"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createReply = exports.getCourseFeedbacks = exports.createFeedback = void 0;
const express_async_handler_1 = __importDefault(require("express-async-handler"));
const feedback_model_1 = require("./feedback.model");
const mongoose_1 = __importDefault(require("mongoose"));
const createFeedback = (0, express_async_handler_1.default)(async (req, res, next) => {
    const { user, content, courseId } = req.body;
    if (!courseId || !content) {
        return next({ message: "Please fil all the fields ", status: 404 });
    }
    const createdFeedback = await feedback_model_1.Feedback.create({
        content,
        user: user.id,
        courseId,
    });
    res.status(201).json({ message: "Feedback created successfully" });
});
exports.createFeedback = createFeedback;
const getCourseFeedbacks = (0, express_async_handler_1.default)(async (req, res, next) => {
    const { courseId } = req.query;
    if (!courseId) {
        return next({ message: "CourseId is required", status: 404 });
    }
    const courseFeedbacks = await feedback_model_1.Feedback.aggregate([
        {
            $match: {
                courseId: new mongoose_1.default.Types.ObjectId(courseId),
            },
        },
        {
            $lookup: {
                from: "users",
                localField: "user",
                foreignField: "_id",
                as: "user",
                pipeline: [
                    {
                        $project: {
                            username: 1,
                            avatar: 1,
                        },
                    },
                ],
            },
        },
        {
            $unwind: "$user",
        },
        { $unwind: { path: "$replies", preserveNullAndEmptyArrays: true } },
        {
            $lookup: {
                from: "users",
                localField: "replies.user",
                foreignField: "_id",
                as: "replies.user",
                pipeline: [
                    {
                        $project: {
                            username: 1,
                            avatar: 1,
                        },
                    },
                ],
            },
        },
        { $unwind: { path: "$replies.user", preserveNullAndEmptyArrays: true } },
        {
            $group: {
                _id: "$_id",
                content: { $first: "$content" },
                user: { $first: "$user" },
                courseId: { $first: "$courseId" },
                replies: { $push: "$replies" },
            },
        },
    ]);
    res.status(200).json(courseFeedbacks);
});
exports.getCourseFeedbacks = getCourseFeedbacks;
const createReply = (0, express_async_handler_1.default)(async (req, res, next) => {
    const { commentId, user, content } = req.body;
    if (!commentId) {
        return next({ message: "Comment Id is required", status: 404 });
    }
    const createdReply = await feedback_model_1.Feedback.findByIdAndUpdate(commentId, {
        $push: {
            replies: {
                user: user.id,
                content: content,
            },
        },
    });
    res.status(201).json({ message: "Reply created successfully" });
});
exports.createReply = createReply;
//# sourceMappingURL=feedback.controller.js.map