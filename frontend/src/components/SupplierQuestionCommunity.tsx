import React from "react";
import { DotLottieReact } from "@lottiefiles/dotlottie-react";

const SupplierQuestionCommunity: React.FC = () => {
  return (
    <div className="p-6 bg-gradient-to-b from-gray-100 to-gray-300 min-h-screen flex flex-col items-center justify-center">
      {/* "Coming Soon" Text */}
      <p className="text-amber-500 text-sm font-semibold mt-4 animate-pulse">
        Coming Soon...
      </p>

      {/* Lottie Animation (Increased Size) */}
      <div className="mt-3 w-full max-w-2xl">
        <DotLottieReact
          src="https://lottie.host/27bc0c2a-db0e-4872-8c96-1496f9e70d41/TDAIlKTkAZ.lottie"
          loop
          autoplay
          style={{ width: "100%", height: "500px" }} // Increased size
        />
      </div>
    </div>
  );
};

export default SupplierQuestionCommunity;
