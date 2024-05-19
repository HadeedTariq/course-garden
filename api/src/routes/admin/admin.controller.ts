import asyncHandler from "express-async-handler";
import { TeacherRequest } from "./teacherRequest.model";
import { User } from "../auth/user.model";
import { Notification } from "./notification.model";

const adminChecker = asyncHandler(async (req, res, next) => {
  res.status(204).json({});
});

const requestToBecomeTeacher = asyncHandler(async (req, res, next) => {
  const { user, subject } = req.body;

  if (!subject) {
    return next({ message: "Subject is required", status: 404 });
  }

  const createTeacherRequest = await TeacherRequest.create({
    user: user.id,
    subject,
  });

  res
    .status(201)
    .json({ message: "Your request to admin is sent successfully" });
});

const teacherRequests = asyncHandler(async (req, res, next) => {
  const allRequests = await TeacherRequest.find({ approved: false }).populate({
    path: "user",
    select: "username email avatar qualification",
  });

  res.status(200).json(allRequests);
});

//? approve
const approveTeacher = asyncHandler(async (req, res, next) => {
  const { userId } = req.body;

  const updateRole = await User.findByIdAndUpdate(userId, {
    role: "teacher",
  });

  if (!updateRole) {
    return next({ status: 404, message: "Something went wrong" });
  }

  const createNotification = await Notification.create({
    user: userId,
    message:
      "Your request for teacher has been approved Please again signin to use your authorities",
  });

  await TeacherRequest.findOneAndUpdate(
    { user: updateRole._id },
    { approved: true }
  );

  res.status(200).json({ message: "User role updated successfully" });
});

//! reject
const rejectTeacher = asyncHandler(async (req, res, next) => {
  const { userId } = req.body;

  const createNotification = await Notification.create({
    user: userId,
    message: "Your request for teacher has been rejected",
  });

  res.status(200).json({ message: "Teacher rejected successfully" });
});

export {
  requestToBecomeTeacher,
  approveTeacher,
  rejectTeacher,
  adminChecker,
  teacherRequests,
};
