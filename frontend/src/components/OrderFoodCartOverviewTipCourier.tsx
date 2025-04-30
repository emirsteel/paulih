import React, { useState } from "react";

interface TipProps {
  setTipAmount: (amount: number) => void;
}

const OrderFoodCartOverviewTipCourier: React.FC<TipProps> = ({
  setTipAmount,
}) => {
  const [selectedTip, setSelectedTip] = useState<number | null>(0);
  const [customTip, setCustomTip] = useState("");

  const handleTipSelect = (amount: number) => {
    setSelectedTip(amount);
    setCustomTip("");
    setTipAmount(amount); // ✅ Send tip amount to parent
  };

  const handleCustomTipChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (!isNaN(Number(value)) && Number(value) >= 0) {
      setCustomTip(value);
      setSelectedTip(null);
      setTipAmount(Number(value)); // ✅ Send custom tip to parent
    }
  };

  return (
    <div className="mb-6 mt-5 bg-white p-4 rounded-lg shadow-md">
      <h3 className="text-lg font-semibold text-gray-900 mb-2">
        Tip for Courier
      </h3>

      <div className="flex items-center bg-gray-100 p-3 rounded-lg">
        <div className="w-6 h-6 rounded-full bg-gray-400 flex items-center justify-center mr-2">
          <span className="text-white text-sm">❤️</span>
        </div>
        <p className="text-gray-600 text-sm">
          Your tips directly support our couriers, who are hardworking students.
        </p>
      </div>

      <div className="flex justify-between items-center mt-3">
        <div className="flex space-x-2">
          {[0, 0.75, 1, 2].map((amount) => (
            <button
              key={amount}
              className={`px-4 py-2 text-sm border rounded-full transition ${
                selectedTip === amount
                  ? "bg-blue-500 text-white"
                  : "border-gray-300 text-gray-700 hover:border-blue-400"
              }`}
              onClick={() => handleTipSelect(amount)}
            >
              €{amount}
            </button>
          ))}
          <div className="relative">
            <input
              type="text"
              placeholder="Other"
              value={customTip}
              onChange={handleCustomTipChange}
              className="w-16 px-3 py-2 border border-gray-300 rounded-full text-sm focus:border-blue-400 focus:outline-none"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderFoodCartOverviewTipCourier;
