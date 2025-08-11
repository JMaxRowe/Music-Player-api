import express from 'express'
import Playlist from '../models/playlist.js'
import { NotFound, Unauthorized } from '../utils/errors.js'
import verifyToken from '../middleware/verifyToken.js'

const router = express.Router()

//create playlist 
router.post("/", verifyToken, async(req, res, next) =>{
    try {
        req.body.owner = req.owner
        const playlist = await Playlist.create(req.body)
        return res.status(201).json(playlist)
    } catch (error) {
        next(error)
    }
})
//get all playlists
router.get("/", async(req, res, next) =>{
    try {
        const playlists = await Playlist.find()
        return res.status(200).json(playlists)
    } catch (error) {
        next(error)
    }
})
// get individual playlist
router.get("/:playlistId", async(req, res, next) =>{
    try {
        const {playlistId} = req.params
        const playlist = await Playlist.findById(playlistId)
        if(!playlist) throw new NotFound()
        return res.status(200).json(playlist)
    } catch (error) {
        next(error)
    }
})
// update playlsit
router.put("/:playlistId", verifyToken, async(req, res, next) =>{
    try {
        const { playlistId } = req.params
        const playlist = await Playlist.findById(playlistId)
        if(!playlist) throw new NotFound()
        
        const updatedPlaylist = await Playlist.findByIdAndUpdate(playlistId, req.body, {
            returnDocument: 'after'
        })
        return res.status(200).json(updatedPlaylist)
    } catch (error) {
        next(error)
    }
})
// delete playlist

router.delete("/:playlistId", verifyToken, async(req, res, next) => {
    try {
        const { playlistId } = req.params
        const playlist = await Playlist.findById(playlistId)
        if(!playlist) throw new NotFound()
        await Playlist.findByIdAndDelete(playlistId)
        return res.sendStatus(204)
    } catch (error) {
        next(error)
    }
})

router.post("/:playlistId/bookmark", verifyToken, async (req, res, next) => {
    try {
        const {playlistId} = req.params
        const userId = req.owner
        if (!userId) throw new Unauthorized()
        const bookmarkedPlaylist = await Playlist.findById(playlistId)
        if (!bookmarkedPlaylist) throw new NotFound()
        
        const updatedPlaylist = await Playlist.findByIdAndUpdate(
            playlistId,
            { $addToSet: {userBookmarks: userId} },
            { returnDocument: 'after'}
        )
        return res.status(200).json(updatedPlaylist)
    } catch (error) {
        next(error)
    }
})

router.delete("/:playlistId/bookmark", verifyToken, async (req, res, next) => {
    try {
        const {playlistId} = req.params
        const userId = req.owner
        if (!userId) throw new Unauthorized()
        const playlist = await Playlist.findById(playlistId)
        if (!playlist) throw new NotFound()
        
        const updated = await Playlist.findByIdAndUpdate(
            playlistId,
            { $pull: { userBookmarks: userId } },
            { returnDocument: "after" }
        )
    return res.status(200).json(updated)
    } catch (error) {
        next(error)
    }
})
export default router