import React, { useContext, useState } from "react";
import { FaPlus, FaThumbsUp, FaTrophy } from "react-icons/fa";
import { AuthUserContext } from "../context/AuthUserContext";
import ProductPopup from "./ProductPopup";

interface Product {
  id: string;
  name: string;
  image: string;
  description: string;
  price: number;
  category: string;
  choiceExtracted: string[];
  extraSideChoice: { name: string; price: number }[];
  sauces: { [key: string]: string[] };
  promotions: string[];
  rating?: number; // Opsiyonel puan
  reviews?: number; // Opsiyonel yorum sayısı
  glutenFree: boolean; // DB'den gelen gluten free bilgisi
  rated?: number; // DB'den gelen en çok oy alan sıralaması
}

interface OrderFoodProductListProps {
  products: Product[];
  onSelectProduct: (id: string) => void;
  onAddToCart: (payload: {
    id: string;
    selectedLavash?: string;
    isExtraTavukDonerSelected?: boolean;
  }) => void;
}

const OrderFoodProductList: React.FC<OrderFoodProductListProps> = ({
  products,
  onSelectProduct,
  onAddToCart,
}) => {
  const { user } = useContext(AuthUserContext);
  const [popupProduct, setPopupProduct] = useState<Product | null>(null);

  if (products.length === 0) {
    return <p className="text-gray-600">Bu mekânda ürün bulunmamaktadır.</p>;
  }

  return (
    <div className="mt-6">
      {/* Responsive grid layout */}
      <ul className="grid gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
        {products.map((product) => (
          <li
            key={product.id}
            className="
              relative bg-white rounded-lg 
              shadow-md hover:shadow-lg 
              transition cursor-pointer 
              border border-gray-200
            "
            onClick={() => onSelectProduct(product.id)}
          >
            {/* 'MEVSİMSEL' badge in the top-left corner */}
            <span
              className="
                absolute top-3 left-3 
                bg-green-100 text-green-800 
                text-xs font-semibold 
                px-2 py-1 rounded-full
              "
            >
              MEVSİMSEL
            </span>

            {/* Product Image */}
            <div className="relative">
              <img
                src={product.image}
                alt={product.name}
                className="w-full h-44 object-cover rounded-t-lg"
              />

              {/* Conditionally display rated badge at top-right if available */}
              {product.rated && (
                <div
                  className="
                    absolute top-3 right-3
                    bg-white/80 backdrop-blur-sm
                    px-2 py-1 rounded-md text-xs flex items-center space-x-1
                  "
                >
                  <FaThumbsUp className="text-green-500" />
                  <span className="font-medium text-green-600">
                    #{product.rated} En Çok Oy Alan
                  </span>
                </div>
              )}

              {/* 'Paulih'in En İyisi' badge at bottom-left of the image with yellow background */}
              <div
                className="
                  absolute bottom-2 left-2
                  flex items-center space-x-1
                  bg-yellow-200 
                  px-2 py-1 rounded-md
                  text-xs
                "
              >
                <FaTrophy className="text-yellow-500" />
                <span className="font-medium text-gray-800">
                  Paulih'in En İyisi
                </span>
              </div>

              {/* Floating '+' button in the bottom-right corner of the image */}
              <button
                className="
                  absolute bottom-2 right-2 
                  bg-white border border-gray-300 
                  text-gray-700 w-8 h-8 
                  flex items-center justify-center 
                  rounded-full hover:bg-gray-100 
                  transition shadow-md
                "
                onClick={(e) => {
                  e.stopPropagation();
                  setPopupProduct(product);
                }}
              >
                <FaPlus size={12} />
              </button>
            </div>

            {/* Card Content */}
            <div className="p-4">
              {/* Product Name */}
              <h3 className="text-md font-bold text-gray-800 mb-1 line-clamp-1">
                {product.name}
              </h3>

              {/* Product Description */}
              <p className="text-sm text-gray-600 mb-2 line-clamp-2">
                {product.description}
              </p>

              {/* Bottom Row: Price, Gluten-free status and rating info */}
              <div className="flex items-center text-sm text-gray-700 space-x-2">
                <span className="font-bold text-gray-800">
                  €{product.price.toFixed(2)}
                </span>

                {/* Always show gluten-free info */}
                <span
                  className="
                    bg-gray-100 text-gray-700 
                    px-2 py-1 text-xs 
                    font-semibold rounded-full
                  "
                >
                  Glutensiz: {product.glutenFree ? "Evet" : "Hayır"}
                </span>

                {/* If no rated value, display rating info in the bottom row */}
                {!product.rated &&
                  product.rating !== undefined &&
                  product.reviews !== undefined && (
                    <div className="flex items-center text-sm text-gray-600 ml-auto">
                      <FaThumbsUp className="text-green-500 mr-1" />
                      <span>{product.rating}%</span>
                      <span className="ml-1">({product.reviews})</span>
                    </div>
                  )}
              </div>
            </div>
          </li>
        ))}
      </ul>

      {/* Popup for product customizations or add-to-cart */}
      {popupProduct && (
        <ProductPopup
          product={popupProduct}
          onClose={() => setPopupProduct(null)}
          onAddToCart={(payload) => {
            onAddToCart(payload);
          }}
        />
      )}
    </div>
  );
};

export default OrderFoodProductList;
