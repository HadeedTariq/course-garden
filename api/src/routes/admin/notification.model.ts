import { Schema, model } from "mongoose";
const notificationSchema = new Schema({
  user: {
    type: Schema.Types.ObjectId,
    ref: "User",
  },
  message: {
    type: String,
    required: true,
  },
  read: {
    type: Boolean,
    default: false,
  },
});

export const Notification = model("Notification", notificationSchema);
