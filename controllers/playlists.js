import express from 'express'
import Playlist from '../models/playlist.js'
import { NotFound } from '../utils/errors.js'

const router = express.Router()

//create playlist 
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
router.put("/:playlistId", async(req, res, next) =>{
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

router.delete("/:playlistId", async(req, res, next) => {
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

export default router