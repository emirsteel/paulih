import React, { useState, useRef } from "react";
import {
  Search as LucideSearch,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

interface OrderFoodVenueMenuProps {
  menu: string[];
  onMenuClick: (category: string) => void;
  onSearch?: (searchTerm: string) => void;
}

const OrderFoodVenueMenu: React.FC<OrderFoodVenueMenuProps> = ({
  menu,
  onMenuClick,
  onSearch = () => {},
}) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedIndex, setSelectedIndex] = useState<number>(0);
  const containerRef = useRef<HTMLDivElement>(null);

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const term = e.target.value;
    setSearchTerm(term);
    onSearch(term);
  };

  const scrollLeft = () => {
    if (containerRef.current) {
      containerRef.current.scrollBy({
        left: -200,
        behavior: "smooth",
      });
    }
  };

  const scrollRight = () => {
    if (containerRef.current) {
      containerRef.current.scrollBy({
        left: 200,
        behavior: "smooth",
      });
    }
  };

  return (
    <div className="p-3 bg-white shadow-md rounded-lg w-full mt-6 flex items-center">
      {/* Search Bar */}
      <div className="flex items-center bg-gray-100 rounded-full px-4 py-2 w-full max-w-md">
        <LucideSearch className="text-gray-500" size={18} />
        <input
          type="text"
          value={searchTerm}
          onChange={handleSearch}
          placeholder="Search"
          className="ml-2 w-full bg-transparent placeholder-gray-500 text-sm focus:outline-none"
        />
      </div>

      {/* Vertical Divider */}
      <div className="h-8 border-l border-gray-300 mx-4"></div>

      {/* Scrollable Menu Categories */}
      <div className="flex items-center w-full">
        <button
          onClick={scrollLeft}
          className="p-2 rounded-full bg-gray-200 hover:bg-gray-300 shadow-md"
        >
          <ChevronLeft />
        </button>
        <div
          ref={containerRef}
          className="flex overflow-x-auto space-x-4 px-4 w-full"
          style={{
            scrollbarWidth: "none", // Firefox
            msOverflowStyle: "none", // IE 10+
            overflow: "hidden",
          }}
        >
          <style>{`
            div::-webkit-scrollbar {
              display: none;
            }
          `}</style>
          {menu.map((category, index) => (
            <div
              key={index}
              className="relative cursor-pointer px-3 py-1 text-center flex-shrink-0"
              onClick={() => {
                setSelectedIndex(index);
                onMenuClick(category);
              }}
            >
              <span
                className={`text-sm font-medium transition-colors duration-300 ${
                  selectedIndex === index
                    ? "text-blue-600"
                    : "text-gray-600 hover:text-blue-600"
                }`}
              >
                {category}
              </span>
              {/* Bottom Border */}
              <div
                className={`absolute bottom-0 left-1/2 transform -translate-x-1/2 h-[2px] transition-all duration-300 ${
                  selectedIndex === index
                    ? "bg-blue-600 w-[80%]"
                    : "bg-transparent w-0 hover:bg-blue-400 hover:w-[50%]"
                }`}
                style={{ borderRadius: "1px" }}
              />
            </div>
          ))}
        </div>
        <button
          onClick={scrollRight}
          className="p-2 rounded-full bg-gray-200 hover:bg-gray-300 shadow-md"
        >
          <ChevronRight />
        </button>
      </div>
    </div>
  );
};

export default OrderFoodVenueMenu;
