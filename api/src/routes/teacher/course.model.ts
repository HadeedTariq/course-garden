import { Document, Schema, Types, model } from "mongoose";
enum Category {
  "Cs" = "Cs",
  "It" = "It",
  "FullStack" = "FullStack",
  "AppDev" = "AppDev",
  "Ml" = "Ml",
  "DataScience" = "DataScience",
  "Frontend" = "Frontend",
  "Backend" = "Backend",
  "Other" = "Other",
}
interface ICourse extends Document {
  title: string;
  description: string;
  thumbnail: string;
  status: "free" | "paid";
  category: Category;
  price?: string;
  totalChapters?: number;
  creator: Types.ObjectId;
  couponCode: Types.ObjectId;
  chapters?: Types.ObjectId[];
  purchasers?: Types.ObjectId[];
  feedbacks?: Types.ObjectId[];
  isPublish: boolean;
}

const courseSchema = new Schema<ICourse>({
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
  status: {
    type: String,
    enum: ["free", "paid"],
    default: "free",
  },
  price: {
    type: String,
    validate: {
      validator: function (this: ICourse, value: string) {
        return this.status === "paid" ? !!value : true;
      },
      message: () => "Price is required for paid status",
    },
  },
  totalChapters: {
    type: Number,
  },
  creator: {
    type: Schema.Types.ObjectId,
    ref: "User",
  },
  chapters: {
    type: [Schema.Types.ObjectId],
    ref: "Chapter",
  },
  couponCode: {
    type: Schema.Types.ObjectId,
    ref: "CouponCode",
  },
  purchasers: {
    type: [Schema.Types.ObjectId],
    ref: "User",
  },
  feedbacks: {
    type: [Schema.Types.ObjectId],
    ref: "Feedback",
  },
  isPublish: {
    type: Boolean,
    default: false,
  },
  category: {
    type: String,
    enum: [
      "Cs",
      "It",
      "FullStack",
      "AppDev",
      "Ml",
      "DataScience",
      "Frontend",
      "Backend",
      "Other",
    ],
    required: true,
  },
});

export const Course = model("Course", courseSchema);

const couponCodeSchema = new Schema({
  coupon: {
    type: String,
    required: true,
  },
  quantity: {
    type: Number,
    default: 0,
  },
  courseId: {
    type: Schema.Types.ObjectId,
    ref: "Course",
  },
  couponUsers: {
    type: [Schema.Types.ObjectId],
    ref: "User",
  },
});

export const CouponCode = model("CouponCode", couponCodeSchema);
