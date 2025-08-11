// 1. connect database
import mongoose from "mongoose";
import dotenv from "dotenv";
import Song from "../models/song.js";

dotenv.config();

// 2. Songs to be uploaded into the database
const seedSongs = [
  {
    title: "Riptide",
    artist: "Vance Joy",
    duration: "3:21",
    album: "Dream Your Life Away",
    userLikes: [],
  },
  {
    title: "Stitches",
    artist: "Shawn Mendes",
    duration: "3:26",
    album: "Handwritten",
    userLikes: [],
  },
  {
    title: "Blinding Lights",
    artist: "The Weeknd",
    duration: "3:20",
    album: "After Hours",
    userLikes: [],
  },
  {
    title: "Roar",
    artist: "Katy Perry",
    duration: "3:43",
    album: "PRISM",
    userLikes: [],
  },
  {
    title: "Shape of You",
    artist: "Ed Sheeran",
    duration: "3:53",
    album: "Divide",
    userLikes: [],
  },
  {
    title: "Someone Like You",
    artist: "Adele",
    duration: "4:45",
    album: "21",
    userLikes: [],
  },
  {
    title: "Blank Space",
    artist: "Taylor Swift",
    duration: "3:51",
    album: "1989",
    userLikes: [],
  },
];

// 3. Upload the songs
async function uploadSongs() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    await Song.deleteMany({}); // delete the previous data
    await Song.insertMany(seedSongs);
    console.log("Songs uploaded!");
  } catch (error) {
    console.error("Upload failed", error);
  } finally {
    // action the finally statement no matter songs succeed or failed
    await mongoose.disconnect(); // 4. Disconnect the connection to database
  }
}

uploadSongs();
