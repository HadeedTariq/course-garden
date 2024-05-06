import { Schema, model } from "mongoose";

const pendingBuyersSchema = new Schema({
  user: {
    type: Schema.Types.ObjectId,
    ref: "User",
  },
  courseId: {
    type: Schema.Types.ObjectId,
    ref: "Course",
  },
  createdAt: { type: Date, default: Date.now },
  price: {
    type: String,
  },
});

pendingBuyersSchema.index({ createdAt: 1 }, { expireAfterSeconds: 5 * 60 });

export const PendingBuyer = model("PendingBuyer", pendingBuyersSchema);
