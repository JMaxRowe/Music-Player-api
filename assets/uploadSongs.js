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
    album: "Dream Your Life Away",
    userLikes: [],
    url: "",
  },
  {
    title: "Stitches",
    artist: "Shawn Mendes",
    album: "Handwritten",
    userLikes: [],
    url: "",
  },
  {
    title: "Blinding Lights",
    artist: "The Weeknd",
    album: "After Hours",
    userLikes: [],
    url: "",
  },
  {
    title: "Roar",
    artist: "Katy Perry",
    album: "PRISM",
    userLikes: [],
    url: "",
  },
  {
    title: "Shape of You",
    artist: "Ed Sheeran",
    album: "Divide",
    userLikes: [],
    url: "",
  },
  {
    title: "Blank Space",
    artist: "Taylor Swift",
    album: "1989",
    userLikes: [],
    url: "",
  },
  {
    title: "HP_OfficeJet",
    artist: "Harris Heller",
    album: "Assassin",
    userLikes: [],
    url: "https://res.cloudinary.com/dhdhyhahn/video/upload/v1755082364/6._HP_OfficeJet_binep5.wav",
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
