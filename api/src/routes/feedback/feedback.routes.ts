import { Router } from "express";
import { checkAuth } from "../../middlewares";
import { createFeedback, getCourseFeedbacks } from "./feedback.controller";

const router = Router();

router.use(checkAuth);

router.post("/create", createFeedback);
router.get("/", getCourseFeedbacks);

export { router as feedbackRouter };
