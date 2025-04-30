import React from "react";
import { FaTags, FaShippingFast, FaGift, FaClock } from "react-icons/fa";

const campaigns = [
  {
    id: 1,
    title: "🔥 20% Off All Orders",
    description: "Limited-time deal! Get 20% off on all meals above €15.",
    icon: <FaTags className="text-orange-600 text-3xl" />,
    bgColor: "bg-orange-100 border-l-4 border-orange-500",
  },
  {
    id: 2,
    title: "🚀 Free Delivery",
    description: "Enjoy free delivery on all orders above €10 for this week.",
    icon: <FaShippingFast className="text-blue-600 text-3xl" />,
    bgColor: "bg-blue-100 border-l-4 border-blue-500",
  },
  {
    id: 3,
    title: "🎉 Buy 1 Get 1 Free",
    description: "Order any burger combo and get another one for FREE!",
    icon: <FaGift className="text-green-600 text-3xl" />,
    bgColor: "bg-green-100 border-l-4 border-green-500",
  },
  {
    id: 4,
    title: "⏳ Limited Time Happy Hours",
    description: "Discounted meals from 3PM - 6PM every day!",
    icon: <FaClock className="text-purple-600 text-3xl" />,
    bgColor: "bg-purple-100 border-l-4 border-purple-500",
  },
];

const OrderFoodCampaigns: React.FC = () => {
  return (
    <div className="max-w-screen-xl mx-auto px-6 py-8">
      {/* Header */}
      <h2 className="text-3xl font-extrabold text-gray-900 mb-6 text-center">
        🏆 Ongoing Campaigns & Special Offers
      </h2>

      {/* Campaigns Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
        {campaigns.map((campaign) => (
          <div
            key={campaign.id}
            className={`p-6 rounded-lg shadow-lg ${campaign.bgColor} flex items-center transition-transform transform hover:scale-105`}
          >
            {/* Icon */}
            <div className="mr-4">{campaign.icon}</div>
            {/* Campaign Info */}
            <div>
              <h3 className="text-lg font-bold text-gray-900">
                {campaign.title}
              </h3>
              <p className="text-gray-700 text-sm">{campaign.description}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default OrderFoodCampaigns;
