"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CouponCode = exports.Course = void 0;
const mongoose_1 = require("mongoose");
var Category;
(function (Category) {
    Category["Cs"] = "Cs";
    Category["It"] = "It";
    Category["FullStack"] = "FullStack";
    Category["AppDev"] = "AppDev";
    Category["Ml"] = "Ml";
    Category["DataScience"] = "DataScience";
    Category["Frontend"] = "Frontend";
    Category["Backend"] = "Backend";
    Category["Other"] = "Other";
})(Category || (Category = {}));
const courseSchema = new mongoose_1.Schema({
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
            validator: function (value) {
                return this.status === "paid" ? !!value : true;
            },
            message: () => "Price is required for paid status",
        },
    },
    totalChapters: {
        type: Number,
    },
    creator: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: "User",
    },
    chapters: {
        type: [mongoose_1.Schema.Types.ObjectId],
        ref: "Chapter",
    },
    couponCode: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: "CouponCode",
    },
    purchasers: {
        type: [mongoose_1.Schema.Types.ObjectId],
        ref: "User",
    },
    feedbacks: {
        type: [mongoose_1.Schema.Types.ObjectId],
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
exports.Course = (0, mongoose_1.model)("Course", courseSchema);
const couponCodeSchema = new mongoose_1.Schema({
    coupon: {
        type: String,
        required: true,
    },
    quantity: {
        type: Number,
        default: 0,
    },
    courseId: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: "Course",
    },
    couponUsers: {
        type: [mongoose_1.Schema.Types.ObjectId],
        ref: "User",
    },
});
exports.CouponCode = (0, mongoose_1.model)("CouponCode", couponCodeSchema);
//# sourceMappingURL=course.model.js.map