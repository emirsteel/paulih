import React, { useEffect, useState, useRef } from "react";
import axios from "axios";
import { Clock, MessageSquare, UserPlus, Heart, X } from "lucide-react";
import {
  fetchFriendRequestSenders,
  fetchLikeNotifications,
} from "../services/api";

interface Comment {
  postId: string;
  commenter: {
    userId: string;
    username: string;
    profileImage?: string;
  };
  commentContent: string;
  commentDate: string;
}

interface Like {
  postId: string;
  liker: {
    userId: string;
    username: string;
    profileImage?: string;
  };
  likeDate: string;
}

interface FriendRequest {
  userId: string;
  username: string;
  name: string;
  profileImage?: string;
}

interface NotificationsPopupProps {
  userId: string | undefined;
  modalOpen: boolean;
  setModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
  readNotifications: string[];
  setReadNotifications: React.Dispatch<React.SetStateAction<string[]>>;
  setNotificationCount: React.Dispatch<React.SetStateAction<number>>;
}

const NotificationsPopup: React.FC<NotificationsPopupProps> = ({
  userId,
  modalOpen,
  setModalOpen,
  readNotifications,
  setReadNotifications,
  setNotificationCount,
}) => {
  const [comments, setComments] = useState<Comment[]>([]);
  const [likes, setLikes] = useState<Like[]>([]);
  const [friendRequests, setFriendRequests] = useState<FriendRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("comment");

  const popupRef = useRef<HTMLDivElement>(null);

  const getRelativeTime = (date: string) => {
    const now = new Date().getTime();
    const past = new Date(date).getTime();
    const diffInSeconds = Math.floor((now - past) / 1000);
    if (diffInSeconds < 60) return `${diffInSeconds} saniye önce`;
    if (diffInSeconds < 3600)
      return `${Math.floor(diffInSeconds / 60)} dakika önce`;
    if (diffInSeconds < 86400)
      return `${Math.floor(diffInSeconds / 3600)} saat önce`;
    return `${Math.floor(diffInSeconds / 86400)} gün önce`;
  };

  const truncateText = (text: string, maxLength: number) =>
    text.length > maxLength ? `${text.slice(0, maxLength)}...` : text;

  useEffect(() => {
    const fetchNotifications = async () => {
      if (!userId) return;
      setLoading(true);
      try {
        const [commentRes, likeRes, requests] = await Promise.all([
          axios.get(
            `http://localhost:5001/api/posts/${userId}/notificationcomments`
          ),
          fetchLikeNotifications(userId),
          fetchFriendRequestSenders(userId),
        ]);
        setComments(commentRes.data.comments || []);
        setLikes(likeRes || []);
        setFriendRequests(requests || []);
      } catch (error) {
        console.error("Bildirimler alınamadı:", error);
      } finally {
        setLoading(false);
      }
    };

    if (modalOpen) fetchNotifications();
  }, [modalOpen, userId]);

  // ✅ Load read notifications from localStorage per user
  useEffect(() => {
    if (!userId) return;
    const stored = localStorage.getItem(`readNotifications-${userId}`);
    if (stored) {
      setReadNotifications(JSON.parse(stored));
    } else {
      setReadNotifications([]);
    }
  }, [userId]);

  // ✅ Handle outside click to close popup
  useEffect(() => {
    const handleOutsideClick = (event: MouseEvent) => {
      if (
        popupRef.current &&
        !popupRef.current.contains(event.target as Node)
      ) {
        setModalOpen(false);
      }
    };
    if (modalOpen) {
      document.addEventListener("mousedown", handleOutsideClick);
    }
    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
    };
  }, [modalOpen]);

  if (!modalOpen) return null;

  const allNotifications = [
    ...comments
      .filter((c) => c.commenter.userId !== userId)
      .map((c) => ({
        type: "comment",
        username: c.commenter.username,
        profileImage: c.commenter.profileImage
          ? `http://localhost:5001/${c.commenter.profileImage}`
          : "/default-avatar.png",
        content: c.commentContent,
        time: c.commentDate,
        targetId: c.postId,
      })),
    ...likes
      .filter((l) => l.liker.userId !== userId)
      .map((l) => ({
        type: "like",
        username: l.liker.username,
        profileImage: l.liker.profileImage
          ? `http://localhost:5001/${l.liker.profileImage}`
          : "/default-avatar.png",
        content: "",
        time: l.likeDate,
        targetId: l.postId,
      })),
    ...friendRequests.map((f) => ({
      type: "friendRequest",
      username: f.username,
      profileImage: f.profileImage
        ? `http://localhost:5001/${f.profileImage}`
        : "/default-avatar.png",
      content: "",
      time: new Date().toISOString(),
      targetId: f.username,
    })),
  ];

  const filtered = allNotifications
    .filter((n) => n.type === activeTab)
    .sort((a, b) => new Date(b.time).getTime() - new Date(a.time).getTime());

  const handleNotificationClick = (
    key: string,
    targetId: string,
    type: string
  ) => {
    const isAlreadyRead = readNotifications.includes(key);
    if (!isAlreadyRead) {
      const updated = [...readNotifications, key];
      setReadNotifications(updated);
      if (userId) {
        localStorage.setItem(
          `readNotifications-${userId}`,
          JSON.stringify(updated)
        );
      }
      setNotificationCount((count) => Math.max(0, count - 1));
    }

    const path =
      type === "friendRequest" ? `/profile/${targetId}` : `/post/${targetId}`;
    window.location.href = `http://localhost:3000${path}`;
  };

  const tabs = [
    { key: "comment", label: "Yorumlar" },
    { key: "like", label: "Beğeniler" },
    { key: "friendRequest", label: "İstekler" },
  ];

  return (
    <div
      ref={popupRef}
      className="bg-white shadow-lg rounded-2xl p-4 w-[90vw] sm:w-80 md:w-96 z-50"
      style={{
        maxHeight: "80vh",
        overflowY: "auto",
        position: "fixed",
        top: "4rem",
        right: "1rem",
      }}
    >
      <button
        className="absolute top-4 right-4 w-8 h-8 rounded-full flex items-center justify-center hover:bg-gray-100 transition"
        onClick={() => setModalOpen(false)}
      >
        <X size={20} className="text-gray-600" />
      </button>

      <h2 className="text-lg font-semibold text-gray-800 mb-2">
        Bildirimlerin
      </h2>

      <div className="flex space-x-2 mb-4">
        {tabs.map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            className={`px-3 py-1 rounded-full text-sm font-medium transition ${
              activeTab === tab.key
                ? "bg-blue-100 text-blue-600"
                : "text-gray-600 hover:bg-gray-100"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {loading ? (
        <p className="text-gray-500 text-sm">Yükleniyor...</p>
      ) : filtered.length > 0 ? (
        filtered.map((notification, index) => {
          const key = `${notification.type}-${index}`;
          const isRead = readNotifications.includes(key);

          return (
            <div
              key={key}
              className="p-2 hover:bg-gray-100 rounded-lg cursor-pointer transition flex flex-col"
              onClick={() =>
                handleNotificationClick(
                  key,
                  notification.targetId,
                  notification.type
                )
              }
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  {notification.type === "comment" ? (
                    <MessageSquare className="text-blue-500" size={16} />
                  ) : notification.type === "like" ? (
                    <Heart className="text-pink-500" size={16} />
                  ) : (
                    <UserPlus className="text-green-500" size={16} />
                  )}
                  <img
                    src={notification.profileImage}
                    alt={notification.username}
                    className="w-8 h-8 rounded-full"
                  />
                  <p className="text-sm font-medium text-gray-800">
                    {notification.username}{" "}
                    <span className="text-gray-600">
                      {notification.type === "comment"
                        ? "gönderine yorum yaptı"
                        : notification.type === "like"
                          ? "gönderini beğendi"
                          : "sana arkadaşlık isteği gönderdi"}
                    </span>
                  </p>
                </div>
                <div
                  className={`w-3 h-3 rounded-full mr-2 transition-opacity duration-300 ${
                    isRead ? "opacity-0" : "bg-blue-500"
                  }`}
                />
              </div>

              {notification.type === "comment" && (
                <div className="pl-8 mt-1">
                  <p className="text-sm text-gray-600 italic">
                    "{truncateText(notification.content, 60)}"
                  </p>
                </div>
              )}

              {notification.type !== "friendRequest" && (
                <div className="pl-8 mt-1">
                  <p className="text-xs text-gray-400 flex items-center">
                    <Clock className="w-3 h-3 mr-1" />
                    {getRelativeTime(notification.time)}
                  </p>
                </div>
              )}
            </div>
          );
        })
      ) : (
        <p className="text-sm text-gray-500">Henüz bildirimin yok.</p>
      )}
    </div>
  );
};

export default NotificationsPopup;
