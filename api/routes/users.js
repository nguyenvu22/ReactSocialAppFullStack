import express from "express";
import { getUser, updateUser, getUnfollowUser } from "../controllers/user.js"

const router = express.Router();

router.get("/find/:userId", getUser)
router.put("/", updateUser)
router.get("/findFollowUser", getUnfollowUser)

export default router;