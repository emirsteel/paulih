import express, { Request, Response } from "express";
import {
  authMiddleware,
  AuthenticatedRequest,
  updateLastActive,
} from "../middleware/auth.middleware"; // Ensure this adds req.user
import {
  signupUser,
  verifyUser,
  loginUser,
  requestPasswordReset,
  resetPassword,
  resendVerificationCode,
  searchUsers,
  updateUserProfile,
  upload,
  updateBannerImage,
  sendCompanyVerificationCode,
  verifyCompanyCode,
  changePassword,
  deactivateAccount,
  deleteUserAccount,
  blockUser,
  unblockUser,
} from "../controllers/user.controller";
import User from "../models/user.model"; // Import your User model

const router = express.Router();

router.post("/signup", signupUser);
router.post("/verify", verifyUser);
router.post("/login", loginUser);
router.post("/request-password-reset", requestPasswordReset);
router.post("/reset-password/:token", resetPassword);
router.post("/resend-verification-code", resendVerificationCode);
router.get("/search", searchUsers);
router.use(authMiddleware, updateLastActive);
router.put("/change-password", authMiddleware, changePassword);
router.put("/deactivate", authMiddleware, deactivateAccount);
router.delete("/user/:userId", authMiddleware, deleteUserAccount);

// Add bio to the response in the /user route
router.get(
  "/user",
  authMiddleware,
  async (req: AuthenticatedRequest, res: Response) => {
    try {
      if (!req.user) {
        return res.status(401).json({ message: "Unauthorized" });
      }

      const user = await User.findById(req.user.id);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      res.json({
        _id: user._id,
        username: user.username,
        name: user.name,
        email: user.email,
        isVerified: user.isVerified,
        profileImage: user.profileImage || null,
        bio: user.bio || "",
        bannerImage: user.bannerImage || null,
        lastActive: user.lastActive ? user.lastActive.toISOString() : null,
        badges: user.badges || [], // New field returned here
      });
    } catch (error) {
      console.error("Error fetching user profile:", error);
      res.status(500).json({ message: "Server error" });
    }
  }
);

// Update the user profile, including optional profile image
router.put("/user/:userId", authMiddleware, upload, updateUserProfile);
router.put(
  "/user/:userId/banner-image",
  authMiddleware,
  upload,
  updateBannerImage
);

// Route to get top 7 users (excluding the logged-in user if needed)
router.get("/interested-users", async (req, res) => {
  try {
    const users = await User.find().limit(7).select("name profileImage"); // Customize as needed
    res.json(users);
  } catch (err) {
    console.error(err);
    res.status(500).send("Server Error");
  }
});

router.get(
  "/:username",
  authMiddleware,
  async (req: AuthenticatedRequest, res: Response) => {
    const { username } = req.params;

    try {
      const profileUser = await User.findOne({ username }).select("-password");
      if (!profileUser) {
        return res.status(404).json({ message: "User not found." });
      }

      if (!req.user || !req.user._id) {
        return res.status(401).json({ message: "Unauthorized access." });
      }

      const loggedInUser = await User.findById(req.user._id)
        .populate("friendRequests.sender", "username profileImage")
        .populate("friends", "_id");

      if (!loggedInUser) {
        return res.status(404).json({ message: "Logged-in user not found." });
      }

      const isFriend = loggedInUser.friends?.some(
        (f: any) =>
          f.toString?.() === profileUser._id.toString?.() ||
          f._id?.toString() === profileUser._id.toString?.()
      );

      const isFriendRequestSent = profileUser.friendRequests?.some(
        (r: any) =>
          r.sender?.toString?.() === loggedInUser._id.toString?.() ||
          r.sender?._id?.toString() === loggedInUser._id.toString?.()
      );

      const isFriendRequestReceived = loggedInUser.friendRequests?.some(
        (r: any) =>
          r.sender?.toString?.() === profileUser._id.toString?.() ||
          r.sender?._id?.toString() === profileUser._id.toString?.()
      );

      return res.status(200).json({
        ...profileUser.toObject(),
        isFriend,
        isFriendRequestSent,
        isFriendRequestReceived,
      });
    } catch (error) {
      console.error("Error fetching user by username:", error);
      return res.status(500).json({ message: "Internal server error" });
    }
  }
);

