import { Request, Response } from "express";
import { Types } from "mongoose";
import Post from "../models/post.model";
import UserModel from "../models/user.model";
import Bookmark from "../models/bookmark.model";

// Create a new post with text, media, and optional music
export const createPost = async (req: Request, res: Response) => {
  const { content, userId, pageId, music, visibility, anonymous } = req.body;
  const media = (req.files as Express.Multer.File[])?.map((file) => file.path);

  if (!content && !media && !music) {
    return res
      .status(400)
      .json({ message: "Post content, media, or music is required" });
  }

  try {
    if (userId && !pageId) {
      const user = await UserModel.findById(userId);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
    }

    const newPost = new Post({
      content,
      ...(pageId ? { page: pageId } : { user: userId }),
      media,
      music: music ? JSON.parse(music) : undefined,
      visibility,
      anonymous,
    });

    await newPost.save();
    res
      .status(201)
      .json({ message: "Post created successfully", post: newPost });
  } catch (error) {
    res.status(500).json({ message: "Error creating post", error });
  }
};

// Get posts by userId
export const getPostsByUser = async (req: Request, res: Response) => {
  const { userId } = req.params;

  try {
    const user = await UserModel.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const posts = await Post.find({ user: user._id }).sort({ createdAt: -1 });
    res.status(200).json({ posts });
  } catch (error) {
    res.status(500).json({ message: "Error retrieving posts", error });
  }
};

// Toggle like/unlike for a post
// Toggle like/unlike for a post
export const toggleLike = async (req: Request, res: Response) => {
  const { postId } = req.params;
  const { userId } = req.body;

  try {
    const post = await Post.findById(postId);
    if (!post) return res.status(404).json({ message: "Post not found" });

    const existingLikeIndex = post.likes.findIndex(
      (like: any) => like.user.toString() === userId
    );

    if (existingLikeIndex !== -1) {
      // Unlike
      post.likes.splice(existingLikeIndex, 1);
    } else {
      // Like
      post.likes.push({
        user: userId,
        createdAt: new Date(), // ⏰ record the date of the like
      });
    }

    await post.save();
    res.status(200).json({ likes: post.likes });
  } catch (error) {
    res.status(500).json({ message: "Error toggling like", error });
  }
};

// Add a comment to a post
export const addComment = async (req: Request, res: Response) => {
  const { postId } = req.params;
  const { userId, content } = req.body;

  if (!content) {
    return res.status(400).json({ message: "Comment content is required" });
  }

  try {
    const post = await Post.findById(postId);
    if (!post) return res.status(404).json({ message: "Post not found" });

    post.comments.push({
      user: userId,
      content,
      createdAt: new Date(),
      likes: [],
      replies: [], // 🔥 Burası önemli!
    });
    await post.save();
    res.status(201).json({ message: "Comment added successfully", post });
  } catch (error) {
    res.status(500).json({ message: "Error adding comment", error });
  }
};

// Toggle like/unlike for a comment
export const toggleCommentLike = async (req: Request, res: Response) => {
  const { postId, commentId } = req.params;
  const { userId } = req.body;

  try {
    const post = await Post.findById(postId);
    if (!post) return res.status(404).json({ message: "Post not found" });

    const comment = post.comments.find(
      (c: any) => c._id.toString() === commentId
    );
    if (!comment) return res.status(404).json({ message: "Comment not found" });

    const hasLiked = comment.likes.some((id: any) => id.toString() === userId);

    if (hasLiked) {
      comment.likes = comment.likes.filter(
        (id: any) => id.toString() !== userId
      );
    } else {
      comment.likes.push(userId);
    }

    await post.save();
    res.status(200).json({ likes: comment.likes });
  } catch (error) {
    res.status(500).json({ message: "Error toggling comment like", error });
  }
};

// Get likes for a specific post with usernames
export const getNotificationLikes = async (req: Request, res: Response) => {
  const { userId } = req.params;

  try {
    const posts = await Post.find({ user: userId }).populate(
      "likes.user",
      "username profileImage"
    );

    const likes = posts.flatMap((post) =>
      post.likes
        .filter(
          (like) =>
            like.user &&
            typeof like.user === "object" &&
            "username" in like.user
        )
        .filter((like) => (like.user as any)._id.toString() !== userId)
        .map((like) => ({
          postId: post._id,
          likeDate: like.createdAt,
          liker: {
            userId: (like.user as any)._id,
            username: (like.user as any).username,
            profileImage:
              (like.user as any).profileImage || "/default-avatar.png",
          },
        }))
    );

    res.status(200).json({ likes });
  } catch (error) {
    console.error("Like notification error:", error);
    res.status(500).json({
      message: "Error fetching like notifications",
      error,
    });
  }
};

