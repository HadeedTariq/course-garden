"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.adminRouter = void 0;
const express_1 = require("express");
const admin_middleware_1 = require("./admin.middleware");
const middlewares_1 = require("../../middlewares");
const admin_controller_1 = require("./admin.controller");
const router = (0, express_1.Router)();
exports.adminRouter = router;
router.use(middlewares_1.checkAuth);
router.post("/requestForTeacher", admin_middleware_1.isAlreadyApplied, admin_controller_1.requestToBecomeTeacher);
router.use(admin_middleware_1.isAdmin);
router.get("/checkAdmin", admin_controller_1.adminChecker);
router.get("/teacherRequests", admin_controller_1.teacherRequests);
router.put("/approveTeacher", admin_controller_1.approveTeacher);
router.put("/rejectTeacher", admin_controller_1.rejectTeacher);
//# sourceMappingURL=admin.routes.js.map