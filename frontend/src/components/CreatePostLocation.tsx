// CreatePostLocation.tsx
import React from "react";
import { FiMapPin } from "react-icons/fi";

interface CreatePostLocationProps {
  onOpenLocation: () => void;
}

const CreatePostLocation: React.FC<CreatePostLocationProps> = ({
  onOpenLocation,
}) => {
  return (
    <div className="mt-4">
      <button
        onClick={onOpenLocation}
        className="flex items-center space-x-2 px-4 py-2 bg-gray-200 rounded-full hover:bg-gray-300 transition"
      >
        <FiMapPin size={20} className="text-blue-500" />
        <span className="text-sm text-gray-600">Location</span>
      </button>
    </div>
  );
};

export default CreatePostLocation;
