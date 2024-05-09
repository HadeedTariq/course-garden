import { Schema, model } from "mongoose";
const playlistSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  thumbnail: {
    type: String,
    required: true,
  },
  user: {
    type: Schema.Types.ObjectId,
    ref: "User",
  },
  courses: {
    type: [Schema.Types.ObjectId],
    ref: "Course",
  },
});

export const Playlist = model("Playlist", playlistSchema);
