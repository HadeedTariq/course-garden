import mongoose, { Schema, Document, Types } from "mongoose";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

export interface UserDocument extends Document {
  username: string;
  email: string;
  avatar?: string;
  qualification: string;
  mobileNumber: string;
  country: string;
  password: string;
  role: "student" | "teacher" | "admin" | "pro";
  status: "member" | "pro";
  refreshToken: string;
  points: Types.ObjectId;
  isPasswordCorrect(password: string): Promise<boolean>;
  generateAccessAndRefreshToken(): {
    refreshToken: string;
    accessToken: string;
  };
}

const userSchema = new Schema<UserDocument>(
  {
    username: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      index: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowecase: true,
      trim: true,
    },
    avatar: {
      type: String,
      required: false,
      default:
        "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRRhtuszppVVNDg2JDHofrs55RtFKjd8I9vNU_wzl2CMA&s",
    },
    password: {
      type: String,
      required: [true, "Password is required"],
    },
    qualification: {
      type: String,
      required: [true, "Qualification is required"],
    },
    points: {
      type: Schema.Types.ObjectId,
      ref: "CoursePoints",
    },
    refreshToken: {
      type: String,
      required: false,
    },
    role: {
      type: String,
      enum: ["student", "teacher", "admin"],
      default: "student",
    },
    mobileNumber: {
      type: String,
      required: true,
      unique: true,
    },
    country: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      enum: ["member", "pro"],
      default: "member",
    },
  },
  {
    timestamps: true,
  }
);

userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();

  this.password = await bcrypt.hash(this.password, 10);
  next();
});

userSchema.methods.isPasswordCorrect = async function (password: string) {
  return await bcrypt.compare(password, this.password);
};
userSchema.methods.generateAccessAndRefreshToken = function () {
  const refreshToken = jwt.sign(
    { id: this._id },
    process.env.JWT_REFRESH_TOKEN_SECRET!,
    {
      expiresIn: "15d",
    }
  );
  const accessToken = jwt.sign(
    {
      id: this._id,
      username: this.username,
      email: this.email,
      status: this.status,
      role: this.role,
      avatar: this.avatar,
    },
    process.env.JWT_ACCESS_TOKEN_SECRET!,
    { expiresIn: "2d" }
  );

  return { refreshToken, accessToken };
};

export const User = mongoose.model<UserDocument>("User", userSchema);
