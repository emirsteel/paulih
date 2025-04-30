// chat.controller.ts
import { Request, Response } from "express";
import ChatMessage from "../models/chat.model";
import User from "../models/user.model";
import { AuthenticatedRequest } from "../middleware/auth.middleware";
import io from "../socket";
import multer from "multer";
import mongoose from "mongoose";

// --------------------------------------------------------------------
// Multer configuration for file uploads (images, audio, and generic files)
// --------------------------------------------------------------------
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/"); // Folder where files will be stored
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});

const upload = multer({
  storage,
  fileFilter: (req, file, cb) => {
    const allowedTypes = [
      "image/png",
      "image/jpeg",
      "image/jpg",
      "image/webp",
      "audio/webm",
      "audio/mpeg",
      "audio/wav",
      "application/pdf",
      "application/vnd.ms-excel",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      "application/msword",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      "application/vnd.ms-powerpoint",
      "application/vnd.openxmlformats-officedocument.presentationml.presentation",
    ];
    if (allowedTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      console.error(`Invalid file type: ${file.mimetype}`);
      cb(new multer.MulterError("LIMIT_UNEXPECTED_FILE", file.fieldname));
    }
  },
});

// --------------------------------------------------------------------
// Fetch conversations between two users (or group messages)
// --------------------------------------------------------------------
export const getConversation = async (
  req: AuthenticatedRequest,
  res: Response
) => {
  const { userId } = req.params;
  const loggedInUserId = req.user?._id;
  try {
    const messages = await ChatMessage.find({
      $or: [
        { sender: loggedInUserId, receiver: userId },
        { sender: userId, receiver: loggedInUserId },
        { groupId: userId },
      ],
    }).sort({ timestamp: 1 });
    res.status(200).json(messages);
  } catch (err) {
    console.error("Error fetching conversation:", err);
    res.status(500).json({ message: "Server error. Please try again later." });
  }
};

// --------------------------------------------------------------------
// sendMessage - handles text and uploaded files (images, audio, and generic files)
// --------------------------------------------------------------------
export const sendMessage = async (req: AuthenticatedRequest, res: Response) => {
  const {
    receiverId,
    groupId,
    message = "",
    description,
    repliedTo,
  } = req.body;
  const senderId = req.user?._id;
  try {
    let newMessage;
    if (groupId) {
      newMessage = new ChatMessage({
        sender: senderId,
        groupId,
        message,
        description,
        repliedTo, // NEW: Include repliedTo field
      });
    } else if (receiverId) {
      newMessage = new ChatMessage({
        sender: senderId,
        receiver: receiverId,
        message,
        description,
        repliedTo, // NEW: Include repliedTo field
      });
    } else {
      return res.status(400).json({ message: "Invalid request data" });
    }

    // File handling
    const files = req.files as
      | {
          images?: Express.Multer.File[];
          audio?: Express.Multer.File[];
          file?: Express.Multer.File[];
        }
      | undefined;

    if (files?.images?.length) {
      newMessage.image = files.images[0].filename;
    }
    if (files?.audio?.length) {
      newMessage.audio = files.audio[0].filename;
    }
    if (files?.file?.length) {
      newMessage.file = files.file[0].filename;
      newMessage.fileSize = files.file[0].size;
    }

    await newMessage.save();
    res.status(201).json(newMessage);

    // Emit to group or user
    if (groupId) {
      io.to(groupId).emit("receiveMessage", newMessage);
    } else {
      io.to(receiverId).emit("receiveMessage", newMessage);
    }
  } catch (err) {
    console.error("Error sending message:", err);
    res.status(500).json({ message: "Server error" });
  }
};

// --------------------------------------------------------------------
// reactMessage - add or update an emoji reaction for a message.
// For one particular user, only one reaction is allowed per message.
// If the user reacts again with a different emoji, the reaction is updated.
// --------------------------------------------------------------------
export const reactMessage = async (
  req: AuthenticatedRequest,
  res: Response
) => {
  const { messageId, emoji } = req.body;
  const userId = req.user?._id.toString();
  if (!messageId || !emoji) {
    return res
      .status(400)
      .json({ message: "Missing messageId or emoji in request" });
  }
  try {
    const message = await ChatMessage.findById(messageId);
    if (!message) {
      return res.status(404).json({ message: "Message not found" });
    }

    // Ensure only one reaction per user per message:
    // Remove any previous reaction from this user.
    message.reactions = (message.reactions || []).filter(
      (reaction) => reaction.user.toString() !== userId
    );

    // Add the new reaction.
    message.reactions.push({ user: userId, emoji, timestamp: new Date() });

    await message.save();
    res.status(200).json(message);

    // Emit updated message reaction to the appropriate room.
    if (message.groupId) {
      io.to(message.groupId.toString()).emit("receiveReaction", message);
    } else if (message.receiver) {
      io.to(message.receiver.toString()).emit("receiveReaction", message);
    }
  } catch (err) {
    console.error("Error reacting to message:", err);
    res.status(500).json({ message: "Server error" });
  }
};

