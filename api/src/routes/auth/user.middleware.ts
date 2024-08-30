import { NextFunction, Request, Response } from "express";
import { pool } from "../../app";

const existedUser = async (req: Request, res: Response, next: NextFunction) => {
  const { email } = req.body;
  if (!email) {
    next({ message: "Please fill all the fields", status: 404 });
  }

  const { rows } = await pool.query("select email from users where email=$1", [
    email,
  ]);
  if (rows[0] && rows[0].email) {
    return next({ message: "User already exist with this mail", status: 404 });
  }
  next();
};

export { existedUser };
