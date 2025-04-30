// src/pages/ForgotPasswordPage.tsx
import React from "react";
import SignupPageLeftComponent from "../components/Signup/Left/SignupPageLeftComponent"; // Reuse left component
import ForgotPasswordRightComponent from "../components/ForgotPasswordRightComponent";

const ForgotPasswordPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-200 flex items-center justify-center p-8">
      {/* On mobile stack vertically; on md+ display side by side */}
      <div className="flex flex-col md:flex-row gap-6 w-full max-w-5xl">
        <SignupPageLeftComponent />
        <ForgotPasswordRightComponent />
      </div>
    </div>
  );
};

export default ForgotPasswordPage;
