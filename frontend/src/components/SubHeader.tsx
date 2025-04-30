import React from "react";

interface SubHeaderProps {
  breadcrumb: string;
  categories: string[];
  onSelectCategory: (category: string) => void;
  selectedCategory: string;
}

const SubHeader: React.FC<SubHeaderProps> = ({
  breadcrumb,
  categories,
  onSelectCategory,
  selectedCategory,
}) => {
  return (
    <div className="px-6 py-4 bg-gray-50 text-sm text-gray-600 flex justify-between items-center">
      <div>{breadcrumb}</div>
      <div className="flex space-x-4">
        {categories.map((category) => (
          <div
            key={category}
            onClick={() => onSelectCategory(category)}
            className="relative cursor-pointer px-4 py-2 text-center"
          >
            <span
              className={`text-sm font-medium transition-colors duration-300 ${
                selectedCategory === category
                  ? "text-blue-600"
                  : "text-gray-600 hover:text-blue-500"
              }`}
            >
              {category}
            </span>
            {/* Bottom Border */}
            <div
              className={`absolute bottom-0 left-1/2 transform -translate-x-1/2 h-1 transition-all duration-300 ${
                selectedCategory === category
                  ? "bg-blue-600 w-[120%]"
                  : "bg-transparent w-0 group-hover:bg-blue-400 group-hover:w-[80%]"
              }`}
              style={{ borderRadius: "2px" }}
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default SubHeader;
