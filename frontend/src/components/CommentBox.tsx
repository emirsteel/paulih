import React from "react";
import { Smile, Camera, Gift, StickyNote, Send } from "lucide-react";

interface CommentBoxProps {
  postId: string;
  commentInput: string;
  handleCommentInputChange: (postId: string, value: string) => void;
  submitComment: (postId: string) => void;
  userProfileImage?: string; // Optionally pass the logged-in user's profile image
  getProfileImageUrl?: (imagePath: string) => string; // If you have a helper function
}

const CommentBox: React.FC<CommentBoxProps> = ({
  postId,
  commentInput,
  handleCommentInputChange,
  submitComment,
  userProfileImage,
  getProfileImageUrl,
}) => {
  // If you have a helper function:
  const avatarUrl = userProfileImage
    ? getProfileImageUrl
      ? getProfileImageUrl(userProfileImage)
      : userProfileImage
    : "/default-profile.png";

  // If you do not have a helper function, just do:
  // const avatarUrl = userProfileImage || "/default-profile.png";

  return (
    <div
      className="w-full flex items-center bg-white border border-gray-300 rounded-full px-4 py-2 shadow-sm"
      onClick={(e) => e.stopPropagation()}
    >
      {/* Left Avatar */}
      <img
        src={avatarUrl}
        alt="Avatar"
        className="w-8 h-8 rounded-full object-cover mr-3"
      />

      {/* Input Field */}
      <input
        type="text"
        value={commentInput}
        onChange={(e) => {
          e.stopPropagation();
          handleCommentInputChange(postId, e.target.value);
        }}
        onClick={(e) => e.stopPropagation()}
        placeholder="Write your comments here..."
        className="flex-1 outline-none border-none bg-transparent text-sm text-gray-800 placeholder-gray-400"
      />

      {/* Icons Inside the Input */}
      <div className="flex items-center space-x-3 text-gray-500 mr-3">
        <Smile
          size={20}
          onClick={(e) => {
            e.stopPropagation();
            // handle emoji logic if needed
          }}
          className="cursor-pointer"
        />
        <Camera
          size={20}
          onClick={(e) => {
            e.stopPropagation();
            // handle camera logic if needed
          }}
          className="cursor-pointer"
        />
        <Gift
          size={20}
          onClick={(e) => {
            e.stopPropagation();
            // handle gift logic if needed
          }}
          className="cursor-pointer"
        />
        <StickyNote
          size={20}
          onClick={(e) => {
            e.stopPropagation();
            // handle sticky note logic if needed
          }}
          className="cursor-pointer"
        />
      </div>

      {/* Send Button */}
      <button
        onClick={(e) => {
          e.stopPropagation();
          submitComment(postId);
        }}
        disabled={!commentInput}
        className={`flex items-center justify-center w-8 h-8 rounded-full ${
          commentInput
            ? "bg-blue-600 text-white cursor-pointer"
            : "bg-gray-200 text-gray-400 cursor-not-allowed"
        }`}
      >
        <Send size={18} />
      </button>
    </div>
  );
};

export default CommentBox;
