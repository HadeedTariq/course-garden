import { Router } from "express";
import {
  applyCouponCode,
  enrollInFreeCourse,
  enrollInPaidCourse,
  getCompletedChapters,
  getCouponCode,
  getCourses,
  getErolledCourseDetails,
  getMyPaidCourseChaptersTitles,
  getMyPaidCourses,
  getPaidCourseContent,
  onCompleteChapter,
  paymentSucceed,
  purchaseCourse,
} from "./student.controller";
import {
  couponCodeChecker,
  isStudentAuthenticated,
  paymentChecker,
} from "./student.middleware";
import { checkAuth } from "../../middlewares";
const router = Router();
router.get("/", isStudentAuthenticated, getCourses);

router.use(checkAuth);

router.get("/course/coursePoints", getErolledCourseDetails);
router.post("/course/enroll/freeCourse", enrollInFreeCourse);
router.put("/course/completeChapter", onCompleteChapter);
router.get("/course/myCompletedChapters", getCompletedChapters);
router.post("/course/applyCouponCode", couponCodeChecker, applyCouponCode);
router.get("/course/checkCoupon", getCouponCode);
router.post("/course/purchase", paymentChecker, purchaseCourse);
router.post("/course/paymentSucceed", paymentSucceed);
router.get("/course/myPurchasedCourses", getMyPaidCourses);
router.get("/paidCourse/:id/chapterTitles", getMyPaidCourseChaptersTitles);
router.post("/course/enroll/paidCourse", enrollInPaidCourse);
router.get("/paidCourse/content", getPaidCourseContent);

export { router as studentRouter };
