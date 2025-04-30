import React from "react";

interface Venue {
  deliveryTime?: string;
  deliveryPrice?: string;
  minimumPayment?: string;
}

interface OrderFoodCartOverviewDeliveryMethodProps {
  venue: Venue | null;
}

const OrderFoodCartOverviewDeliveryMethod: React.FC<
  OrderFoodCartOverviewDeliveryMethodProps
> = ({ venue }) => {
  return (
    <div className="p-4 bg-white rounded-lg shadow-md mt-5">
      {/* Header */}
      <div className="flex justify-between items-center mb-3">
        <h2 className="text-lg font-semibold text-gray-900">
          Teslimat Yöntemi
        </h2>
      </div>

      {/* Notification */}
      <div className="flex items-center bg-gray-100 p-3 rounded-lg">
        <div className="w-6 h-6 rounded-full bg-gray-400 flex items-center justify-center mr-2">
          <span className="text-white text-sm">🛍️</span>
        </div>
        <p className="text-gray-600 text-sm">
          Paulih şu an sadece kendi kuryesiyle teslimat sunmaktadır!
        </p>
      </div>

      {/* Separator */}
      <hr className="my-3 border-gray-200" />

      {/* ✅ Delivery Option - Styled like Saved Addresses */}
      <div className="bg-blue-50 text-blue-600 font-medium px-3 py-2 rounded-lg w-full transition">
        <div className="flex items-center">
          {/* ✅ Left: Rounded Circle Selection Indicator - Blue Background & Border */}
          <div className="w-6 h-6 mr-3 flex-shrink-0 rounded-full border-2 border-blue-500 bg-blue-500 text-white flex items-center justify-center transition-transform duration-200">
            {/* ✅ Checkmark Icon */}
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="w-3 h-3"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M16.707 5.293a1 1 0 00-1.414 0L8 12.586l-3.293-3.293a1 1 0 00-1.414 1.414l4 4a 1 1 0 001.414 0l8-8a 1 1 0 000-1.414z"
                clipRule="evenodd"
              />
            </svg>
          </div>

          {/* ✅ Delivery Details */}
          <div className="flex-1">
            {/* Title */}
            <div className="flex items-center mb-1">
              <span className="w-5 h-5 flex items-center justify-center bg-green-600 text-white text-xs font-bold rounded-full mr-2">
                P
              </span>
              <p className="text-green-600 font-semibold">Paulih getirsin</p>
            </div>

            {/* ✅ Time & Cost - Dynamically Fetched */}
            <p className="text-gray-600 text-sm">
              {venue?.deliveryTime || "35-45 dk"} •{" "}
              {venue?.deliveryPrice === "₺0.00" ||
              venue?.deliveryPrice === "Free"
                ? "Getirmesi Ücretsiz"
                : `Getirme Ücreti ${venue?.deliveryPrice || "₺15.00"}`}{" "}
              • Min. {venue?.minimumPayment || "₺100"}
            </p>

            {/* Phone Notice */}
            <div className="flex items-center text-gray-600 text-sm mt-2">
              <span className="text-yellow-500 text-lg mr-2">💬</span>
              850’li bir numara detaylar için seni arayabilir.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderFoodCartOverviewDeliveryMethod;
