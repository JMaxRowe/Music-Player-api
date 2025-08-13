import express from "express";
import Song from "../models/song.js";
import verifyToken from "../middleware/verifyToken.js";
import Playlist from "../models/playlist.js";

const router = express.Router();

// get all songs liked by a user
router.get("/:userId/liked-songs", verifyToken, async (req, res, next) => {
  try {
    const userId = req.params.userId;
    const likedSongs = await Song.find({ userLikes: userId });
    return res.json(likedSongs);
  } catch (error) {
    next(error);
  }
});

// get all playlists created by a user
router.get(
  "/:userId/created-playlists",
  verifyToken,
  async (req, res, next) => {
    try {
      const userId = req.params.userId;
      const createdPlaylists = await Playlist.find({ owner: userId });
      return res.json(createdPlaylists);
    } catch (error) {
      next(error);
    }
  }
);

// get all playlists bookmarked by a user
router.get(
  "/:userId/bookmarked-playlists",
  verifyToken,
  async (req, res, next) => {
    try {
      const userId = req.params.userId;
      const bookmarkedPlaylists = await Playlist.find({
        userBookmarks: userId,
      });
      return res.json(bookmarkedPlaylists);
    } catch (error) {
      next(error);
    }
  }
);
