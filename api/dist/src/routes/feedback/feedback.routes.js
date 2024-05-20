"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.feedbackRouter = void 0;
const express_1 = require("express");
const middlewares_1 = require("../../middlewares");
const feedback_controller_1 = require("./feedback.controller");
const router = (0, express_1.Router)();
exports.feedbackRouter = router;
router.use(middlewares_1.checkAuth);
router.post("/create", feedback_controller_1.createFeedback);
router.post("/reply", feedback_controller_1.createReply);
router.get("/", feedback_controller_1.getCourseFeedbacks);
//# sourceMappingURL=feedback.routes.js.map