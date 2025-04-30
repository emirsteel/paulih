import React, { useEffect, useState } from "react";
import { FaArrowLeft } from "react-icons/fa";

interface OrderFoodCartOverviewCartProps {
  venue: {
    name: string;
  } | null;
  total: number;
  discount: number;
  promoCode: string;
  tipAmount: number; // ✅ Added tipAmount prop
}

const OrderFoodCartOverviewCart: React.FC<OrderFoodCartOverviewCartProps> = ({
  venue,
  total,
  discount,
  promoCode,
  tipAmount, // ✅ Receive tipAmount as prop
}) => {
  const [scrollY, setScrollY] = useState(0);
  const [cartPosition, setCartPosition] = useState(240);
  const [cartFixed, setCartFixed] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const currentScroll = window.scrollY;
      setCartFixed(currentScroll > 200);
      setCartPosition((prev) => prev + (currentScroll - scrollY) * 0.2);
      setScrollY(currentScroll);
    };

    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [scrollY]);

  return (
    <>
      <div className="absolute top-10 left-10 text-black">
        <button className="flex items-center bg-white text-black px-4 py-2 rounded-md shadow-md text-base">
          <FaArrowLeft className="mr-2" /> Back
        </button>
      </div>

      <div
        className={`w-96 transition-transform duration-500 ease-in-out ${
          cartFixed ? "fixed top-10 right-12" : "absolute right-12"
        }`}
        style={{ top: cartFixed ? "40px" : `${cartPosition}px` }}
      >
        <div className="bg-white p-5 shadow-lg rounded-lg text-base">
          <h3 className="text-lg font-bold">Prices in EUR</h3>
          <p className="text-sm text-gray-500">incl. taxes (if applicable)</p>
          <hr className="my-3" />

          <div className="flex justify-between text-gray-700 text-md">
            <span>Item subtotal</span>
            <span>€{total.toFixed(2)}</span>
          </div>
          <div className="flex justify-between text-gray-700 text-md">
            <span>Small order fee</span>
            <span>€1.81</span>
          </div>

          {/* ✅ Display Tip */}
          {tipAmount > 0 && (
            <div className="flex justify-between text-blue-600 text-md">
              <span>Tip for Courier</span>
              <span>€{tipAmount.toFixed(2)}</span>
            </div>
          )}

          {discount > 0 && (
            <div className="flex justify-between text-green-600 font-bold text-md">
              <span>Campaign · {promoCode}</span>
              <span>-€{discount.toFixed(2)}</span>
            </div>
          )}

          <hr className="my-3" />
          <div className="flex justify-between font-semibold text-xl">
            <span>Total</span>
            <span>
              €{Math.max(0, total + 1.81 - discount + tipAmount).toFixed(2)}
            </span>
          </div>
          <p className="text-sm text-blue-500 mt-3 cursor-pointer text-left">
            How fees work
          </p>
        </div>
      </div>
    </>
  );
};

export default OrderFoodCartOverviewCart;
