// CreatePostLiveVideo.tsx
import React from "react";
import { FiCamera } from "react-icons/fi";

interface CreatePostLiveVideoProps {
  onOpenLiveVideo: () => void;
}

const CreatePostLiveVideo: React.FC<CreatePostLiveVideoProps> = ({
  onOpenLiveVideo,
}) => {
  return (
    <div className="mt-4">
      <button
        onClick={onOpenLiveVideo}
        className="flex items-center space-x-2 px-4 py-2 bg-gray-200 rounded-full hover:bg-gray-300 transition"
      >
        <FiCamera size={20} className="text-blue-500" />
        <span className="text-sm text-gray-600">Live Video</span>
      </button>
    </div>
  );
};

export default CreatePostLiveVideo;
