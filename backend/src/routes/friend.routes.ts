// routes/friend.routes.ts
import express from "express";
import {
  getUniversityFriendSuggestions,
  getFriendRequestSenders,
} from "../controllers/friend.controller";
import { protect } from "../middleware/auth.middleware";

const router = express.Router();

router.get("/university", protect, getUniversityFriendSuggestions);
router.get("/:userId/friend-requests", protect, getFriendRequestSenders);

export default router;
