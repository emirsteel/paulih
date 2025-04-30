import React from "react";
import { CardElement } from "@stripe/react-stripe-js";
import { FaCreditCard, FaShoppingCart, FaUtensils } from "react-icons/fa";

interface OrderCartPaymentDetailsProps {
  cart: any;
  total: number;
  handlePayment: () => void;
}

const OrderCartPaymentDetails: React.FC<OrderCartPaymentDetailsProps> = ({
  cart,
  total,
  handlePayment,
}) => {
  if (!cart || !cart.products.length) {
    return <p>Loading order details...</p>;
  }

  return (
    <div className="max-w-4xl mx-auto bg-white p-6 rounded-lg shadow-lg mt-6">
      <h2 className="text-2xl font-bold text-blue-600 mb-6 flex items-center">
        <FaShoppingCart className="mr-2" /> Payment Details
      </h2>

      {/* Stripe Card Input */}
      <div className="mb-6 bg-gray-50 p-4 rounded-lg">
        <h3 className="text-lg font-semibold text-blue-600 mb-2 flex items-center">
          <FaCreditCard className="mr-2" /> Enter Card Details
        </h3>
        <div className="border border-gray-300 rounded-lg px-4 py-2">
          <CardElement />
        </div>
      </div>

      {/* Order Summary */}
      <div className="mb-6">
        <h3 className="text-lg font-semibold text-blue-600 mb-2">
          Order Summary
        </h3>
        <ul className="space-y-4">
          {cart.products.map((item: any) => (
            <li
              key={item.productId?._id}
              className="flex justify-between items-center bg-gray-50 p-4 rounded-lg"
            >
              <div className="flex items-center space-x-2">
                <FaUtensils className="text-gray-600" />
                <div>
                  <p className="text-gray-800 font-medium">
                    {item.productId?.name || "Unknown"}
                  </p>
                  <p className="text-gray-600 text-sm">
                    ${item.productId?.price?.toFixed(2) || "0.00"} x{" "}
                    {item.quantity}
                  </p>
                </div>
              </div>
              <p className="text-gray-800 font-bold">
                ${((item.productId?.price || 0) * item.quantity).toFixed(2)}
              </p>
            </li>
          ))}
        </ul>
      </div>

      {/* Payment Button */}
      <button
        className="mt-4 w-full bg-blue-500 text-white font-semibold py-3 rounded-lg hover:bg-blue-600 transition duration-200"
        onClick={handlePayment}
      >
        Complete Order
      </button>
    </div>
  );
};

export default OrderCartPaymentDetails;
