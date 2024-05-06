import { NextFunction, Request, Response } from "express";
import { User } from "./user.model";

const existedUser = async (req: Request, res: Response, next: NextFunction) => {
  const { email } = req.body;
  if (!email) {
    next({ message: "Please fill all the fields", status: 404 });
  }

  const isUserAlreadyExist = await User.findOne({ email });
  if (isUserAlreadyExist) {
    return next({ message: "User already exist with this mail", status: 404 });
  }
  next();
};

export { existedUser };
