import React, { useState, useEffect } from "react";
import Cropper from "react-easy-crop";
import getCroppedImg from "./cropImageHelper";
import Modal from "react-modal";

const StepTwoCreatePage: React.FC<{
  stepTwoData: any;
  handleStepTwoChange: any;
  handleNext: any;
  handlePrevious: any;
}> = ({ stepTwoData, handleStepTwoChange, handleNext, handlePrevious }) => {
  const [isNextEnabled, setIsNextEnabled] = useState(false);
  const [currentTag, setCurrentTag] = useState("");
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);
  const [selectedFile, setSelectedFile] = useState<string | null>(null);
  const [cropField, setCropField] = useState<"picture" | "banner" | null>(null);
  const [isCropModalOpen, setIsCropModalOpen] = useState(false);

  useEffect(() => {
    setIsNextEnabled(!!stepTwoData.banner && !!stepTwoData.picture);
  }, [stepTwoData.banner, stepTwoData.picture]);

  const handleFileChange = (field: "picture" | "banner") => (event: any) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        setSelectedFile(reader.result as string);
        setCropField(field);
        setIsCropModalOpen(true);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleCropComplete = (croppedArea: any, croppedAreaPixels: any) => {
    setCroppedAreaPixels(croppedAreaPixels);
  };

  const handleSaveCroppedImage = async () => {
    if (selectedFile && croppedAreaPixels && cropField) {
      const croppedImage = await getCroppedImg(selectedFile, croppedAreaPixels);
      handleStepTwoChange(cropField)({
        target: { value: croppedImage },
      });
      setSelectedFile(null);
      setCropField(null);
      setIsCropModalOpen(false);
    }
  };

  const handleCancelCrop = () => {
    setSelectedFile(null);
    setCropField(null);
    setIsCropModalOpen(false);
  };

  const handleAddTag = () => {
    if (currentTag.trim() === "") return;

    const newTags = [...(stepTwoData.tags || []), currentTag.trim()];
    handleStepTwoChange("tags")({
      target: { value: newTags },
    });
    setCurrentTag("");
  };

  const handleRemoveTag = (index: number) => {
    const newTags = stepTwoData.tags.filter(
      (_: string, i: number) => i !== index
    );
    handleStepTwoChange("tags")({
      target: { value: newTags },
    });
  };

  const handleKeyDown = (event: React.KeyboardEvent) => {
    if (event.key === "," || event.key === "Enter") {
      event.preventDefault();
      handleAddTag();
    }
  };

  return (
    <div>
      <h2 className="text-xl font-semibold mb-4">
        Step 2: SEO & Visual Content
      </h2>

      {/* Company Picture */}
      <div className="mb-4">
        <label className="block text-sm font-medium mb-2">
          Company Picture <span className="text-red-600">*</span>
        </label>
        <input
          type="file"
          accept="image/*"
          onChange={handleFileChange("picture")}
          className="w-full p-2 border rounded-lg"
        />
        {stepTwoData.picture && (
          <div className="mt-4">
            <img
              src={stepTwoData.picture}
              alt="Company Picture"
              className="w-32 h-32 object-cover border rounded-lg"
            />
          </div>
        )}
      </div>

      {/* Crop Modal */}
      {isCropModalOpen && (
        <Modal
          isOpen={isCropModalOpen}
          onRequestClose={handleCancelCrop}
          className="fixed inset-0 flex items-center justify-center"
          overlayClassName="fixed inset-0 bg-black bg-opacity-50"
        >
          <div className="bg-white rounded-lg shadow-lg p-6 w-96">
            <h3 className="text-lg font-semibold mb-4 text-gray-800">
              Crop {cropField === "picture" ? "Picture" : "Banner"}
            </h3>
            <div className="relative h-56 bg-gray-200 rounded-md">
              <Cropper
                image={selectedFile}
                crop={crop}
                zoom={zoom}
                aspect={cropField === "picture" ? 1 : 16 / 9}
                cropShape={cropField === "picture" ? "round" : "rect"}
                onCropChange={setCrop}
                onZoomChange={setZoom}
                onCropComplete={handleCropComplete}
              />
            </div>
            <div className="flex flex-col gap-2 mt-4">
              <button
                onClick={handleSaveCroppedImage}
                className="w-full px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition"
              >
                Save
              </button>
              <button
                onClick={handleCancelCrop}
                className="w-full px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition"
              >
                Cancel
              </button>
            </div>
          </div>
        </Modal>
      )}

      {/* Company Banner */}
      <div className="mb-4">
        <label className="block text-sm font-medium mb-2">
          Company Banner <span className="text-red-600">*</span>
        </label>
        <input
          type="file"
          accept="image/*"
          onChange={handleFileChange("banner")}
          className="w-full p-2 border rounded-lg"
        />
        {stepTwoData.banner && (
          <div className="mt-4">
            <img
              src={stepTwoData.banner}
              alt="Company Banner"
              className="w-full h-48 object-cover border rounded-lg"
            />
          </div>
        )}
      </div>

      {/* Tags Input */}
      <div className="mb-4">
        <label className="block text-sm font-medium mb-2">Tags</label>
        <div className="flex flex-wrap gap-2 mb-2">
          {(stepTwoData.tags || []).map((tag: string, index: number) => (
            <span
              key={index}
              className="bg-blue-100 text-blue-600 px-3 py-1 rounded-full border border-blue-600 flex items-center"
            >
              {tag}
              <button
                type="button"
                onClick={() => handleRemoveTag(index)}
                className="ml-2 text-red-600"
              >
                &times;
              </button>
            </span>
          ))}
        </div>
        <input
          type="text"
          value={currentTag}
          onChange={(e) => setCurrentTag(e.target.value)}
          onKeyDown={handleKeyDown}
          className="w-full p-2 border rounded-lg"
          placeholder="Type a tag and press Enter or Comma"
        />
      </div>
      {/* Full-Width Buttons */}
      <div className="space-y-2">
        <button
          onClick={handleNext}
          disabled={!isNextEnabled}
          className={`w-full px-4 py-2 rounded-lg ${
            !isNextEnabled
              ? "bg-gray-400 text-gray-700 cursor-not-allowed"
              : "bg-blue-600 text-white"
          }`}
        >
          Next
        </button>
        <button
          onClick={handlePrevious}
          className="w-full bg-gray-300 text-gray-700 px-4 py-2 rounded-lg"
        >
          Back
        </button>
      </div>
    </div>
  );
};

export default StepTwoCreatePage;
