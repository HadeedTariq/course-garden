"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.chapterRouter = void 0;
const express_1 = require("express");
const teacher_middleware_1 = require("./teacher.middleware");
const chapter_controller_1 = require("./chapter.controller");
const router = (0, express_1.Router)();
exports.chapterRouter = router;
router.use(teacher_middleware_1.isTeacher);
router.post("/create", teacher_middleware_1.isCourseExist, chapter_controller_1.createChapter);
//# sourceMappingURL=chapter.routes.js.map