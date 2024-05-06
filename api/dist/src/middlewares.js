"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.errorHandler = exports.checkAuth = exports.notFound = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
function notFound(req, res, next) {
    res.status(404);
    const error = new Error(`🔍 - Not Found - ${req.originalUrl}`);
    next(error);
}
exports.notFound = notFound;
function checkAuth(req, res, next) {
    const { accessToken } = req.cookies;
    if (!accessToken) {
        return next({ message: "Access Token not found", status: 404 });
    }
    const user = jsonwebtoken_1.default.verify(accessToken, process.env.JWT_ACCESS_TOKEN_SECRET);
    if (!user) {
        return next({ message: "Invalid Access Token", status: 404 });
    }
    req.body.user = user;
    next();
}
exports.checkAuth = checkAuth;
// eslint-disable-next-line @typescript-eslint/no-unused-vars
function errorHandler(err, req, res, next) {
    const statusCode = err.status !== 200 ? err.status : 500;
    res.status(statusCode || 500);
    res.json({
        message: err.message,
        description: err.description,
        stack: process.env.NODE_ENV === "production" ? "🥞" : err.stack,
    });
}
exports.errorHandler = errorHandler;
//# sourceMappingURL=middlewares.js.map