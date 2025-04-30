// CreatePostMusic.tsx
import React from "react";
import { FiFlag } from "react-icons/fi";

interface CreatePostMusicProps {
  onOpenMusic: () => void;
}

const CreatePostMusic: React.FC<CreatePostMusicProps> = ({ onOpenMusic }) => {
  return (
    <div className="mt-4">
      <button
        onClick={onOpenMusic}
        className="flex items-center space-x-2 px-4 py-2 bg-gray-200 rounded-full hover:bg-gray-300 transition"
      >
        <FiFlag size={20} className="text-blue-500" />
        <span className="text-sm text-gray-600">Music</span>
      </button>
    </div>
  );
};

export default CreatePostMusic;
