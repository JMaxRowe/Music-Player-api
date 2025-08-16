import express from "express";
import "dotenv/config";
import morgan from "morgan";
import mongoose from "mongoose";
import serverless from 'serverless-http'

import userRouter from "../../controllers/users.js";
import playlistRouter from "../../controllers/playlists.js";
import songRouter from "../../controllers/songs.js";
import profileRouter from "../../controllers/profile.js";

import Playlist from "../../models/playlist.js";
import Song from "../../models/song.js";

import notFoundHandler from "../../middleware/notFoundHandler.js";
import errorHandler from "../../middleware/errorHandler.js";
import verifyToken from "../../middleware/verifyToken.js";
import cors from "cors";

const app = express();



app.use(cors());
app.use(morgan("dev"));

app.get("/protected-route", verifyToken, (req, res, next) => {
  return res.json({ message: "HIT PROTECTED ROUTE" });
});

app.get("/api", async (req, res, next) => {
  try {
    const popularPlaylists = await Playlist.aggregate([
      {
        $addFields: {
          bookmarkCount: {
            $size: { $ifNull: ["$userBookmarks", []] },
          },
        },
      },
      { $sort: { bookmarkCount: -1 } },
      { $limit: 4 },
    ]);

    const topSongs = await Song.aggregate([
      {
        $addFields: {
          likeCount: {
            $size: { $ifNull: ["$userLikes", []] },
          },
        },
      },
      { $sort: { likeCount: -1 } },
      { $limit: 4 },
    ]);

    const topPlaylists = await Playlist.populate(popularPlaylists, "owner");

    return res.status(200).json({ topPlaylists, topSongs });
  } catch (error) {
    next(error);
  }
});

app.use("/api/auth", userRouter);
app.use("/api/playlists", playlistRouter);
app.use("/api/songs", songRouter);
app.use("/api/user", profileRouter);

app.use(notFoundHandler);

app.use(errorHandler);

const startServers = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log("🔒 Database connected");

  } catch (error) {
    console.log(error);
  }
};
startServers();

export const handler = serverless(app, {
  request: (req, event) => {
    if (typeof event.body === 'string') {
      try {
        req.body = JSON.parse(event.body);
      } catch (err) {
        req.body = {};
      }
    }
  }
});