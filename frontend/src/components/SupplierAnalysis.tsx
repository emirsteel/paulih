import React, { useState, useEffect } from "react";
import { fetchVenueEarnings } from "../services/api";
import { useParams } from "react-router-dom";
import {
  Chart,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  PointElement,
  LineElement,
  ArcElement,
} from "chart.js";

// Register Chart.js components
Chart.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  PointElement,
  LineElement,
  ArcElement
);

const SupplierAnalysis: React.FC = () => {
  const { venueId } = useParams<{ venueId: string }>();
  const [activeTab, setActiveTab] = useState<
    "revenue" | "orders" | "customers"
  >("revenue");
  const summaryData = {
    totalEarnings: "₺12,500",
    totalOrders: 128,
    avgOrderValue: "₺97.65",
    topSellingProduct: "Lahmacun",
  };

  const [weeklyEarnings, setWeeklyEarnings] = useState<number>(0);

  useEffect(() => {
    if (venueId) {
      fetchEarnings(venueId);
    }
  }, [venueId]);

  const fetchEarnings = async (venueId: string) => {
    const earnings = await fetchVenueEarnings(venueId);
    setWeeklyEarnings(earnings);
  };

  // Chart Data (Static for Now, Replace with API Data as Needed)
  const revenueData = {
    labels: [
      "Monday",
      "Tuesday",
      "Wednesday",
      "Thursday",
      "Friday",
      "Saturday",
      "Sunday",
    ],
    datasets: [
      {
        label: "Weekly Earnings (₺)",
        data: [2500, 1800, 2200, 3000, 4000, 5000, weeklyEarnings],
        backgroundColor: "rgba(59, 130, 246, 0.7)",
        borderColor: "rgba(59, 130, 246, 1)",
        borderWidth: 1,
      },
    ],
  };

  const ordersData = {
    labels: [
      "Pazartesi",
      "Salı",
      "Çarşamba",
      "Perşembe",
      "Cuma",
      "Cumartesi",
      "Pazar",
    ],
    datasets: [
      {
        label: "Günlük Sipariş Sayısı",
        data: [20, 25, 30, 35, 50, 80, 100],
        backgroundColor: "rgba(16, 185, 129, 0.7)", // Green
        borderColor: "rgba(16, 185, 129, 1)",
        borderWidth: 1,
      },
    ],
  };

  const customersData = {
    labels: ["Yeni Müşteriler", "Düzenli Müşteriler"],
    datasets: [
      {
        label: "Müşteri Dağılımı",
        data: [40, 60],
        backgroundColor: ["rgba(245, 158, 11, 0.7)", "rgba(220, 38, 38, 0.7)"], // Amber & Red
        borderColor: ["rgba(245, 158, 11, 1)", "rgba(220, 38, 38, 1)"],
        borderWidth: 1,
      },
    ],
  };

  return (
    <div className="bg-white p-6 shadow-lg rounded-md">
      {/* Top Summary Boxes */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 mb-8">
        {[
          {
            label: "Weekly Earnings",
            value: `₺${weeklyEarnings.toLocaleString()}`,
            color: "bg-blue-100 text-blue-700",
          },
          {
            label: "Total Orders",
            value: "128",
            color: "bg-green-100 text-green-700",
          },
          {
            label: "Average Order Value",
            value: "₺97.65",
            color: "bg-amber-100 text-amber-700",
          },
          {
            label: "Top Selling Product",
            value: "Lahmacun",
            color: "bg-red-100 text-red-700",
          },
        ].map((item, index) => (
          <div
            key={index}
            className={`p-5 border border-gray-300 rounded-md shadow-sm ${item.color}`}
          >
            <p className="text-sm font-medium">{item.label}</p>
            <p className="text-2xl font-semibold mt-1">{item.value}</p>
          </div>
        ))}
      </div>

      {/* Tabs Section */}
      <div>
        <div className="flex space-x-4 border-b border-gray-300 mb-4">
          {["revenue", "orders", "customers"].map((key) => (
            <button
              key={key}
              onClick={() =>
                setActiveTab(key as "revenue" | "orders" | "customers")
              }
              className={`py-2 px-6 font-medium transition border-b-2 ${
                activeTab === key
                  ? "text-blue-600 border-blue-500"
                  : "border-transparent text-gray-500 hover:text-gray-700"
              }`}
            >
              {key.charAt(0).toUpperCase() + key.slice(1)} Analysis
            </button>
          ))}
        </div>

        {/* Tab Content with Charts */}
        <div className="mt-4 p-6 border rounded-md bg-gray-50">
          {activeTab === "revenue" && (
            <>
              <h3 className="text-lg font-semibold text-blue-600">
                Revenue Analysis
              </h3>
              <p className="text-gray-600 mt-2">
                Total Weekly Earnings:{" "}
                <span className="font-bold">₺{weeklyEarnings}</span>
              </p>
              <div className="mt-4"></div>
            </>
          )}

          {activeTab === "orders" && (
            <>
              <h3 className="text-lg font-semibold text-green-600">
                Sipariş Dağılımı
              </h3>
              <p className="text-gray-600 mt-2">
                Toplam sipariş sayısı:{" "}
                <span className="font-bold">{summaryData.totalOrders}</span>
              </p>
              <div className="mt-4"></div>
            </>
          )}

          {activeTab === "customers" && (
            <>
              <h3 className="text-lg font-semibold text-amber-600">
                Müşteri Analizi
              </h3>
              <p className="text-gray-600 mt-2">
                En çok sipariş veren müşteri:{" "}
                <span className="font-bold">Ali Veli</span>
              </p>
              <div className="mt-4 w-60 mx-auto"></div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default SupplierAnalysis;
