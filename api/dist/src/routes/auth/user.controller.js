"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.logoutUser = exports.authenticateByResfreshToken = exports.authenticateUser = exports.loginUser = exports.registerUser = void 0;
const express_async_handler_1 = __importDefault(require("express-async-handler"));
const libphonenumber_js_1 = __importDefault(require("libphonenumber-js"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const user_model_1 = require("./user.model");
const registerUser = (0, express_async_handler_1.default)(async (req, res, next) => {
    const { username, email, password, qualification, mobileNumber, country } = req.body;
    if (!username ||
        !email ||
        !password ||
        !qualification ||
        !mobileNumber ||
        !country) {
        return next({ message: "Please fill all the fields", status: 404 });
    }
    const phoneNumber = (0, libphonenumber_js_1.default)(mobileNumber, country.toUpperCase());
    if (!phoneNumber?.isValid()) {
        return next({
            message: "Invalid Mobile Number",
            description: "This phone number doesn't match to your country code",
            status: 404,
        });
    }
    await user_model_1.User.create(req.body);
    res.status(201).json({ message: "User registered successfully" });
});
exports.registerUser = registerUser;
const loginUser = (0, express_async_handler_1.default)(async (req, res, next) => {
    const { email, password } = req.body;
    if (!email || !password) {
        return next({ status: 404, message: "Please fill all the fields" });
    }
    const user = await user_model_1.User.findOne({ email });
    if (!user) {
        return next({ status: 404, message: "User not found" });
    }
    const isPasswordCorrect = await user.isPasswordCorrect(password);
    if (!isPasswordCorrect) {
        return next({ status: 404, message: "Incorrect Credentials" });
    }
    const { accessToken, refreshToken } = user.generateAccessAndRefreshToken();
    user.refreshToken = refreshToken;
    await user.save({ validateBeforeSave: false });
    res
        .cookie("accessToken", accessToken, {
        secure: true,
        httpOnly: false,
        sameSite: "none",
    })
        .cookie("refreshToken", refreshToken, {
        secure: true,
        httpOnly: false,
        sameSite: "none",
    });
    res.status(200).json({ message: "User logged in successfully" });
});
exports.loginUser = loginUser;
const authenticateUser = (0, express_async_handler_1.default)(async (req, res, next) => {
    const { user } = req.body;
    res.status(200).json(user);
});
exports.authenticateUser = authenticateUser;
const authenticateByResfreshToken = (0, express_async_handler_1.default)(async (req, res, next) => {
    const { refreshToken: refToken } = req.cookies;
    if (!refToken) {
        return next({ message: "Refresh Token not found", status: 404 });
    }
    const { id } = jsonwebtoken_1.default.verify(refToken, process.env.JWT_REFRESH_TOKEN_SECRET);
    if (!id) {
        return next({ message: "Invalid Refresh Token", status: 404 });
    }
    const user = await user_model_1.User.findById(id);
    if (!user) {
        return next({ status: 404, message: "User not found" });
    }
    const { accessToken, refreshToken } = user.generateAccessAndRefreshToken();
    user.refreshToken = refreshToken;
    await user.save({ validateBeforeSave: false });
    res
        .cookie("accessToken", accessToken, {
        secure: true,
        httpOnly: false,
        sameSite: "none",
    })
        .cookie("refreshToken", refreshToken, {
        secure: true,
        httpOnly: false,
        sameSite: "none",
    });
    res
        .status(200)
        .json({ message: "User logged in by using refreshToken successfully" });
});
exports.authenticateByResfreshToken = authenticateByResfreshToken;
const logoutUser = (0, express_async_handler_1.default)(async (req, res, next) => {
    res
        .clearCookie("refreshToken", {
        secure: true,
        httpOnly: false,
        sameSite: "none",
    })
        .clearCookie("accessToken", {
        secure: true,
        httpOnly: false,
        sameSite: "none",
    })
        .json({ message: "User logged out successfully" });
});
exports.logoutUser = logoutUser;
//# sourceMappingURL=user.controller.js.map