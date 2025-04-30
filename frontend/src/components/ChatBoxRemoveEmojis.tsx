// ChatBoxRemoveEmojis.tsx
import React from "react";
import { X } from "lucide-react";
import { removeReaction } from "../services/api";

interface Reaction {
  user: string;
  emoji: string;
  timestamp: string;
}

interface ChatBoxRemoveEmojisProps {
  messageId: string;
  reactions: Reaction[];
  onClose: () => void;
  onReactionRemoved: (updatedMessage: any) => void; // callback with the updated message
}

const ChatBoxRemoveEmojis: React.FC<ChatBoxRemoveEmojisProps> = ({
  messageId,
  reactions,
  onClose,
  onReactionRemoved,
}) => {
  const handleRemoveReaction = async (emoji: string) => {
    try {
      const updatedMessage = await removeReaction({ messageId, emoji });
      onReactionRemoved(updatedMessage);
      onClose();
    } catch (error) {
      console.error("Failed to remove reaction:", error);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center">
      {/* Click outside to close */}
      <div
        className="absolute inset-0"
        style={{ cursor: "default" }}
        onClick={onClose}
      ></div>

      {/* Popup container - light theme */}
      <div className="relative bg-white text-gray-800 p-4 rounded shadow-lg w-72">
        <div className="flex justify-between items-center mb-2">
          <h2 className="text-base font-semibold">Reactions</h2>
          <button
            onClick={onClose}
            className="p-1 rounded hover:bg-gray-100 transition"
          >
            <X size={20} className="text-gray-600 hover:text-gray-800" />
          </button>
        </div>

        {reactions.length === 0 ? (
          <p className="text-sm text-gray-500">No reactions yet.</p>
        ) : (
          <div className="space-y-2">
            {reactions.map((r, index) => (
              <div
                key={`${r.user}-${index}`}
                onClick={() => handleRemoveReaction(r.emoji)}
                className="flex items-center justify-between bg-gray-100 rounded px-3 py-2 cursor-pointer hover:bg-gray-200 transition"
              >
                <div>
                  <p className="text-sm font-medium text-gray-800">
                    User: {r.user}
                  </p>
                  <p className="text-xs text-gray-500">Tap to remove</p>
                </div>
                <span className="text-2xl">{r.emoji}</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ChatBoxRemoveEmojis;
