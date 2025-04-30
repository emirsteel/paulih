import React from "react";

interface OrderCategoriesBarProps {
  categories: string[];
  selectedCategory: string;
  onCategorySelect: (category: string) => void;
}

const OrderCategoriesBar: React.FC<OrderCategoriesBarProps> = ({
  categories,
  selectedCategory,
  onCategorySelect,
}) => {
  return (
    <header className="flex justify-center bg-white py-4 shadow-sm border-b">
      <div className="flex space-x-6">
        {categories.map((category) => (
          <button
            key={category}
            onClick={() => onCategorySelect(category)}
            className={`px-6 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
              selectedCategory === category
                ? "bg-blue-500 text-white shadow-lg"
                : "text-gray-600 hover:text-blue-500"
            }`}
          >
            {category}
          </button>
        ))}
      </div>
    </header>
  );
};

export default OrderCategoriesBar;
