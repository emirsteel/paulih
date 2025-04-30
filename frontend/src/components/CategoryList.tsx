import React from "react";

interface CategoryListProps {
  categories: string[];
  onSelectCategory: (category: string) => void;
}

const CategoryList: React.FC<CategoryListProps> = ({
  categories,
  onSelectCategory,
}) => {
  return (
    <div className="w-full p-6 grid grid-cols-3 gap-4">
      {categories.map((category) => (
        <div
          key={category}
          onClick={() => onSelectCategory(category)}
          className="cursor-pointer bg-gray-100 p-4 rounded-lg shadow-md hover:bg-blue-100 transition"
        >
          <h3 className="text-lg font-semibold text-gray-800">{category}</h3>
        </div>
      ))}
    </div>
  );
};

export default CategoryList;
