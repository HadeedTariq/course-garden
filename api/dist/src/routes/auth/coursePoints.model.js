"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CoursePoints = void 0;
const mongoose_1 = require("mongoose");
const coursePointsSchema = new mongoose_1.Schema({
    points: {
        type: Number,
        default: 0,
    },
    courseId: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: "Course",
    },
    chapters: {
        type: [mongoose_1.Schema.Types.ObjectId],
        ref: "Chapter",
    },
    user: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: "User",
    },
    courseCompleted: {
        type: Boolean,
        default: false,
    },
});
exports.CoursePoints = (0, mongoose_1.model)("CoursePoints", coursePointsSchema);
//# sourceMappingURL=coursePoints.model.js.map