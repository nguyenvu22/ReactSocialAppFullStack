import express from "express";
import { addStory, getStories, getSpecificStory } from "../controllers/story.js"

const router = express.Router();

router.get("/", getStories)
router.post("/", addStory)
router.get("/story", getSpecificStory)

export default router;