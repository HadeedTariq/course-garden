import { Router } from "express";
import { isTeacher } from "./teacher.middleware";
import {
  createCourse,
  deleteCourse,
  getCourseById,
  myCourses,
  publishCourse,
  getCourseRevenue,
} from "./teacher.controller";

const router = Router();

router.use(isTeacher);

router.get("/course/revenue", getCourseRevenue);
router.get("/course/myCourses", myCourses);
router.post("/createCourse", createCourse);
router.delete("/deleteCourse/:id", deleteCourse);
router.get("/course/:id", getCourseById);
router.post("/course/publish", publishCourse);

export { router as teacherRouter };
