import React from "react";
import LoginPageLeftComponent from "../components/Login/Left/LoginPageLeftComponent";
import LoginPageRightComponent from "../components/Login/Right/LoginPageRightComponent";

const LoginPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-200 flex items-center justify-center p-8">
      {/* On mobile stack vertically; on md+ display side by side */}
      <div className="flex flex-col md:flex-row gap-6 w-full max-w-5xl">
        <LoginPageLeftComponent />
        <LoginPageRightComponent />
      </div>
    </div>
  );
};

export default LoginPage;
