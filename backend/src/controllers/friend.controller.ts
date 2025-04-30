// controllers/friend.controller.ts
import { Request, Response } from "express";
import User from "../models/user.model";

// ✅ University suggestion based on Hacettepe domain
export const getUniversityFriendSuggestions = async (
  req: Request,
  res: Response
) => {
  try {
    const suggestions = await User.find({
      email: { $regex: "@hacettepe\\.edu\\.tr$", $options: "i" },
    })
      .select("email username name profileImage")
      .lean();

    return res.status(200).json(suggestions);
  } catch (err) {
    console.error("Error fetching university friend suggestions:", err);
    res.status(500).json({ message: "Server error" });
  }
};

// ✅ Correct implementation to fetch friend request senders
export const getFriendRequestSenders = async (req: Request, res: Response) => {
  const { userId } = req.params;

  try {
    const user = await User.findById(userId)
      .populate("friendRequests.sender", "username name profileImage") // ✅ populate 'sender' only
      .lean();

    if (!user) return res.status(404).json({ message: "User not found" });

    const friendRequests = (user.friendRequests || [])
      .filter((req: any) => req.sender) // prevent null population
      .map((req: any) => ({
        userId: req.sender._id,
        username: req.sender.username,
        name: req.sender.name,
        profileImage: req.sender.profileImage || "/default-avatar.png",
      }));

    return res.status(200).json({ friendRequests });
  } catch (error) {
    console.error("Error fetching friend requests:", error);
    return res.status(500).json({ message: "Server error" });
  }
};
