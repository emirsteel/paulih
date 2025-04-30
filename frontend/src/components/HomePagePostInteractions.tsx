import React from "react";
import { FaHeart, FaComment, FaShare, FaBookmark } from "react-icons/fa";

interface HomePagePostInteractionsProps {
  post: any;
  loggedInUser: any;
  toggleLike: (postId: string) => void;
  toggleCommentBox: (postId: string) => void;
  openSharePopup: (post: any) => void;
  likeStatus: { [postId: string]: boolean };
  likeCounts: { [postId: string]: number };
}

const HomePagePostInteractions: React.FC<HomePagePostInteractionsProps> = ({
  post,
  loggedInUser,
  toggleLike,
  toggleCommentBox,
  openSharePopup,
  likeStatus,
  likeCounts,
}) => {
  const isLiked = likeStatus[post._id] || false;
  const likes = likeCounts[post._id] || 0;
  const commentsCount = post.comments ? post.comments.length : 0;

  return (
    <div className="post-interactions mt-4 border-t border-gray-300 pt-2 select-none">
      <div className="flex justify-evenly items-center w-full py-2">
        <div
          className="flex items-center cursor-pointer group"
          onClick={(e) => {
            e.stopPropagation();
            toggleLike(post._id);
          }}
        >
          <div className="p-2 rounded-full transition-all duration-200 hover:bg-pink-50">
            <FaHeart
              size={20}
              className={`transition-colors duration-200 ${
                isLiked
                  ? "text-pink-500"
                  : "text-gray-500 group-hover:text-pink-500"
              }`}
            />
          </div>
          <span
            className={`ml-1 text-sm transition-colors duration-200 ${
              isLiked
                ? "text-pink-500"
                : "text-gray-500 group-hover:text-pink-500"
            }`}
          >
            {likes}
          </span>
        </div>

        <div
          className="flex items-center cursor-pointer group"
          onClick={(e) => {
            e.stopPropagation();
            toggleCommentBox(post._id);
          }}
        >
          <div className="p-2 rounded-full transition-all duration-200 hover:bg-blue-50">
            <FaComment
              size={20}
              className="transition-colors duration-200 text-gray-500 group-hover:text-blue-500"
            />
          </div>
          <span className="ml-1 text-sm text-gray-500 group-hover:text-blue-500">
            {commentsCount}
          </span>
        </div>

        <div
          className="flex items-center cursor-pointer group"
          onClick={(e) => {
            e.stopPropagation();
            openSharePopup(post);
          }}
        >
          <div className="p-2 rounded-full transition-all duration-200 hover:bg-green-50">
            <FaShare
              size={20}
              className="transition-colors duration-200 text-gray-500 group-hover:text-green-500"
            />
          </div>
        </div>

        <div className="flex items-center cursor-pointer group">
          <div className="p-2 rounded-full transition-all duration-200 hover:bg-yellow-50">
            <FaBookmark
              size={20}
              className="transition-colors duration-200 text-gray-500 group-hover:text-yellow-500"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomePagePostInteractions;
