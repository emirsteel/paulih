import React from "react";
import CourierLoginLeftComponent from "../components/CourierLoginLeftComponent";
import CourierLoginRightComponent from "../components/CourierLoginRightComponent";

const CourierLoginPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-200 flex items-center justify-center p-4">
      {/* On mobile, stack vertically; on md+ display side by side */}
      <div className="flex flex-col md:flex-row gap-6 w-full max-w-5xl">
        <CourierLoginLeftComponent />
        <CourierLoginRightComponent />
      </div>
    </div>
  );
};

export default CourierLoginPage;
