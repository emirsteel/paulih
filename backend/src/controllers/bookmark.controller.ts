// bookmark.controller.ts
import { Request, Response } from "express";
import Bookmark from "../models/bookmark.model";

export const createBookmark = async (req: Request, res: Response) => {
  try {
    const { user, post } = req.body;
    const existing = await Bookmark.findOne({ user, post });
    if (existing) {
      return res.status(200).json(existing);
    }
    const bookmark = await Bookmark.create({ user, post });
    return res.status(201).json(bookmark);
  } catch (error) {
    console.error("Error creating bookmark:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
};

export const getBookmarkStatus = async (req: Request, res: Response) => {
  try {
    const { post, user } = req.query;
    if (!post || !user) {
      return res.status(400).json({ error: "Post and user are required." });
    }
    const bookmark = await Bookmark.findOne({ post, user });
    return res.status(200).json({ bookmarked: Boolean(bookmark) });
  } catch (error) {
    console.error("Error fetching bookmark status:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
};

export const deleteBookmark = async (req: Request, res: Response) => {
  try {
    const { post, user } = req.query;
    if (!post || !user) {
      return res.status(400).json({ error: "Post and user are required." });
    }
    const result = await Bookmark.findOneAndDelete({ post, user });
    if (!result) {
      return res.status(404).json({ error: "Bookmark not found." });
    }
    return res.status(200).json({ message: "Bookmark removed." });
  } catch (error) {
    console.error("Error deleting bookmark:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
};

export const getBookmarkCount = async (req: Request, res: Response) => {
  try {
    const { post } = req.query;
    if (!post) {
      return res.status(400).json({ error: "Post id is required." });
    }
    const count = await Bookmark.countDocuments({ post });
    return res.status(200).json({ count });
  } catch (error) {
    console.error("Error fetching bookmark count:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
};

// Get bookmarked posts for a specific user
export const getUserBookmarks = async (req: Request, res: Response) => {
  const { userId } = req.params;

  try {
    const bookmarks = await Bookmark.find({ user: userId }).populate({
      path: "post",
      populate: { path: "user", select: "username profileImage" },
    });
    return res.status(200).json({ bookmarks });
  } catch (error) {
    console.error("Error retrieving bookmarks:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
};

export const getUserBookmarkCount = async (req: Request, res: Response) => {
  const { userId } = req.params;
  try {
    // Ensure userId is converted to ObjectId if necessary:
    const count = await Bookmark.countDocuments({ user: userId });
    return res.status(200).json({ count });
  } catch (error) {
    console.error("Error retrieving bookmark count:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
};
