import React, { useEffect, useState } from "react";
import { fetchUserOrders } from "../services/api";
import {
  FaClock,
  FaShoppingCart,
  FaStar,
  FaChevronRight,
  FaInfoCircle,
  FaRedo,
  FaTimesCircle,
} from "react-icons/fa";

interface Order {
  _id: string;
  amount: number;
  paymentMethod: string;
  orderStatus: string;
  createdAt: string;
  venue?: {
    name: string;
  };
  products: {
    productId: string;
    name: string;
    image: string;
    quantity: number;
    price: number;
  }[];
}

const OrderFoodPreviousOrders: React.FC = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [visibleCount, setVisibleCount] = useState(5); // Show 5 orders initially
  const userId = localStorage.getItem("userId");

  useEffect(() => {
    if (!userId) return;

    const fetchOrders = async () => {
      try {
        const data = await fetchUserOrders(userId);
        setOrders(data);
      } catch (error) {
        console.error("Failed to fetch user orders:", error);
      }
    };

    fetchOrders();
  }, [userId]);

  return (
    <div className="bg-gray-50 min-h-screen p-6">
      {orders.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20">
          <FaShoppingCart className="text-gray-300 text-6xl" />
          <p className="text-gray-600 mt-4 text-lg">No Orders Yet</p>
          <p className="text-sm text-gray-500 text-center max-w-xs">
            Browse products and start an order. Delivery fee is free for your
            first order!
          </p>
          <button className="mt-4 px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 transition">
            Start Shopping
          </button>
        </div>
      ) : (
        <div className="mt-4">
          {orders.slice(0, visibleCount).map((order) => (
            <div
              key={order._id}
              className="bg-white border border-gray-200 rounded-md shadow-sm p-4 mb-4"
            >
              <div className="flex justify-between items-center">
                <p className="text-gray-900 font-semibold text-sm">
                  {order.venue?.name || "Unknown Venue"}
                </p>
                <a href={`/venue/${order._id}`} className="text-gray-500">
                  <FaChevronRight />
                </a>
              </div>

              <div className="flex items-center text-xs text-gray-500 mt-1">
                <FaClock className="mr-1" />
                {new Date(order.createdAt).toLocaleString("en-US", {
                  month: "short",
                  day: "2-digit",
                  year: "numeric",
                })}{" "}
                |{" "}
                {new Date(order.createdAt).toLocaleTimeString([], {
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </div>

              <div className="mt-3">
                {order.products.map((product) => (
                  <div
                    key={product.productId}
                    className="flex items-center space-x-3 text-xs mb-2"
                  >
                    <img
                      src={product.image}
                      alt={product.name}
                      className="w-10 h-10 rounded-md object-cover border border-gray-200"
                    />
                    <p className="text-gray-600">{product.name}</p>
                  </div>
                ))}
              </div>

              <div className="flex justify-between items-center mt-3 text-xs text-gray-500">
                <p>Puan</p>
                <p>Durum</p>
                <p>Fiyat</p>
              </div>
              <div className="flex justify-between items-center mt-1">
                <div className="flex">
                  {[...Array(5)].map((_, index) => (
                    <FaStar key={index} className="text-yellow-400 text-xs" />
                  ))}
                </div>
                <p className="text-gray-800 font-medium text-sm">
                  {order.orderStatus}
                </p>
                <p className="text-black font-bold text-sm">
                  £{order.amount.toFixed(2)}
                </p>
              </div>

              <div className="flex justify-between mt-4">
                <button className="flex items-center gap-2 bg-gray-200 text-gray-800 px-3 py-1.5 rounded-md shadow-md hover:bg-gray-300 transition text-sm">
                  <FaInfoCircle className="text-sm" /> Detaylar
                </button>
              </div>
            </div>
          ))}

          {/* Show More Button */}
          {visibleCount < orders.length && (
            <div className="flex justify-center mt-4">
              <button
                onClick={() => setVisibleCount(visibleCount + 5)}
                className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition"
              >
                Daha Fazla
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default OrderFoodPreviousOrders;
