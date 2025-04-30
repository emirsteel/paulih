// CreatePostPhotoVideo.tsx
import React, { useRef } from "react";
import { FiImage, FiPlusCircle, FiX } from "react-icons/fi";

interface CreatePostPhotoVideoProps {
  media: File[];
  previewUrls: string[];
  setMedia: (media: File[]) => void;
  setPreviewUrls: (urls: string[]) => void;
  handleMediaChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleAddMoreContent: () => void;
  handleDeleteImage: (index: number) => void;
  setFullImageUrl: (url: string) => void;
}

const CreatePostPhotoVideo: React.FC<CreatePostPhotoVideoProps> = ({
  media,
  previewUrls,
  setMedia,
  setPreviewUrls,
  handleMediaChange,
  handleAddMoreContent,
  handleDeleteImage,
  setFullImageUrl,
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  return (
    <div className="mt-6 border border-gray-300 rounded-lg p-4">
      <div className="mb-4 flex items-center justify-between">
        <div className="flex space-x-4">
          <label className="flex flex-col items-center cursor-pointer">
            <FiImage
              size={20}
              className={
                media.filter((file) => file.type.startsWith("image/")).length >=
                  4 || media.some((file) => file.type.startsWith("video/"))
                  ? "text-gray-400"
                  : "text-blue-500"
              }
            />
            <span className="text-xs mt-1">Photo/Video</span>
            <input
              type="file"
              accept="image/*,video/*"
              onChange={handleMediaChange}
              className="hidden"
              ref={fileInputRef}
            />
          </label>
          <button
            onClick={handleAddMoreContent}
            className="flex flex-col items-center cursor-pointer hover:bg-gray-100 rounded-lg p-2 transition"
          >
            <FiPlusCircle size={20} className="text-blue-500" />
            <span className="text-xs mt-1">Add More</span>
          </button>
        </div>
        <button
          onClick={() => setPreviewUrls([])}
          className="flex items-center space-x-2 px-4 py-2 bg-gray-200 rounded-full hover:bg-gray-300 transition"
        >
          <FiX size={20} className="text-gray-600" />
          <span className="text-sm text-gray-600">Clear</span>
        </button>
      </div>
      {previewUrls.length > 0 && (
        <div className="grid grid-cols-2 gap-4">
          {previewUrls.map((url, index) => (
            <div key={index} className="relative overflow-hidden rounded-lg">
              <img
                src={url}
                alt={`Preview ${index}`}
                className="w-full h-36 object-cover transition-transform duration-300 hover:scale-105 cursor-pointer"
                onClick={() => setFullImageUrl(url)}
              />
              <button
                onClick={() => handleDeleteImage(index)}
                className="absolute top-2 right-2 w-6 h-6 bg-white rounded-full flex items-center justify-center text-red-600 text-xs hover:bg-red-100 transition"
              >
                <FiX />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default CreatePostPhotoVideo;
