import { Schema, model } from "mongoose";

const coursePointsSchema = new Schema({
  points: {
    type: Number,
    default: 0,
  },
  courseId: {
    type: Schema.Types.ObjectId,
    ref: "Course",
  },
  chapters: {
    type: [Schema.Types.ObjectId],
    ref: "Chapter",
  },
  user: {
    type: Schema.Types.ObjectId,
    ref: "User",
  },
  courseCompleted: {
    type: Boolean,
    default: false,
  },
});

export const CoursePoints = model("CoursePoints", coursePointsSchema);
