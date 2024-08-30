import { Router } from "express";
import { existedUser } from "./user.middleware";
import {
  authenticateByResfreshToken,
  logoutUser,
  authenticateUser,
  loginUser,
  registerUser,
} from "./user.controller";
import { checkAuth } from "../../middlewares";

const router = Router();

router.post("/register", existedUser, registerUser);
router.post("/login", loginUser);
router.post("/", checkAuth, authenticateUser);
router.post("/refreshAccessToken", authenticateByResfreshToken);
router.post("/logout", logoutUser);

export { router as authRouter };
