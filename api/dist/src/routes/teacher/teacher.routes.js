"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.teacherRouter = void 0;
const express_1 = require("express");
const teacher_middleware_1 = require("./teacher.middleware");
const teacher_controller_1 = require("./teacher.controller");
const router = (0, express_1.Router)();
exports.teacherRouter = router;
router.use(teacher_middleware_1.isTeacher);
router.get("/course/myCourses", teacher_controller_1.myCourses);
router.post("/createCourse", teacher_controller_1.createCourse);
router.delete("/deleteCourse/:id", teacher_controller_1.deleteCourse);
router.get("/course/revenue", teacher_controller_1.getCourseRevenue);
router.get("/course/:id", teacher_controller_1.getCourseById);
router.post("/course/publish", teacher_controller_1.publishCourse);
//# sourceMappingURL=teacher.routes.js.map