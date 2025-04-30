import React from "react";

interface ItemDetailsProps {
  item: { name: string; image: string; details: string };
}

const ItemDetails: React.FC<ItemDetailsProps> = ({ item }) => {
  return (
    <div className="p-6">
      <img
        src={item.image}
        alt={item.name}
        className="w-full h-64 object-cover"
      />
      <h1 className="text-2xl font-bold mt-4">{item.name}</h1>
      <p className="text-gray-600 mt-4">{item.details}</p>
    </div>
  );
};

export default ItemDetails;
