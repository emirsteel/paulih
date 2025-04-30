import React from "react";
import { FaCheckCircle, FaGlobeAmericas } from "react-icons/fa";

interface HomePagePostHeaderProps {
  user: any;
  post: any;
  getProfileImageUrl: (imagePath: string) => string;
  loggedInUser?: any;
}

const HomePagePostHeader: React.FC<HomePagePostHeaderProps> = ({
  user,
  post,
  getProfileImageUrl,
  loggedInUser,
}) => {
  const profileImageUrl =
    user?.profileImage && getProfileImageUrl(user.profileImage)
      ? getProfileImageUrl(user.profileImage)
      : "/default-profile.png";

  return (
    <div className="post-header flex items-center justify-between">
      <div className="flex items-center">
        <img
          src={profileImageUrl}
          alt={user?.name || "User"}
          className="h-10 w-10 rounded-full object-cover"
        />
        <div className="ml-2">
          <p className="font-bold text-black cursor-pointer">
            {user?.name || "Unknown User"}
          </p>
          <div className="flex items-center text-xs text-gray-500">
            <span>
              {post.createdAt ? new Date(post.createdAt).toLocaleString() : ""}
            </span>
            <FaGlobeAmericas size={12} className="ml-1" />
          </div>
        </div>
      </div>
      <div>
        {user?.isVerified && (
          <FaCheckCircle size={16} className="text-blue-500" />
        )}
      </div>
    </div>
  );
};

export default HomePagePostHeader;
