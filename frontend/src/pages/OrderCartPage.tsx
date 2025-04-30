import React, { useContext, useState } from "react";
import OrderCartOverview from "../components/OrderCartOverview";
import PaymentPageWrapper from "../components/PaymentPageWrapper";
import { AuthUserContext } from "../context/AuthUserContext";

const OrderCartPage: React.FC = () => {
  const [currentPhase, setCurrentPhase] = useState<"overview" | "payment">(
    "overview"
  );

  const { user, loading } = useContext(AuthUserContext); // Access user and loading state

  const handleProceedToPayment = () => {
    setCurrentPhase("payment");
  };

  // Show a loading state while fetching user data
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <p className="text-gray-600 font-medium text-lg">Loading...</p>
      </div>
    );
  }

  // Handle case when user is not authenticated
  if (!user || !user._id) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <p className="text-red-500 font-bold text-xl">
          You must be logged in to access your cart.
        </p>
      </div>
    );
  }

  // Render the main page when user is authenticated
  return (
    <div className="min-h-screen bg-gray-100">
      {currentPhase === "overview" ? (
        <OrderCartOverview />
      ) : (
        <PaymentPageWrapper /> // Use PaymentPageWrapper here
      )}
    </div>
  );
};

export default OrderCartPage;
