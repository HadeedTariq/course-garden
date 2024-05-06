import { CourseType } from "@/types/general";
import { z } from "zod";

const courseValidator = z.object({
  title: z
    .string()
    .min(10, { message: "Minimum 10 characters long" })
    .max(255, { message: "Maximum 255 characters long" }),
  description: z
    .string()
    .min(20, { message: "Minimum 20 characters long" })
    .max(500, { message: "Maximum 500 characters long" }),
  thumbnail: z.string().url(),
  couponCode: z.object({
    coupon: z
      .string()
      .min(10, { message: "Minimum 10 characters long" })
      .max(15, { message: "Maximum 15 characters long" }),
    quantity: z.number(),
  }),
  category: z.enum([
    "Cs",
    "It",
    "FullStack",
    "AppDev",
    "Ml",
    "DataScience",
    "Frontend",
    "Backend",
    "Other",
  ]),
});

export type CourseSchema = z.infer<typeof courseValidator>;

const chapterValidator = z.object({
  title: z
    .string()
    .min(10, { message: "Minimum 10 characters long" })
    .max(255, { message: "Maximum 255 characters long" }),
  description: z
    .string()
    .min(20, { message: "Minimum 20 characters long" })
    .max(500, { message: "Maximum 500 characters long" }),
  thumbnail: z.string().url(),
  chapterNumber: z.number(),
  courseId: z.string().min(22),
  video: z.string().url(),
});

export type ChapterSchema = z.infer<typeof chapterValidator>;

const publishValidator = z.object({
  totalChapters: z
    .number()
    .max(20, { message: "Chapters cannot exceed the limit of 20" })
    .optional(),
  status: z.enum(["free", "paid"]),
  price: z.string().optional(),
  chapters: z.any().optional(),
});

export type PublishSchema = Omit<
  z.infer<typeof publishValidator>,
  "chapters"
> & {
  chapters: CourseType["chapters"] | [];
};

export { courseValidator, chapterValidator, publishValidator };
