// OrderFoodMainHeaderCart.tsx
import React, { useEffect, useState, useContext } from "react";
import { FaTimes, FaPlus } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { AuthUserContext } from "../context/AuthUserContext";
import { getCart, fetchProductsByVenue } from "../services/api";

interface OrderFoodMainHeaderCartProps {
  isOpen: boolean;
  onClose: () => void;
  onCartCountChange?: (count: number) => void; // Callback for total quantity
}

const OrderFoodMainHeaderCart: React.FC<OrderFoodMainHeaderCartProps> = ({
  isOpen,
  onClose,
  onCartCountChange,
}) => {
  const { user } = useContext(AuthUserContext);
  const [cart, setCart] = useState<any | null>(null);
  const [recommendedProducts, setRecommendedProducts] = useState<any[]>([]);
  const navigate = useNavigate();

  // Function to fetch the cart
  const fetchCartData = () => {
    if (!user?._id) return;
    getCart(user._id)
      .then((response) => {
        setCart(response.data);

        // Calculate total quantity across all products in the cart
        const totalQuantity =
          response.data?.products?.reduce(
            (acc: number, item: any) => acc + (item.quantity || 0),
            0
          ) || 0;

        // Pass that total quantity back to MainHeader
        onCartCountChange?.(totalQuantity);
      })
      .catch((error) => {
        console.error("Error fetching cart:", error);
        setCart({ products: [] });
        onCartCountChange?.(0);
      });
  };

  // Fetch cart on mount and poll every 5 seconds
  useEffect(() => {
    fetchCartData();
    const interval = setInterval(fetchCartData, 5000);
    return () => clearInterval(interval);
  }, [user]);

  // Fetch recommended products based on the first product's venue
  useEffect(() => {
    if (cart && cart.products && cart.products.length > 0) {
      const firstVenueId = cart.products[0].productId.venueId?._id;
      if (firstVenueId) {
        fetchProductsByVenue(firstVenueId)
          .then((response) => {
            const allProducts = Array.isArray(response.data)
              ? response.data
              : [response.data];
            const productIdsInCart = cart.products.map(
              (item: any) => item.productId._id
            );
            const recommended = allProducts.filter(
              (p: any) => !productIdsInCart.includes(p._id)
            );
            setRecommendedProducts(recommended.slice(0, 5)); // show first 5
          })
          .catch((err) =>
            console.error("Error fetching recommended products:", err)
          );
      }
    }
  }, [cart]);

  const handleProceedToCheckout = () => {
    navigate("/order-cart");
  };

  // If cart is empty
  if (!cart || !cart.products || cart.products.length === 0) {
    return (
      <div
        className={`fixed inset-0 bg-black bg-opacity-50 transition-opacity ${
          isOpen ? "opacity-100 visible" : "opacity-0 invisible"
        } z-[9999] flex justify-end`}
        onClick={onClose}
      >
        <div
          className={`relative w-full max-w-md bg-white h-full shadow-lg transform transition-transform ${
            isOpen ? "translate-x-0" : "translate-x-full"
          } flex flex-col`}
          onClick={(e) => e.stopPropagation()}
        >
          <button
            className="absolute top-4 right-4 bg-white border-2 border-gray-400 rounded-full w-8 h-8 flex items-center justify-center"
            onClick={onClose}
          >
            <FaTimes className="text-gray-700 text-lg" />
          </button>
          <div className="p-6 text-center w-full h-full flex flex-col items-center justify-center">
            <div className="text-blue-500 text-4xl">🛒</div>
            <p className="text-lg font-bold text-blue-500 mt-4">
              Sepetiniz boş
            </p>
            <p className="text-sm text-gray-500">
              Add something to your basket!
            </p>
          </div>
        </div>
      </div>
    );
  }

  // Calculate total price
  const totalPrice = cart.products.reduce(
    (acc: number, item: any) =>
      acc + (item.productId?.price || 0) * item.quantity,
    0
  );

  return (
    <div
      className={`fixed inset-0 bg-black bg-opacity-50 transition-opacity ${
        isOpen ? "opacity-100 visible" : "opacity-0 invisible"
      } z-[9999] flex justify-end`}
      onClick={onClose}
    >
      <div
        className={`relative w-full max-w-md bg-white h-full shadow-lg transform transition-transform ${
          isOpen ? "translate-x-0" : "translate-x-full"
        } flex flex-col`}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          className="absolute top-4 right-4 bg-white border-2 border-gray-400 rounded-full w-8 h-8 flex items-center justify-center"
          onClick={onClose}
        >
          <FaTimes className="text-gray-700 text-lg" />
        </button>

        {/* Cart Items */}
        <div className="px-6 w-full h-full flex flex-col">
          <h2 className="text-2xl font-bold text-gray-900 mt-6 mb-4">
            Siparişiniz
          </h2>
          <div className="flex flex-col gap-4">
            {cart.products.map((item: any) => (
              <div
                key={item.productId?._id}
                className="flex items-center justify-between bg-white p-4 rounded-lg shadow-sm border border-gray-200"
              >
                {/* Product Image and Info */}
                <div className="flex items-center">
                  <img
                    src={item.productId?.image || "/images/default-food.png"}
                    alt={item.productId?.name}
                    className="w-14 h-14 rounded-lg object-cover"
                  />
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-900">
                      {item.productId?.name}
                    </p>
                    <p className="text-xs text-gray-500">
                      {item.productId?.description || ""}
                    </p>
                    {item.productId?.venueId && (
                      <p className="text-xs text-gray-700">
                        Mekan: {item.productId.venueId.name}
                      </p>
                    )}
                    <p className="text-blue-600 font-bold text-sm">
                      €{item.productId?.price.toFixed(2)}
                    </p>
                  </div>
                </div>
                {/* Display Count (No controls) */}
                <div className="border rounded-lg flex items-center px-2 py-1">
                  <span className="text-gray-900">{item.quantity}</span>
                </div>
              </div>
            ))}
          </div>

          {/* Recommended Products */}
          {recommendedProducts.length > 0 && (
            <div className="mt-6">
              <h3 className="text-lg font-semibold text-gray-900">
                Sepetine Bunları da Ekleyebilirsin!
              </h3>
              <p className="text-xs text-gray-500 mb-3">
                Diğer kullanıcıların birlikte aldıkları ürünlere göre
              </p>
              <div className="flex gap-4 overflow-x-auto">
                {recommendedProducts.map((prod: any) => (
                  <div
                    key={prod._id}
                    className="min-w-[120px] bg-gray-100 rounded-lg p-2 flex-shrink-0"
                  >
                    <div className="w-full h-20 overflow-hidden rounded">
                      <img
                        src={prod.image || "/images/default-food.png"}
                        alt={prod.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <p className="text-sm text-gray-800 mt-2 line-clamp-1">
                      {prod.name}
                    </p>
                    <div className="flex items-center mt-1">
                      {prod.oldPrice && prod.oldPrice > prod.price && (
                        <span className="text-xs text-gray-400 line-through mr-1">
                          {prod.oldPrice} TL
                        </span>
                      )}
                      <span className="text-sm font-bold text-gray-800">
                        {prod.price} TL
                      </span>
                    </div>
                    <button
                      onClick={() =>
                        console.log("Add recommended product:", prod._id)
                      }
                      className="mt-2 flex items-center justify-center bg-white text-blue-600 border border-blue-600 w-8 h-8 rounded-full hover:bg-blue-600 hover:text-white transition"
                    >
                      <FaPlus size={12} />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Total & Checkout */}
          <div className="mt-6 border-t pt-4">
            <div className="flex justify-between items-center">
              <p className="text-md font-semibold">Total</p>
              <p className="text-md font-bold text-blue-600">
                €{totalPrice.toFixed(2)}
              </p>
            </div>
            <button
              className="mt-4 w-full bg-blue-600 text-white font-semibold py-3 rounded-lg hover:bg-blue-700 transition duration-200 flex justify-between items-center px-4"
              onClick={handleProceedToCheckout}
            >
              <span className="text-sm">Ödemeye Git</span>
              <span className="text-sm">€{totalPrice.toFixed(2)}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderFoodMainHeaderCart;
