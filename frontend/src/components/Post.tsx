import React from "react";

interface PostProps {
  content: string;
  username: string;
  time: string; // You might need to adjust this type
  views: number;
}

const Post: React.FC<PostProps> = ({ content, username, time, views }) => {
  return (
    <div className="post border rounded-lg p-4 mb-4 shadow-sm">
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center space-x-2">
          <img
            src="/path/to/profile-image.jpg"
            alt="User"
            className="h-8 w-8 rounded-full"
          />
          <span className="font-semibold">{username}</span>
        </div>
        <span className="text-xs text-gray-500">{time}</span>
      </div>
      <p className="text-gray-800 mb-4">{content}</p>
      <div className="flex items-center justify-between text-gray-500 text-xs">
        <div className="flex items-center space-x-2">
          <span className="flex items-center space-x-1">
            <svg
              className="h-4 w-4 text-gray-500"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M12 4.5c4.7 0 8.4 4.1 8.4 4.1s-3.7 4.1-8.4 4.1-8.4-4.1-8.4-4.1S7.3 4.5 12 4.5z"
              />
              <circle cx="12" cy="8.6" r="1.6" />
            </svg>
            <span>{views}</span>
          </span>
        </div>
        <div className="flex space-x-4">
          <button className="hover:text-blue-500">Like</button>
          <button className="hover:text-blue-500">Comment</button>
          <button className="hover:text-blue-500">Share</button>
        </div>
      </div>
    </div>
  );
};

export default Post;
