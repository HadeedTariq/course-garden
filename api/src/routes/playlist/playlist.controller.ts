import asyncHandler from "express-async-handler";
import { Course } from "../teacher/course.model";
import { Playlist } from "./playlist.model";

const createPlaylist = asyncHandler(async (req, res, next) => {
  const { user, courseId, name } = req.body;

  if (!name || !courseId) {
    return next({ message: "Please fill all the fields", status: 404 });
  }

  const course = await Course.findById(courseId);

  if (!course) {
    return next({ message: "Course not found", status: 404 });
  }

  const playlist = await Playlist.create({
    name,
    user: user.id,
    courses: [courseId],
    thumbnail: course.thumbnail,
  });

  res.status(201).json({ message: "Playlist Created Successfully" });
});

const getMyPlaylists = asyncHandler(async (req, res, next) => {
  const { user } = req.body;

  const myCreatedPlaylists = await Playlist.find({
    user: user.id,
  });

  console.log(myCreatedPlaylists);

  res.status(200).json(myCreatedPlaylists);
});

const updatePlaylist = asyncHandler(async (req, res, next) => {
  const { playlistId, courseId, user } = req.body;

  if (!playlistId || !courseId) {
    return next({
      message: "Playlist id and video id is required",
      status: 404,
    });
  }

  const playlistUpdater = await Playlist.findOneAndUpdate(
    {
      _id: playlistId,
      user: user.id,
    },
    {
      $push: { courses: courseId },
    }
  );
  if (playlistUpdater) {
    res.status(201).json({ message: "Playlist updated successfully" });
  } else {
    return next({ status: 404 });
  }
});

export { createPlaylist, getMyPlaylists, updatePlaylist };
