// CreatePostGif.tsx
import React from "react";
import { FiGift } from "react-icons/fi";

interface CreatePostGifProps {
  gifModalOpen: boolean;
  setGifModalOpen: (open: boolean) => void;
  onSelectGif: (gifUrl: string) => void;
}

const CreatePostGif: React.FC<CreatePostGifProps> = ({
  gifModalOpen,
  setGifModalOpen,
  onSelectGif,
}) => {
  return (
    <div className="mt-4">
      <button
        onClick={() => setGifModalOpen(true)}
        className="flex items-center space-x-2 px-4 py-2 bg-gray-200 rounded-full hover:bg-gray-300 transition"
      >
        <FiGift size={20} className="text-blue-500" />
        <span className="text-sm text-gray-600">GIF</span>
      </button>
    </div>
  );
};

export default CreatePostGif;
