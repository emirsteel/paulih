import React from "react";

const PasswordSecurity: React.FC = () => {
  return (
    <div>
      <h2 className="text-lg font-bold text-gray-600 mb-4">
        Password & Security
      </h2>
      <form className="bg-gray-100 p-4 rounded-lg shadow">
        <div className="mb-4">
          <label htmlFor="password" className="block text-sm font-medium">
            New Password
          </label>
          <input
            id="password"
            type="password"
            className="mt-1 block w-full p-2 border border-gray-300 rounded-lg"
          />
        </div>
        <div className="mb-4">
          <label
            htmlFor="confirmPassword"
            className="block text-sm font-medium"
          >
            Confirm New Password
          </label>
          <input
            id="confirmPassword"
            type="password"
            className="mt-1 block w-full p-2 border border-gray-300 rounded-lg"
          />
        </div>
        <button
          type="submit"
          className="bg-blue-500 text-white px-4 py-2 rounded-lg shadow hover:bg-blue-600"
        >
          Update Password
        </button>
      </form>
    </div>
  );
};

export default PasswordSecurity;
