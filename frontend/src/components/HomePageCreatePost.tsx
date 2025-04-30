// src/components/HomePageCreatePost.tsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FiImage, FiSmile, FiMusic } from "react-icons/fi";

interface HomePageCreatePostProps {
  userData: {
    name: string;
    username: string;
    profileImage?: string;
  };
  onPostClick: () => void;
}

const HomePageCreatePost: React.FC<HomePageCreatePostProps> = ({
  userData,
  onPostClick,
}) => {
  const [content, setContent] = useState("");
  const navigate = useNavigate();

  const getProfileImageUrl = (imagePath?: string) => {
    return imagePath && imagePath.trim() !== ""
      ? imagePath.startsWith("http")
        ? imagePath
        : `http://localhost:5001/${imagePath}`
      : "/default-profile.png";
  };

  const handleProfileClick = () => {
    navigate(`/profile/${userData.username}`);
  };

  return (
    <div className="bg-white rounded-2xl shadow p-4 mb-6 mt-6">
      <div className="flex items-start space-x-3">
        <img
          src={getProfileImageUrl(userData.profileImage)}
          alt="Profil"
          onClick={handleProfileClick}
          className="w-10 h-10 rounded-full object-cover cursor-pointer hover:opacity-80 transition"
        />
        <button
          onClick={onPostClick}
          className="flex-1 text-left bg-gray-100 hover:bg-gray-200 text-gray-600 rounded-full px-4 py-2 text-sm transition"
        >
          Ne düşünüyorsun, {userData.name.split(" ")[0]}?
        </button>
      </div>

      <div className="flex justify-around items-center mt-4 border-t pt-3">
        <button
          onClick={onPostClick}
          className="flex items-center space-x-1 text-gray-500 hover:text-blue-600 text-sm transition"
        >
          <FiImage className="w-5 h-5" />
          <span>Fotoğraf/Video</span>
        </button>
        <button
          onClick={onPostClick}
          className="flex items-center space-x-1 text-gray-500 hover:text-blue-600 text-sm transition"
        >
          <FiSmile className="w-5 h-5" />
          <span>Duygu</span>
        </button>
        <button
          onClick={onPostClick}
          className="flex items-center space-x-1 text-gray-500 hover:text-blue-600 text-sm transition"
        >
          <FiMusic className="w-5 h-5" />
          <span>Müzik</span>
        </button>
      </div>
    </div>
  );
};

export default HomePageCreatePost;
