"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.teacherRequests = exports.adminChecker = exports.rejectTeacher = exports.approveTeacher = exports.requestToBecomeTeacher = void 0;
const express_async_handler_1 = __importDefault(require("express-async-handler"));
const teacherRequest_model_1 = require("./teacherRequest.model");
const user_model_1 = require("../auth/user.model");
const notification_model_1 = require("./notification.model");
const adminChecker = (0, express_async_handler_1.default)(async (req, res, next) => {
    res.status(204).json({});
});
exports.adminChecker = adminChecker;
const requestToBecomeTeacher = (0, express_async_handler_1.default)(async (req, res, next) => {
    const { user, subject } = req.body;
    if (!subject) {
        return next({ message: "Subject is required", status: 404 });
    }
    const createTeacherRequest = await teacherRequest_model_1.TeacherRequest.create({
        user: user.id,
        subject,
    });
    res
        .status(201)
        .json({ message: "Your request to admin is sent successfully" });
});
exports.requestToBecomeTeacher = requestToBecomeTeacher;
const teacherRequests = (0, express_async_handler_1.default)(async (req, res, next) => {
    const allRequests = await teacherRequest_model_1.TeacherRequest.find({ approved: false }).populate({
        path: "user",
        select: "username email avatar qualification",
    });
    res.status(200).json(allRequests);
});
exports.teacherRequests = teacherRequests;
//? approve
const approveTeacher = (0, express_async_handler_1.default)(async (req, res, next) => {
    const { userId } = req.body;
    const updateRole = await user_model_1.User.findByIdAndUpdate(userId, {
        role: "teacher",
    });
    if (!updateRole) {
        return next({ status: 404, message: "Something went wrong" });
    }
    const createNotification = await notification_model_1.Notification.create({
        user: userId,
        message: "Your request for teacher has been approved Please again signin to use your authorities",
    });
    await teacherRequest_model_1.TeacherRequest.findOneAndUpdate({ user: updateRole._id }, { approved: true });
    res.status(200).json({ message: "User role updated successfully" });
});
exports.approveTeacher = approveTeacher;
//! reject
const rejectTeacher = (0, express_async_handler_1.default)(async (req, res, next) => {
    const { userId } = req.body;
    const createNotification = await notification_model_1.Notification.create({
        user: userId,
        message: "Your request for teacher has been rejected",
    });
    res.status(200).json({ message: "Teacher rejected successfully" });
});
exports.rejectTeacher = rejectTeacher;
//# sourceMappingURL=admin.controller.js.map