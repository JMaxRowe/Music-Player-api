import express from "express";
import Song from "../models/song.js";
import verifyToken from "../middleware/verifyToken.js";
import Playlist from "../models/playlist.js";

import { NotFound, Forbidden } from "../utils/errors.js";

const router = express.Router();

// index - display all songs
router.get("", async (req, res, next) => {
  try {
    const songs = await Song.find();
    return res.json(songs);
  } catch (error) {
    next(error);
  }
});

// add a song to the playlist
router.post("/:songId/add-to-playlist", verifyToken, async (req, res, next) => {
  const { songId } = req.params;
  const { playlistId } = req.body;
  try {
    const playlist = await Playlist.findById(playlistId);
    if (!playlist) throw new NotFound("Playlist not found.");

    if (!playlist.owner.equals(req.user._id)) {
      throw new Forbidden(
        "You don't have the permission to edit this playlist."
      );
    }

    if (!playlist.songs.includes(songId)) {
      playlist.songs.push(songId);
      await playlist.save();
    }
    return res.status(201).json(playlist);
  } catch (error) {
    next(error);
  }
});

// user likes a song
router.put("/:songId/like", verifyToken, async (req, res, next) => {
  try {
    const song = await Song.findById(req.params.songId);
    if (!song) throw new NotFound("Song not found.");

    const userId = req.user._id;
    if (!song.userLikes.includes(userId)) {
      song.userLikes.push(userId);
      await song.save();
    }
    res.json(song);
  } catch (error) {
    next(error);
  }
});

// user removes a like from a song
router.delete("/:songId/like", verifyToken, async (req, res, next) => {
  try {
    const song = await Song.findById(req.params.songId);
    if (!song) throw new NotFound("Song not found.");

    const userId = req.user._id;
    if (song.userLikes.includes(userId)) {
      song.userLikes = song.userLikes.filter((userLike) => {
        return userLike.toString() !== userId.toString();
      });
      await song.save();
    }
    res.json(song);
  } catch (error) {
    next(error);
  }
});

export default router;
