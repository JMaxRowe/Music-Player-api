import mongoose from "mongoose";


const movieSchema = new mongoose.Schema({
    title: {type: String, required: ['You need to add a movie title.', true]},
    director: {type: String, required: ['You need to add a director.', true]},
    owner: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
}, {
    timestamps: true,
    toJSON: { virtuals: true }
})


const Movie = mongoose.model('Movie', movieSchema)

export default Movie