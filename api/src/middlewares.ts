import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";

import ErrorResponse from "./interfaces/ErrorResponse";

export function notFound(req: Request, res: Response, next: NextFunction) {
  res.status(404);
  const error = new Error(`🔍 - Not Found - ${req.originalUrl}`);
  next(error);
}

export function checkAuth(req: Request, res: Response, next: NextFunction) {
  const { accessToken } = req.cookies;
  if (!accessToken) {
    return next({ message: "Access Token not found", status: 404 });
  }

  const user = jwt.verify(accessToken, process.env.JWT_ACCESS_TOKEN_SECRET!);

  if (!user) {
    return next({ message: "Invalid Access Token", status: 404 });
  }
  req.body.user = user;
  next();
}
// eslint-disable-next-line @typescript-eslint/no-unused-vars
export function errorHandler(
  err: Error & { status: number; description?: string },
  req: Request,
  res: Response<ErrorResponse & { description?: string }>,
  next: NextFunction
) {
  const statusCode = err.status !== 200 ? err.status : 500;
  res.status(statusCode || 500);
  res.json({
    message: err.message,
    description: err.description,
    stack: process.env.NODE_ENV === "production" ? "🥞" : err.stack,
  });
}
