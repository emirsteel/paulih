import React from "react";

interface Address {
  _id: string;
  addressTitle: string;
  addressDescription: string;
  selectedTag: string;
  isSelected: boolean;
}

interface OrderFoodCartOverviewAddressProps {
  savedAddresses: Address[];
  selectedAddress: Address | null;
  handleSelectAddress: (address: Address) => void;
  setShowLocationPopup: (value: boolean) => void;
}

const OrderFoodCartOverviewAddress: React.FC<
  OrderFoodCartOverviewAddressProps
> = ({
  savedAddresses,
  selectedAddress,
  handleSelectAddress,
  setShowLocationPopup,
}) => {
  const getTagIcon = (tag: string) => {
    switch (tag) {
      case "home":
        return "🏡";
      case "heart":
        return "💖";
      case "work":
        return "🏢";
      case "school":
        return "🎓";
      default:
        return "📍";
    }
  };

  return (
    <div className="p-4 bg-white rounded-lg shadow-md">
      {/* Header with "Change Address" Button */}
      <div className="mb-3 flex justify-between items-center">
        <h2 className="text-lg font-medium text-gray-900">Kayıtlı Adresler</h2>

        {/* Change Address Button - Opens LocationPopup */}
        <button
          onClick={() => setShowLocationPopup(true)}
          className="text-amber-500 text-sm hover:underline"
        >
          Adresi Değiştir
        </button>
      </div>

      {/* List of Selected Address */}
      <ul className="space-y-2 overflow-y-auto max-h-64">
        {savedAddresses
          .filter((addr) => addr.isSelected) // ✅ Show only the selected address
          .map((addr) => (
            <li key={addr._id} className="group">
              <button
                onClick={() => handleSelectAddress(addr)}
                className={`flex items-center px-3 py-2 rounded-lg text-sm transition w-full relative ${
                  selectedAddress?._id === addr._id
                    ? "bg-blue-50 text-blue-600 font-medium"
                    : "text-gray-600 hover:bg-gray-100 hover:text-gray-800"
                }`}
              >
                {/* Left: Rounded Circle Selection Indicator */}
                <div
                  className={`w-6 h-6 mr-3 flex-shrink-0 rounded-full border-2 flex items-center justify-center transition-transform duration-200 ${
                    selectedAddress?._id === addr._id
                      ? "border-blue-500 bg-blue-500 text-white scale-110"
                      : "border-gray-200 bg-gray-200 scale-100"
                  }`}
                >
                  {selectedAddress?._id === addr._id && (
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
                  )}
                </div>

                {/* Address Title & Description */}
                <span className="flex flex-col text-left">
                  <span className="font-medium">
                    <span className="text-lg mr-1">
                      {getTagIcon(addr.selectedTag)}
                    </span>
                    {addr.addressTitle}
                  </span>
                  <span className="text-gray-500 text-xs">
                    {addr.addressDescription}
                  </span>
                </span>
              </button>
            </li>
          ))}
      </ul>
    </div>
  );
};

export default OrderFoodCartOverviewAddress;
