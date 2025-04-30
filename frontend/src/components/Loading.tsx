import React from "react";
import { Bird } from "lucide-react";

const Loading: React.FC = () => {
  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-white text-gray-700">
      {/* Spinner */}
      <div className="w-6 h-6 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mb-6" />

      {/* Footer */}
      <div className="absolute bottom-8 text-center text-sm text-gray-500 font-medium">
        <div className="flex items-center justify-center space-x-2">
          <Bird className="w-4 h-4 text-gray-500" />
          <p className="text-sm font-semibold tracking-wide">PAULIH</p>
        </div>
        <p className="text-xs text-gray-400 mt-1">Yükleniyor... v1.0</p>
      </div>
    </div>
  );
};

export default Loading;
