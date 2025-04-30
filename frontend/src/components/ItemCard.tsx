import React from "react";

interface ItemCardProps {
  item: { name: string; price: number };
}

const ItemCard: React.FC<ItemCardProps> = ({ item }) => {
  return (
    <div className="bg-white shadow-md rounded-lg overflow-hidden transform transition-all duration-200 hover:scale-105">
      <div className="p-4">
        <h4 className="text-lg font-semibold text-gray-800">{item.name}</h4>
        <p className="text-gray-500 mb-4">${item.price.toFixed(2)}</p>
        <button className="w-full bg-blue-500 text-white py-2 rounded-lg font-medium hover:bg-blue-600 transition">
          Add to Cart
        </button>
      </div>
    </div>
  );
};

export default ItemCard;
