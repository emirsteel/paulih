import React, { useState, useEffect } from "react";
import { FaArrowLeft, FaArrowRight } from "react-icons/fa";

const categoryPromotions = {
  Food: [
    {
      id: 1,
      title: "Discount on Pizza",
      image:
        "https://img.freepik.com/free-vector/hand-drawn-pizza-horizontal-banner_23-2150273531.jpg?semt=ais_hybrid",
    },
    {
      id: 2,
      title: "Burger Bonanza",
      image:
        "https://img.freepik.com/free-psd/retro-burger-restaurant-horizontal-banner_23-2148591014.jpg",
    },
    {
      id: 3,
      title: "Dessert Delight",
      image:
        "https://c8.alamy.com/comp/2AAMYCB/set-of-poster-offer-delicious-fast-food-2AAMYCB.jpg",
    },
    {
      id: 4,
      title: "Combo Offers",
      image:
        "https://img.freepik.com/free-vector/combo-offers-banners-concept_23-2148657937.jpg",
    },
  ],
  Shopping: [
    {
      id: 5,
      title: "Clothing Carnival",
      image: "https://via.placeholder.com/200?text=Clothing+Carnival",
    },
    {
      id: 6,
      title: "Bookstore Bonanza",
      image: "https://via.placeholder.com/200?text=Bookstore+Bonanza",
    },
  ],
  Entertainment: [
    {
      id: 7,
      title: "Movie Madness",
      image: "https://via.placeholder.com/200?text=Movie+Madness",
    },
    {
      id: 8,
      title: "Concert Craze",
      image: "https://via.placeholder.com/200?text=Concert+Craze",
    },
  ],
};

interface PromotionalBannersProps {
  selectedCategory: string;
}

const PromotionalBanners: React.FC<PromotionalBannersProps> = ({
  selectedCategory,
}) => {
  const promotions = categoryPromotions[selectedCategory] || [];
  const [currentIndex, setCurrentIndex] = useState(0);

  // Detect the number of items to display (2 for phones, 3 for larger screens)
  const isMobile = window.innerWidth <= 768; // Breakpoint for mobile screens
  const itemsPerView = isMobile ? 2 : 3;

  const totalPromotions = promotions.length;

  const handlePrev = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === 0 ? totalPromotions - itemsPerView : prevIndex - 1
    );
  };

  const handleNext = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === totalPromotions - itemsPerView ? 0 : prevIndex + 1
    );
  };

  // Auto-slide every 3 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) =>
        prevIndex === totalPromotions - itemsPerView ? 0 : prevIndex + 1
      );
    }, 3000);

    return () => clearInterval(interval);
  }, [totalPromotions, itemsPerView]);

  if (!promotions.length) return null; // No promotions for the selected category

  return (
    <section className="relative mb-8 px-4">
      <h2 className="text-lg font-semibold text-gray-800 mb-4">
        {selectedCategory} Promosyonları
      </h2>
      {/* Left Arrow */}
      <button
        className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-gray-200 hover:bg-gray-300 text-gray-800 p-2 rounded-full shadow-md z-10 transition"
        onClick={handlePrev}
      >
        <FaArrowLeft />
      </button>
      {/* Right Arrow */}
      <button
        className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-gray-200 hover:bg-gray-300 text-gray-800 p-2 rounded-full shadow-md z-10 transition"
        onClick={handleNext}
      >
        <FaArrowRight />
      </button>
      {/* Promotion Slides */}
      <div className="overflow-hidden">
        <div
          className="flex transition-transform duration-500 ease-in-out gap-4"
          style={{
            transform: `translateX(-${(currentIndex * 100) / itemsPerView}%)`,
          }}
        >
          {promotions.map((promo) => (
            <div
              key={promo.id}
              className="relative w-full h-48 bg-white rounded-lg overflow-hidden shadow-md hover:shadow-lg transition"
              style={{
                flex: `0 0 calc(${100 / itemsPerView}% - 16px)`,
              }}
            >
              <img
                src={promo.image}
                alt={promo.title}
                className="absolute inset-0 w-full h-full object-cover"
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default PromotionalBanners;