router.post(
  "/send-friend-request",
  authMiddleware,
  async (req: AuthenticatedRequest, res) => {
    const { targetUserId } = req.body;
    const requesterId = req.user?._id;

    try {
      const targetUser = await User.findById(targetUserId);
      if (!targetUser) {
        return res.status(404).json({ message: "User not found" });
      }

      const alreadySent = targetUser.friendRequests.some(
        (r: any) =>
          r.sender?.toString?.() === requesterId.toString?.() ||
          r.sender?._id?.toString() === requesterId.toString()
      );

      if (alreadySent) {
        return res.status(400).json({ message: "Friend request already sent" });
      }

      targetUser.friendRequests.push({ sender: requesterId });
      await targetUser.save();

      res.status(200).json({ message: "Friend request sent successfully" });
    } catch (error) {
      console.error("Error sending friend request:", error);
      res.status(500).json({ message: "Server error" });
    }
  }
);
router.post(
  "/handle-friend-request",
  authMiddleware,
  async (req: AuthenticatedRequest, res) => {
    const { requesterId, action } = req.body;
    const targetUserId = req.user?._id;

    try {
      const targetUser = await User.findById(targetUserId);
      const requester = await User.findById(requesterId);

      if (!targetUser || !requester) {
        return res.status(404).json({ message: "User not found" });
      }

      // ✅ request.sender güvenli kontrol
      const requestIndex = targetUser.friendRequests.findIndex(
        (request: any) => {
          return request.sender?.toString?.() === requesterId.toString();
        }
      );

      if (requestIndex === -1) {
        return res.status(400).json({ message: "Friend request not found" });
      }

      // ✅ İsteği listeden çıkar
      targetUser.friendRequests.splice(requestIndex, 1);

      if (action === "accept") {
        targetUser.friends.push(requesterId);
        requester.friends.push(targetUserId);
      }

      await targetUser.save();
      await requester.save();

      res
        .status(200)
        .json({ message: `Friend request ${action}ed successfully` });
    } catch (error) {
      console.error("Error handling friend request:", error);
      res.status(500).json({ message: "Server error" });
    }
  }
);
router.get(
  "/friend-requests",
  authMiddleware,
  async (req: AuthenticatedRequest, res) => {
    try {
      const user = await User.findById(req.user?._id).populate(
        "friendRequests",
        "username profileImage"
      );
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      res.status(200).json({ friendRequests: user.friendRequests });
    } catch (error) {
      console.error("Error fetching friend requests:", error);
      res.status(500).json({ message: "Server error" });
    }
  }
);

// Backend: Cancel Friend Request Endpoint
router.post("/cancel-friend-request", authMiddleware, async (req, res) => {
  const { userId, targetUserId } = req.body;

  if (!userId || !targetUserId) {
    return res.status(400).json({ message: "Invalid request data." });
  }

  try {
    // ✅ Correct way: match inside { sender: userId }
    await User.findByIdAndUpdate(targetUserId, {
      $pull: { friendRequests: { sender: userId } },
    });

    res.status(200).json({ message: "Friend request canceled successfully." });
  } catch (error) {
    console.error("Error canceling friend request:", error);
    res.status(500).json({ message: "Server error occurred." });
  }
});

router.get("/online-users", async (req: Request, res: Response) => {
  try {
    const fiveMinutesAgo = new Date(Date.now() - 5 * 60 * 1000);
    const activeUsers = await User.find({
      lastActive: { $gte: fiveMinutesAgo },
    }).select("name _id lastActive");

    console.log("Active Users:", activeUsers); // Debug log

    res.status(200).json(activeUsers);
  } catch (error) {
    console.error("Error fetching active users:", error);
    res.status(500).json({ message: "Server error" });
  }
});

router.put("/block", blockUser);
router.put("/unblock", unblockUser);

export default router;
