// pages.routes.ts
import { Router } from "express";
import multer from "multer";
import {
  createPage,
  getPageByUsername,
  getAllPages,
  getMyPages,
  loginPage,
  followPage,
  unfollowPage, // <-- Import loginPage
} from "../controllers/pages.controller";
import { authMiddleware } from "../middleware/auth.middleware";

const router = Router();

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/");
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + "-" + file.originalname);
  },
});
const upload = multer({ storage });

// 1) Create a page
router.post(
  "/create",
  upload.fields([
    { name: "profileImage", maxCount: 1 },
    { name: "bannerImage", maxCount: 1 },
  ]),
  createPage
);

// 2) Login for pages
router.post("/login", loginPage); // <-- Add this line

// 3) Get pages created by the logged in user
router.get("/mine", authMiddleware, getMyPages);

// 4) Get all pages
router.get("/", getAllPages);

// 5) Get a page by username
router.get("/:username", getPageByUsername);

// Follow a page (PUT request)
router.put("/:pageId/follow", authMiddleware, followPage);

// Unfollow a page (DELETE request)
router.delete("/:pageId/follow", authMiddleware, unfollowPage);

export default router;
