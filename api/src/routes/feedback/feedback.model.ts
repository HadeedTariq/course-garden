import { Schema, model } from "mongoose";
const feedbackSchema = new Schema({
  content: {
    type: String,
    required: true,
  },
  user: {
    type: Schema.Types.ObjectId,
    ref: "User",
  },
  courseId: {
    type: Schema.Types.ObjectId,
    ref: "Course",
  },
  replies: [
    {
      content: {
        type: String,
        required: true,
      },
      user: {
        type: Schema.Types.ObjectId,
        ref: "User",
      },
    },
  ],
});

export const Feedback = model("Feedback", feedbackSchema);
