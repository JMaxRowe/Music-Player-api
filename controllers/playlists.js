import express from 'express'
import Playlist from '../models/playlist.js'
import { NotFound } from '../utils/errors.js'

const router = express.Router()

//create playlist - NEED TO SEE IMAGE UPLOAD LESSON TO COMPLETE
router.post("/", async(req, res, next) =>{
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
        const playlistId = req.params
        const playlist = await Playlist.findById(playlistId)
        if(!playlist) throw new NotFound()
        return res.status(200).json(playlist)
    } catch (error) {
        next(error)
    }
})
// update playlsit

// delete playlist

export default router