// Helper type guard to check if a user is populated
function isPopulatedUser(
  user: any
): user is { _id: any; username: string; profileImage?: string } {
  return user && user._id !== undefined && user.username !== undefined;
}

// Get notification comments for a user's posts
export const getNotificationComments = async (req: Request, res: Response) => {
  const { userId } = req.params;

  try {
    const userPosts = await Post.find({ user: userId }).populate({
      path: "comments.user",
      select: "username profileImage",
    });

    const comments = userPosts
      .flatMap((post) =>
        post.comments.map((comment) => {
          if (isPopulatedUser(comment.user)) {
            return {
              postId: post._id,
              postContent: post.content,
              commentContent: comment.content,
              commentDate: comment.createdAt,
              commenter: {
                userId: comment.user._id,
                username: comment.user.username,
                profileImage:
                  comment.user.profileImage || "/default-avatar.png",
              },
            };
          }
          return null;
        })
      )
      .filter(Boolean);

    res.status(200).json({ comments });
  } catch (error) {
    res.status(500).json({ message: "Error fetching comments", error });
  }
};

export const getPostById = async (req: Request, res: Response) => {
  const { postId } = req.params;
  try {
    const post = await Post.findById(postId)
      .populate("user", "username profileImage")
      .populate("comments.user", "username profileImage");

    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }
    res.status(200).json({ post });
  } catch (error) {
    res.status(500).json({ message: "Error fetching post", error });
  }
};

// Get all posts sorted by creation date (most recent first)
export const getAllPosts = async (req: Request, res: Response) => {
  try {
    const posts = await Post.find({})
      .sort({ createdAt: -1 })
      .populate("user", "username name profileImage bio isVerified friends") // <-- Add additional fields here
      .populate("comments.user", "username name profileImage");
    res.status(200).json({ posts });
  } catch (error) {
    res.status(500).json({ message: "Error retrieving posts", error });
  }
};

// Delete a post
export const deletePost = async (req: Request, res: Response) => {
  const { postId } = req.params;
  try {
    const post = await Post.findById(postId);
    if (!post) {
      return res.status(404).json({ message: "Gönderi bulunamadı" });
    }

    await Bookmark.deleteMany({ post: postId });
    await Post.findByIdAndDelete(postId);

    res
      .status(200)
      .json({ message: "Gönderi ve ilgili bookmark'lar başarıyla silindi" });
  } catch (error) {
    res.status(500).json({ message: "Gönderi silinirken hata oluştu", error });
  }
};

// Get posts visible to friends for a given user
export const getFriendsPosts = async (req: Request, res: Response) => {
  const { userId } = req.params;
  try {
    const user = await UserModel.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "Kullanıcı bulunamadı" });
    }
    // Extract friend IDs from the user's friends list (handles both string and object formats)
    const friendIds =
      user.friends?.map((friend: any) =>
        typeof friend === "object" ? friend.$oid || friend._id : friend
      ) || [];

    // Convert the logged-in user ID and friend IDs to ObjectId
    const userObjId = new Types.ObjectId(userId);
    const friendObjectIds = friendIds.map(
      (id: string) => new Types.ObjectId(id)
    );

    // Find posts with "Friends" visibility from the user or one of their friends
    const posts = await Post.find({
      visibility: "Friends",
      user: { $in: [userObjId, ...friendObjectIds] },
    })
      .sort({ createdAt: -1 })
      .populate("user", "username name profileImage")
      .populate("comments.user", "username name profileImage");
    res.status(200).json({ posts });
  } catch (error) {
    res.status(500).json({
      message: "Arkadaş gönderileri alınırken hata oluştu",
      error,
    });
  }
};

