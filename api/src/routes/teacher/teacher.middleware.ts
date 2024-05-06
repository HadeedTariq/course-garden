import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import { User } from "../auth/user.model";
import { Course } from "./course.model";

export const isTeacher = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { accessToken } = req.cookies;
  if (!accessToken) {
    return next({ message: "Access Token not found", status: 404 });
  }

  const user: any = jwt.verify(
    accessToken,
    process.env.JWT_ACCESS_TOKEN_SECRET!
  );

  if (!user) {
    return next({ message: "Invalid Access Token", status: 404 });
  }

  const isValidateTeacher = await User.findOne({
    _id: user.id,
    role: "teacher",
  });
  if (!isValidateTeacher) {
    return next({
      message: "Only teacher can perform this action",
      status: 404,
    });
  }

  req.body.user = user;
  next();
};

export const isCourseExist = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { courseId } = req.body;
  if (!courseId || courseId.length !== 24) {
    return next({ message: "Course Id must be true", status: 404 });
  }

  const course = await Course.findById(courseId);

  if (!course) {
    return next({ message: "Course Not found", status: 404 });
  }
  next();
};
