// src/pages/ResetPasswordPage.tsx
import React from "react";
import SignupPageLeftComponent from "../components/Signup/Left/SignupPageLeftComponent"; // Reusing the left component from Signup
import ResetPasswordPageRightComponent from "../components/ResetPasswordPageRightComponent";

const ResetPasswordPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-200 flex items-center justify-center p-8">
      <div className="flex flex-col md:flex-row gap-6 w-full max-w-5xl">
        <SignupPageLeftComponent />
        <ResetPasswordPageRightComponent />
      </div>
    </div>
  );
};

export default ResetPasswordPage;
