import express from "express";
const app = express();
import cors from "cors";
import cookieParser from "cookie-parser";
import multer from "multer";

import authRoutes from "./routes/auth.js";
import commentRoutes from "./routes/comments.js";
import likeRoutes from "./routes/likes.js";
import postRoutes from "./routes/posts.js";
import userRoutes from "./routes/users.js";
import relationshipRoutes from "./routes/relationships.js";
import storyRoutes from "./routes/stories.js";
import conversationRoutes from "./routes/conversations.js";
import messageRoutes from "./routes/messages.js";

//middlewware
//config whhile using credential:true
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Credentials", true);
  next();
});
app.use(express.json()); //=> Allow sending json obj
app.use(
  cors({
    origin: "http://localhost:3000",
  })
);
app.use(cookieParser());

//Upload file at client side
const storage = multer.diskStorage({
  //Where to store img
  destination: function (req, file, cb) {
    cb(null, "../client/public/upload");
  },
  //Name of that img
  filename: function (req, file, cb) {
    //Custom file's name
    cb(null, Date.now() + file.originalname);
  },
});
const upload = multer({ storage: storage });
app.post("/api/upload", upload.single("file"), (req, res) => {
  const file = req.file;
  res.status(200).json(file.filename);
});

// make sure no one con reach the API but localhost:3000
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/posts", postRoutes);
app.use("/api/comments", commentRoutes);
app.use("/api/likes", likeRoutes);
app.use("/api/relationships", relationshipRoutes);
app.use("/api/stories", storyRoutes);
app.use("/api/conversation", conversationRoutes);
app.use("/api/message", messageRoutes);

app.listen(8800, () => {
  console.log("API working!");
});
