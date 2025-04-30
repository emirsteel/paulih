import React, { useState, useEffect } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import MainHeader from "../components/MainHeader";
import SubHeader from "../components/SubHeader";
import PromotionalBanners from "../components/PromotionalBanners";
import OrderCuisineSlider from "../components/OrderCuisineSlider";
import OrderVenueDisplay from "../components/OrderVenueDisplay";
import OrderFoodFilters from "../components/OrderFoodFilters";
import OrderHome from "../components/OrderHome"; // Ensure OrderHome.tsx exports default
import { fetchVenuesByCategory } from "../services/api";
import OrderFoodPreviousOrders from "../components/OrderFoodPreviousOrders";
import {
  FaEnvelope,
  FaPhone,
  FaFacebook,
  FaTwitter,
  FaInstagram,
} from "react-icons/fa";

interface Venue {
  _id: string;
  name: string;
  category: string;
  location: { address: string; city: string };
  rating: number;
  phone: string;
  email: string;
  photos: string[];
  logo: string;
  description: string;
  likedBy: string[];
  deliveryTime: string;
  minimumPayment: string;
  discount: string;
  distance: string;
  subcategory: string;
  deliveryPrice: string;
  deliveryBy: string;
  paymentMethod: string[];
}

const subcategoriesMap: { [key: string]: string[] } = {
  Food: ["Burger", "Pizza", "Dessert"],
  Shopping: ["Bookstores", "Clothing", "Electronics"],
  Entertainment: ["Movies", "Events", "Concerts"],
};

const CategoryPage: React.FC = () => {
  const { category } = useParams<{ category?: string }>();
  const navigate = useNavigate();
  const [selectedCategory, setSelectedCategory] = useState<string>(
    category
      ? category
          .split("-")
          .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
          .join(" ")
      : "Home"
  );
  const [venues, setVenues] = useState<Venue[]>([]);
  const [filteredVenues, setFilteredVenues] = useState<Venue[]>([]);

  useEffect(() => {
    if (category) {
      const formattedCategory = category
        .split("-")
        .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
        .join(" ");
      setSelectedCategory(formattedCategory);
      fetchVenuesByCategory(formattedCategory)
        .then((data: Venue[]) => {
          setVenues(data);
          setFilteredVenues(data);
        })
        .catch(console.error);
    } else {
      setSelectedCategory("Home");
      setVenues([]);
      setFilteredVenues([]);
    }
  }, [category]);

  const handleApplyFilters = (
    selectedCuisines: string[],
    basketValue: number,
    deliveryType: string,
    rating: string,
    paymentMethod: string
  ) => {
    const filtered = venues.filter((venue) => {
      const matchesCuisine =
        selectedCuisines.length === 0 ||
        selectedCuisines.includes(venue.subcategory);
      const matchesBasket =
        parseFloat(venue.minimumPayment.replace(/[^0-9.-]+/g, "")) <=
        basketValue;
      const matchesDeliveryType =
        !deliveryType || venue.deliveryBy === deliveryType;
      const matchesRating =
        !rating || parseInt(rating.split(" ")[0]) <= Math.round(venue.rating);
      const matchesPayment =
        !paymentMethod || venue.paymentMethod.includes(paymentMethod);
      return (
        matchesCuisine &&
        matchesBasket &&
        matchesDeliveryType &&
        matchesRating &&
        matchesPayment
      );
    });
    setFilteredVenues(filtered);
  };

  const handleSelectCategory = (category: string) => {
    const formattedCategory = category.toLowerCase().replace(/ /g, "-");
    navigate(`/order/${formattedCategory}`);
  };

  const handleSelectVenue = (venueId: string) => {
    navigate(`/order/food/venue/${venueId}`);
  };

  const breadcrumb = `Home${selectedCategory !== "Home" ? ` / ${selectedCategory}` : ""}`;

  return (
    <div>
      <MainHeader venues={venues} onSelectVenue={handleSelectVenue} />
      <SubHeader
        breadcrumb={breadcrumb}
        categories={Object.keys(subcategoriesMap)}
        selectedCategory={selectedCategory}
        onSelectCategory={handleSelectCategory}
      />
      <div className="p-4 sm:p-6">
        <PromotionalBanners selectedCategory={selectedCategory} />
        {selectedCategory !== "Home" && <OrderCuisineSlider />}
        {selectedCategory === "Home" ? (
          <OrderHome />
        ) : (
          <div className="flex flex-col lg:flex-row justify-between items-start min-h-[70vh]">
            {selectedCategory === "Food" && (
              <div className="w-full lg:w-1/4 flex-shrink-0 pr-0 lg:pr-6 self-start mb-6 lg:mb-0">
                <div className="sticky top-0">
                  <h2 className="text-lg font-bold mb-4">Filtreler</h2>
                  <OrderFoodFilters
                    onApply={handleApplyFilters}
                    onCancel={() => setFilteredVenues(venues)}
                  />
                </div>
              </div>
            )}
            <div className="w-full lg:w-2/4 flex flex-col justify-center items-center">
              <OrderVenueDisplay
                venues={filteredVenues}
                handleSelectVenue={handleSelectVenue}
              />
            </div>
            <div className="w-full lg:w-1/4 flex-shrink-0 pl-0 lg:pl-6 self-start mb-6 lg:mb-0">
              <div className="flex justify-between items-center mt-4 mb-4">
                <h3 className="text-l font-semibold text-gray-900">
                  Sipariş Geçmişi
                </h3>
                <a
                  href="/orders"
                  className="text-sm text-blue-500 hover:underline"
                >
                  Daha Fazla
                </a>
              </div>
              <div className="sticky top-0">
                <OrderFoodPreviousOrders />
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CategoryPage;
