import React, { useState, useEffect } from "react";
import { FaArrowLeft, FaArrowRight } from "react-icons/fa";

const dishes = [
  {
    id: 1,
    title: "Burger",
    image:
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR708sOHJXNtULBTKlwC60Dwyrdr6bgZFCOsg&s",
  },
  {
    id: 2,
    title: "Pizza",
    image:
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS_P0K4E4hpX0jAiIW7qkb-qPQWI2su7M8KbA&s",
  },
  {
    id: 3,
    title: "Suşi",
    image:
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR5zhu2ezwxm64PCVDt9kMoINuTdI563O-UPA&s",
  },
  {
    id: 4,
    title: "Makarna",
    image:
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQUD9SG_K6k3Fl9EAkKvuGS9JCkRXZy3i9b8Q&s",
  },
  {
    id: 5,
    title: "Salata",
    image:
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR4gKkpWYwIttlo4K28Fj_Iy2E3RYQypi0GQA&s",
  },
  {
    id: 6,
    title: "Tacos",
    image:
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTmYAIC38D1wCs18xg-cAv9enSCqv6REKUNcA&s",
  },
  {
    id: 7,
    title: "Biftek",
    image:
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRRWy_mDjV0N2fbHdnDhCZvd-PasPpSwveTdA&s",
  },
  {
    id: 8,
    title: "Ramen",
    image:
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRbW4Mjtf0uhoflyOUlgTPOXb8sbrKTcsHw_A&s",
  },
  {
    id: 9,
    title: "Dim Sum",
    image:
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcScHG8st1yFR_Oegn0PXFaPh9zLm6TyaC8lIA&s",
  },
  {
    id: 10,
    title: "Kebap",
    image:
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTxsK8XY0akqvr4-u7p7dxY3igq3Vsz6Wh5WQ&s",
  },
];

const OrderCuisineSlider: React.FC = () => {
  const [itemsPerView, setItemsPerView] = useState(8); // Default for larger screens
  const [currentIndex, setCurrentIndex] = useState(0);

  // Update itemsPerView based on screen size
  useEffect(() => {
    const handleResize = () => {
      setItemsPerView(window.innerWidth <= 768 ? 4 : 8); // 4 items for phones, 8 for larger screens
    };

    handleResize(); // Initialize on mount
    window.addEventListener("resize", handleResize); // Listen for screen resize

    return () => window.removeEventListener("resize", handleResize); // Cleanup on unmount
  }, []);

  const handlePrev = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === 0
        ? dishes.length - itemsPerView
        : (prevIndex - itemsPerView + dishes.length) % dishes.length
    );
  };

  const handleNext = () => {
    setCurrentIndex((prevIndex) => (prevIndex + itemsPerView) % dishes.length);
  };

  const visibleDishes = Array.from({ length: itemsPerView }, (_, i) => {
    const index = (currentIndex + i) % dishes.length;
    return dishes[index];
  });

  return (
    <section className="relative mb-8">
      <h2 className="text-lg font-semibold text-gray-800 mb-4">
        Mutfakları Keşfet
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

      {/* Cuisine Slides */}
      <div className="overflow-hidden">
        <div className="flex transition-transform duration-500 ease-in-out">
          {visibleDishes.map((dish) => (
            <div
              key={dish.id}
              className="group relative w-[calc(100%/4)] md:w-[calc(100%/8)] h-36 bg-white rounded-lg overflow-hidden shadow-md hover:shadow-lg transition mx-2 cursor-pointer"
            >
              <img
                src={dish.image}
                alt={dish.title}
                className="absolute inset-0 w-full h-full object-cover transition-transform duration-300 transform group-hover:scale-105"
              />
              <div
                className="absolute bottom-0 left-0 right-0 text-white text-center py-1 text-sm"
                style={{
                  background:
                    "linear-gradient(to top, rgba(0, 0, 0, 0.8), rgba(0, 0, 0, 0))",
                }}
              >
                {dish.title}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default OrderCuisineSlider;
