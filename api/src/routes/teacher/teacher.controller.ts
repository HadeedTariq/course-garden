import asyncHandler from "express-async-handler";
import { CouponCode, Course } from "./course.model";
import mongoose from "mongoose";
import { Chapter } from "./chapter.model";
import { Payment } from "./payments.model";

const createCourse = asyncHandler(async (req, res, next) => {
  const {
    title,
    description,
    thumbnail,
    couponCode: { coupon, quantity },
    category,
  } = req.body;

  if (
    !title ||
    !description ||
    !thumbnail ||
    !coupon ||
    !quantity ||
    !category
  ) {
    return next({ status: 404, message: "Please fill all the fields" });
  }

  const createdCouponCode = await CouponCode.create({
    coupon,
    quantity,
  });

  const createdCourse = await Course.create({
    title,
    description,
    thumbnail,
    creator: req.body.user.id,
    couponCode: createdCouponCode._id,
    category,
  });
  createdCouponCode.courseId = createdCourse._id;
  await createdCouponCode.save();
  res.status(201).json(createdCourse);
});

const deleteCourse = asyncHandler(async (req, res, next) => {
  const { id } = req.params;
  if (!id || id.length !== 24) {
    return next({ status: 404, message: "Course Id is required" });
  }

  const delCourse = await Course.findByIdAndDelete(id);

  if (delCourse) {
    const delCouponCodes = await CouponCode.findOneAndDelete({
      courseId: id,
    });
    const delChapters = await Chapter.deleteMany({
      courseId: id,
    });
    res.status(200).json({ message: "Course deleted successfully" });
  }
});

const getCourseById = asyncHandler(async (req, res, next) => {
  const { id } = req.params;
  if (!id || id.length !== 24) {
    return next({ message: "Course Id must be true", status: 404 });
  }
  const course = await Course.findById(id).populate("chapters");

  if (!course) {
    return next({ message: "Course Not found", status: 404 });
  }

  res.status(200).json(course);
});

const publishCourse = asyncHandler(async (req, res, next) => {
  const { status, price, courseId } = req.body;
  if (
    !status ||
    (status === "paid" && !price) ||
    !courseId ||
    courseId.length !== 24
  ) {
    return next({ message: "Please fill all the fields", status: 404 });
  }

  const updateCourse = await Course.findByIdAndUpdate(courseId, {
    status: status,
    price: price ? `$ ${price}` : "$ 0",
    isPublish: true,
  });

  if (updateCourse) {
    res.status(201).json({ message: "Course published successfully" });
  } else {
    next({ message: "Something went wrong" });
  }
});

const myCourses = asyncHandler(async (req, res, next) => {
  const { user } = req.body;

  const courses = await Course.aggregate([
    {
      $match: {
        creator: new mongoose.Types.ObjectId(user.id),
      },
    },
    {
      $lookup: {
        from: "chapters",
        localField: "chapters",
        foreignField: "_id",
        as: "courseChapters",
      },
    },
  ]);

  res.status(200).json(courses);
});

const getCourseRevenue = asyncHandler(async (req, res, next) => {
  const { courseId } = req.query;

  if (!courseId || courseId.length !== 24) {
    return next({ message: "Course Id must be required", status: 404 });
  }

  const currentDate = new Date();
  const firstDayOfMonth = new Date(
    currentDate.getFullYear(),
    currentDate.getMonth()
  );

  const firstDayOfNextMonth = new Date(
    currentDate.getFullYear(),
    currentDate.getMonth() + 1,
    1
  );

  const revenueDetails = await Payment.aggregate([
    {
      $match: {
        courseId: new mongoose.Types.ObjectId(courseId as string),
      },
    },
    {
      $lookup: {
        from: "users",
        localField: "purchaser",
        foreignField: "_id",
        as: "purchaserDetails",
        pipeline: [
          {
            $project: {
              username: 1,
              avatar: 1,
              email: 1,
            },
          },
        ],
      },
    },
    { $unwind: "$purchaserDetails" },
  ]);

  const monthlyRevenue = revenueDetails.reduce((acc: any, pDetails: any) => {
    const realPrice = pDetails.price.split(" ")[1];
    if (
      pDetails.createdAt > firstDayOfMonth &&
      pDetails.createdAt < firstDayOfNextMonth
    ) {
      acc += Number(realPrice);
    }
    return acc;
  }, 0);

  const totalRevenue = revenueDetails.reduce((acc: any, pDetails: any) => {
    const realPrice = pDetails.price.split(" ")[1];
    acc += Number(realPrice);
    return acc;
  }, 0);

  res.status(200).json({
    purchaserDetails: revenueDetails,
    totalRevenue: `$ ${totalRevenue}`,
    monthlyRevenue: `$ ${monthlyRevenue}`,
  });
});

export {
  createCourse,
  getCourseById,
  publishCourse,
  myCourses,
  deleteCourse,
  getCourseRevenue,
};