// --------------------------------------------------------------------
// removeReaction - removes the specified emoji reaction from the current user
// --------------------------------------------------------------------
export const removeReaction = async (
  req: AuthenticatedRequest,
  res: Response
) => {
  const { messageId, emoji } = req.body;
  const userId = req.user?._id;

  try {
    const message = await ChatMessage.findById(messageId);
    if (!message) {
      return res.status(404).json({ message: "Message not found" });
    }

    // Remove the reaction from this user that matches the given emoji
    message.reactions = (message.reactions || []).filter(
      (reaction) =>
        reaction.user.toString() !== userId || reaction.emoji !== emoji
    );

    await message.save();

    res.status(200).json(message);

    // Emit the updated message to the appropriate room
    if (message.groupId) {
      io.to(message.groupId.toString()).emit("receiveReaction", message);
    } else if (message.receiver) {
      io.to(message.receiver.toString()).emit("receiveReaction", message);
    }
  } catch (err) {
    console.error("Error removing reaction:", err);
    res.status(500).json({ message: "Server error" });
  }
};

// --------------------------------------------------------------------
// Fetch friends list with details
// --------------------------------------------------------------------
export const getFriends = async (req: AuthenticatedRequest, res: Response) => {
  const loggedInUserId = req.user?._id;
  try {
    const user = await User.findById(loggedInUserId).populate(
      "friends",
      "name username profileImage bio"
    );
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    const friendsWithDetails = await Promise.all(
      user.friends.map(async (friend: any) => {
        const lastMessage = await ChatMessage.findOne({
          $or: [
            { sender: loggedInUserId, receiver: friend._id },
            { sender: friend._id, receiver: loggedInUserId },
          ],
        })
          .sort({ timestamp: -1 })
          .lean();

        const lastImages = await ChatMessage.find({
          $or: [
            {
              sender: loggedInUserId,
              receiver: friend._id,
              image: { $exists: true },
            },
            {
              sender: friend._id,
              receiver: loggedInUserId,
              image: { $exists: true },
            },
          ],
        })
          .sort({ timestamp: -1 })
          .limit(3)
          .select("image -_id")
          .lean();

        return {
          _id: friend._id,
          name: friend.name,
          username: friend.username,
          profileImage: friend.profileImage,
          bio: friend.bio || "No bio available",
          lastChat: lastMessage ? lastMessage.message : null,
          lastChatTime: lastMessage ? lastMessage.timestamp : null,
        };
      })
    );
    res.status(200).json(friendsWithDetails);
  } catch (err) {
    console.error("Error fetching friends with details:", err);
    res.status(500).json({ message: "Server error. Please try again later." });
  }
};

// --------------------------------------------------------------------
// Mark messages as seen
// --------------------------------------------------------------------
export const markMessagesAsSeen = async (
  req: AuthenticatedRequest,
  res: Response
) => {
  const { senderId } = req.body;
  const receiverId = req.user?._id;
  try {
    await ChatMessage.updateMany(
      { sender: senderId, receiver: receiverId, seen: false },
      { seen: true }
    );
    res.status(200).json({ message: "Messages marked as seen" });
  } catch (err) {
    console.error("Error marking messages as seen:", err);
    res.status(500).json({ message: "Server error. Please try again later." });
  }
};

// --------------------------------------------------------------------
// Fetch all unread messages for the logged-in user
// --------------------------------------------------------------------
export const getUnreadMessages = async (
  req: AuthenticatedRequest,
  res: Response
) => {
  const userId = req.user?._id;
  try {
    const unreadMessages = await ChatMessage.find({
      receiver: userId,
      seen: false,
    }).sort({ timestamp: 1 });
    res.status(200).json(unreadMessages);
  } catch (err) {
    console.error("Error fetching unread messages:", err);
    res.status(500).json({ message: "Server error. Please try again later." });
  }
};

export { upload };
