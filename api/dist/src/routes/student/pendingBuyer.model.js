"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PendingBuyer = void 0;
const mongoose_1 = require("mongoose");
const pendingBuyersSchema = new mongoose_1.Schema({
    user: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: "User",
    },
    courseId: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: "Course",
    },
    createdAt: { type: Date, default: Date.now },
    price: {
        type: String,
    },
});
pendingBuyersSchema.index({ createdAt: 1 }, { expireAfterSeconds: 5 * 60 });
exports.PendingBuyer = (0, mongoose_1.model)("PendingBuyer", pendingBuyersSchema);
//# sourceMappingURL=pendingBuyer.model.js.map