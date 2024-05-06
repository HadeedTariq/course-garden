"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createChapter = void 0;
const express_async_handler_1 = __importDefault(require("express-async-handler"));
const chapter_model_1 = require("./chapter.model");
const course_model_1 = require("./course.model");
const createChapter = (0, express_async_handler_1.default)(async (req, res, next) => {
    const { title, description, thumbnail, chapterNumber, video, courseId, totalChapters, } = req.body;
    if (!title ||
        !description ||
        !thumbnail ||
        !chapterNumber ||
        !video ||
        !courseId) {
        return next({ message: "Please fill all the fields", status: 404 });
    }
    const createdChapter = await chapter_model_1.Chapter.create({
        title,
        description,
        thumbnail,
        chapterNumber,
        video,
        courseId,
    });
    await course_model_1.Course.findByIdAndUpdate(courseId, {
        $push: { chapters: createdChapter._id },
        totalChapters,
    });
    if (createdChapter) {
        res.status(201).json({
            message: "Chapter created successfully",
            chapterId: createdChapter._id,
        });
    }
    else {
        return next({ message: "Something went wrong" });
    }
});
exports.createChapter = createChapter;
//# sourceMappingURL=chapter.controller.js.map