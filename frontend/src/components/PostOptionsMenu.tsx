// src/components/PostOptionsMenu.tsx
import React, { useState, useEffect, useRef } from "react";
import { MoreHorizontal, Bell, Trash2, Flag, Link } from "lucide-react";
import { AlertBox } from "./Alerts";
import {
  sendNotification,
  getNotificationStatus,
  removeNotification,
  deletePost,
} from "../services/api";
import PostOptionsMenuReportPopup from "./PostOptionsMenuReportPopup";
import PostOptionsMenuDeletePost from "./PostOptionsMenuDeletePost";

interface PostOptionsMenuProps {
  postId: string;
  postOwnerId: string; // Indicates who owns the post.
  onPostDelete?: (postId: string) => void;
}

const PostOptionsMenu: React.FC<PostOptionsMenuProps> = ({
  postId,
  postOwnerId,
  onPostDelete,
}) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [alertMessage, setAlertMessage] = useState<string | null>(null);
  const [notificationsEnabled, setNotificationsEnabled] = useState(false);
  const [isReportPopupOpen, setIsReportPopupOpen] = useState(false);
  const [isDeletePopupOpen, setIsDeletePopupOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const checkNotificationStatus = async () => {
      const userId = localStorage.getItem("userId");
      if (userId) {
        try {
          const exists = await getNotificationStatus(postId, userId);
          setNotificationsEnabled(exists);
        } catch (error) {
          console.error(
            "Bildirim durumu kontrol edilirken hata oluştu:",
            error
          );
        }
      }
    };
    checkNotificationStatus();
  }, [postId]);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleCopyLink = (e: React.MouseEvent<HTMLLIElement>) => {
    e.stopPropagation();
    const link = `http://localhost:3000/post/${postId}`;
    navigator.clipboard
      .writeText(link)
      .then(() => {
        setAlertMessage("Bağlantı başarıyla kopyalandı!");
        setTimeout(() => setAlertMessage(null), 2000);
      })
      .catch((err) => {
        console.error("Bağlantı kopyalanamadı", err);
      });
    setIsMenuOpen(false);
  };

  const handleToggleNotifications = async (
    e: React.MouseEvent<HTMLLIElement>
  ) => {
    e.stopPropagation();
    const userId = localStorage.getItem("userId");
    if (!userId) {
      setAlertMessage("Lütfen bildirimleri açmak/kapatmak için giriş yapın.");
      setTimeout(() => setAlertMessage(null), 2000);
      return;
    }
    if (!notificationsEnabled) {
      try {
        await sendNotification({
          user: userId,
          post: postId,
          type: "notification",
          message: "Bu gönderi için bildirimler açıldı!",
        });
        setNotificationsEnabled(true);
        setAlertMessage("Bu gönderi için bildirimler açıldı!");
      } catch (error) {
        setAlertMessage("Bildirimler etkinleştirilemedi!");
      }
    } else {
      try {
        await removeNotification(postId, userId);
        setNotificationsEnabled(false);
        setAlertMessage("Bu gönderi için bildirimler kapatıldı!");
      } catch (error) {
        setAlertMessage("Bildirimler kapatılamadı!");
      }
    }
    setTimeout(() => setAlertMessage(null), 2000);
    setIsMenuOpen(false);
  };

  // This function will be called after the user confirms deletion in the popup.
  const handleDeletePost = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    try {
      await deletePost(postId);
      setAlertMessage("Gönderi başarıyla silindi!");
      if (onPostDelete) {
        onPostDelete(postId);
      }
    } catch (error) {
      setAlertMessage("Gönderi silinemedi!");
    }
    setTimeout(() => setAlertMessage(null), 2000);
    setIsDeletePopupOpen(false);
  };

  // Open the report popup when the "Gönderiyi Şikayet Et" button is clicked.
  const handleReportPost = (e: React.MouseEvent<HTMLLIElement>) => {
    e.stopPropagation();
    setIsReportPopupOpen(true);
    setIsMenuOpen(false);
  };

  // Get the current logged-in user's ID.
  const currentUserId = localStorage.getItem("userId");

  return (
    <div className="relative" ref={menuRef}>
      <div
        onClick={(e) => {
          e.stopPropagation();
          toggleMenu();
        }}
        className={`flex items-center justify-center text-gray-600 h-8 w-8 cursor-pointer rounded-full transition ${
          isMenuOpen ? "bg-gray-300" : "hover:bg-gray-200"
        }`}
      >
        <MoreHorizontal size={20} />
      </div>

      {isMenuOpen && (
        <div className="absolute right-0 top-10 bg-white rounded-xl shadow-lg w-56 p-2 z-10 border border-gray-200 transition-opacity opacity-100">
          <ul
            className="flex flex-col"
            onClick={(e) => {
              e.stopPropagation();
              toggleMenu();
            }}
          >
            <li
              onClick={handleToggleNotifications}
              className="flex items-center px-4 py-2 hover:bg-gray-100 rounded-lg cursor-pointer transition group"
            >
              <Bell
                size={18}
                className="text-gray-500 mr-3 group-hover:text-blue-600"
              />
              <span className="text-sm font-medium group-hover:text-blue-600">
                {notificationsEnabled
                  ? "Bildirimleri Kapat"
                  : "Bildirimleri Aç"}
              </span>
            </li>
            <li
              onClick={handleCopyLink}
              className="flex items-center px-4 py-2 hover:bg-gray-100 rounded-lg cursor-pointer transition group"
            >
              <Link
                size={18}
                className="text-gray-500 mr-3 group-hover:text-blue-600"
              />
              <span className="text-sm font-medium group-hover:text-blue-600">
                Bağlantıyı Kopyala
              </span>
            </li>
            {currentUserId === postOwnerId && (
              <li
                onClick={(e) => {
                  e.stopPropagation();
                  setIsDeletePopupOpen(true);
                  setIsMenuOpen(false);
                }}
                className="flex items-center px-4 py-2 hover:bg-gray-100 rounded-lg cursor-pointer transition group"
              >
                <Trash2
                  size={18}
                  className="text-gray-500 mr-3 group-hover:text-blue-600"
                />
                <span className="text-sm font-medium group-hover:text-blue-600">
                  Gönderiyi Sil
                </span>
              </li>
            )}
            <li
              onClick={handleReportPost}
              className="flex items-center px-4 py-2 hover:bg-gray-100 rounded-lg cursor-pointer transition group"
            >
              <Flag
                size={18}
                className="text-gray-500 mr-3 group-hover:text-blue-600"
              />
              <span className="text-sm font-medium group-hover:text-blue-600">
                Gönderiyi Şikayet Et
              </span>
            </li>
          </ul>
        </div>
      )}

      {alertMessage && (
        <div className="fixed bottom-0 left-0 w-full z-50">
          <AlertBox
            variant="success"
            title={alertMessage}
            onClose={() => setAlertMessage(null)}
          />
        </div>
      )}

      {/* Render the Report Popup */}
      <PostOptionsMenuReportPopup
        isOpen={isReportPopupOpen}
        postId={postId}
        onClose={() => setIsReportPopupOpen(false)}
      />

      {/* Render the Delete Confirmation Popup */}
      {isDeletePopupOpen && (
        <PostOptionsMenuDeletePost
          isOpen={isDeletePopupOpen}
          postId={postId}
          onClose={() => setIsDeletePopupOpen(false)}
          onDelete={handleDeletePost}
        />
      )}
    </div>
  );
};

export default PostOptionsMenu;
