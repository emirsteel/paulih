import React from "react";
import ItemCard from "./ItemCard";

interface OrderItemListProps {
  items: { name: string; price: number }[];
}

const OrderItemList: React.FC<OrderItemListProps> = ({ items }) => {
  return (
    <main className="flex-grow grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 p-6">
      {items.map((item, index) => (
        <ItemCard key={index} item={item} />
      ))}
    </main>
  );
};

export default OrderItemList;
