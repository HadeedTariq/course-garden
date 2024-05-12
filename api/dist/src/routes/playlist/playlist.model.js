"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Playlist = void 0;
const mongoose_1 = require("mongoose");
const playlistSchema = new mongoose_1.Schema({
    name: {
        type: String,
        required: true,
    },
    thumbnail: {
        type: String,
        required: true,
    },
    user: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: "User",
    },
    courses: {
        type: [mongoose_1.Schema.Types.ObjectId],
        ref: "Course",
    },
});
exports.Playlist = (0, mongoose_1.model)("Playlist", playlistSchema);
//# sourceMappingURL=playlist.model.js.map