import express from "express";
import multer from "multer";
import {
  createPost,
  getPostsByUser,
  toggleLike,
  addComment,
  getNotificationLikes,
  getNotificationComments,
  getPostById,
  getAllPosts,
  toggleCommentLike,
  deletePost,
  getFriendsPosts,
  addReply,
  getReplyUserInfo,
  toggleReplyLike,
  addReplyToReply,
  getNotificationReplies,
} from "../controllers/post.controller";

const router = express.Router();

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/");
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + "-" + file.originalname);
  },
});
const upload = multer({ storage });

router.post("/", upload.array("media", 5), createPost);
router.get("/all", getAllPosts);
router.get("/reply-user/:userId", getReplyUserInfo);
router.put("/:postId/comment/:commentId/reply/:replyId/like", toggleReplyLike);
router.post(
  "/:postId/comments/:commentId/replies/:replyId/replies",
  addReplyToReply
);
router.get("/single/:postId", getPostById);
router.put("/:postId/like", toggleLike);
router.post("/:postId/comment", addComment);
router.get("/:userId/notificationlikes", getNotificationLikes);
router.get("/:userId/notificationcomments", getNotificationComments);
router.put("/:postId/comment/:commentId/like", toggleCommentLike);
router.get("/:userId/notificationreplies", getNotificationReplies);
router.delete("/:postId", deletePost);
router.get("/friends/:userId", getFriendsPosts);
router.post("/:postId/comments/:commentId/replies", addReply);
router.get("/:userId", getPostsByUser);

export default router;
