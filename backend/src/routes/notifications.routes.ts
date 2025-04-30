// src/routes/notifications.routes.ts
import express from "express";
import {
  createNotification,
  getUserNotifications,
  getNotificationStatus,
  removeNotification,
} from "../controllers/notifications.controller";

const router = express.Router();

router.post("/", createNotification);
router.get("/:userId", getUserNotifications);
router.get("/status", getNotificationStatus);
router.delete("/", removeNotification);

export default router;
