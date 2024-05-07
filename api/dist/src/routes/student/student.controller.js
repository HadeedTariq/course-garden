"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getMyAllCourses = exports.getAllCoursesPoints = exports.getPaidCourseContent = exports.enrollInPaidCourse = exports.getMyPaidCourseChaptersTitles = exports.getMyPaidCourses = exports.paymentSucceed = exports.purchaseCourse = exports.getCouponCode = exports.applyCouponCode = exports.getCompletedChapters = exports.onCompleteChapter = exports.enrollInFreeCourse = exports.getErolledCourseDetails = exports.getCourses = void 0;
const express_async_handler_1 = __importDefault(require("express-async-handler"));
const course_model_1 = require("../teacher/course.model");
const coursePoints_model_1 = require("../auth/coursePoints.model");
const mongoose_1 = __importDefault(require("mongoose"));
const pendingBuyer_model_1 = require("./pendingBuyer.model");
const payments_model_1 = require("../teacher/payments.model");
const getCourses = (0, express_async_handler_1.default)(async (req, res, next) => {
    const { category, price, status } = req.query;
    const coursePipeline = [
        {
            $match: {
                isPublish: true,
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
        {
            $lookup: {
                from: "users",
                localField: "creator",
                foreignField: "_id",
                as: "teacher",
                pipeline: [
                    {
                        $project: {
                            username: 1,
                            avatar: 1,
                            qualification: 1,
                        },
                    },
                ],
            },
        },
        {
            $unwind: "$teacher",
        },
        {
            $project: {
                couponCode: 0,
                chapters: 0,
                creator: 0,
                purchasers: 0,
            },
        },
    ];
    if (req.body.user && req.body.user.id) {
        coursePipeline[0].$match.creator = {
            $ne: new mongoose_1.default.Types.ObjectId(req.body.user.id),
        };
    }
    const courses = await course_model_1.Course.aggregate(coursePipeline);
    const realCourses = courses?.map((crs) => {
        if (crs.price) {
            return {
                title: crs.title,
                thumbnail: crs.thumbnail,
                category: crs.category,
                description: crs.description,
                teacher: crs.teacher,
                status: crs.status,
                price: crs.price,
                _id: crs._id,
            };
        }
        else {
            return crs;
        }
    });
    console.log(realCourses);
    res.status(200).json(realCourses);
});
exports.getCourses = getCourses;
const getErolledCourseDetails = (0, express_async_handler_1.default)(async (req, res, next) => {
    const { courseId } = req.query;
    if (!courseId) {
        return next({ status: 404, message: "Course Id is required" });
    }
    const coursePointDetails = await coursePoints_model_1.CoursePoints.findOne({
        courseId,
        user: req.body.user.id,
    });
    if (coursePointDetails) {
        res.status(200).json(coursePointDetails);
    }
    else {
        return next({ message: "Course not found", status: 404 });
    }
});
exports.getErolledCourseDetails = getErolledCourseDetails;
const enrollInFreeCourse = (0, express_async_handler_1.default)(async (req, res, next) => {
    const { courseId } = req.query;
    if (!courseId) {
        return next({ status: 404, message: "Course Id is required" });
    }
    const addCourseToPoints = await coursePoints_model_1.CoursePoints.create({
        courseId,
        user: req.body.user.id,
    });
    res.status(201).json({ message: "Enrolled in free course successfully" });
});
exports.enrollInFreeCourse = enrollInFreeCourse;
const onCompleteChapter = (0, express_async_handler_1.default)(async (req, res, next) => {
    const { courseId, chapterId } = req.query;
    if (!courseId || !chapterId) {
        return next({
            status: 404,
            message: "Course Id and Chapter Id is required",
        });
    }
    const course = await course_model_1.Course.findById(courseId);
    const updateCoursePoints = await coursePoints_model_1.CoursePoints.findOneAndUpdate({ courseId, user: req.body.user.id }, {
        $inc: { points: 5 },
        $push: { chapters: chapterId },
    }, { new: true });
    if (updateCoursePoints && course?.chapters?.length) {
        const isCourseCompleted = updateCoursePoints.points === course?.chapters?.length * 5;
        if (isCourseCompleted) {
            updateCoursePoints.courseCompleted = true;
            await updateCoursePoints.save();
            res.status(201).json({ message: "Course completed successfully" });
            return;
        }
        else {
            res.status(200).json({ message: "chapter completed successfully" });
        }
    }
    else {
        next({});
    }
});
exports.onCompleteChapter = onCompleteChapter;
const getCompletedChapters = (0, express_async_handler_1.default)(async (req, res, next) => {
    const { user } = req.body;
    const { courseId } = req.query;
    if (!courseId) {
        return next({ status: 404, message: "Course Id is required" });
    }
    const coursePoints = await coursePoints_model_1.CoursePoints.findOne({ courseId, user: user.id });
    if (coursePoints) {
        res.status(200).json(coursePoints.chapters);
    }
    else {
        return next({ status: 404, message: "No course points found" });
    }
});
exports.getCompletedChapters = getCompletedChapters;
const applyCouponCode = (0, express_async_handler_1.default)(async (req, res, next) => {
    const { courseId } = req.body;
    const updateCouponPoints = await course_model_1.CouponCode.findOneAndUpdate({ courseId }, {
        $inc: { quantity: -1 },
        $push: { couponUsers: req.body.user.id },
    });
    res.status(200).json({ message: "Coupon Code applied successfully" });
});
exports.applyCouponCode = applyCouponCode;
const getCouponCode = (0, express_async_handler_1.default)(async (req, res, next) => {
    const { courseId } = req.query;
    if (!courseId) {
        return next({ message: "Course Id  required", status: 404 });
    }
    const couponCode = await course_model_1.CouponCode.findOne({
        courseId,
        couponUsers: req.body.user.id,
    });
    if (couponCode) {
        res.status(200).json(couponCode.coupon);
    }
    else {
        next({ status: 404, message: "No coupon code found" });
    }
});
exports.getCouponCode = getCouponCode;
const purchaseCourse = (0, express_async_handler_1.default)(async (req, res, next) => {
    const { session } = req.body;
    res.status(200).json({ id: session.id });
});
exports.purchaseCourse = purchaseCourse;
const paymentSucceed = (0, express_async_handler_1.default)(async (req, res, next) => {
    const { id, courseId } = req.body;
    if (!id || !courseId) {
        return next({ message: "Id and Course Id  required", status: 404 });
    }
    const buyerExist = await pendingBuyer_model_1.PendingBuyer.findOne({
        user: req.body.user.id,
        courseId,
        _id: id,
    });
    if (!buyerExist) {
        return next({ message: "Invalid secret id", status: 404 });
    }
    const updateCourse = await course_model_1.Course.findByIdAndUpdate(courseId, {
        $push: { purchasers: req.body.user.id },
    });
    await payments_model_1.Payment.create({
        courseId,
        purchaser: req.body.user.id,
        price: buyerExist.price,
    });
    await pendingBuyer_model_1.PendingBuyer.findByIdAndDelete(buyerExist._id);
    if (updateCourse) {
        res.status(200).json({ message: "Payment Successfull" });
    }
    else {
        next({ message: "Something went wrong", status: 404 });
    }
});
exports.paymentSucceed = paymentSucceed;
const getMyPaidCourses = (0, express_async_handler_1.default)(async (req, res, next) => {
    const { user } = req.body;
    const myPurchasedCourses = await course_model_1.Course.find({
        purchasers: user.id,
    });
    const purchasedCoursesIds = myPurchasedCourses?.map((course) => course._id);
    res.status(200).json(purchasedCoursesIds);
});
exports.getMyPaidCourses = getMyPaidCourses;
const getMyPaidCourseChaptersTitles = (0, express_async_handler_1.default)(async (req, res, next) => {
    const { id } = req.params;
    const { user } = req.body;
    if (!id) {
        return next({ message: " Course Id  required", status: 404 });
    }
    const course = await course_model_1.Course.findOne({
        _id: id,
        purchasers: user.id,
    }).populate({
        path: "chapters",
        select: "title",
    });
    res.status(200).json(course?.chapters || []);
});
exports.getMyPaidCourseChaptersTitles = getMyPaidCourseChaptersTitles;
const enrollInPaidCourse = (0, express_async_handler_1.default)(async (req, res, next) => {
    const { courseId } = req.query;
    if (!courseId) {
        return next({ status: 404, message: "Course Id is required" });
    }
    const course = await course_model_1.Course.findOne({
        _id: courseId,
        purchasers: req.body.user.id,
    });
    if (!course) {
        return next({ status: 404, message: "Please purchased the course" });
    }
    const addCourseToPoints = await coursePoints_model_1.CoursePoints.create({
        courseId,
        user: req.body.user.id,
    });
    res.status(201).json({ message: "Enrolled in Paid course successfully" });
});
exports.enrollInPaidCourse = enrollInPaidCourse;
const getPaidCourseContent = (0, express_async_handler_1.default)(async (req, res, next) => {
    const { courseId } = req.query;
    if (!courseId) {
        return next({ status: 404, message: "Course Id is required" });
    }
    const coursePipeline = [
        {
            $match: {
                isPublish: true,
                _id: new mongoose_1.default.Types.ObjectId(courseId),
                purchasers: new mongoose_1.default.Types.ObjectId(req.body.user.id),
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
        {
            $lookup: {
                from: "users",
                localField: "creator",
                foreignField: "_id",
                as: "teacher",
                pipeline: [
                    {
                        $project: {
                            username: 1,
                            avatar: 1,
                            qualification: 1,
                        },
                    },
                ],
            },
        },
        {
            $unwind: "$teacher",
        },
        {
            $project: {
                couponCode: 0,
                chapters: 0,
                creator: 0,
                purchasers: 0,
            },
        },
    ];
    const course = await course_model_1.Course.aggregate(coursePipeline);
    if (!course) {
        return next({ status: 404, message: "Please purchased the course" });
    }
    res.status(200).json(course);
});
exports.getPaidCourseContent = getPaidCourseContent;
const getAllCoursesPoints = (0, express_async_handler_1.default)(async (req, res, next) => {
    const { user } = req.body;
    const coursePoints = await coursePoints_model_1.CoursePoints.find({
        user: new mongoose_1.default.Types.ObjectId(user.id),
    }).select("points");
    const totalPoints = coursePoints?.reduce((acc, detail) => {
        acc += detail.points;
        return acc;
    }, 0);
    res.status(200).json({ totalPoints });
});
exports.getAllCoursesPoints = getAllCoursesPoints;
const getMyAllCourses = (0, express_async_handler_1.default)(async (req, res, next) => {
    const { user } = req.body;
    const enrolledCourses = await coursePoints_model_1.CoursePoints.find({
        user: new mongoose_1.default.Types.ObjectId(user.id),
    }).select("courseId");
    res.status(200).json(enrolledCourses);
});
exports.getMyAllCourses = getMyAllCourses;
//# sourceMappingURL=student.controller.js.map