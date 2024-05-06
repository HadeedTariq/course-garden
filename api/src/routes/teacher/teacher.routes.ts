import { Router } from "express";
import { isTeacher } from "./teacher.middleware";
import {
  createCourse,
  deleteCourse,
  getCourseById,
  getCourseRevenue,
  myCourses,
  publishCourse,
} from "./teacher.controller";

const router = Router();

router.use(isTeacher);

router.get("/course/myCourses", myCourses);
router.post("/createCourse", createCourse);
router.delete("/deleteCourse/:id", deleteCourse);
router.get("/course/revenue", getCourseRevenue);
router.get("/course/:id", getCourseById);
router.post("/course/publish", publishCourse);

export { router as teacherRouter };
