import React from "react";
import {
  FaPizzaSlice,
  FaHamburger,
  FaIceCream,
  FaBook,
  FaTshirt,
  FaFilm,
} from "react-icons/fa";
import { NavLink } from "react-router-dom";

interface SidebarFiltersProps {
  selectedCategory: string;
  subcategoriesMap: { [key: string]: string[] };
  onSelectFilter: (subcategory: string) => void;
}

const iconMap: { [key: string]: JSX.Element } = {
  Burger: <FaHamburger />,
  Pizza: <FaPizzaSlice />,
  Dessert: <FaIceCream />,
  Bookstores: <FaBook />,
  Clothing: <FaTshirt />,
  Movies: <FaFilm />,
};

const SidebarFilters: React.FC<SidebarFiltersProps> = ({
  selectedCategory,
  subcategoriesMap,
  onSelectFilter,
}) => {
  return (
    <div className="fixed top-38 left-0 w-60 h-[calc(100vh-8rem)] bg-blue-50 border-r border-gray-200 shadow-lg overflow-y-auto custom-scrollbar">
      {/* Header */}
      <div className="p-6 bg-blue-100 border-b border-gray-200">
        <h3 className="text-lg font-semibold text-blue-700">
          {selectedCategory}
        </h3>
        <p className="text-sm text-blue-500 mt-2">
          Browse venues by subcategory
        </p>
      </div>

      {/* Subcategories */}
      {subcategoriesMap[selectedCategory] && (
        <nav className="mt-4 px-2">
          <ul className="space-y-1">
            {subcategoriesMap[selectedCategory].map((subcategory) => (
              <li key={subcategory} className="group">
                <NavLink
                  to={`/order/${subcategory.toLowerCase()}`}
                  className={({ isActive }) =>
                    `flex items-center px-3 py-2 rounded-lg text-sm transition ${
                      isActive
                        ? "bg-blue-200 text-blue-700 font-medium"
                        : "text-gray-600 hover:bg-blue-100 hover:text-blue-600"
                    }`
                  }
                >
                  <span className="mr-3 text-lg">
                    {iconMap[subcategory] || subcategory[0]}
                  </span>
                  <span>{subcategory}</span>
                </NavLink>
              </li>
            ))}
          </ul>
        </nav>
      )}
    </div>
  );
};

export default SidebarFilters;
