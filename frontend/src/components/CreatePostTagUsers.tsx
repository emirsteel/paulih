// CreatePostTagUsers.tsx
import React from "react";
import { FiTag } from "react-icons/fi";

interface CreatePostTagUsersProps {
  onOpenTagUsers: () => void;
}

const CreatePostTagUsers: React.FC<CreatePostTagUsersProps> = ({
  onOpenTagUsers,
}) => {
  return (
    <div className="mt-4">
      <button
        onClick={onOpenTagUsers}
        className="flex items-center space-x-2 px-4 py-2 bg-gray-200 rounded-full hover:bg-gray-300 transition"
      >
        <FiTag size={20} className="text-blue-500" />
        <span className="text-sm text-gray-600">Tag Users</span>
      </button>
    </div>
  );
};

export default CreatePostTagUsers;
