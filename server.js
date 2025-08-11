import express from "express";
import "dotenv/config";
import morgan from "morgan";
import mongoose from "mongoose";

import userRouter from "./controllers/users.js";
import playlistRouter from "./controllers/playlists.js";
import songRouter from "./controllers/songs.js";
import profileRouter from "./controllers/profile.js";

import notFoundHandler from "./middleware/notFoundHandler.js";
import errorHandler from "./middleware/errorHandler.js";
import verifyToken from "./middleware/verifyToken.js";
import cors from "cors";

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());
app.use(cors({ origin: "http://localhost:5173" }));
app.use(morgan("dev"));

app.get("/protected-route", verifyToken, (req, res, next) => {
  return res.json({ message: "HIT PROTECTED ROUTE" });
});

app.use("/api/auth", userRouter);
app.use("/api/playlists", playlistRouter);
app.use("/api/songs", songRouter);
app.use("/api/profile", profileRouter);

app.use(notFoundHandler);

app.use(errorHandler);

const startServers = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log("🔒 Database connected");
    app.listen(port, () => console.log(`🚀 Server running on port ${port}`));
  } catch (error) {
    console.log(error);
  }
};
startServers();
