import { Router } from "express";
import {
  createBookmark,
  getBookmarkStatus,
  deleteBookmark,
  getBookmarkCount,
  getUserBookmarks,
  getUserBookmarkCount, // <-- new import
} from "../controllers/bookmark.controller";

const router = Router();

router.post("/", createBookmark);
router.get("/status", getBookmarkStatus);
router.delete("/", deleteBookmark);
router.get("/count", getBookmarkCount);

// Route to get bookmarked posts for a user
router.get("/user/:userId", getUserBookmarks);

// NEW: Route to get bookmarked count for a user
router.get("/user/:userId/count", getUserBookmarkCount);

export default router;
