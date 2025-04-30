import React, { useState, useEffect } from "react";
import { Heart, MessageCircle, Bookmark, Share } from "lucide-react";
import {
  bookmarkPost,
  getBookmarkStatus,
  removeBookmark,
} from "../services/api";

interface User {
  _id?: string;
  id?: string;
  name: string;
  username: string;
}

interface PostInteractionsProps {
  post: any;
  user: User;
  toggleLike: (postId: string) => void;
  toggleCommentBox: (postId: string) => void;
  openSharePopup: (post: any) => void;
  likeCounts: { [postId: string]: number };
  comments: any[];
}

const PostInteractions: React.FC<PostInteractionsProps> = ({
  post,
  user,
  toggleLike,
  toggleCommentBox,
  openSharePopup,
  likeCounts,
  comments,
}) => {
  const [isLiked, setIsLiked] = useState(false);
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [animateLike, setAnimateLike] = useState(false);

  const likeCount = likeCounts[post._id] || 0;
  const commentCount = comments.length || 0;

  useEffect(() => {
    const userId = user._id || user.id;
    if (!userId) return;

    // Check if user has already liked
    if (Array.isArray(post.likes)) {
      const liked = post.likes.some(
        (like: any) => (like?.user?.toString() || like?.toString()) === userId
      );
      setIsLiked(liked);
    }

    const checkIfBookmarked = async () => {
      try {
        const bookmarked = await getBookmarkStatus(post._id, userId);
        setIsBookmarked(bookmarked);
      } catch (error) {
        console.error("Kaydetme durumu alınamadı:", error);
      }
    };
    checkIfBookmarked();
  }, [post, user]);

  const handleLike = (e: React.MouseEvent<HTMLDivElement>) => {
    e.stopPropagation();
    toggleLike(post._id);
    setIsLiked((prev) => !prev); // ✅ Toggle the like UI immediately
    setAnimateLike(true);
    setTimeout(() => setAnimateLike(false), 500);
  };

  const handleComment = (e: React.MouseEvent<HTMLDivElement>) => {
    e.stopPropagation();
    toggleCommentBox(post._id);
  };

  const handleShare = (e: React.MouseEvent<HTMLDivElement>) => {
    e.stopPropagation();
    openSharePopup(post);
  };

  const handleBookmark = async (e: React.MouseEvent<HTMLDivElement>) => {
    e.stopPropagation();
    const userId = user._id || user.id;
    if (!userId) return;

    try {
      if (isBookmarked) {
        await removeBookmark(post._id, userId);
        setIsBookmarked(false);
      } else {
        await bookmarkPost(post._id, userId);
        setIsBookmarked(true);
      }
    } catch (error) {
      console.error("Kaydetme sırasında hata:", error);
    }
  };

  return (
    <div className="mt-4 select-none text-sm text-gray-700">
      {/* Like + Comment Counts */}
      {(likeCount > 0 || commentCount > 0) && (
        <div className="flex items-center justify-between px-2 pb-1">
          <div className="flex items-center space-x-1">
            <img
              width="18"
              height="18"
              src="https://img.icons8.com/color-glass/48/like--v1.png"
              alt="beğeni"
            />
            <span className="font-medium text-gray-500">
              {likeCount.toLocaleString()} beğeni
            </span>
          </div>
          <div className="text-gray-500">
            <span className="hover:underline">
              {commentCount.toLocaleString()} yorum
            </span>
          </div>
        </div>
      )}

      <hr className="my-2 border-gray-300" />

      {/* Interaction Buttons */}
      <div className="flex justify-evenly items-center w-full py-2 text-gray-500">
        {/* Like */}
        <div
          className="group flex items-center cursor-pointer"
          onClick={handleLike}
        >
          <div className="rounded-full p-2 transition duration-300 group-hover:bg-pink-50">
            <Heart
              size={18}
              className={`
                ${isLiked ? "text-red-500 fill-current" : "text-gray-500 group-hover:text-red-500"}
                ${animateLike ? "animate-like" : ""}
              `}
            />
          </div>
          <span
            className={`${isLiked ? "text-red-500" : "text-gray-500 group-hover:text-red-500"}`}
          >
            {isLiked ? "Beğenildi" : "Beğen"}
          </span>
        </div>

        {/* Comment */}
        <div
          className="group flex items-center cursor-pointer"
          onClick={handleComment}
        >
          <div className="rounded-full p-2 transition duration-300 group-hover:bg-blue-50">
            <MessageCircle
              size={18}
              className="text-gray-500 group-hover:text-blue-500"
            />
          </div>
          <span className="text-gray-500 group-hover:text-blue-500">
            Yorum Yap
          </span>
        </div>

        {/* Share */}
        <div
          className="group flex items-center cursor-pointer"
          onClick={handleShare}
        >
          <div className="rounded-full p-2 transition duration-300 group-hover:bg-green-50">
            <Share
              size={18}
              className="text-gray-500 group-hover:text-green-500"
            />
          </div>
          <span className="text-gray-500 group-hover:text-green-500">
            Paylaş
          </span>
        </div>

        {/* Bookmark */}
        <div
          className="group flex items-center cursor-pointer"
          onClick={handleBookmark}
        >
          <div className="rounded-full p-2 transition duration-300 group-hover:bg-blue-50">
            <Bookmark
              size={18}
              className={`
                ${isBookmarked ? "text-blue-500 fill-current" : "text-gray-500 group-hover:text-blue-500"}
              `}
            />
          </div>
          <span
            className={`${isBookmarked ? "text-blue-500" : "text-gray-500 group-hover:text-blue-500"}`}
          >
            {isBookmarked ? "Kaydedildi" : "Kaydet"}
          </span>
        </div>
      </div>

      {/* Like Animation */}
      <style>{`
        @keyframes likeAnimation {
          0% { transform: scale(1); }
          30% { transform: scale(1.3); }
          60% { transform: scale(0.9); }
          100% { transform: scale(1); }
        }
        .animate-like {
          animation: likeAnimation 0.5s ease-in-out;
        }
      `}</style>
    </div>
  );
};

export default PostInteractions;
