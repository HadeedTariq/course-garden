import asyncHandler from "express-async-handler";
import jwt from "jsonwebtoken";
import { pool } from "../../app";
import bcrypt from "bcrypt";

const registerUser = asyncHandler(async (req, res, next) => {
  const { username, email, password, qualification, mobileNumber, country } =
    req.body;
  if (
    !username ||
    !email ||
    !password ||
    !qualification ||
    !mobileNumber ||
    !country
  ) {
    return next({ message: "Please fill all the fields", status: 404 });
  }
  const hashedPassword = await bcrypt.hash(password, 12);
  await pool.query(
    "INSERT INTO users (username, email, user_password, qualification, mobilenumber, country) VALUES ($1, $2, $3, $4, $5, $6)",
    [username, email, hashedPassword, qualification, mobileNumber, country]
  );

  res.status(201).json({ message: "User registered successfully" });
});

const loginUser = asyncHandler(async (req, res, next) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return next({ status: 404, message: "Please fill all the fields" });
  }
  const { rows } = await pool.query("select * from users where email=$1", [
    email,
  ]);
  if (!rows[0]) {
    return next({ status: 404, message: "User does't exist" });
  }
  const isPasswordCorrect = await bcrypt.compare(
    password,
    rows[0].user_password
  );
  console.log(rows[0]);

  if (!isPasswordCorrect) {
    return next({ status: 404, message: "Incorrect password" });
  }
  const refreshToken = jwt.sign(
    {
      id: rows[0].userid,
    },
    process.env.JWT_REFRESH_TOKEN_SECRET as string
  );
  await pool.query("update users set refreshToken=$1 where userid=$2", [
    refreshToken,
    rows[0].userid,
  ]);
  const accessToken = jwt.sign(
    {
      id: rows[0].userid,
      username: rows[0].username,
    },
    process.env.JWT_ACCESS_TOKEN_SECRET as string
  );
  res
    .cookie("accessToken", accessToken, {
      secure: true,
      httpOnly: false,
      sameSite: "none",
    })
    .cookie("refreshToken", refreshToken, {
      secure: true,
      httpOnly: false,
      sameSite: "none",
    })
    .status(201)
    .json({
      message: "User logged in successfully",
    });
});

const authenticateUser = asyncHandler(async (req, res, next) => {
  const { user } = req.body;

  res.status(200).json(user);
});

const authenticateByResfreshToken = asyncHandler(async (req, res, next) => {
  const { refreshToken: refToken } = req.cookies;
  if (!refToken) {
    return next({ message: "Refresh Token not found", status: 404 });
  }
  const { id }: any = jwt.verify(
    refToken,
    process.env.JWT_REFRESH_TOKEN_SECRET!
  );
  if (!id) {
    return next({ message: "Invalid Refresh Token", status: 404 });
  }

  const { rows: user } = await pool.query(
    "select * from users where userid=$1",
    [id]
  );

  if (!user[0]) {
    return next({ status: 404, message: "User not found" });
  }
  const accessToken = jwt.sign(
    {
      id: user[0].userid,
      username: user[0].username,
    },
    process.env.JWT_ACCESS_TOKEN_SECRET as string
  );
  const refreshToken = jwt.sign(
    {
      id: user[0].userid,
    },
    process.env.JWT_REFRESH_TOKEN_SECRET as string
  );
  await pool.query("update users set refreshToken=$1 where userid=$2", [
    refreshToken,
    user[0].userid,
  ]);

  res
    .cookie("accessToken", accessToken, {
      secure: true,
      httpOnly: false,
      sameSite: "none",
    })
    .cookie("refreshToken", refreshToken, {
      secure: true,
      httpOnly: false,
      sameSite: "none",
    });

  res
    .status(200)
    .json({ message: "User logged in by using refreshToken successfully" });
});

const logoutUser = asyncHandler(async (req, res, next) => {
  res
    .clearCookie("refreshToken", {
      secure: true,
      httpOnly: false,
      sameSite: "none",
    })
    .clearCookie("accessToken", {
      secure: true,
      httpOnly: false,
      sameSite: "none",
    })
    .json({ message: "User logged out successfully" });
});

export {
  registerUser,
  loginUser,
  authenticateUser,
  authenticateByResfreshToken,
  logoutUser,
};
