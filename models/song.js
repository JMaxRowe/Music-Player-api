import mongoose from "mongoose";

const songSchema = new mongoose.Schema({
  title: { type: String, required: [true, `You need to add a song title.`] },
  artist: { type: String, required: [true, `You need to add a artist.`] },
  duration: { type: String },
  album: { type: String },
  userLikes: {
    type: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
    default: [],
  },
  url: { type: String },
});

const Song = mongoose.model("Song", songSchema);

export default Song;
