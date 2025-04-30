// src/components/CreatePostUpperSide.tsx
import React, { useRef, useEffect } from "react";
import axios from "axios";
import { Globe, Users, Lock, Smile } from "lucide-react";
import EmojiPicker from "emoji-picker-react";

interface CreatePostUpperSideProps {
  content: string;
  setContent: (val: string) => void;
  userData?: {
    profileImage?: string;
    name: string;
    username?: string; // Added username property
  };
  visibility: "Everyone" | "Friends" | "Private";
  setVisibility: (val: "Everyone" | "Friends" | "Private") => void;
  showEmojiPicker: boolean;
  setShowEmojiPicker: (val: boolean) => void;
}

const CreatePostUpperSide: React.FC<CreatePostUpperSideProps> = ({
  content,
  setContent,
  userData,
  visibility,
  setVisibility,
  showEmojiPicker,
  setShowEmojiPicker,
}) => {
  const emojiPickerRef = useRef<HTMLDivElement>(null);
  const visibilityPopupRef = useRef<HTMLDivElement>(null);
  const [showVisibilityPopup, setShowVisibilityPopup] = React.useState(false);

  const getProfileImageUrl = (imagePath?: string) =>
    imagePath ? `http://localhost:5001/${imagePath}` : "/default-profile.png";

  const handleEmojiClick = (emojiData: any, event: MouseEvent) => {
    setContent(content + emojiData.emoji);
  };

  // Close emoji picker if clicking outside
  useEffect(() => {
    const handleClickOutsideEmoji = (event: MouseEvent) => {
      if (
        emojiPickerRef.current &&
        !emojiPickerRef.current.contains(event.target as Node)
      ) {
        setShowEmojiPicker(false);
      }
    };
    if (showEmojiPicker) {
      document.addEventListener("mousedown", handleClickOutsideEmoji);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutsideEmoji);
    };
  }, [showEmojiPicker, setShowEmojiPicker]);

  // Close visibility popup if clicking outside
  useEffect(() => {
    const handleClickOutsideVisibility = (event: MouseEvent) => {
      if (
        visibilityPopupRef.current &&
        !visibilityPopupRef.current.contains(event.target as Node)
      ) {
        setShowVisibilityPopup(false);
      }
    };
    if (showVisibilityPopup) {
      document.addEventListener("mousedown", handleClickOutsideVisibility);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutsideVisibility);
    };
  }, [showVisibilityPopup]);

  const visibilityOptions: ("Everyone" | "Friends" | "Private")[] = [
    "Everyone",
    "Friends",
    "Private",
  ];

  // Toggle visibility popup
  const toggleVisibilityPopup = () => {
    setShowVisibilityPopup((prev) => !prev);
  };

  // Example submission handler (to send data to backend)
  const handleSubmit = async () => {
    try {
      const token = localStorage.getItem("token");
      const storedUser = localStorage.getItem("user");
      if (!storedUser) throw new Error("LocalStorage'da kullanıcı bulunamadı");
      const user = JSON.parse(storedUser);

      const formData = new FormData();
      formData.append("content", content);
      formData.append("userId", user._id);
      formData.append("visibility", visibility);
      // To add media if needed: formData.append("media", file);

      const response = await axios.post(
        "http://localhost:5001/api/posts",
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );
      console.log("Gönderi başarıyla oluşturuldu:", response.data);
      setContent("");
    } catch (error) {
      console.error("Gönderi oluşturulurken hata:", error);
    }
  };

  return (
    <div className="p-4 bg-white rounded-lg">
      {/* Top Row: Profile information on the left, Visibility on the right */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <img
            src={getProfileImageUrl(userData?.profileImage)}
            alt="profil"
            className="w-10 h-10 rounded-full border border-gray-300"
          />
          <div>
            <p className="text-base font-semibold text-gray-700">
              {userData?.name || "Kullanıcı"}
            </p>
            {userData?.username && (
              <p className="text-xs text-gray-500">@{userData.username}</p>
            )}
          </div>
        </div>
        {/* Visibility Selector */}
        <div className="relative">
          <button
            onClick={toggleVisibilityPopup}
            className="flex items-center text-xs text-gray-500 hover:text-blue-600 transition"
          >
            {visibility === "Everyone" && <Globe size={16} className="mr-1" />}
            {visibility === "Friends" && <Users size={16} className="mr-1" />}
            {visibility === "Private" && <Lock size={16} className="mr-1" />}
            <span>
              {visibility === "Everyone"
                ? "Herkese Açık"
                : visibility === "Friends"
                  ? "Arkadaşlar"
                  : "Sadece Ben"}
            </span>
          </button>
          {showVisibilityPopup && (
            <div
              ref={visibilityPopupRef}
              className="absolute right-0 mt-2 w-40 bg-white border-1 border-gray-300 rounded-lg shadow-lg z-10"
            >
              <ul className="space-y-1 p-2">
                {visibilityOptions.map((option) => (
                  <li key={option}>
                    <button
                      onClick={() => {
                        setVisibility(option);
                        setShowVisibilityPopup(false);
                      }}
                      className={`flex items-center px-2 py-1 rounded-full text-xs transition w-full ${
                        visibility === option
                          ? "bg-blue-50 text-blue-600 font-medium"
                          : "bg-gray-100 text-black hover:bg-gray-200 hover:text-blue-600"
                      }`}
                    >
                      <div
                        className={`w-4 h-4 mr-1 flex-shrink-0 rounded-full flex items-center justify-center transition-transform duration-200 ${
                          visibility === option
                            ? "bg-blue-600 text-white scale-110"
                            : "bg-gray-200 scale-100"
                        }`}
                      >
                        {visibility === option && (
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="w-3 h-3"
                            viewBox="0 0 20 20"
                            fill="currentColor"
                          >
                            <path
                              fillRule="evenodd"
                              d="M16.707 5.293a1 1 0 00-1.414 0L8 12.586l-3.293-3.293a1 1 0 00-1.414 1.414l4 4a1 1 0 001.414 0l8-8a1 1 0 000-1.414z"
                              clipRule="evenodd"
                            />
                          </svg>
                        )}
                      </div>
                      <span>
                        {option === "Everyone"
                          ? "Herkese Açık"
                          : option === "Friends"
                            ? "Arkadaşlar"
                            : "Sadece Ben"}
                      </span>
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>

      {/* Content Input with Emoji Picker */}
      <div className="mt-4 relative">
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="Ne paylaşmak istersin?"
          className="w-full h-32 p-3 rounded-lg bg-gray-50 text-gray-700 focus:outline-none"
        />
        <button
          onClick={() => setShowEmojiPicker(!showEmojiPicker)}
          className="absolute bottom-2 left-2 p-1 rounded-full text-yellow-500 hover:text-yellow-600 transition"
        >
          <span role="img" aria-label="emoji" className="text-base">
            <Smile size={16} />
          </span>
        </button>
        {showEmojiPicker && (
          <div
            ref={emojiPickerRef}
            className="absolute z-30 bg-white shadow-lg rounded-lg top-12 left-2 p-2"
          >
            <div className="flex justify-end">
              <button
                onClick={() => setShowEmojiPicker(false)}
                className="text-gray-500 hover:text-gray-700 text-xs"
              >
                &times;
              </button>
            </div>
            <EmojiPicker onEmojiClick={handleEmojiClick} />
          </div>
        )}
      </div>
    </div>
  );
};

export default CreatePostUpperSide;
