// src/components/PostHeader.tsx
import React from "react";
import { useNavigate } from "react-router-dom";
import { Globe, CheckCircle, Users, Lock } from "lucide-react";
import PostOptionsMenu from "./PostOptionsMenu";

interface PostHeaderUser {
  _id?: string;
  name?: string;
  username?: string;
  profileImage?: string;
  bio?: string;
  badges?: string[];
  // For the displayed user, friends is an array of friend IDs (strings)
  friends?: string[];
  isVerified?: boolean;
  isParody?: boolean;
}

interface Friend {
  _id: string;
  name: string;
  username?: string;
}

interface PostHeaderProps {
  user: PostHeaderUser;
  post: any; // Accepts any post or event object
  getProfileImageUrl: (imagePath: string) => string;
  loggedInUserId?: string;
  // New prop: full friend objects for the logged in user so we can show names
  loggedInUserFriends?: Friend[];
  onPostDelete?: (postId: string) => void;
  isEvent?: boolean;
}

// Helper to compute time ago in Turkish
const timeAgo = (date?: string | Date): string => {
  if (!date) return "";
  const now = new Date();
  const postDate = new Date(date);
  const seconds = Math.floor((now.getTime() - postDate.getTime()) / 1000);
  if (seconds < 60) return `${seconds} saniye önce`;
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes} dakika önce`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours} saat önce`;
  const days = Math.floor(hours / 24);
  if (days < 7) return `${days} gün önce`;
  const weeks = Math.floor(days / 7);
  if (weeks < 4) return `${weeks} hafta önce`;
  const months = Math.floor(days / 30);
  if (months < 12) return `${months} ay önce`;
  const years = Math.floor(days / 365);
  return `${years} yıl önce`;
};

