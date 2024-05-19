import { Schema, model } from "mongoose";
const teacherRequestSchema = new Schema({
  user: {
    type: Schema.Types.ObjectId,
    ref: "User",
    unique: true,
  },
  subject: {
    type: String,
    required: true,
  },
  approved: {
    type: Boolean,
    default: false,
  },
});

export const TeacherRequest = model("TeacherRequest", teacherRequestSchema);
