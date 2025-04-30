import React, { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import Map, { Marker, NavigationControl } from "react-map-gl";
import { AuthUserContext } from "../context/AuthUserContext";
import {
  fetchVenuesByAddedProducts,
  getCart,
  getUserAddresses,
} from "../services/api";
import { FaMapMarkerAlt, FaArrowLeft, FaPlus, FaMinus } from "react-icons/fa";
import LocationPopup from "./LocationsPopup";
import OrderFoodApplyPromoCode from "./OrderFoodCartOverviewApplyPromoCode";
import OrderFoodCartOverviewMap from "./OrderFoodCartOverviewMap";
import OrderFoodCartOverviewCart from "./OrderFoodCartOverviewCart";
import OrderFoodCartOverviewAddress from "./OrderFoodCartOverviewAddress";
import OrderFoodCartOverviewDeliveryMethod from "./OrderFoodCartOverviewDeliveryMethod";
import OrderFoodCartPreviewOrderSummary from "./OrderFoodCartOverviewOrderSummary";
import OrderFoodCartOverviewNoteToCourier from "./OrderFoodCartOverviewNoteToCourier";
import OrderFoodCartOverviewTipCourier from "./OrderFoodCartOverviewTipCourier";
import OrderFoodFooter from "./OrderFoodFooter";
import MainHeader from "./MainHeader";

const MAPBOX_TOKEN =
  "pk.eyJ1IjoicGF1bGloIiwiYSI6ImNtNnRjbjlibDAxeWQyanNnbGpnazAwbzAifQ.b5EiudBGiXOuZdAE6ZxxBA"; // Replace with your actual Mapbox API key

interface Venue {
  _id: string;
  name: string;
  category: string;
  subcategory: string;
  location: {
    address: string;
    city: string;
    latitude: number;
    longitude: number;
  };
  rating: number;
  phone: string;
  email: string;
  logo: string;
  photos: string[];
  description: string;
  deliveryTime: string;
  deliveryPrice: string;
  minimumPayment: string;
  discount: string;
  likedBy: string[];
  deliveryBy: string;
  paymentMethod: string[];
  menu: string[];
  username: string;
  password: string;
  forgotPassword: string;
}

interface Address {
  _id: string;
  userId: string;
  addressTitle: string;
  apartment: string;
  flat: string;
  floor: string;
  phoneNumber: string;
  addressDescription: string;
  noteToCourier: string;
  latitude: number;
  longitude: number;
  selectedTag: string;
  isSelected: boolean;
  createdAt: string;
  updatedAt: string;
}

const OrderCartOverview: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useContext(AuthUserContext);
  const [venue, setVenue] = useState<Venue | null>(null);
  const [cart, setCart] = useState<any>(null);
  const [location, setLocation] = useState<string>("Fetching address...");
  const [savedAddresses, setSavedAddresses] = useState<Address[]>([]);
  const [selectedAddress, setSelectedAddress] = useState<Address | null>(null);
  const [loadingVenue, setLoadingVenue] = useState<boolean>(true);
  const [showLocationPopup, setShowLocationPopup] = useState(false);
  const [discount, setDiscount] = useState<number>(0);
  const [promoCode, setPromoCode] = useState<string>("");
  const [tipAmount, setTipAmount] = useState(0);

  const handleProceedToPayment = () => {
    navigate("/order-payment"); // Update this to the correct route if different
  };

  const [viewport, setViewport] = useState({
    longitude: venue?.location?.longitude || 13.405, // Default to Berlin before venue loads
    latitude: venue?.location?.latitude || 52.52,
    zoom: 15,
  });

  useEffect(() => {
    if (venue?.location?.longitude && venue?.location?.latitude) {
      setViewport((prev) => ({
        ...prev, // Keep previous settings
        longitude: venue.location.longitude,
        latitude: venue.location.latitude,
      }));
    }
  }, [venue]); // Runs only when venue updates

  const handleMapMove = (evt) => {
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

  const handleSelectAddress = (address: Address) => {
    setSelectedAddress(address);
  };

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

  useEffect(() => {
    if (!user || !user._id) return;

    fetchVenuesByAddedProducts(user._id)
      .then((venues) => {
        if (venues.length > 0) {
          setVenue(venues[0]);
        }
      })
      .catch((error) => console.error("Error fetching venue:", error))
      .finally(() => setLoadingVenue(false));

    getCart(user._id)
      .then((response) => setCart(response.data))
      .catch(() => setCart({ products: [] }));

    getUserAddresses(user._id)
      .then((addresses) => {
        const selectedAddr =
          addresses.find((addr) => addr.isSelected) || addresses[0]; // Selects the first `isSelected: true` address
        setSavedAddresses(addresses);
        setSelectedAddress(selectedAddr || null); // If no address, set null
      })
      .catch(() => setSavedAddresses([]));
  }, [user]);

  if (loadingVenue) return <p>Loading venue details...</p>;
  if (!venue || !venue.location?.latitude || !venue.location?.longitude)
    return <p>Error loading venue location.</p>;

  const total =
    cart?.products?.reduce(
      (acc: number, item: any) =>
        acc + (item.productId?.price || 0) * item.quantity,
      0
    ) || 0;

  return (
    <div className="relative min-h-screen bg-gray-100">
      <MainHeader
        venues={[]}
        onSelectVenue={function (venueId: string): void {
          throw new Error("Function not implemented.");
        }}
      />
      {/* ✅ Map + Venue Information */}
      <div className="relative w-full h-[400px]">
        <div className="relative w-full h-[400px] overflow-hidden">
          {!loadingVenue &&
            venue?.location?.latitude &&
            venue?.location?.longitude && (
              <OrderFoodCartOverviewMap
                venue={venue}
                viewport={viewport}
                setViewport={setViewport}
                handleZoomIn={handleZoomIn}
                handleZoomOut={handleZoomOut}
                handleMapMove={handleMapMove}
              />
            )}
        </div>
        <OrderFoodCartOverviewCart
          venue={venue}
          total={total}
          discount={discount}
          promoCode={promoCode}
          tipAmount={tipAmount} // ✅ Pass tip to cart
        />
      </div>
      {/* ✅ Order Details Section */}
      <div className="max-w-3xl ml-10 p-8">
        <OrderFoodCartOverviewAddress
          savedAddresses={savedAddresses}
          selectedAddress={selectedAddress}
          handleSelectAddress={handleSelectAddress}
          setShowLocationPopup={setShowLocationPopup}
        />

        {/* ✅ LocationPopup - Only Shows When Button is Clicked */}
        {showLocationPopup && (
          <LocationPopup
            onClose={() => setShowLocationPopup(false)}
            onNext={() => {}}
          />
        )}

        <OrderFoodCartOverviewDeliveryMethod venue={venue} />

        <OrderFoodCartOverviewNoteToCourier />
        <OrderFoodCartOverviewTipCourier setTipAmount={setTipAmount} />

        <OrderFoodCartPreviewOrderSummary cart={cart} />

        <OrderFoodApplyPromoCode
          total={total}
          setDiscount={setDiscount}
          setPromoCode={setPromoCode}
        />

        {/* ✅ Proceed to Payment */}
        <button
          onClick={handleProceedToPayment}
          className="w-full mt-6 bg-blue-600 text-white font-semibold py-4 rounded-md"
        >
          Proceed to Payment
        </button>
      </div>
      <OrderFoodFooter />
    </div>
  );
};

export default OrderCartOverview;
