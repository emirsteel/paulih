import React from "react";

interface ProductCardProps {
  product: {
    image: string;
    title: string;
    author: string;
    price: number;
    discount?: string;
  };
}

const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  return (
    <div className="bg-white shadow rounded-lg p-4">
      <img
        src={product.image}
        alt={product.title}
        className="w-full h-48 object-cover rounded"
      />
      <div className="mt-4">
        <h3 className="text-md font-semibold">{product.title}</h3>
        <p className="text-sm text-gray-500">{product.author}</p>
        <p className="text-lg font-bold mt-2">${product.price}</p>
        <button className="mt-2 w-full bg-blue-500 text-white py-2 rounded-lg">
          Add to Cart
        </button>
      </div>
    </div>
  );
};

export default ProductCard;
