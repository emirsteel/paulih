// chat.routes.ts
import express from "express";
import { authMiddleware } from "../middleware/auth.middleware";
import {
  getConversation,
  sendMessage,
  getFriends,
  markMessagesAsSeen,
  getUnreadMessages,
  reactMessage,
  upload,
  removeReaction,
} from "../controllers/chat.controller";

const router = express.Router();

router.get("/conversations/:userId", authMiddleware, getConversation);

router.post(
  "/messages",
  authMiddleware,
  upload.fields([
    { name: "images", maxCount: 10 },
    { name: "audio", maxCount: 1 },
    { name: "file", maxCount: 1 },
  ]),
  sendMessage
);

// New endpoint for reacting to a message
router.post("/messages/react", authMiddleware, reactMessage);

router.get("/friends", authMiddleware, getFriends);
router.post("/messages/seen", authMiddleware, markMessagesAsSeen);
router.get("/all-unread-messages", authMiddleware, getUnreadMessages);
router.post("/messages/removeReaction", authMiddleware, removeReaction);

export default router;
