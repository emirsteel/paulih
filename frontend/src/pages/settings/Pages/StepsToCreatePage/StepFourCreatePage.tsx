import React from "react";
import { FaLink } from "react-icons/fa";

const StepFourCreatePage: React.FC<{
  formData: any;
  handleChange: any;
  handleNext: any;
  handlePrevious: any;
}> = ({ formData, handleChange, handleNext, handlePrevious }) => (
  <div>
    <h2 className="text-xl font-semibold mb-4">
      Step 4: Social Media and Business Details
    </h2>

    <div className="mb-4">
      <label className="block text-sm font-medium mb-2">Website URL</label>
      <div className="relative">
        <FaLink className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
        <input
          type="url"
          value={formData.websiteURL}
          onChange={handleChange("websiteURL")}
          className="w-full p-2 pl-10 border rounded-lg"
          placeholder="Enter website URL"
        />
      </div>
    </div>

    <div className="mb-4">
      <label className="block text-sm font-medium mb-2">Facebook</label>
      <div className="relative">
        <FaLink className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
        <input
          type="url"
          value={formData.socialMediaProfiles.facebook}
          onChange={handleChange("socialMediaProfiles.facebook")}
          className="w-full p-2 pl-10 border rounded-lg"
          placeholder="Enter Facebook URL"
        />
      </div>
    </div>

    <div className="mb-4">
      <label className="block text-sm font-medium mb-2">Twitter</label>
      <div className="relative">
        <FaLink className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
        <input
          type="url"
          value={formData.socialMediaProfiles.twitter}
          onChange={handleChange("socialMediaProfiles.twitter")}
          className="w-full p-2 pl-10 border rounded-lg"
          placeholder="Enter Twitter URL"
        />
      </div>
    </div>

    <div className="mb-4">
      <label className="block text-sm font-medium mb-2">Instagram</label>
      <div className="relative">
        <FaLink className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
        <input
          type="url"
          value={formData.socialMediaProfiles.instagram}
          onChange={handleChange("socialMediaProfiles.instagram")}
          className="w-full p-2 pl-10 border rounded-lg"
          placeholder="Enter Instagram URL"
        />
      </div>
    </div>

    <div className="mb-4">
      <label className="block text-sm font-medium mb-2">LinkedIn</label>
      <div className="relative">
        <FaLink className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
        <input
          type="url"
          value={formData.socialMediaProfiles.linkedin}
          onChange={handleChange("socialMediaProfiles.linkedin")}
          className="w-full p-2 pl-10 border rounded-lg"
          placeholder="Enter LinkedIn URL"
        />
      </div>
    </div>

    <div className="mb-4">
      <label className="block text-sm font-medium mb-2">YouTube</label>
      <div className="relative">
        <FaLink className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
        <input
          type="url"
          value={formData.socialMediaProfiles.youtube}
          onChange={handleChange("socialMediaProfiles.youtube")}
          className="w-full p-2 pl-10 border rounded-lg"
          placeholder="Enter YouTube URL"
        />
      </div>
    </div>

    <div className="mb-4">
      <label className="block text-sm font-medium mb-2">Other</label>
      <div className="relative">
        <FaLink className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
        <input
          type="url"
          value={formData.socialMediaProfiles.other}
          onChange={handleChange("socialMediaProfiles.other")}
          className="w-full p-2 pl-10 border rounded-lg"
          placeholder="Enter any other social media or relevant link"
        />
      </div>
    </div>

    {/* Buttons */}
    <div className="space-y-2">
      <button
        onClick={handleNext}
        className="w-full bg-blue-600 text-white px-4 py-2 rounded-lg"
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

export default StepFourCreatePage;
