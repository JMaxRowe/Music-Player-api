import express from 'express'
import Playlist from '../models/playlist.js'
import { NotFound } from '../utils/errors.js'

const router = express.Router()

//create playlist - NEED TO SEE IMAGE UPLOAD LESSON TO COMPLETE
router.post("", async(req, res, next) =>{
    try {
        const playlist = await Playlist.create(req.body)
        return res.status(201).json(playlist)
    } catch (error) {
        next(error)
    }
})
//get all playlists

// get individual playlist

// update playlsit

// delete playlist

export default router