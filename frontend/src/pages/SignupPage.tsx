import React from "react";
import SignupPageLeftComponent from "../components/Signup/Left/SignupPageLeftComponent";
import SignupPageRightComponent from "../components/Signup/Right/SignupPageRightComponent";

const SignupPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-200 flex items-center justify-center p-4">
      {/* On mobile, stack vertically; on md+ display side by side */}
      <div className="flex flex-col md:flex-row gap-6 w-full max-w-5xl">
        <SignupPageLeftComponent />
        <SignupPageRightComponent />
      </div>
    </div>
  );
};

export default SignupPage;
