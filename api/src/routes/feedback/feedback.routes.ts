import { Router } from "express";
import { checkAuth } from "../../middlewares";
import {
  createFeedback,
  createReply,
  getCourseFeedbacks,
} from "./feedback.controller";

const router = Router();

router.use(checkAuth);

router.post("/create", createFeedback);
router.post("/reply", createReply);
router.get("/", getCourseFeedbacks);

export { router as feedbackRouter };
