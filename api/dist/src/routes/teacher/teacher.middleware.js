"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.isCourseExist = exports.isTeacher = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const user_model_1 = require("../auth/user.model");
const course_model_1 = require("./course.model");
const isTeacher = async (req, res, next) => {
    const { accessToken } = req.cookies;
    if (!accessToken) {
        return next({ message: "Access Token not found", status: 404 });
    }
    const user = jsonwebtoken_1.default.verify(accessToken, process.env.JWT_ACCESS_TOKEN_SECRET);
    if (!user) {
        return next({ message: "Invalid Access Token", status: 404 });
    }
    const isValidateTeacher = await user_model_1.User.findOne({
        _id: user.id,
        role: "teacher",
    });
    if (!isValidateTeacher) {
        return next({
            message: "Only teacher can perform this action",
            status: 404,
        });
    }
    req.body.user = user;
    next();
};
exports.isTeacher = isTeacher;
const isCourseExist = async (req, res, next) => {
    const { courseId } = req.body;
    if (!courseId || courseId.length !== 24) {
        return next({ message: "Course Id must be true", status: 404 });
    }
    const course = await course_model_1.Course.findById(courseId);
    if (!course) {
        return next({ message: "Course Not found", status: 404 });
    }
    next();
};
exports.isCourseExist = isCourseExist;
//# sourceMappingURL=teacher.middleware.js.map