import React, { useState, useEffect } from "react";
import { updateOrderStatus } from "../services/api";
import { FiX } from "react-icons/fi";

interface Product {
  _id: string;
  name: string;
  category: string;
  price: number;
  quantity: number;
  image: string;
  purchasedAt: string;
  extraSideChoice?: { name: string }[];
  sauces?: { name: string }[];
  orderId: string;
  orderStatus: string;
}

interface SupplierRecentlyPurchasedProductsProps {
  purchasedProducts: Product[];
  orderStatus: { [key: string]: string };
  setOrderStatus: React.Dispatch<
    React.SetStateAction<{ [key: string]: string }>
  >;
}

const SupplierRecentlyPurchasedProducts: React.FC<
  SupplierRecentlyPurchasedProductsProps
> = ({ purchasedProducts, orderStatus, setOrderStatus }) => {
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  // Turkish status progression:
  // Default state: "Sipariş Alındı"
  // Next state: "Sipariş Hazırlanıyor"
  // Final state: "Kuryeye Teslim Edildi"
  const statusFlow = [
    "Sipariş Alındı",
    "Sipariş Hazırlanıyor",
    "Kuryeye Teslim Edildi",
  ];

  const handleStatusChange = async (orderId: string) => {
    // Get the current status or default to "Sipariş Alındı"
    let currentStatus = orderStatus[orderId] || "Sipariş Alındı";
    const currentIndex = statusFlow.indexOf(currentStatus);

    // If already at final state, do nothing
    if (currentIndex === statusFlow.length - 1) return;

    const newStatus = statusFlow[currentIndex + 1];

    try {
      await updateOrderStatus(orderId, newStatus);
      setOrderStatus((prevStatus) => ({
        ...prevStatus,
        [orderId]: newStatus,
      }));
    } catch (error) {
      console.error("Failed to update order status:", error);
    }
  };

  // Close modal when clicking outside
  useEffect(() => {
    const handleOutsideClick = (event: MouseEvent) => {
      if (selectedProduct && (event.target as Element).id === "modal-overlay") {
        setSelectedProduct(null);
      }
    };

    document.addEventListener("click", handleOutsideClick);
    return () => document.removeEventListener("click", handleOutsideClick);
  }, [selectedProduct]);

  return (
    <div className="bg-white p-6 rounded shadow mb-6">
      <h3 className="text-lg font-semibold mb-4 text-gray-800 text-center">
        Recently Purchased Products
      </h3>
      {purchasedProducts.length === 0 ? (
        <p className="text-gray-500 text-sm text-center">
          No recent purchases.
        </p>
      ) : (
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-gray-100 text-gray-600 text-sm text-center">
              <th className="p-2">Product</th>
              <th className="p-2">Quantity</th>
              <th className="p-2">Price</th>
              <th className="p-2">Purchased At</th>
              <th className="p-2">Order Status</th>
            </tr>
          </thead>
          <tbody>
            {purchasedProducts
              .sort(
                (a, b) =>
                  new Date(b.purchasedAt).getTime() -
                  new Date(a.purchasedAt).getTime()
              )
              .map((product) => {
                // Get the current status for this order
                const currentStatus =
                  orderStatus[product.orderId] || "Sipariş Alındı";
                let buttonLabel = "";
                if (currentStatus === "Sipariş Alındı") {
                  buttonLabel = "Sipariş Hazırlanıyor";
                } else if (currentStatus === "Sipariş Hazırlanıyor") {
                  buttonLabel = "Kuryeye Teslim Edildi";
                } else {
                  buttonLabel = currentStatus;
                }
                return (
                  <tr key={product._id} className="border-b text-center">
                    {/* Product Info - Click to show details */}
                    <td
                      className="flex items-center cursor-pointer hover:bg-gray-100 rounded-lg transition duration-300"
                      onClick={() => setSelectedProduct(product)}
                    >
                      <img
                        src={product.image}
                        alt={product.name}
                        className="w-10 h-10 object-cover rounded"
                      />
                      <span className="text-gray-800 font-medium text-sm">
                        {product.name}
                      </span>
                    </td>
                    <td className="p-2 text-sm text-gray-700">
                      {product.quantity}
                    </td>
                    <td className="p-2 text-sm text-gray-700">
                      ${product.price.toFixed(2)}
                    </td>
                    <td className="p-2 text-sm text-gray-500">
                      {new Date(product.purchasedAt).toLocaleString()}
                    </td>
                    {/* Order Status Button */}
                    <td className="p-2">
                      <button
                        className={`px-3 py-1 rounded text-sm font-medium transition-all w-40 text-center ${
                          currentStatus === "Kuryeye Teslim Edildi"
                            ? "bg-green-500 text-white cursor-default"
                            : "bg-blue-500 text-white hover:bg-blue-600"
                        }`}
                        onClick={() => handleStatusChange(product.orderId)}
                        disabled={currentStatus === "Kuryeye Teslim Edildi"}
                      >
                        {buttonLabel}
                      </button>
                    </td>
                  </tr>
                );
              })}
          </tbody>
        </table>
      )}

      {/* Modal Popup for Product Details */}
      {selectedProduct && (
        <div
          id="modal-overlay"
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
        >
          <div className="bg-white rounded-lg shadow-lg p-6 w-[400px] relative">
            {/* Close Button */}
            <button
              className="absolute top-4 right-4 w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center hover:bg-gray-300 transition"
              onClick={() => setSelectedProduct(null)}
            >
              <FiX size={20} className="text-gray-600" />
            </button>
            {/* Modal Content */}
            <h2 className="text-lg font-semibold text-gray-800 mb-4 text-center">
              {selectedProduct.name}
            </h2>
            <div className="flex flex-col items-center">
              <img
                src={selectedProduct.image}
                alt={selectedProduct.name}
                className="w-20 h-20 object-cover rounded-lg mb-4"
              />
              <p className="text-gray-700 text-sm">
                <strong>Category:</strong> {selectedProduct.category}
              </p>
              <p className="text-gray-700 text-sm">
                <strong>Extras:</strong>{" "}
                {selectedProduct.extraSideChoice
                  ?.map((e) => e.name)
                  .join(", ") || "None"}
              </p>
              <p className="text-gray-700 text-sm">
                <strong>Sauces:</strong>{" "}
                {selectedProduct.sauces?.map((s) => s.name).join(", ") ||
                  "None"}
              </p>
              <p className="text-gray-700 text-sm">
                <strong>Purchased At:</strong>{" "}
                {new Date(selectedProduct.purchasedAt).toLocaleString()}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SupplierRecentlyPurchasedProducts;
