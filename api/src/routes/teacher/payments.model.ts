import { Schema, model } from "mongoose";

const paymentSchema = new Schema({
  purchaser: {
    type: Schema.Types.ObjectId,
    ref: "User",
  },
  price: {
    type: String,
    required: true,
  },
  courseId: {
    type: Schema.Types.ObjectId,
    ref: "Course",
  },
  createdAt: {
    type: Date,
    default: new Date(),
  },
});

export const Payment = model("Payment", paymentSchema);
