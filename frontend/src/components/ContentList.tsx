import React from "react";

interface ContentListProps {
  items: {
    id: string;
    name: string;
    image: string;
    description: string;
    price: number;
    rating: number;
  }[];
  onSelectItem: (id: string) => void;
}

const ContentList: React.FC<ContentListProps> = ({ items, onSelectItem }) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 p-6">
      {items.map((item) => (
        <div
          key={item.id}
          className="bg-white shadow-lg rounded-lg overflow-hidden group"
        >
          {/* Image Section */}
          <div
            className="relative cursor-pointer overflow-hidden"
            onClick={() => onSelectItem(item.id)}
          >
            <img
              src={item.image}
              alt={item.name}
              className="w-full h-48 object-cover transition-transform duration-300 group-hover:scale-105"
            />
          </div>

          {/* Content Section */}
          <div className="p-4">
            <div
              className="cursor-pointer"
              onClick={() => onSelectItem(item.id)}
            >
              <h3 className="text-lg font-bold text-gray-800">{item.name}</h3>
              <p className="text-sm text-gray-600 mt-2">
                {item.description.length > 50
                  ? item.description.slice(0, 50) + "..."
                  : item.description}
              </p>
            </div>

            {/* Price and Rating */}
            <div className="flex items-center justify-between mt-4">
              <p className="text-lg font-semibold text-blue-500">
                ${item.price.toFixed(2)}
              </p>
              <div className="flex items-center text-yellow-500">
                {Array.from({ length: 5 }, (_, i) => (
                  <i
                    key={i}
                    className={`fas fa-star ${
                      i < item.rating ? "" : "text-gray-300"
                    }`}
                  />
                ))}
              </div>
            </div>

            {/* Add to Cart Button */}
            <button
              className="w-full mt-4 bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600 transition"
              onClick={() => alert(`Added ${item.name} to cart!`)}
            >
              Add to Cart
            </button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default ContentList;
