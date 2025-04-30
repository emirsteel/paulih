import React, { useState, useEffect } from "react";
import { updateVenuePaymentMethod } from "../services/api";
import {
  FaCcVisa,
  FaCcMastercard,
  FaPaypal,
  FaMoneyBillWave,
  FaCreditCard,
} from "react-icons/fa";
import { SiTicketmaster } from "react-icons/si";

// Define payment methods with icons
const paymentOptions = [
  {
    id: "Kredi / Banka Kartı",
    name: "Kredi / Banka Kartı",
    icon: <FaCreditCard className="text-gray-700 text-2xl" />,
  },
];

interface SupplierPaymentMethodsProps {
  venueId: string;
  initialMethods: string[];
}

const SupplierPaymentMethods: React.FC<SupplierPaymentMethodsProps> = ({
  venueId,
  initialMethods,
}) => {
  const [selectedMethods, setSelectedMethods] =
    useState<string[]>(initialMethods);
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  useEffect(() => {
    setSelectedMethods(initialMethods);
  }, [initialMethods]);

  const handleMethodToggle = (methodId: string) => {
    const methodName = paymentOptions.find(
      (option) => option.id === methodId
    )?.name;
    if (!methodName) return; // Ensure valid selection

    setSelectedMethods((prevMethods) =>
      prevMethods.includes(methodName)
        ? prevMethods.filter((m) => m !== methodName)
        : [...prevMethods, methodName]
    );
  };

  const handleSaveChanges = async () => {
    setErrorMessage("");
    setSuccessMessage("");

    if (!venueId) {
      setErrorMessage("Venue ID is missing!");
      return;
    }

    try {
      await updateVenuePaymentMethod(venueId, selectedMethods);
      setSuccessMessage("✅ Payment methods updated successfully!");
    } catch (error) {
      setErrorMessage("❌ Failed to update payment methods.");
      console.error("Error updating payment methods:", error);
    }
  };

  return (
    <div className="p-6 bg-gray-50 shadow-md rounded-lg border border-gray-200">
      <h2 className="text-2xl font-semibold mb-4 text-gray-800">
        Ödeme Yöntemleri
      </h2>

      {/* ✅ Display error/success messages */}
      {errorMessage && (
        <p className="text-red-500 text-sm mb-2">{errorMessage}</p>
      )}
      {successMessage && (
        <p className="text-green-500 text-sm mb-2">{successMessage}</p>
      )}

      {/* Payment Methods Selection */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {paymentOptions.map((option) => (
          <label
            key={option.id}
            className={`flex flex-col items-center p-4 rounded-lg shadow-md cursor-pointer transition duration-200
            ${
              selectedMethods.includes(option.name)
                ? "border-2 border-blue-500 bg-blue-50"
                : "border border-gray-300 bg-white hover:bg-gray-100"
            }`}
          >
            <input
              type="checkbox"
              checked={selectedMethods.includes(option.name)}
              onChange={() => handleMethodToggle(option.id)}
              className="hidden"
            />
            <div className="text-3xl">{option.icon}</div>
            <span className="text-sm font-medium text-gray-800 mt-2">
              {option.name}
            </span>
          </label>
        ))}
      </div>

      {/* Live Preview */}
      {selectedMethods.length > 0 && (
        <div className="mt-6 p-4 border rounded-lg bg-white shadow-md">
          <h3 className="text-lg font-semibold text-gray-800 mb-2">
            Seçili Ödeme Yöntemleri
          </h3>
          <p className="text-sm text-gray-700">{selectedMethods.join(" · ")}</p>
        </div>
      )}

      {/* Save Button */}
      <button
        onClick={handleSaveChanges}
        className="mt-6 w-full bg-blue-600 text-white py-2 rounded-md font-semibold text-lg hover:bg-blue-700 transition"
      >
        Kaydet
      </button>
    </div>
  );
};

export default SupplierPaymentMethods;
