"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.updatePlaylist = exports.getMyPlaylists = exports.createPlaylist = void 0;
const express_async_handler_1 = __importDefault(require("express-async-handler"));
const course_model_1 = require("../teacher/course.model");
const playlist_model_1 = require("./playlist.model");
const createPlaylist = (0, express_async_handler_1.default)(async (req, res, next) => {
    const { user, courseId, name } = req.body;
    if (!name || !courseId) {
        return next({ message: "Please fill all the fields", status: 404 });
    }
    const course = await course_model_1.Course.findById(courseId);
    if (!course) {
        return next({ message: "Course not found", status: 404 });
    }
    const playlist = await playlist_model_1.Playlist.create({
        name,
        user: user.id,
        courses: [courseId],
        thumbnail: course.thumbnail,
    });
    res.status(201).json({ message: "Playlist Created Successfully" });
});
exports.createPlaylist = createPlaylist;
const getMyPlaylists = (0, express_async_handler_1.default)(async (req, res, next) => {
    const { user } = req.body;
    const myCreatedPlaylists = await playlist_model_1.Playlist.find({
        user: user.id,
    });
    console.log(myCreatedPlaylists);
    res.status(200).json(myCreatedPlaylists);
});
exports.getMyPlaylists = getMyPlaylists;
const updatePlaylist = (0, express_async_handler_1.default)(async (req, res, next) => {
    const { playlistId, courseId, user } = req.body;
    if (!playlistId || !courseId) {
        return next({
            message: "Playlist id and video id is required",
            status: 404,
        });
    }
    const playlistUpdater = await playlist_model_1.Playlist.findOneAndUpdate({
        _id: playlistId,
        user: user.id,
    }, {
        $push: { courses: courseId },
    });
    if (playlistUpdater) {
        res.status(201).json({ message: "Playlist updated successfully" });
    }
    else {
        return next({ status: 404 });
    }
});
exports.updatePlaylist = updatePlaylist;
//# sourceMappingURL=playlist.controller.js.map