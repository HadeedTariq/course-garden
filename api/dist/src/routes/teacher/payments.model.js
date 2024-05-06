"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Payment = void 0;
const mongoose_1 = require("mongoose");
const paymentSchema = new mongoose_1.Schema({
    purchaser: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: "User",
    },
    price: {
        type: String,
        required: true,
    },
    courseId: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: "Course",
    },
    createdAt: {
        type: Date,
        default: new Date(),
    },
});
exports.Payment = (0, mongoose_1.model)("Payment", paymentSchema);
//# sourceMappingURL=payments.model.js.map