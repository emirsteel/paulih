// ChatBoxReplyMessage.tsx

import React from "react";
import { X } from "lucide-react";

interface ChatBoxReplyMessageProps {
  originalMessage: {
    _id: string;
    message: string;
    image?: string;
    file?: string;
  };
  onCancel: () => void;
}

const ChatBoxReplyMessage: React.FC<ChatBoxReplyMessageProps> = ({
  originalMessage,
  onCancel,
}) => {
  // You can style this container as you like.
  // For example, a small top bar with the original message text or file preview
  return (
    <div className="bg-gray-100 p-2 mb-2 rounded relative">
      <button
        onClick={onCancel}
        className="absolute top-1 right-1 w-5 h-5 flex items-center justify-center text-gray-500 hover:text-black"
        title="Cancel reply"
      >
        <X size={14} />
      </button>

      <p className="text-sm text-gray-700 font-semibold mb-1">Replying to...</p>

      {/* Show a snippet of the original message text or file */}
      {originalMessage.file ? (
        <p className="text-xs text-gray-600 truncate">
          File: {originalMessage.message}
        </p>
      ) : originalMessage.image ? (
        <p className="text-xs text-gray-600 truncate">
          Image: {originalMessage.message}
        </p>
      ) : (
        <p className="text-xs text-gray-600 truncate">
          {originalMessage.message}
        </p>
      )}
    </div>
  );
};

export default ChatBoxReplyMessage;
