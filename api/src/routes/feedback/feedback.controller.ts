import asyncHandler from "express-async-handler";
import { Feedback } from "./feedback.model";
import mongoose from "mongoose";

const createFeedback = asyncHandler(async (req, res, next) => {
  const { user, content, courseId } = req.body;

  if (!courseId || !content) {
    return next({ message: "Please fil all thye fields ", status: 404 });
  }

  const createdFeedback = await Feedback.create({
    content,
    user: user.id,
    courseId,
  });

  res.status(201).json({ message: "Feedback created successfully" });
});

const getCourseFeedbacks = asyncHandler(async (req, res, next) => {
  const { courseId } = req.query;
  if (!courseId) {
    return next({ message: "CourseId is required", status: 404 });
  }

  const courseFeedbacks = await Feedback.aggregate([
    {
      $match: {
        courseId: new mongoose.Types.ObjectId(courseId as string),
      },
    },
    {
      $lookup: {
        from: "users",
        localField: "user",
        foreignField: "_id",
        as: "user",
        pipeline: [
          {
            $project: {
              username: 1,
              avatar: 1,
            },
          },
        ],
      },
    },
    {
      $unwind: "$user",
    },
  ]);
  console.log(courseFeedbacks);
  res.status(200).json(courseFeedbacks);
});

export { createFeedback, getCourseFeedbacks };
