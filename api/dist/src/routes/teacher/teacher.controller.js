"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getCourseRevenue = exports.deleteCourse = exports.myCourses = exports.publishCourse = exports.getCourseById = exports.createCourse = void 0;
const express_async_handler_1 = __importDefault(require("express-async-handler"));
const course_model_1 = require("./course.model");
const mongoose_1 = __importDefault(require("mongoose"));
const chapter_model_1 = require("./chapter.model");
const payments_model_1 = require("./payments.model");
const createCourse = (0, express_async_handler_1.default)(async (req, res, next) => {
    const { title, description, thumbnail, couponCode: { coupon, quantity }, category, } = req.body;
    if (!title ||
        !description ||
        !thumbnail ||
        !coupon ||
        !quantity ||
        !category) {
        return next({ status: 404, message: "Please fill all the fields" });
    }
    const createdCouponCode = await course_model_1.CouponCode.create({
        coupon,
        quantity,
    });
    const createdCourse = await course_model_1.Course.create({
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
exports.createCourse = createCourse;
const deleteCourse = (0, express_async_handler_1.default)(async (req, res, next) => {
    const { id } = req.params;
    if (!id || id.length !== 24) {
        return next({ status: 404, message: "Course Id is required" });
    }
    const delCourse = await course_model_1.Course.findByIdAndDelete(id);
    if (delCourse) {
        const delCouponCodes = await course_model_1.CouponCode.findOneAndDelete({
            courseId: id,
        });
        const delChapters = await chapter_model_1.Chapter.deleteMany({
            courseId: id,
        });
        res.status(200).json({ message: "Course deleted successfully" });
    }
});
exports.deleteCourse = deleteCourse;
const getCourseById = (0, express_async_handler_1.default)(async (req, res, next) => {
    const { id } = req.params;
    if (!id || id.length !== 24) {
        return next({ message: "Course Id must be true", status: 404 });
    }
    const course = await course_model_1.Course.findById(id).populate("chapters");
    if (!course) {
        return next({ message: "Course Not found", status: 404 });
    }
    res.status(200).json(course);
});
exports.getCourseById = getCourseById;
const publishCourse = (0, express_async_handler_1.default)(async (req, res, next) => {
    const { status, price, courseId } = req.body;
    if (!status ||
        (status === "paid" && !price) ||
        !courseId ||
        courseId.length !== 24) {
        return next({ message: "Please fill all the fields", status: 404 });
    }
    const updateCourse = await course_model_1.Course.findByIdAndUpdate(courseId, {
        status: status,
        price: price ? `$ ${price}` : "$ 0",
        isPublish: true,
    });
    if (updateCourse) {
        res.status(201).json({ message: "Course published successfully" });
    }
    else {
        next({ message: "Something went wrong" });
    }
});
exports.publishCourse = publishCourse;
const myCourses = (0, express_async_handler_1.default)(async (req, res, next) => {
    const { user } = req.body;
    const courses = await course_model_1.Course.aggregate([
        {
            $match: {
                creator: new mongoose_1.default.Types.ObjectId(user.id),
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
exports.myCourses = myCourses;
const getCourseRevenue = (0, express_async_handler_1.default)(async (req, res, next) => {
    const { courseId } = req.query;
    if (!courseId || courseId.length !== 24) {
        return next({ message: "Course Id must be required", status: 404 });
    }
    const currentDate = new Date();
    const firstDayOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth());
    const firstDayOfNextMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1);
    const revenueDetails = await payments_model_1.Payment.aggregate([
        {
            $match: {
                courseId: new mongoose_1.default.Types.ObjectId(courseId),
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
    const monthlyRevenue = revenueDetails.reduce((acc, pDetails) => {
        const realPrice = pDetails.price.split(" ")[1];
        if (pDetails.createdAt > firstDayOfMonth &&
            pDetails.createdAt < firstDayOfNextMonth) {
            acc += Number(realPrice);
        }
        return acc;
    }, 0);
    const totalRevenue = revenueDetails.reduce((acc, pDetails) => {
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
exports.getCourseRevenue = getCourseRevenue;
//# sourceMappingURL=teacher.controller.js.map