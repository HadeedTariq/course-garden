import asyncHandler from "express-async-handler";
import { Feedback } from "./feedback.model";
import mongoose from "mongoose";

const createFeedback = asyncHandler(async (req, res, next) => {
  const { user, content, courseId } = req.body;

  if (!courseId || !content) {
    return next({ message: "Please fil all the fields ", status: 404 });
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

    { $unwind: { path: "$replies", preserveNullAndEmptyArrays: true } },

    {
      $lookup: {
        from: "users",
        localField: "replies.user",
        foreignField: "_id",
        as: "replies.user",
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

    { $unwind: { path: "$replies.user", preserveNullAndEmptyArrays: true } },

    {
      $group: {
        _id: "$_id",
        content: { $first: "$content" },
        user: { $first: "$user" },
        courseId: { $first: "$courseId" },
        replies: { $push: "$replies" },
      },
    },
  ]);

  res.status(200).json(courseFeedbacks);
});

const createReply = asyncHandler(async (req, res, next) => {
  const { commentId, user, content } = req.body;
  if (!commentId) {
    return next({ message: "Comment Id is required", status: 404 });
  }

  const createdReply = await Feedback.findByIdAndUpdate(commentId, {
    $push: {
      replies: {
        user: user.id,
        content: content,
      },
    },
  });
  res.status(201).json({ message: "Reply created successfully" });
});

export { createFeedback, getCourseFeedbacks, createReply };
