import React from "react";
import { FaCheck } from "react-icons/fa";

interface StepProgressBarProps {
  step: number;
}

const StepProgressBar: React.FC<StepProgressBarProps> = ({ step }) => {
  return (
    <div className="flex items-center justify-between px-6 py-4 bg-white border border-gray-200 rounded-2xl shadow-sm mb-6">
      {/* Step 1 */}
      <div className="flex items-center space-x-2">
        <div
          className={`flex items-center justify-center w-8 h-8 rounded-full text-xs font-semibold ${
            step >= 1 ? "bg-blue-600 text-white" : "bg-gray-200 text-gray-500"
          } transition-all duration-300`}
        >
          {step > 1 ? <FaCheck size={12} /> : "1"}
        </div>
        <div className="flex flex-col leading-tight">
          <span className="text-xs text-gray-700">Temel Bilgiler</span>
          <span
            className={`text-[10px] ${
              step > 1 ? "text-green-500" : "text-gray-400"
            }`}
          >
            {step > 1 ? "Tamamlandı" : "Devam Ediyor"}
          </span>
        </div>
      </div>

      {/* Progress line */}
      <div className="flex-1 mx-2 h-0.5 bg-gray-200 relative">
        <div
          className={`absolute top-0 left-0 h-0.5 rounded-full ${
            step === 2 ? "w-full bg-blue-600" : "w-1/2 bg-blue-400"
          } transition-all duration-500`}
        ></div>
      </div>

      {/* Step 2 */}
      <div className="flex items-center space-x-2">
        <div
          className={`flex items-center justify-center w-8 h-8 rounded-full text-xs font-semibold ${
            step === 2 ? "bg-blue-600 text-white" : "bg-gray-200 text-gray-500"
          } transition-all duration-300`}
        >
          2
        </div>
        <div className="flex flex-col leading-tight">
          <span className="text-xs text-gray-700">Ek Bilgiler</span>
          <span
            className={`text-[10px] ${
              step === 2 ? "text-blue-500" : "text-gray-400"
            }`}
          >
            {step === 2 ? "Devam Ediyor" : "Bekliyor"}
          </span>
        </div>
      </div>
    </div>
  );
};

export default StepProgressBar;