const PostHeader: React.FC<PostHeaderProps> = ({
  user,
  post,
  getProfileImageUrl,
  loggedInUserId,
  loggedInUserFriends,
  onPostDelete,
  isEvent = false,
}) => {
  const navigate = useNavigate();

  // For events, use post.page if available; otherwise, use the provided user data.
  const displayUser = isEvent && post.page ? post.page : user;

  const profileImgSrc = displayUser?.profileImage
    ? getProfileImageUrl(displayUser.profileImage)
    : "/default-profile.png";

  const displayName = isEvent
    ? displayUser?.name || "Bilinmeyen Sayfa"
    : displayUser?.name || post?.author || "Bilinmeyen Kullanıcı";

  const isSelf = displayUser?._id === loggedInUserId;
  const isFriend = displayUser?.friends?.includes(loggedInUserId || "");

  const handleFollow = () => {
    if (isFriend) {
      console.log("Arkadaşlık kaldırma / takipten çıkma mantığı burada");
    } else {
      console.log("Takip etme mantığı burada");
    }
  };

  const handleChat = () => {
    navigate("/chat");
  };

  const handleProfileEdit = () => {
    if (displayUser && displayUser.username) {
      navigate(`/profile/${displayUser.username}`);
    }
  };

  // Compute mutual friends (the intersection between the logged in user's friend objects and the displayed user's friend IDs)
  const renderMutualFriendsInfo = () => {
    if (
      !loggedInUserFriends ||
      !displayUser?.friends ||
      loggedInUserFriends.length === 0 ||
      displayUser.friends.length === 0
    ) {
      return null;
    }
    // Filter logged in user's friends that appear in displayUser.friends
    const mutualFriends = loggedInUserFriends.filter((friend) =>
      displayUser.friends!.includes(friend._id)
    );
    if (mutualFriends.length === 0) return null;
    if (mutualFriends.length === 1) {
      return (
        <p className="text-xs text-gray-500 mt-1">
          {mutualFriends[0].name} tarafından takip ediliyor
        </p>
      );
    }
    return (
      <p className="text-xs text-gray-500 mt-1">
        {mutualFriends[0].name} ve {mutualFriends.length - 1} kişi tarafından
        takip ediliyor
      </p>
    );
  };

  // Map backend visibility values to Turkish
  const visibilityText =
    post.visibility === "Everyone"
      ? "Herkes"
      : post.visibility === "Friends"
        ? "Arkadaşlar"
        : post.visibility === "Private"
          ? "Özel"
          : "Herkes";

  return (
    <div className="post-header flex items-center justify-between">
      <div className="post-user flex items-center space-x-2">
        <img
          src={profileImgSrc}
          alt={displayName}
          className="h-10 w-10 rounded-full object-cover border border-gray-300 shadow-sm"
        />

        <div className="flex flex-col">
          {/* Container that stops click propagation so hover events work */}
          <div
            className="relative group flex items-center space-x-1"
            onClick={(e) => e.stopPropagation()}
          >
            <p className="font-semibold text-black cursor-pointer">
              {displayName}
            </p>
            {!isEvent && displayUser?.isVerified && (
              <CheckCircle size={16} className="text-blue-500" />
            )}

            {/* Hover Popup with stopPropagation added */}
            <div
              className="absolute left-0 top-full mt-1 w-72 p-4 bg-white border border-gray-200 shadow-lg rounded hidden group-hover:block z-10"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-start justify-between">
                <div className="flex items-center space-x-2">
                  <img
                    src={profileImgSrc}
                    alt={displayName}
                    className="h-10 w-10 rounded-full object-cover border border-gray-300"
                  />
                  <div>
                    <div className="flex items-center space-x-1">
                      <p className="font-bold text-sm">{displayName}</p>
                      {displayUser?.isVerified && (
                        <CheckCircle size={14} className="text-blue-500" />
                      )}
                    </div>
                    {displayUser?.username && (
                      <p className="text-xs text-gray-500">
                        @{displayUser.username}
                      </p>
                    )}
                  </div>
                </div>
                {!isSelf && (
                  <button
                    onClick={handleFollow}
                    className={`px-3 py-1 text-sm rounded-full ${
                      isFriend
                        ? "bg-gray-900 text-white hover:bg-black"
                        : "bg-black text-white hover:bg-gray-800"
                    }`}
                  >
                    {isFriend ? "Arkadaş" : "Ekle"}
                  </button>
                )}
              </div>
              {/* Instead of hardcoding mutual friend info, render it dynamically */}
              {renderMutualFriendsInfo()}
              <div className="flex items-center space-x-3 text-sm font-semibold mt-3">
                <span>{displayUser?.friends?.length || 0} Arkadaş</span>
              </div>
              {isSelf ? (
                <button
                  onClick={handleProfileEdit}
                  className="mt-3 w-full px-3 py-2 text-sm bg-blue-600 text-white rounded-full hover:bg-blue-700"
                >
                  Profili Düzenle
                </button>
              ) : (
                <button
                  onClick={handleChat}
                  className="mt-3 w-full px-3 py-2 text-sm bg-blue-600 text-white rounded-full hover:bg-blue-700"
                >
                  Mesaj Gönder
                </button>
              )}
            </div>
          </div>
          {isEvent ? (
            <div className="flex items-center text-xs text-gray-500">
              <span>{timeAgo(post.createdAt)}</span>
            </div>
          ) : (
            <div className="flex items-center text-xs text-gray-500">
              <span>{timeAgo(post.createdAt)}</span>
              <span className="mx-1">•</span>
              <div className="relative group">
                {post.visibility === "Everyone" ? (
                  <Globe size={12} className="text-gray-500" />
                ) : post.visibility === "Friends" ? (
                  <Users size={12} className="text-gray-500" />
                ) : post.visibility === "Private" ? (
                  <Lock size={12} className="text-gray-500" />
                ) : (
                  <Globe size={12} className="text-gray-500" />
                )}
                <span className="absolute left-1/2 -top-6 transform -translate-x-1/2 bg-gray-700 text-white text-[10px] font-medium rounded px-1 py-0.5 opacity-0 group-hover:opacity-100 transition">
                  {visibilityText}
                </span>
              </div>
            </div>
          )}
        </div>
      </div>

      <PostOptionsMenu
        postId={post._id}
        postOwnerId={displayUser?._id || ""}
        onPostDelete={onPostDelete}
      />
    </div>
  );
};

export default PostHeader;
