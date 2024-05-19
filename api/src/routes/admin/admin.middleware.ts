import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import { User } from "../auth/user.model";
import { TeacherRequest } from "./teacherRequest.model";

const isAdmin = async (req: Request, res: Response, next: NextFunction) => {
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

  const isUserAdmin = await User.findOne({
    _id: user.id,
    role: "admin",
  });

  if (!isUserAdmin) {
    return next({ message: "Only admin can do this", status: 404 });
  }
  req.body.user = user;
  next();
};

const isAlreadyApplied = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { user } = req.body;

  const isApplied = await TeacherRequest.findOne({
    user: user.id,
  });

  if (isApplied) {
    return next({ message: "You already applied", status: 404 });
  }
  next();
};

export { isAdmin, isAlreadyApplied };
