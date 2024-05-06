import asyncHandler from "express-async-handler";
import { Chapter } from "./chapter.model";
import { Course } from "./course.model";

const createChapter = asyncHandler(async (req, res, next) => {
  const {
    title,
    description,
    thumbnail,
    chapterNumber,
    video,
    courseId,
    totalChapters,
  } = req.body;

  if (
    !title ||
    !description ||
    !thumbnail ||
    !chapterNumber ||
    !video ||
    !courseId
  ) {
    return next({ message: "Please fill all the fields", status: 404 });
  }
  const createdChapter = await Chapter.create({
    title,
    description,
    thumbnail,
    chapterNumber,
    video,
    courseId,
  });

  await Course.findByIdAndUpdate(courseId, {
    $push: { chapters: createdChapter._id },
    totalChapters,
  });

  if (createdChapter) {
    res.status(201).json({
      message: "Chapter created successfully",
      chapterId: createdChapter._id,
    });
  } else {
    return next({ message: "Something went wrong" });
  }
});

export { createChapter };
