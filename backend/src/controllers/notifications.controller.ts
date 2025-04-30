// src/controllers/notifications.controller.ts
import { Request, Response } from "express";
import Notification from "../models/notifications.model";

export const createNotification = async (req: Request, res: Response) => {
  try {
    const { user, post, type, message } = req.body;
    if (!user || !post || !message) {
      return res.status(400).json({ error: "Missing required fields" });
    }
    const notification = new Notification({ user, post, type, message });
    await notification.save();
    return res.status(201).json(notification);
  } catch (error) {
    console.error("Error creating notification", error);
    return res.status(500).json({ error: "Internal server error" });
  }
};

export const getUserNotifications = async (req: Request, res: Response) => {
  try {
    const userId = req.params.userId;
    const notifications = await Notification.find({ user: userId }).sort({
      createdAt: -1,
    });
    return res.status(200).json(notifications);
  } catch (error) {
    console.error("Error fetching notifications", error);
    return res.status(500).json({ error: "Internal server error" });
  }
};

export const getNotificationStatus = async (req: Request, res: Response) => {
  try {
    const { post, user } = req.query;
    if (!post || !user) {
      return res
        .status(400)
        .json({ error: "Missing required query parameters" });
    }
    // Check if a notification record exists for this post and user
    const exists = await Notification.exists({ post, user });
    return res.status(200).json({ exists: !!exists });
  } catch (error) {
    console.error("Error checking notification status", error);
    return res.status(500).json({ error: "Internal server error" });
  }
};

export const removeNotification = async (req: Request, res: Response) => {
  try {
    const { post, user } = req.query;
    if (!post || !user) {
      return res
        .status(400)
        .json({ error: "Missing required query parameters" });
    }
    await Notification.deleteOne({ post, user });
    return res.status(200).json({ success: true });
  } catch (error) {
    console.error("Error removing notification", error);
    return res.status(500).json({ error: "Internal server error" });
  }
};
