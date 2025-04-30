import React, { useEffect, useState, useRef } from "react";
import { FiSend, FiTrash, FiX } from "react-icons/fi";
import { IoIosArrowUp, IoIosArrowDown } from "react-icons/io";

interface ChatInfo {
  type: "user" | "group";
  name: string;
}

interface ImagePopupForChatBoxProps {
  selectedImages: File[];
  setSelectedImages: React.Dispatch<React.SetStateAction<File[]>>;
  onClose: () => void;
  onSend: (imagesToSend: File[]) => void;
  chatInfo: ChatInfo;
}

const ImagePopupForChatBox: React.FC<ImagePopupForChatBoxProps> = ({
  selectedImages,
  setSelectedImages,
  onClose,
  onSend,
  chatInfo,
}) => {
  const [popupImages, setPopupImages] = useState<File[]>([]);
  const [backgroundColor, setBackgroundColor] = useState<string>("transparent");
  const [imageUrls, setImageUrls] = useState<string[]>([]);
  const [currentImageIndex, setCurrentImageIndex] = useState<number>(0);
  const [thumbnailStartIndex, setThumbnailStartIndex] = useState<number>(0);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setPopupImages(selectedImages);
  }, [selectedImages]);

  useEffect(() => {
    const urls = popupImages.map((file) => URL.createObjectURL(file));
    setImageUrls(urls);
    return () => {
      urls.forEach((url) => URL.revokeObjectURL(url));
    };
  }, [popupImages]);

  const handleAddImages = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const filesArray = Array.from(e.target.files).slice(
        0,
        10 - popupImages.length
      );
      setPopupImages((prev) => [...prev, ...filesArray]);
    }
  };

  const handleDeleteImage = (index: number) => {
    setPopupImages((prev) => {
      const updated = prev.filter((_, i) => i !== index);
      if (updated.length === 0) {
        onClose();
      }
      return updated;
    });
    if (index === currentImageIndex) {
      setCurrentImageIndex(0);
    } else if (index < currentImageIndex) {
      setCurrentImageIndex((prev) => prev - 1);
    }
  };

  useEffect(() => {
    if (!imageUrls[currentImageIndex]) return;
    const img = new Image();
    img.src = imageUrls[currentImageIndex];
    img.crossOrigin = "anonymous";
    img.onload = () => {
      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d");
      canvas.width = 1;
      canvas.height = 1;
      ctx?.drawImage(img, 0, 0, 1, 1);
      const pixel = Array.from(ctx?.getImageData(0, 0, 1, 1).data || []);
      if (pixel.length) {
        const [r, g, b] = pixel;
        setBackgroundColor(`rgb(${r}, ${g}, ${b})`);
      }
    };
  }, [imageUrls, currentImageIndex]);

  const visibleThumbnails = 5;
  const handleThumbnailScroll = (direction: "up" | "down") => {
    if (direction === "up" && thumbnailStartIndex > 0) {
      setThumbnailStartIndex((prev) => prev - 1);
    } else if (
      direction === "down" &&
      thumbnailStartIndex + visibleThumbnails < imageUrls.length
    ) {
      setThumbnailStartIndex((prev) => prev + 1);
    }
  };

  const getDisplayName = () => chatInfo.name;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center"
      style={{ backgroundColor: "rgba(0,0,0,0.75)" }}
    >
      <div
        className="relative rounded-lg shadow-lg max-w-3xl w-full h-[500px] overflow-hidden flex items-center justify-center"
        style={{ backgroundColor }}
      >
        <div
          className="absolute inset-0 z-0"
          style={{
            backgroundImage: `url(${imageUrls[currentImageIndex]})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
            filter: "blur(20px)",
            transform: "scale(1.2)",
            opacity: 0.6,
          }}
        ></div>

        {imageUrls[currentImageIndex] && (
          <img
            src={imageUrls[currentImageIndex]}
            alt="Seçili Görsel"
            className="relative z-10 max-h-full max-w-full object-contain rounded-lg"
          />
        )}

        <button
          onClick={onClose}
          className="absolute top-4 right-4 w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center hover:bg-gray-300 transition z-50"
        >
          <FiX size={20} className="text-gray-600" />
        </button>

        <input
          type="file"
          multiple
          accept="image/*"
          ref={fileInputRef}
          className="hidden"
          onChange={handleAddImages}
        />

        <div className="absolute right-4 top-20 z-20 flex flex-col space-y-2 items-center">
          {thumbnailStartIndex > 0 && (
            <button
              className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center hover:bg-gray-300 transition z-50"
              onClick={() => handleThumbnailScroll("up")}
            >
              <IoIosArrowUp size={20} className="text-gray-600" />
            </button>
          )}
          {imageUrls
            .slice(thumbnailStartIndex, thumbnailStartIndex + visibleThumbnails)
            .map((url, index) => (
              <div key={index} className="relative">
                <img
                  src={url}
                  alt={`Küçük Resim ${index}`}
                  className={`w-12 h-12 object-cover rounded cursor-pointer ${
                    index + thumbnailStartIndex === currentImageIndex
                      ? "ring-2 ring-blue-500"
                      : ""
                  }`}
                  onClick={() =>
                    setCurrentImageIndex(index + thumbnailStartIndex)
                  }
                />
                {index + thumbnailStartIndex === currentImageIndex && (
                  <button
                    className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 hover:bg-opacity-70 transition text-white"
                    onClick={() =>
                      handleDeleteImage(index + thumbnailStartIndex)
                    }
                  >
                    <FiTrash size={24} />
                  </button>
                )}
              </div>
            ))}
          {thumbnailStartIndex + visibleThumbnails < imageUrls.length && (
            <button
              className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center hover:bg-gray-300 transition z-50"
              onClick={() => handleThumbnailScroll("down")}
            >
              <IoIosArrowDown size={20} className="text-gray-600" />
            </button>
          )}
        </div>

        <div
          className="absolute bottom-0 z-20 flex items-center justify-between w-full px-6 py-4"
          style={{
            background:
              "linear-gradient(to top, rgba(0,0,0,0.8), rgba(0,0,0,0))",
          }}
        >
          <span className="text-white text-sm font-medium px-3 py-1 rounded-lg bg-gray-700">
            {getDisplayName()}
          </span>

          <button
            onClick={() => onSend(popupImages)}
            className="flex items-center space-x-2 px-4 py-2 bg-blue-500 text-white rounded-full shadow-md hover:bg-blue-600 transition text-sm h-10"
          >
            <FiSend size={16} />
            <span>Gönder</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default ImagePopupForChatBox;
