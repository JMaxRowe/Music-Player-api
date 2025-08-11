import mongoose from "mongoose";


const playlistSchema = new mongoose.Schema({
    title: {type: String, required: ['You need to add a playlist title.', true]},
    director: {type: String, required: ['You need to add a director.', true]},
    owner: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
}, {
    timestamps: true,
    toJSON: { virtuals: true }
})


const Playlist = mongoose.model('Playlist', playlistSchema)

export default Playlist