// src/components/PostOptionsMenuDeletePost.tsx
import React from "react";
import { X } from "lucide-react";

interface PostOptionsMenuDeletePostProps {
  isOpen: boolean;
  postId: string;
  onClose: () => void;
  onDelete: (e: React.MouseEvent<HTMLButtonElement>) => void;
}

const PostOptionsMenuDeletePost: React.FC<PostOptionsMenuDeletePostProps> = ({
  isOpen,
  postId,
  onClose,
  onDelete,
}) => {
  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 flex items-center justify-center z-50"
      onClick={(e) => e.stopPropagation()}
    >
      {/* Overlay */}
      <div className="absolute inset-0 bg-black opacity-50" onClick={onClose} />
      {/* Popup */}
      <div
        className="relative bg-white rounded-lg p-6 z-10 w-80"
        onClick={(e) => e.stopPropagation()} // Prevent clicks inside from propagating
      >
        {/* Header: Title and Close Button */}
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-bold">Gönderi silinsin mi?</h2>
          <button
            className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center hover:bg-gray-300 transition shadow"
            onClick={(e) => {
              e.stopPropagation();
              onClose();
            }}
          >
            <X className="text-gray-600" size={20} />
          </button>
        </div>
        <p className="text-sm text-gray-700 mb-6">
          Bu işlem geri alınamaz ve gönderi, profilinden, seni takip eden tüm
          hesapların zaman akışından ve arama sonuçlarından silinir.
        </p>
        <button
          onClick={onDelete}
          className="w-full px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition mb-3"
        >
          Sil
        </button>
        <button
          onClick={onClose}
          className="w-full px-4 py-2 bg-gray-200 text-gray-800 rounded hover:bg-gray-300 transition mb-3"
        >
          İptal
        </button>
      </div>
    </div>
  );
};

export default PostOptionsMenuDeletePost;
