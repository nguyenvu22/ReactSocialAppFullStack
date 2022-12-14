import express from "express";
import { getUser, updateUser, getUnfollowUser, getFollowedUser } from "../controllers/user.js"

const router = express.Router();

router.get("/find/:userId", getUser)
router.put("/", updateUser)
router.get("/findFollowUser", getUnfollowUser)
router.get("/getFollowedUser", getFollowedUser)


export default router;