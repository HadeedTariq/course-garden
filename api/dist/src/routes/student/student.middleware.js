"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.paymentChecker = exports.couponCodeChecker = exports.isStudentAuthenticated = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const course_model_1 = require("../teacher/course.model");
const stripe_1 = __importDefault(require("stripe"));
const pendingBuyer_model_1 = require("./pendingBuyer.model");
const isStudentAuthenticated = (req, res, next) => {
    const { accessToken } = req.cookies;
    if (!accessToken) {
        return next();
    }
    const user = jsonwebtoken_1.default.verify(accessToken, process.env.JWT_ACCESS_TOKEN_SECRET);
    if (!user) {
        return next();
    }
    req.body.user = user;
    next();
};
exports.isStudentAuthenticated = isStudentAuthenticated;
const couponCodeChecker = async (req, res, next) => {
    const { courseId, coupon } = req.body;
    if (!courseId || !coupon) {
        return next({ message: "Course Id and Coupon Code required", status: 404 });
    }
    const couponCode = await course_model_1.CouponCode.findOne({
        courseId,
        quantity: { $gt: 0 },
        coupon,
    });
    if (!couponCode) {
        return next({ message: "Invalid Coupon Code ", status: 404 });
    }
    next();
};
exports.couponCodeChecker = couponCodeChecker;
const paymentChecker = async (req, res, next) => {
    const stripe = new stripe_1.default(process.env.STRIPE_API_KEY);
    const { courseId, coupon, price } = req.body;
    if (!courseId || !price) {
        return next({ status: 404, message: "Course id and price is required" });
    }
    const course = await course_model_1.Course.findById(courseId);
    const pendingBuyer = await pendingBuyer_model_1.PendingBuyer.create({
        courseId: course?._id,
        user: req.body.user.id,
    });
    if (coupon) {
        const couponDetails = await course_model_1.CouponCode.findOne({
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
            }
            else {
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
        }
        else {
            return next({ status: 404, message: "Course not found" });
        }
    }
    else {
        if (course) {
            const realPrice = Number(course.price?.split(" ")[1]);
            if (course.price !== price) {
                return next({ status: 404, message: "Price Doesn't match" });
            }
            else {
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
        }
        else {
            return next({ status: 404, message: "Course not found" });
        }
    }
};
exports.paymentChecker = paymentChecker;
//# sourceMappingURL=student.middleware.js.map