import mongoose from "mongoose";


const playlistSchema = new mongoose.Schema({
    title: {type: String, required: ['You need to title your playlist.', true]},
    songs: [
        {
            type: mongoose.Schema.Types.ObjectId, 
            ref: 'Song',

        }],
    owner: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'User',
        required: true },
    coverArt: {type: String},
    Bookmarks:{
        type: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
        default: []
    } 
}, {
    timestamps: true,
    toJSON: { virtuals: true }
})


const Playlist = mongoose.model('Playlist', playlistSchema)

export default Playlist