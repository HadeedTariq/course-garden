"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.authRouter = void 0;
const express_1 = require("express");
const user_middleware_1 = require("./user.middleware");
const user_controller_1 = require("./user.controller");
const middlewares_1 = require("../../middlewares");
const router = (0, express_1.Router)();
exports.authRouter = router;
router.post("/register", user_middleware_1.existedUser, user_controller_1.registerUser);
router.post("/login", user_controller_1.loginUser);
router.post("/", middlewares_1.checkAuth, user_controller_1.authenticateUser);
router.post("/refreshAccessToken", user_controller_1.authenticateByResfreshToken);
router.post("/logout", user_controller_1.logoutUser);
//# sourceMappingURL=user.routes.js.map