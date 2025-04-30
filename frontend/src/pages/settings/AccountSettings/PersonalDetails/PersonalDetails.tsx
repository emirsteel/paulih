import React from "react";

const PersonalDetails: React.FC = () => {
  return (
    <div>
      <h2 className="text-lg font-bold text-gray-600 mb-4">Personal Details</h2>
      <div className="bg-gray-100 p-4 rounded-lg shadow">
        <p>
          <strong>Name:</strong> John Doe
        </p>
        <p>
          <strong>Username:</strong> johndoe
        </p>
        <p>
          <strong>Email:</strong> johndoe@example.com
        </p>
      </div>
    </div>
  );
};

export default PersonalDetails;
