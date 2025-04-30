import React from "react";
import { X } from "lucide-react";

interface ChatBoxMessageEmojiProps {
  onClose: () => void; // Callback to close the popup
  onEmojiSelect?: (emoji: string) => void; // Optional callback when an emoji is clicked
  isSender?: boolean; // Determines which side to display the popup
}

const ChatBoxMessageEmoji: React.FC<ChatBoxMessageEmojiProps> = ({
  onClose,
  onEmojiSelect,
  isSender,
}) => {
  const emojis = ["👍", "❤️", "😂", "😮", "😢", "🙏"];

  // Position the popup: for sender messages, anchor to left; for receiver, anchor to right.
  const containerClass = isSender
    ? "absolute bottom-full mb-2 left-0 transform -translate-x-full bg-white border border-gray-200 shadow-lg p-2 flex items-center space-x-3 rounded-md z-50"
    : "absolute bottom-full mb-2 right-0 transform translate-x-full bg-white border border-gray-200 shadow-lg p-2 flex items-center space-x-3 rounded-md z-50";

  // Style each emoji icon with rounded circle, hover background, and pointer cursor.
  const emojiClass =
    "cursor-pointer text-xl rounded-full p-1 hover:bg-gray-200 transition";

  return (
    <div className={containerClass} style={{ minWidth: "150px" }}>
      {emojis.map((emoji) => (
        <span
          key={emoji}
          role="img"
          aria-label="Reaction Emoji"
          className={emojiClass}
          onClick={() => {
            if (onEmojiSelect) onEmojiSelect(emoji);
            onClose();
          }}
        >
          {emoji}
        </span>
      ))}
      <X
        size={24}
        className="cursor-pointer rounded-full p-1 bg-gray-200 transition hover:bg-gray-300 transition"
        onClick={onClose}
      />
    </div>
  );
};

export default ChatBoxMessageEmoji;
