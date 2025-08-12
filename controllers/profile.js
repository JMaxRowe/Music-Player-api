import express from "express";
import verifyToken from "../middleware/verifyToken.js";
import Playlist from "../models/playlist.js";
import Song from "../models/song.js";
import User from "../models/user.js";

const router = express.Router();

router.get("/:userId", verifyToken, async (req, res, next) => {
  try {
    const userId = req.params.userId;
    const user = await User.findById(userId);

    // all/first 4 playlists created by this userId
    const createdPlaylists = await Playlist.find({ owner: userId })
      .populate("owner")
      .limit(4);

    // all/first 4 playlists bookmarked by this userId
    const bookmarkedPlaylists = await Playlist.find({
      userBookmarks: userId,
    })
      .populate("owner")
      .limit(4);

    // all/first 4 songs liked by this userId
    const likedSongs = await Song.find({ userLikes: userId }).limit(4);

    return res.json({
      user,
      createdPlaylists,
      bookmarkedPlaylists,
      likedSongs,
    });
  } catch (error) {
    next(error);
  }
});

export default router;
