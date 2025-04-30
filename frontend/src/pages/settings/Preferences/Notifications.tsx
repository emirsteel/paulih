import React from "react";

const Notifications: React.FC = () => {
  return (
    <div>
      <h2 className="text-lg font-bold text-gray-600 mb-4">
        Notification Settings
      </h2>
      <div className="bg-gray-100 p-4 rounded-lg shadow">
        <p>Manage your notification preferences:</p>
        <div className="mt-4">
          <label className="flex items-center space-x-3">
            <input
              type="checkbox"
              className="form-checkbox h-5 w-5 text-blue-600"
            />
            <span>Email Notifications</span>
          </label>
          <label className="flex items-center space-x-3 mt-2">
            <input
              type="checkbox"
              className="form-checkbox h-5 w-5 text-blue-600"
            />
            <span>SMS Notifications</span>
          </label>
          <label className="flex items-center space-x-3 mt-2">
            <input
              type="checkbox"
              className="form-checkbox h-5 w-5 text-blue-600"
            />
            <span>Push Notifications</span>
          </label>
        </div>
      </div>
    </div>
  );
};

export default Notifications;
