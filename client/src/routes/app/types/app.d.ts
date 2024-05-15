import { Category } from "@/lib/category";
import { User } from "@/types/general";

interface Chapter {
  _id: string;
  title: string;
  description: string;
  thumbnail: string;
  chapterNumber: number;
  video: string;
}

interface Feedback {
  _id: string;
  content: string;
  user: Pick<User, "username" | "avatar">;
  replies: Feedback[];
}

interface PublishedCourse {
  _id: string;
  title: string;
  description: string;
  thumbnail: string;
  status: "free" | "paid";
  totalChapters: number;
  price: string;
  category: Category;
  teacher: Pick<User, "username" | "avatar"> & { qualification: string };
  courseChapters: Chapter[];
  purchasers: User[];
  feedbacks: Feedback[];
}

interface CoursePurchasersDetails {
  _id: string;
  purchaser: string;
  price: string;
  courseId: string;
  purchaserDetails: {
    _id: string;
    username: string;
    avatar: string;
    email: string;
  };
}

interface CourseRevenue {
  purchaserDetails: CoursePurchasersDetails[];
  totalRevenue: string;
  monthlyRevenue: string;
}

interface PlaylistData {
  _id: string;
  name: string;
  thumbnail: string;
  user: string;
  courses: string[];
}
