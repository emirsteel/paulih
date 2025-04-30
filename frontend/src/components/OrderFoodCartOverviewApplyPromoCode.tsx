import React, { useState } from "react";
import { applyPromoCode } from "../services/api";

interface OrderFoodCartOverviewApplyPromoCodeProps {
  total: number;
  setDiscount: (discount: number) => void;
  setPromoCode: (code: string) => void;
}

const OrderFoodCartOverviewApplyPromoCode: React.FC<
  OrderFoodCartOverviewApplyPromoCodeProps
> = ({ total, setDiscount, setPromoCode }) => {
  const [promoCodeInput, setPromoCodeInput] = useState<string>("");
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleApplyPromoCode = () => {
    if (!promoCodeInput) {
      setErrorMessage("Please enter a promo code.");
      return;
    }

    applyPromoCode(promoCodeInput, total)
      .then((response) => {
        setDiscount(response.discount);
        setPromoCode(promoCodeInput);
        setSuccessMessage(
          `Promo code applied! You saved €${response.discount.toFixed(2)}.`
        );
        setErrorMessage(null);
      })
      .catch((error) => {
        setSuccessMessage(null);
        setErrorMessage(error.response?.data?.error || "Invalid promo code.");
      });
  };

  return (
    <div className="mb-6 mt-5 bg-white p-4 rounded-lg shadow-md">
      <h3 className="text-lg font-semibold text-gray-900 mb-2">
        Have a Promo Code?
      </h3>

      <div className="relative flex items-center w-full">
        <input
          type="text"
          id="promo-code"
          className="w-full px-4 pt-3 pb-1 border border-gray-300 rounded-lg shadow focus:outline-none transition peer"
          value={promoCodeInput}
          onChange={(e) => setPromoCodeInput(e.target.value)}
        />
        <label
          htmlFor="promo-code"
          className={`absolute left-4 px-1 bg-white text-sm transition-all duration-200 
            ${promoCodeInput ? "-top-2 text-blue-500" : "top-3 text-gray-400"}
            peer-focus:-top-2 peer-focus:text-blue-500`}
        >
          Enter Promo Code
        </label>
        <button
          className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-blue-500 text-white text-sm px-3 py-1 rounded-md hover:bg-blue-600 transition"
          onClick={handleApplyPromoCode}
        >
          Apply
        </button>
      </div>

      {successMessage && (
        <p className="text-green-600 text-sm mt-2">{successMessage}</p>
      )}
      {errorMessage && (
        <p className="text-red-500 text-sm mt-2">{errorMessage}</p>
      )}
    </div>
  );
};

export default OrderFoodCartOverviewApplyPromoCode;