// Add a reply to a comment
export const addReply = async (req: Request, res: Response) => {
  const { postId, commentId } = req.params;
  const { userId, content } = req.body;

  if (!content) {
    return res.status(400).json({ message: "Reply content is required" });
  }

  try {
    const post = await Post.findById(postId);
    if (!post) return res.status(404).json({ message: "Post not found" });

    const comment = post.comments.find(
      (c: any) => c._id.toString() === commentId
    );
    if (!comment) return res.status(404).json({ message: "Comment not found" });

    comment.replies.push({
      user: userId,
      content,
      createdAt: new Date(),
      likes: [],
      replies: [], // 🔥🔥 Burayı ekliyoruz!
    });

    await post.save();
    res.status(201).json({ message: "Reply added successfully", post });
  } catch (error) {
    res.status(500).json({ message: "Error adding reply", error });
  }
};

// Get full user info (name, profileImage) for a reply
export const getReplyUserInfo = async (req: Request, res: Response) => {
  const { userId } = req.params;

  try {
    const user = await UserModel.findById(userId).select(
      "name username profileImage"
    );

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json({
      _id: user._id,
      name: user.name,
      username: user.username,
      profileImage: user.profileImage || "/default-avatar.png",
    });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error fetching user info for reply", error });
  }
};

// Toggle like/unlike for a reply
export const toggleReplyLike = async (req: Request, res: Response) => {
  const { postId, commentId, replyId } = req.params;
  const { userId } = req.body;

  try {
    const post = await Post.findById(postId);
    if (!post) return res.status(404).json({ message: "Post not found" });

    const comment = post.comments.find(
      (c: any) => c._id.toString() === commentId
    );
    if (!comment) return res.status(404).json({ message: "Comment not found" });

    const reply = comment.replies.find(
      (r: any) => r._id.toString() === replyId
    );
    if (!reply) return res.status(404).json({ message: "Reply not found" });

    const hasLiked = reply.likes.some((id: any) => id.toString() === userId);

    if (hasLiked) {
      reply.likes = reply.likes.filter((id: any) => id.toString() !== userId);
    } else {
      reply.likes.push(userId);
    }

    await post.save();
    res.status(200).json({ likes: reply.likes });
  } catch (error) {
    res.status(500).json({ message: "Error toggling reply like", error });
  }
};

// Add a reply to a reply (nested reply)
// Add a reply to a reply
export const addReplyToReply = async (req: Request, res: Response) => {
  const { postId, commentId, replyId } = req.params;
  const { userId, content } = req.body;

  if (!content) {
    return res.status(400).json({ message: "Reply content is required" });
  }

  try {
    const post = await Post.findById(postId);
    if (!post) return res.status(404).json({ message: "Post not found" });

    const comment = post.comments.find(
      (c: any) => c._id.toString() === commentId
    );
    if (!comment) return res.status(404).json({ message: "Comment not found" });

    const findReplyRecursive = (replies: any[], replyId: string): any => {
      for (const reply of replies) {
        if (reply._id.toString() === replyId) {
          return reply;
        }
        if (reply.replies && reply.replies.length > 0) {
          const found = findReplyRecursive(reply.replies, replyId);
          if (found) return found;
        }
      }
      return null;
    };

    const parentReply = findReplyRecursive(comment.replies, replyId);

    if (!parentReply)
      return res.status(404).json({ message: "Parent reply not found" });

    parentReply.replies.push({
      user: userId,
      content,
      createdAt: new Date(),
      likes: [],
      replies: [], // Yeni reply'nin de boş replies arrayi olmalı
    });

    await post.save();
    res
      .status(201)
      .json({ message: "Reply to reply added successfully", post });
  } catch (error) {
    res.status(500).json({ message: "Error adding reply to reply", error });
  }
};

export const getNotificationReplies = async (req: Request, res: Response) => {
  const { userId } = req.params;

  try {
    const posts = await Post.find({ user: userId }).populate(
      "comments.user",
      "username profileImage"
    );

    const replies = posts.flatMap((post) => {
      return post.comments.flatMap((comment: any) => {
        return comment.replies
          .filter((reply: any) => reply.user.toString() !== userId)
          .map((reply: any) => ({
            postId: post._id,
            commentId: comment._id,
            replyId: reply._id,
            replyContent: reply.content,
            replyDate: reply.createdAt,
            replier: reply.user, // user is ObjectId here, optionally populate later
          }));
      });
    });

    res.status(200).json({ replies });
  } catch (error) {
    res.status(500).json({ message: "Error fetching replies", error });
  }
};
