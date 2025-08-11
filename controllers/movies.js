import express from 'express'
import Movie from '../models/movie.js'
import verifyToken from '../middleware/verifyToken.js'

import { NotFound, Forbidden } from '../utils/errors.js'


const router = express.Router()

router.post('', verifyToken, async(req, res, next) =>{
    try {
        req.body.owner = req.user._id
        const movie = await Movie.create(req.body)
        return res.status(201).json(movie)
    } catch (error) {
        next(error)
    }
})

router.get('', async (req, res, next)=>{
    try {
        const movies = await Movie.find()
        return res.json(movies)
    } catch (error) {
        next(error)
    }
    
})

router.get('/:movieId', async(req, res, next) => {
    try {
        const { movieId } = req.params
        const movie = await Movie.findById(movieId).populate('owner')
        if (!movie) throw new NotFound('Movie not found')

        return res.json(movie)
    } catch (error) {
        next(error)
    }
})

router.put('/:movieId', verifyToken, async (req, res, next) => {
    try {
        const { movieId } = req.params
        const movie = await Movie.findById(movieId).populate('owner')
        if (!movie) throw new NotFound('Movie not found')
        
        if (!movie.owner.equals(req.user._id)) throw new Forbidden()

        const updatedMovie = await Movie.findByIdAndUpdate(movieId, req.body, {returnDocument: 'after'})

        return res.json(updatedMovie)
    } catch (error) {
        next(error)
    }
    
})

router.delete('/:movieId', verifyToken, async (req, res, next) => {
    try {
        const { movieId } = req.params
        const movie = await Movie.findById(movieId).populate('owner')
        if (!movie) throw new NotFound('Movie not found')
        
        if (!movie.owner.equals(req.user._id)) throw new Forbidden()

        await Movie.findByIdAndDelete(movieId)

        return res.sendStatus(201)
    } catch (error) {
        next(error)
    }
})

export default router