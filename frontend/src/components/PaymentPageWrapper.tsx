import React, { useEffect, useState } from "react";
import { Elements } from "@stripe/react-stripe-js";
import { loadStripe, Stripe } from "@stripe/stripe-js";
import OrderCartPayment from "./OrderCartPayment";

// Fallback script loading
const stripePromise = (async () => {
  try {
    return await loadStripe(
      process.env.REACT_APP_STRIPE_PUBLISHABLE_KEY ||
        "pk_test_51PbfE9Rr9xRSaQNstpsKub9ahljQ64uu4o6I5GVhN2yDTuDbfUzUwwwEjYxz95gEWNrpZhoS32FI8trVGdJH0DWc00S6D3eSX8"
    );
  } catch (err) {
    console.error("Stripe script loading error:", err);
    return null;
  }
})();

const PaymentPageWrapper: React.FC = () => {
  const [stripe, setStripe] = useState<Stripe | null>(null);

  useEffect(() => {
    const initializeStripe = async () => {
      const stripeInstance = await stripePromise;
      setStripe(stripeInstance);
    };

    initializeStripe();
  }, []);

  if (!stripe) {
    return <p>Failed to initialize Stripe. Please try again later.</p>;
  }

  return (
    <Elements stripe={stripe}>
      <OrderCartPayment />
    </Elements>
  );
};

export default PaymentPageWrapper;
