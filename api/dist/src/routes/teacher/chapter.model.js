"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Chapter = void 0;
const mongoose_1 = require("mongoose");
const chapterSchema = new mongoose_1.Schema({
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
    chapterNumber: {
        type: Number,
        required: true,
    },
    video: {
        type: String,
        required: true,
    },
    courseId: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: "Course",
    },
});
exports.Chapter = (0, mongoose_1.model)("Chapter", chapterSchema);
//# sourceMappingURL=chapter.model.js.map