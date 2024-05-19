import { Router } from "express";
import { isAdmin, isAlreadyApplied } from "./admin.middleware";
import { checkAuth } from "../../middlewares";
import {
  adminChecker,
  approveTeacher,
  rejectTeacher,
  requestToBecomeTeacher,
  teacherRequests,
} from "./admin.controller";

const router = Router();

router.use(checkAuth);
router.post("/requestForTeacher", isAlreadyApplied, requestToBecomeTeacher);

router.use(isAdmin);
router.get("/checkAdmin", adminChecker);
router.get("/teacherRequests", teacherRequests);
router.put("/approveTeacher", approveTeacher);
router.put("/rejectTeacher", rejectTeacher);

export { router as adminRouter };
