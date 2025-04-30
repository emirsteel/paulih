import React from "react";

interface Product {
  id: string;
  name: string;
  image: string;
  description: string;
  price: number;
}

interface ProductListProps {
  products: Product[];
  onSelectProduct: (id: string) => void;
}

const ProductList: React.FC<ProductListProps> = ({
  products,
  onSelectProduct,
}) => {
  return (
    <div>
      <h3 className="text-lg font-semibold text-gray-800 mb-4">Products</h3>
      <ul className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {products.map((product) => (
          <li
            key={product.id}
            className="p-4 bg-white rounded-lg shadow-md hover:shadow-lg transition cursor-pointer"
            onClick={() => onSelectProduct(product.id)}
          >
            <img
              src={product.image}
              alt={product.name}
              className="w-full h-40 object-cover rounded-lg mb-4"
            />
            <h4 className="text-md font-semibold text-gray-800">
              {product.name}
            </h4>
            <p className="text-sm text-gray-600">{product.description}</p>
            <p className="text-sm font-bold text-gray-800">
              ${product.price.toFixed(2)}
            </p>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ProductList;
