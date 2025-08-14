import express from "express";
import Playlist from "../models/playlist.js";
import { NotFound, Unauthorized, Forbidden } from "../utils/errors.js";
import verifyToken from "../middleware/verifyToken.js";

const router = express.Router();

//create playlist
router.post("/", verifyToken, async (req, res, next) => {
  try {
    req.body.owner = req.user._id || req.owner;
    const playlist = await Playlist.create(req.body);
    return res.status(201).json(playlist);
  } catch (error) {
    next(error);
  }
});
//get all playlists
router.get("/", async (req, res, next) => {
  try {
    const playlists = await Playlist.find().populate("owner");
    return res.status(200).json(playlists);
  } catch (error) {
    next(error);
  }
});
// get individual playlist
router.get("/:playlistId", async (req, res, next) => {
  try {
    const { playlistId } = req.params;
    const playlist = await Playlist.findById(playlistId)
      .populate("owner")
      .populate("songs");
    if (!playlist) throw new NotFound("Playlist not found");
    return res.status(200).json(playlist);
  } catch (error) {
    next(error);
  }
});
// update playlist
router.put("/:playlistId", verifyToken, async (req, res, next) => {
  try {
    const { playlistId } = req.params;
    const playlist = await Playlist.findById(playlistId);
    if (!playlist) throw new NotFound("Playlist not found");

    if (!playlist.owner.equals(req.user._id))
      throw new Forbidden(
        "You don't have the permission to edit this playlist."
      );

    const updatedPlaylist = await Playlist.findByIdAndUpdate(
      playlistId,
      req.body,
      {
        returnDocument: "after",
      }
    );
    return res.status(200).json(updatedPlaylist);
  } catch (error) {
    next(error);
  }
});
// delete playlist

router.delete("/:playlistId", verifyToken, async (req, res, next) => {
  try {
    const { playlistId } = req.params;
    const playlist = await Playlist.findById(playlistId);
    if (!playlist) throw new NotFound("Playlist not found");

    if (!playlist.owner.equals(req.user._id))
      throw new Forbidden(
        "You don't have the permission to delete this playlist."
      );

    await Playlist.findByIdAndDelete(playlistId);
    return res.sendStatus(204);
  } catch (error) {
    next(error);
  }
});

router.post("/:playlistId/bookmark", verifyToken, async (req, res, next) => {
  try {
    const { playlistId } = req.params;
    const userId = req.user._id;
    if (!userId) throw new Unauthorized("Authentication required");
    const bookmarkedPlaylist = await Playlist.findById(playlistId);
    if (!bookmarkedPlaylist) throw new NotFound("Playlist not found");

    const updatedPlaylist = await Playlist.findByIdAndUpdate(
      playlistId,
      { $addToSet: { userBookmarks: userId } },
      { returnDocument: "after" }
    );
    return res.status(200).json(updatedPlaylist);
  } catch (error) {
    next(error);
  }
});

router.delete("/:playlistId/bookmark", verifyToken, async (req, res, next) => {
  try {
    const { playlistId } = req.params;
    const userId = req.user._id;
    if (!userId) throw new Unauthorized("Authentication required");
    const playlist = await Playlist.findById(playlistId);
    if (!playlist) throw new NotFound("Playlist not found");

    const updated = await Playlist.findByIdAndUpdate(
      playlistId,
      { $pull: { userBookmarks: userId } },
      { returnDocument: "after" }
    );
    return res.status(200).json(updated);
  } catch (error) {
    next(error);
  }
});
export default router;
