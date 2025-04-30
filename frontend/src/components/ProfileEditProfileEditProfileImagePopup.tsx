import React, { useState, useCallback } from "react";
import Cropper from "react-easy-crop";
import { X } from "lucide-react";

interface ProfileEditProfileEditProfileImagePopupProps {
  isOpen: boolean;
  imageFile: File;
  onClose: () => void;
  onSave: (croppedFile: File) => void;
}

interface Crop {
  x: number;
  y: number;
}

const ProfileEditProfileEditProfileImagePopup: React.FC<
  ProfileEditProfileEditProfileImagePopupProps
> = ({ isOpen, imageFile, onClose, onSave }) => {
  const [crop, setCrop] = useState<Crop>({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<any>(null);

  const onCropComplete = useCallback((_: Crop, croppedAreaPixels: any) => {
    setCroppedAreaPixels(croppedAreaPixels);
  }, []);

  // Helper to create an HTMLImageElement from a URL.
  const createImage = (url: string): Promise<HTMLImageElement> =>
    new Promise((resolve, reject) => {
      const image = new Image();
      image.addEventListener("load", () => resolve(image));
      image.addEventListener("error", (error) => reject(error));
      image.setAttribute("crossOrigin", "anonymous");
      image.src = url;
    });

  // Generate cropped image using canvas.
  const getCroppedImg = async (
    imageSrc: string,
    pixelCrop: any
  ): Promise<File> => {
    const image = await createImage(imageSrc);
    const canvas = document.createElement("canvas");
    const diameter = pixelCrop.width; // assuming square crop
    canvas.width = diameter;
    canvas.height = diameter;
    const ctx = canvas.getContext("2d");

    // Draw the cropped area onto the canvas
    ctx?.drawImage(
      image,
      pixelCrop.x,
      pixelCrop.y,
      pixelCrop.width,
      pixelCrop.height,
      0,
      0,
      diameter,
      diameter
    );

    return new Promise((resolve, reject) => {
      canvas.toBlob((blob) => {
        if (blob) {
          const croppedFile = new File([blob], "cropped.jpeg", {
            type: "image/jpeg",
          });
          resolve(croppedFile);
        } else {
          reject(new Error("Canvas is empty"));
        }
      }, "image/jpeg");
    });
  };

  const onSaveClick = async () => {
    const imageUrl = URL.createObjectURL(imageFile);
    try {
      const croppedFile = await getCroppedImg(imageUrl, croppedAreaPixels);
      onSave(croppedFile);
    } catch (error) {
      console.error(error);
    }
  };

  if (!isOpen) return null;

  const imageUrl = URL.createObjectURL(imageFile);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg w-full max-w-lg p-4 relative">
        {/* Header with title on left and close button on right */}
        <div className="flex justify-between items-center pb-2 border-b border-gray-300 mb-4">
          <h2 className="text-lg font-semibold text-gray-700">
            Crop Profile Image
          </h2>
          <button
            onClick={onClose}
            className="bg-gray-200 rounded-full p-1 hover:bg-gray-300 transition"
          >
            <X size={20} className="text-gray-600" />
          </button>
        </div>
        <div className="relative w-full h-64 bg-gray-100">
          <Cropper
            image={imageUrl}
            crop={crop}
            zoom={zoom}
            aspect={1}
            cropShape="round"
            showGrid={false}
            onCropChange={setCrop}
            onZoomChange={setZoom}
            onCropComplete={onCropComplete}
          />
        </div>
        <div className="mt-4">
          <button
            onClick={onSaveClick}
            className="w-full px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProfileEditProfileEditProfileImagePopup;
