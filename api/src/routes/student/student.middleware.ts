import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import { CouponCode, Course } from "../teacher/course.model";
import Stripe from "stripe";
import { PendingBuyer } from "./pendingBuyer.model";

const isStudentAuthenticated = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { accessToken } = req.cookies;

  if (!accessToken) {
    return next();
  }

  const user: any = jwt.verify(
    accessToken,
    process.env.JWT_ACCESS_TOKEN_SECRET!
  );

  if (!user) {
    return next();
  }

  req.body.user = user;
  next();
};

const couponCodeChecker = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { courseId, coupon } = req.body;
  if (!courseId || !coupon) {
    return next({ message: "Course Id and Coupon Code required", status: 404 });
  }

  const couponCode = await CouponCode.findOne({
    courseId,
    quantity: { $gt: 0 },
    coupon,
  });

  if (!couponCode) {
    return next({ message: "Invalid Coupon Code ", status: 404 });
  }

  next();
};

const paymentChecker = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const stripe = new Stripe(process.env.STRIPE_API_KEY!);
  const { courseId, coupon, price } = req.body;
  if (!courseId || !price) {
    return next({ status: 404, message: "Course id and price is required" });
  }
  const course = await Course.findById(courseId);
  const pendingBuyer = await PendingBuyer.create({
    courseId: course?._id,
    user: req.body.user.id,
  });
  if (coupon) {
    const couponDetails = await CouponCode.findOne({
      courseId,
      couponUsers: req.body.user.id,
    });
    if (!couponDetails) {
      return next({ status: 404, message: "Incorrect Coupon Details" });
    }
    if (course) {
      const realPrice = Number(course.price?.split(" ")[1]);
      const discountPrice = Math.floor(realPrice / 2);
      const discRealPrice = `$${discountPrice}`;

      if (discRealPrice !== price) {
        return next({ status: 404, message: "Price Doesn't match" });
      } else {
        pendingBuyer.price = discRealPrice;
        await pendingBuyer.save();
        const session = await stripe.checkout.sessions.create({
          payment_method_types: ["card"],
          line_items: [
            {
              price_data: {
                currency: "usd",
                product_data: {
                  name: course.title,
                  images: [course.thumbnail],
                },
                unit_amount: discountPrice * 100,
              },
              quantity: 1,
            },
          ],
          mode: "payment",
          success_url: `${process.env.CLIENT_URL}/course/paymentSuccessFull/${pendingBuyer._id}?courseId=${course._id}`,
          cancel_url: `${process.env.CLIENT_URL}/`,
        });
        req.body.session = session;
        next();
      }
    } else {
      return next({ status: 404, message: "Course not found" });
    }
  } else {
    if (course) {
      const realPrice = Number(course.price?.split(" ")[1]);

      if (course.price !== price) {
        return next({ status: 404, message: "Price Doesn't match" });
      } else {
        pendingBuyer.price = `$ ${realPrice}`;
        await pendingBuyer.save();
        const session = await stripe.checkout.sessions.create({
          payment_method_types: ["card"],
          line_items: [
            {
              price_data: {
                currency: "usd",
                product_data: {
                  name: course.title,
                  images: [course.thumbnail],
                },
                unit_amount: realPrice * 100,
              },
              quantity: 1,
            },
          ],
          mode: "payment",
          success_url: `${process.env.CLIENT_URL}/course/paymentSuccessFull/${pendingBuyer._id}?courseId=${course._id}`,
          cancel_url: `${process.env.CLIENT_URL}/`,
        });
        req.body.session = session;
        next();
      }
    } else {
      return next({ status: 404, message: "Course not found" });
    }
  }
};

export { isStudentAuthenticated, couponCodeChecker, paymentChecker };
