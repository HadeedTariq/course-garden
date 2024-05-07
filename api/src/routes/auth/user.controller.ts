import asyncHandler from "express-async-handler";
import PhoneNumber from "libphonenumber-js";
import jwt from "jsonwebtoken";
import { User } from "./user.model";

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
  const phoneNumber = PhoneNumber(mobileNumber, country.toUpperCase());

  if (!phoneNumber?.isValid()) {
    return next({
      message: "Invalid Mobile Number",
      description: "This phone number doesn't match to your country code",
      status: 404,
    });
  }

  await User.create(req.body);
  res.status(201).json({ message: "User registered successfully" });
});

const loginUser = asyncHandler(async (req, res, next) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return next({ status: 404, message: "Please fill all the fields" });
  }

  const user = await User.findOne({ email });

  if (!user) {
    return next({ status: 404, message: "User not found" });
  }

  const isPasswordCorrect = await user.isPasswordCorrect(password);

  if (!isPasswordCorrect) {
    return next({ status: 404, message: "Incorrect Credentials" });
  }
  const { accessToken, refreshToken } = user.generateAccessAndRefreshToken();
  user.refreshToken = refreshToken;
  await user.save({ validateBeforeSave: false });

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

  res.status(200).json({ message: "User logged in successfully" });
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

  const user = await User.findById(id);

  if (!user) {
    return next({ status: 404, message: "User not found" });
  }

  const { accessToken, refreshToken } = user.generateAccessAndRefreshToken();
  user.refreshToken = refreshToken;
  await user.save({ validateBeforeSave: false });

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
