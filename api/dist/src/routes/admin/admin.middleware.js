"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.isAlreadyApplied = exports.isAdmin = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const user_model_1 = require("../auth/user.model");
const teacherRequest_model_1 = require("./teacherRequest.model");
const isAdmin = async (req, res, next) => {
    const { accessToken } = req.cookies;
    if (!accessToken) {
        return next({ message: "Access Token not found", status: 404 });
    }
    const user = jsonwebtoken_1.default.verify(accessToken, process.env.JWT_ACCESS_TOKEN_SECRET);
    if (!user) {
        return next({ message: "Invalid Access Token", status: 404 });
    }
    const isUserAdmin = await user_model_1.User.findOne({
        _id: user.id,
        role: "admin",
    });
    if (!isUserAdmin) {
        return next({ message: "Only admin can do this", status: 404 });
    }
    req.body.user = user;
    next();
};
exports.isAdmin = isAdmin;
const isAlreadyApplied = async (req, res, next) => {
    const { user } = req.body;
    const isApplied = await teacherRequest_model_1.TeacherRequest.findOne({
        user: user.id,
    });
    if (isApplied) {
        return next({ message: "You already applied", status: 404 });
    }
    next();
};
exports.isAlreadyApplied = isAlreadyApplied;
//# sourceMappingURL=admin.middleware.js.map