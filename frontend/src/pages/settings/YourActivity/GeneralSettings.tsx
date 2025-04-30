import React from "react";

const GeneralSettings: React.FC = () => {
  return (
    <div>
      <h2 className="text-lg font-bold text-gray-600 mb-4">General Settings</h2>
      <div className="bg-gray-100 p-4 rounded-lg shadow">
        <form>
          <div className="mb-4">
            <label htmlFor="language" className="block text-sm font-medium">
              Preferred Language
            </label>
            <select
              id="language"
              className="mt-1 block w-full p-2 border border-gray-300 rounded-lg"
            >
              <option value="en">English</option>
              <option value="fr">French</option>
              <option value="es">Spanish</option>
            </select>
          </div>
          <div className="mb-4">
            <label htmlFor="timezone" className="block text-sm font-medium">
              Time Zone
            </label>
            <select
              id="timezone"
              className="mt-1 block w-full p-2 border border-gray-300 rounded-lg"
            >
              <option value="utc-5">UTC -5</option>
              <option value="utc+0">UTC +0</option>
              <option value="utc+5">UTC +5</option>
            </select>
          </div>
          <button
            type="submit"
            className="bg-blue-500 text-white px-4 py-2 rounded-lg shadow hover:bg-blue-600"
          >
            Save Changes
          </button>
        </form>
      </div>
    </div>
  );
};

export default GeneralSettings;
