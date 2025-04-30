import React from "react";

const AdsPreferences: React.FC = () => {
  return (
    <div>
      <h2 className="text-lg font-bold text-gray-600 mb-4">Ads Preferences</h2>
      <div className="bg-gray-100 p-4 rounded-lg shadow">
        <p>Manage how ads are personalized for you:</p>
        <div className="mt-4">
          <label className="flex items-center space-x-3">
            <input
              type="checkbox"
              className="form-checkbox h-5 w-5 text-blue-600"
            />
            <span>Use my data for ad personalization</span>
          </label>
          <label className="flex items-center space-x-3 mt-2">
            <input
              type="checkbox"
              className="form-checkbox h-5 w-5 text-blue-600"
            />
            <span>Show ads based on my activity</span>
          </label>
          <div className="mt-4">
            <p className="text-sm text-gray-600">
              You can review and manage your ad interests in the ad settings
              section.
            </p>
            <button className="bg-blue-500 text-white px-4 py-2 rounded-lg shadow hover:bg-blue-600 mt-2">
              Manage Ad Interests
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdsPreferences;
