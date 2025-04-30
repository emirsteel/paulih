import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { fetchAllPayments, updateOrderStatus } from "../services/api";

interface Payment {
  _id: string;
  userId: any;
  amount: number;
  paymentMethod: string;
  status: string;
  orderStatus: string;
  products: {
    productId: string;
    name: string;
    price: number;
    category: string;
    image: string;
    quantity: number;
    extraSideChoice?: { name: string; price: number }[];
    sauces?: { name: string }[];
  }[];
  venue: {
    venueId: any;
    name: string;
    category: string;
    location: { address: string; city: string };
  } | null;
  deliveryAddress: {
    addressTitle: string;
    apartment: string;
    flat: string;
    floor: string;
    phoneNumber: string;
    addressDescription: string;
    latitude: number;
    longitude: number;
    selectedTag: string;
  };
  createdAt: string;
  updatedAt: string;
}

const CourierDashboard = () => {
  const navigate = useNavigate();
  const courierUsername = localStorage.getItem("courierUsername");
  const [payments, setPayments] = useState<Payment[]>([]);

  // Statistics states
  const [totalPayments, setTotalPayments] = useState(0);
  const [totalAmount, setTotalAmount] = useState(0);
  const [totalDelivered, setTotalDelivered] = useState(0);
  const [paymentsByVenue, setPaymentsByVenue] = useState<{
    [key: string]: number;
  }>({});

  useEffect(() => {
    const getPayments = async () => {
      try {
        const response = await fetchAllPayments();
        const data = Array.isArray(response.data)
          ? response.data
          : [response.data];
        setPayments(data);
      } catch (error) {
        console.error("Error fetching payments:", error);
      }
    };

    getPayments();
  }, []);

  // Recompute statistics when payments update
  useEffect(() => {
    setTotalPayments(payments.length);
    setTotalAmount(payments.reduce((acc, payment) => acc + payment.amount, 0));
    setTotalDelivered(
      payments.filter((payment) => payment.orderStatus === "Teslim Edildi")
        .length
    );

    const venueStats = payments.reduce(
      (acc: { [key: string]: number }, payment) => {
        if (payment.venue && payment.venue.name) {
          acc[payment.venue.name] = (acc[payment.venue.name] || 0) + 1;
        }
        return acc;
      },
      {}
    );
    setPaymentsByVenue(venueStats);
  }, [payments]);

  const handleLogout = () => {
    localStorage.removeItem("courierUsername");
    navigate("/courier/login");
  };

  // When the courier confirms delivery, update order status to "Teslim Edildi"
  const handleConfirmDelivery = async (orderId: string) => {
    try {
      const newStatus = "Teslim Edildi";
      await updateOrderStatus(orderId, newStatus);
      setPayments((prevPayments) =>
        prevPayments.map((payment) =>
          payment._id === orderId
            ? { ...payment, orderStatus: newStatus }
            : payment
        )
      );
    } catch (error) {
      console.error("Error updating order status:", error);
    }
  };

  return (
    <div className="p-4 md:p-6">
      <h2 className="text-2xl md:text-3xl font-bold mb-4">Courier Dashboard</h2>
      <p className="mb-4 text-base md:text-lg">Welcome, {courierUsername}!</p>
      <button
        onClick={handleLogout}
        className="mb-8 px-4 py-2 bg-blue-600 text-white rounded shadow hover:bg-blue-700 transition"
      >
        Logout
      </button>

      {/* Statistics Section */}
      <div className="mb-8 grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="p-4 bg-white rounded shadow">
          <h3 className="text-lg font-bold">Total Payments</h3>
          <p className="text-2xl">{totalPayments}</p>
        </div>
        <div className="p-4 bg-white rounded shadow">
          <h3 className="text-lg font-bold">Total Amount</h3>
          <p className="text-2xl">${totalAmount.toFixed(2)}</p>
        </div>
        <div className="p-4 bg-white rounded shadow">
          <h3 className="text-lg font-bold">Total Delivered</h3>
          <p className="text-2xl">{totalDelivered}</p>
        </div>
        <div className="p-4 bg-white rounded shadow">
          <h3 className="text-lg font-bold">Payments by Venue</h3>
          {Object.keys(paymentsByVenue).length === 0 ? (
            <p>N/A</p>
          ) : (
            <ul className="text-sm">
              {Object.entries(paymentsByVenue).map(([venue, count]) => (
                <li key={venue}>
                  {venue}: {count}
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>

      {/* Payments Table */}
      <h3 className="text-xl md:text-2xl font-semibold mb-2">Payments</h3>
      {payments.length === 0 ? (
        <p className="text-base md:text-lg">No payments found.</p>
      ) : (
        // Wrap table in an overflow container for responsiveness
        <div className="overflow-x-auto">
          <table className="min-w-full border-collapse text-sm md:text-base">
            <thead>
              <tr className="bg-gray-100 text-gray-600">
                <th className="p-2 whitespace-nowrap">Payment ID</th>
                <th className="p-2 whitespace-nowrap">Amount</th>
                <th className="p-2 whitespace-nowrap">Payment Method</th>
                <th className="p-2 whitespace-nowrap">Status</th>
                <th className="p-2 whitespace-nowrap">Order Status</th>
                <th className="p-2 whitespace-nowrap">Purchased At</th>
                <th className="p-2 whitespace-nowrap">Venue</th>
                <th className="p-2 whitespace-nowrap">Delivery Address</th>
                <th className="p-2 whitespace-nowrap">Products</th>
                <th className="p-2 whitespace-nowrap">Action</th>
              </tr>
            </thead>
            <tbody>
              {payments.map((payment) => (
                <tr key={payment._id} className="border-b text-center">
                  <td className="p-2">{payment._id}</td>
                  <td className="p-2">
                    {payment.amount !== undefined
                      ? `$${payment.amount.toFixed(2)}`
                      : "N/A"}
                  </td>
                  <td className="p-2">{payment.paymentMethod}</td>
                  <td className="p-2">{payment.status}</td>
                  <td className="p-2">{payment.orderStatus}</td>
                  <td className="p-2">
                    {new Date(payment.createdAt).toLocaleString()}
                  </td>
                  <td className="p-2">
                    {payment.venue ? payment.venue.name : "N/A"}
                  </td>
                  <td className="p-2 text-left">
                    {payment.deliveryAddress ? (
                      <div className="text-xs">
                        <div>{payment.deliveryAddress.addressTitle}</div>
                        <div>{payment.deliveryAddress.addressDescription}</div>
                        <div>{payment.deliveryAddress.phoneNumber}</div>
                      </div>
                    ) : (
                      "N/A"
                    )}
                  </td>
                  <td className="p-2">
                    {payment.products && payment.products.length > 0 ? (
                      <ul className="list-disc ml-4 text-left text-xs">
                        {payment.products.map((product) => (
                          <li key={product.productId}>
                            {product.name} (Qty: {product.quantity})
                          </li>
                        ))}
                      </ul>
                    ) : (
                      "N/A"
                    )}
                  </td>
                  <td className="p-2">
                    {payment.orderStatus === "Kuryeye Teslim Edildi" ? (
                      <button
                        onClick={() => handleConfirmDelivery(payment._id)}
                        className="px-3 py-1 bg-green-500 text-white rounded hover:bg-green-600 transition text-xs"
                      >
                        Teslim Edildi
                      </button>
                    ) : (
                      "-"
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default CourierDashboard;
