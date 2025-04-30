import React, { useEffect, useState, useContext } from "react";
import { useStripe, useElements } from "@stripe/react-stripe-js";
import { AuthUserContext } from "../context/AuthUserContext";
import {
  getCart,
  processPayment,
  fetchVenueById,
  getUserAddresses,
} from "../services/api";
import OrderCartPaymentMap from "./OrderCartPaymentMap";
import OrderCartPaymentDetails from "./OrderCartPaymentDetails";
import MainHeader from "./MainHeader";
import OrderFoodFooter from "./OrderFoodFooter";

interface Address {
  _id: string;
  userId: string;
  addressTitle: string;
  apartment: string;
  flat: string;
  floor: string;
  phoneNumber: string;
  addressDescription: string;
  latitude: number;
  longitude: number;
  selectedTag: string;
  isSelected: boolean;
}

const OrderCartPayment: React.FC = () => {
  const { user } = useContext(AuthUserContext);
  const stripe = useStripe();
  const elements = useElements();
  const [cart, setCart] = useState<any>(null);
  const [total, setTotal] = useState<number>(0);
  const [userLocation, setUserLocation] = useState<{
    latitude: number;
    longitude: number;
  } | null>(null);
  const [selectedAddress, setSelectedAddress] = useState<Address | null>(null);

  const [viewport, setViewport] = useState({
    longitude: 0,
    latitude: 0,
    zoom: 15,
  });

  useEffect(() => {
    if (!user || !user._id) return;

    getCart(user._id)
      .then((response) => {
        const fetchedCart = response.data;
        setCart(fetchedCart);

        const calculatedTotal = fetchedCart.products.reduce(
          (acc: number, item: any) =>
            acc + (item.productId?.price || 0) * item.quantity,
          0
        );
        setTotal(calculatedTotal + 2.0); // Delivery fee included
      })
      .catch((error) => console.error("Error fetching cart:", error));

    // Fetch user's saved addresses
    getUserAddresses(user._id)
      .then((addresses: Address[]) => {
        const selectedAddr =
          addresses.find((addr) => addr.isSelected) || addresses[0];
        if (selectedAddr) {
          setSelectedAddress(selectedAddr);
          setUserLocation({
            latitude: selectedAddr.latitude,
            longitude: selectedAddr.longitude,
          });
          setViewport({
            longitude: selectedAddr.longitude,
            latitude: selectedAddr.latitude,
            zoom: 15,
          });
        }
      })
      .catch((error) => console.error("Error fetching user address:", error));
  }, [user]);

  const handlePayment = async () => {
    if (!stripe || !elements) {
      console.error("Stripe has not loaded.");
      return;
    }

    const cardElement = elements.getElement("card");
    if (!cardElement) {
      alert("Payment element is not available.");
      return;
    }

    if (!cart || !cart.products.length) {
      alert("Your cart is empty!");
      return;
    }

    if (!selectedAddress) {
      alert("Please select a delivery address.");
      return;
    }

    try {
      const { paymentMethod, error } = await stripe.createPaymentMethod({
        type: "card",
        card: cardElement,
        billing_details: {
          name: user?.name || "Guest",
        },
      });

      if (error) {
        console.error("Payment method creation error:", error.message);
        alert(error.message);
        return;
      }

      // Fetch venue details from the first product
      const venueId = cart.products[0]?.productId?.venueId;
      const venue = await fetchVenueById(venueId);

      const productsWithDetails = cart.products.map((item: any) => ({
        productId: item.productId._id,
        name: item.productId.name,
        price: item.productId.price,
        category: item.productId.category,
        image: item.productId.image,
        quantity: item.quantity,
      }));

      const paymentData = {
        userId: user._id,
        amount: total,
        paymentMethodId: paymentMethod?.id,
        paymentMethod: "Credit/Debit Card",
        // Include the delivery address details:
        deliveryAddress: {
          addressTitle: selectedAddress.addressTitle,
          apartment: selectedAddress.apartment,
          flat: selectedAddress.flat,
          floor: selectedAddress.floor,
          phoneNumber: selectedAddress.phoneNumber,
          addressDescription: selectedAddress.addressDescription,
          latitude: selectedAddress.latitude,
          longitude: selectedAddress.longitude,
          selectedTag: selectedAddress.selectedTag,
        },
        // Optionally include products and venue if your backend uses them:
        products: productsWithDetails,
        venue: {
          venueId: venue._id,
          name: venue.name,
          category: venue.category,
          location: venue.location,
        },
      };

      const response = await processPayment(paymentData);

      if (response.data.success) {
        alert("Payment successful! Order ID: " + response.data.orderId);
      } else {
        alert("Payment failed: " + response.data.error);
      }
    } catch (error) {
      console.error("Error processing payment:", error);
      alert("Payment failed. Please try again.");
    }
  };

  const handleMapMove = (evt: any) => {
    setViewport((prev) => ({
      ...prev,
      longitude: evt.viewState.longitude,
      latitude: evt.viewState.latitude,
      zoom: evt.viewState.zoom,
    }));
  };

  const handleZoomIn = () => {
    setViewport((prev) => ({ ...prev, zoom: prev.zoom + 1 }));
  };

  const handleZoomOut = () => {
    setViewport((prev) => ({ ...prev, zoom: prev.zoom - 1 }));
  };

  if (!cart || !userLocation) {
    return <p>Loading...</p>;
  }

  return (
    <div className="w-full">
      <MainHeader
        venues={[]}
        onSelectVenue={function (venueId: string): void {
          throw new Error("Function not implemented.");
        }}
      />
      <OrderCartPaymentMap
        userLocation={userLocation}
        viewport={viewport}
        setViewport={setViewport}
        handleZoomIn={handleZoomIn}
        handleZoomOut={handleZoomOut}
        handleMapMove={handleMapMove}
      />

      {/* Import Payment Details */}
      <OrderCartPaymentDetails
        cart={cart}
        total={total}
        handlePayment={handlePayment}
      />

      <OrderFoodFooter />
    </div>
  );
};

export default OrderCartPayment;
