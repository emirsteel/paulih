import React, { useEffect, useState } from "react";
import { FiUsers, FiX } from "react-icons/fi";
import CreateGroupPopup from "./CreateGroupPopup";
import { fetchFriends, createGroup } from "../services/api";

interface Friend {
  _id: string;
  name: string;
  profileImage?: string;
}

interface UserOptionsPopupProps {
  isVisible: boolean;
  position: { top: number; left: number };
  onClose: () => void;
}

const UserOptionsPopup: React.FC<UserOptionsPopupProps> = ({
  isVisible,
  position,
  onClose,
}) => {
  const [isGroupPopupVisible, setGroupPopupVisible] = useState(false);
  const [friends, setFriends] = useState<Friend[]>([]);

  useEffect(() => {
    if (isVisible) {
      const getFriends = async () => {
        try {
          const friendsList = await fetchFriends();
          setFriends(friendsList);
        } catch (error) {
          console.error("Error fetching friends:", error);
        }
      };
      getFriends();
    }
  }, [isVisible]);

  const handleCreateGroup = async (formData: FormData) => {
    try {
      const response = await createGroup(formData);
      console.log("Group created:", response.data);
      setGroupPopupVisible(false);
    } catch (error) {
      console.error(
        "Error creating group:",
        error.response?.data || error.message
      );
    }
  };

  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 z-50" onClick={onClose}>
      <div
        className="absolute bg-white border border-gray-200 shadow-lg rounded-xl w-72 transition-all"
        style={{
          top: position.top + 60,
          left: position.left - 165,
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-5 pt-4 pb-2">
          <span className="text-sm font-semibold text-gray-800 tracking-wide">
            Ayarlar
          </span>
          <button
            onClick={onClose}
            className="w-7 h-7 flex items-center justify-center rounded-full hover:bg-gray-100 transition"
          >
            <FiX size={16} className="text-gray-700" />
          </button>
        </div>

        {/* Shorter line under header */}
        <div className="px-5">
          <hr className="border-t border-gray-100" />
        </div>

        {/* Options */}
        <div className="px-4 py-3 space-y-2">
          <div
            onClick={() => setGroupPopupVisible(true)}
            className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-gray-50 cursor-pointer transition-all"
          >
            <FiUsers className="text-indigo-600" size={18} />
            <span className="text-sm text-gray-700 font-medium">
              Yeni Grup Oluştur
            </span>
          </div>
        </div>

        {/* Group creation popup */}
        {isGroupPopupVisible && (
          <CreateGroupPopup
            friends={friends}
            onClose={() => setGroupPopupVisible(false)}
            onCreate={handleCreateGroup}
          />
        )}
      </div>
    </div>
  );
};

export default UserOptionsPopup;
