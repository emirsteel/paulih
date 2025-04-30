import React from "react";

const ProductCategories: React.FC = () => {
  const categories = [
    "Happiness",
    "Career growth",
    "Self-esteem",
    "Motivation",
    "Relationships",
  ];
  return (
    <div className="px-6 py-4 bg-gray-50">
      <div className="flex space-x-4">
        {categories.map((category) => (
          <button
            key={category}
            className="bg-gray-200 text-sm px-4 py-2 rounded-full hover:bg-blue-500 hover:text-white"
          >
            {category}
          </button>
        ))}
      </div>
    </div>
  );
};

export default ProductCategories;
