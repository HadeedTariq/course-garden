import { Router } from "express";
import { isCourseExist, isTeacher } from "./teacher.middleware";
import { createChapter } from "./chapter.controller";

const router = Router();

router.use(isTeacher);

router.post("/create", isCourseExist, createChapter);

export { router as chapterRouter };
