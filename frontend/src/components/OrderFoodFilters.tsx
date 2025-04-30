import React, { useState } from "react";
import { RefreshCcw, Filter } from "lucide-react";

interface OrderFoodFiltersProps {
  onApply: (
    selectedCuisines: string[],
    basketValue: number,
    deliveryType: string,
    rating: string,
    paymentMethod: string
  ) => void;
  onCancel: () => void;
}

const OrderFoodFilters: React.FC<OrderFoodFiltersProps> = ({
  onApply,
  onCancel,
}) => {
  const deliveryTypes = ["Adrese Teslim"];
  const cuisines = ["Burger", "Pizza", "Döner", "Sushi", "Makarna"];
  const paymentMethods = ["Kredi Kartı"];
  const ratings = ["4.5 Yıldız & Üstü", "4 Yıldız & Üstü", "3 Yıldız & Üstü"];

  const [selectedCuisines, setSelectedCuisines] = useState<string[]>([]);
  const [selectedDeliveryType, setSelectedDeliveryType] = useState<string>("");
  const [selectedRating, setSelectedRating] = useState<string>("");
  const [selectedPaymentMethod, setSelectedPaymentMethod] =
    useState<string>("");
  const [basketValue, setBasketValue] = useState<number>(50); // Default basket value
  const [isFilterOpen, setIsFilterOpen] = useState(false); // Modal state

  // Simulating database values for min and max basket amounts
  const minBasketAmount = 10;
  const maxBasketAmount = 100;

  const toggleCuisine = (cuisine: string) => {
    setSelectedCuisines((prev) =>
      prev.includes(cuisine)
        ? prev.filter((item) => item !== cuisine)
        : [...prev, cuisine]
    );
  };

  const resetFilters = () => {
    setSelectedCuisines([]);
    setSelectedDeliveryType("");
    setSelectedRating("");
    setSelectedPaymentMethod("");
    setBasketValue((minBasketAmount + maxBasketAmount) / 2); // Reset basket to default midpoint value
    onCancel(); // Reset venues
    setIsFilterOpen(false); // Close modal
  };

  const handleSingleSelect = (
    selected: string,
    setSelected: React.Dispatch<React.SetStateAction<string>>
  ) => {
    setSelected((prev) => (prev === selected ? "" : selected));
  };

  const renderSingleSelectItems = (
    items: string[],
    selected: string,
    setSelected: React.Dispatch<React.SetStateAction<string>>
  ) => (
    <ul className="space-y-2">
      {items.map((item) => (
        <li key={item} className="group">
          <button
            onClick={() => handleSingleSelect(item, setSelected)}
            className={`flex items-center px-3 py-2 rounded-lg text-sm transition w-full ${
              selected === item
                ? "bg-blue-50 text-blue-600 font-medium"
                : "text-gray-600 hover:bg-gray-100 hover:text-gray-800"
            }`}
          >
            <div
              className={`w-6 h-6 mr-3 flex-shrink-0 rounded-full flex items-center justify-center transition-transform duration-200 ${
                selected === item
                  ? "bg-blue-600 text-white scale-110"
                  : "bg-gray-200 scale-100"
              }`}
            >
              {selected === item && (
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
            <span>{item}</span>
          </button>
        </li>
      ))}
    </ul>
  );

  const renderFilterItems = (items: string[]) => (
    <ul className="space-y-2">
      {items.map((item) => (
        <li key={item} className="group">
          <button
            onClick={() =>
              setSelectedCuisines((prev) =>
                prev.includes(item)
                  ? prev.filter((i) => i !== item)
                  : [...prev, item]
              )
            }
            className={`flex items-center px-3 py-2 rounded-lg text-sm transition w-full ${
              selectedCuisines.includes(item)
                ? "bg-blue-50 text-blue-600 font-medium"
                : "text-gray-600 hover:bg-gray-100 hover:text-gray-800"
            }`}
          >
            <div
              className={`w-6 h-6 mr-3 flex-shrink-0 rounded-sm flex items-center justify-center transition-transform duration-200 ${
                selectedCuisines.includes(item)
                  ? "bg-blue-600 text-white scale-110"
                  : "bg-gray-200 scale-100"
              }`}
            >
              {selectedCuisines.includes(item) && (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="w-4 h-4"
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
            <span>{item}</span>
          </button>
        </li>
      ))}
    </ul>
  );

  return (
    <>
      {/* Filters Button for Mobile */}
      <div className="md:hidden mb-4">
        <button
          onClick={() => setIsFilterOpen(true)}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-600 transition"
        >
          Filtreler
        </button>
      </div>

      {/* Filters Section for Desktop */}
      <div className="hidden md:block bg-white p-4 rounded-lg shadow-lg w-full flex flex-col justify-between h-full">
        <div>
          <h3 className="font-semibold text-gray-700 mb-2">Mutfaklar</h3>
          {renderFilterItems(cuisines)}

          <h3 className="font-semibold text-gray-700 mt-4 mb-2">
            Minimum Sepet Tutarı
          </h3>
          <input
            type="range"
            min={minBasketAmount}
            max={maxBasketAmount}
            value={basketValue}
            onChange={(e) => setBasketValue(Number(e.target.value))}
            className="w-full cursor-pointer"
          />
          <div className="flex justify-between text-sm text-gray-600">
            <span>₺{minBasketAmount}</span>
            <span>₺{maxBasketAmount}</span>
          </div>
          <p className="text-sm text-gray-700 mt-2">
            Seçilen Minimum:{" "}
            <span className="text-blue-600 font-medium">₺{basketValue}</span>
          </p>

          <h3 className="font-semibold text-gray-700 mt-4 mb-2">
            Teslimat Türü
          </h3>
          {renderSingleSelectItems(
            deliveryTypes,
            selectedDeliveryType,
            setSelectedDeliveryType
          )}

          <h3 className="font-semibold text-gray-700 mt-4 mb-2">Puanlar</h3>
          {renderSingleSelectItems(ratings, selectedRating, setSelectedRating)}

          <h3 className="font-semibold text-gray-700 mt-4 mb-2">
            Ödeme Yöntemleri
          </h3>
          {renderSingleSelectItems(
            paymentMethods,
            selectedPaymentMethod,
            setSelectedPaymentMethod
          )}
        </div>
        {/* Stack buttons vertically */}
        <div className="flex flex-col mt-4 space-y-2">
          <button
            onClick={resetFilters}
            className="flex items-center justify-center px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition"
          >
            <RefreshCcw size={16} className="mr-2" />
            Filtreleri Sıfırla
          </button>
          <button
            onClick={() => {
              onApply(
                selectedCuisines,
                basketValue,
                selectedDeliveryType,
                selectedRating,
                selectedPaymentMethod
              );
            }}
            className="flex items-center justify-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
          >
            <Filter size={16} className="mr-2" />
            Filtreleri Uygula
          </button>
        </div>
      </div>

      {/* Filters Modal for Mobile */}
      {isFilterOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-11/12 max-w-lg h-[80vh] overflow-y-auto">
            <h3 className="text-lg font-bold mb-4">Filtreler</h3>
            <div>
              <h3 className="font-semibold text-gray-700 mb-2">Mutfaklar</h3>
              {renderFilterItems(cuisines)}

              <h3 className="font-semibold text-gray-700 mt-4 mb-2">
                Minimum Sepet Tutarı
              </h3>
              <input
                type="range"
                min={minBasketAmount}
                max={maxBasketAmount}
                value={basketValue}
                onChange={(e) => setBasketValue(Number(e.target.value))}
                className="w-full cursor-pointer"
              />
              <p className="text-sm text-gray-700">
                Seçilen Minimum: ₺{basketValue}
              </p>

              <h3 className="font-semibold text-gray-700 mt-4 mb-2">
                Teslimat Türü
              </h3>
              {renderSingleSelectItems(
                deliveryTypes,
                selectedDeliveryType,
                setSelectedDeliveryType
              )}

              <h3 className="font-semibold text-gray-700 mt-4 mb-2">Puanlar</h3>
              {renderSingleSelectItems(
                ratings,
                selectedRating,
                setSelectedRating
              )}

              <h3 className="font-semibold text-gray-700 mt-4 mb-2">
                Ödeme Yöntemleri
              </h3>
              {renderSingleSelectItems(
                paymentMethods,
                selectedPaymentMethod,
                setSelectedPaymentMethod
              )}
            </div>
            <div className="flex flex-col mt-4 space-y-2">
              <button
                onClick={resetFilters}
                className="flex items-center justify-center px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition"
              >
                <RefreshCcw size={16} className="mr-2" />
                Filtreleri Sıfırla
              </button>
              <button
                onClick={() => {
                  onApply(
                    selectedCuisines,
                    basketValue,
                    selectedDeliveryType,
                    selectedRating,
                    selectedPaymentMethod
                  );
                  setIsFilterOpen(false);
                }}
                className="flex items-center justify-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
              >
                <Filter size={16} className="mr-2" />
                Filtreleri Uygula
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default OrderFoodFilters;
