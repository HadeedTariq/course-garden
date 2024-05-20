"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TeacherRequest = void 0;
const mongoose_1 = require("mongoose");
const teacherRequestSchema = new mongoose_1.Schema({
    user: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: "User",
        unique: true,
    },
    subject: {
        type: String,
        required: true,
    },
    approved: {
        type: Boolean,
        default: false,
    },
});
exports.TeacherRequest = (0, mongoose_1.model)("TeacherRequest", teacherRequestSchema);
//# sourceMappingURL=teacherRequest.model.js.map