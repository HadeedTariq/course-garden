import { Schema, model } from "mongoose";
const chapterSchema = new Schema({
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  thumbnail: {
    type: String,
    required: true,
  },
  chapterNumber: {
    type: Number,
    required: true,
  },
  video: {
    type: String,
    required: true,
  },
  courseId: {
    type: Schema.Types.ObjectId,
    ref: "Course",
  },
});

export const Chapter = model("Chapter", chapterSchema);
