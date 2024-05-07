import { ChapterSchema } from "@/routes/app/teacher/validators/course.validator";

interface ServerError {
  response: {
    data: {
      message: string;
      description?: string;
    };
  };
}

interface User {
  id: string;
  username: string;
  email: string;
  status: string;
  role: "student" | "teacher" | "admin" | "pro";
  avatar: string;
}
interface ChapterType extends ChapterSchema {
  _id: string;
}
interface CourseType {
  title: string;
  description: string;
  thumbnail: string;
  status: "free" | "paid";
  price: string;
  totalChapters: number;
  creator: string;
  purchasers?: string[];
  feedbacks?: string[];
  isPublish: boolean;
  _id: string;
  chapters: ChapterType[];
}
