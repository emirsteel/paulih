import React, { useState } from "react";
import { motion } from "framer-motion";
import {
  FaHome,
  FaClipboardList,
  FaChartLine,
  FaCog,
  FaChevronDown,
  FaChevronUp,
} from "react-icons/fa";

const interfaceSections = [
  {
    title: "Dashboard Overview",
    icon: <FaHome className="text-md text-blue-600" />,
    description:
      "The dashboard provides real-time insights into your business. Here, you can track pending orders, revenue, customer trends, and more.",
    features: [
      {
        name: "Order Summary",
        details: "View pending, completed, and canceled orders at a glance.",
      },
      {
        name: "Earnings Overview",
        details: "Monitor daily, weekly, and monthly earnings with charts.",
      },
      {
        name: "Notifications",
        details:
          "Receive instant updates about new orders, customer inquiries, and platform announcements.",
      },
    ],
  },
  {
    title: "Managing Orders",
    icon: <FaClipboardList className="text-md text-green-600" />,
    description:
      "Efficient order management is key to customer satisfaction. Follow these steps to handle orders seamlessly.",
    features: [
      {
        name: "New Orders",
        details:
          "Orders appear in the ‘New Orders’ section. You can accept or decline them within a given timeframe.",
      },
      {
        name: "Processing Orders",
        details:
          "Once accepted, move the order to ‘Preparing’ status and notify the customer of the estimated delivery time.",
      },
      {
        name: "Delivery Updates",
        details:
          "Update the order status to ‘Out for Delivery’ and provide tracking information where applicable.",
      },
      {
        name: "Order Completion",
        details:
          "Mark the order as ‘Completed’ once it has been successfully delivered.",
      },
    ],
  },
  {
    title: "Using Supplier Tools",
    icon: <FaCog className="text-3xl text-yellow-600" />,
    description:
      "Utilize the supplier tools effectively to manage your inventory, track performance, and enhance your operations.",
    features: [
      {
        name: "Menu Management",
        details:
          "Update your menu items, pricing, and availability in real-time.",
      },
      {
        name: "Promotions & Discounts",
        details:
          "Create special discounts or promotions to attract more customers.",
      },
      {
        name: "Customer Support",
        details:
          "Access and respond to customer messages directly from your supplier panel.",
      },
    ],
  },
  {
    title: "Performance & Analytics",
    icon: <FaChartLine className="text-3xl text-purple-600" />,
    description:
      "Gain insights into your business performance with detailed analytics and reports.",
    features: [
      {
        name: "Revenue Breakdown",
        details:
          "View total earnings, daily revenue trends, and transaction history.",
      },
      {
        name: "Order Trends",
        details: "Identify peak order times and customer preferences.",
      },
      {
        name: "Customer Feedback",
        details:
          "Analyze reviews and ratings to improve service quality and satisfaction.",
      },
    ],
  },
];

const faqs = [
  {
    question: "How do I update my menu?",
    answer:
      "Navigate to the ‘Menu Management’ section under Supplier Tools. Here, you can add new items, update pricing, and modify availability.",
  },
  {
    question: "Can I offer discounts?",
    answer:
      "Yes! You can create promotions and discount codes in the ‘Promotions & Discounts’ section.",
  },
  {
    question: "How do I contact customer support?",
    answer:
      "Go to the ‘Customer Support’ tab, where you can chat with customers and respond to their inquiries.",
  },
];

const SupplierQuestionInterfaceUsage: React.FC = () => {
  const [openSection, setOpenSection] = useState<number | null>(null);
  const [openFAQ, setOpenFAQ] = useState<number | null>(null);

  const toggleSection = (index: number) => {
    setOpenSection(openSection === index ? null : index);
  };

  const toggleFAQ = (index: number) => {
    setOpenFAQ(openFAQ === index ? null : index);
  };

  return (
    <div className="p-6 bg-gradient-to-b from-gray-100 to-gray-300 min-h-screen">
      <motion.h3
        className="text-2xl font-bold text-gray-900 border-b-2 border-blue-600 pb-4 text-center"
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
      >
        Interface Usage Guide
      </motion.h3>

      <p className="text-gray-700 text-center mt-2 text-sm">
        Learn how to navigate and maximize the platform’s features.
      </p>

      {/* Computer Screen with Video */}
      <div className="mt-6 flex flex-col items-center">
        <div className="relative w-full max-w-3xl bg-gray-900 rounded-lg shadow-lg p-4">
          {/* Monitor Top Bar */}
          <div className="flex justify-between items-center px-3 py-2 bg-gray-800 rounded-t-lg">
            <div className="flex space-x-2">
              <span className="w-3 h-3 bg-red-500 rounded-full"></span>
              <span className="w-3 h-3 bg-yellow-500 rounded-full"></span>
              <span className="w-3 h-3 bg-green-500 rounded-full"></span>
            </div>
            <span className="text-gray-400 text-xs">
              Paulih Supplier Interface
            </span>
            <div></div>
          </div>

          {/* Video Frame */}
          <div className="bg-black p-2 rounded-b-lg">
            <iframe
              className="w-full h-64 md:h-80 lg:h-96 rounded-lg"
              src="https://www.youtube.com/embed/YOUR_VIDEO_ID"
              title="Supplier Interface Tutorial"
              frameBorder="0"
              allowFullScreen
            ></iframe>
          </div>
        </div>

        {/* Video Source */}
        <p className="mt-3 text-sm text-gray-600">
          Source:{" "}
          <a
            href="https://www.youtube.com/watch?v=YOUR_VIDEO_ID"
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-600 hover:underline"
          >
            https://www.youtube.com/watch?v=YOUR_VIDEO_ID
          </a>
        </p>
      </div>

      {/* Interface Sections */}
      <div className="mt-6 space-y-4">
        {interfaceSections.map((section, index) => (
          <div
            key={index}
            className="bg-white p-5 rounded-lg shadow-md border-l-4 border-blue-600 cursor-pointer"
            onClick={() => toggleSection(index)}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                {section.icon}
                <h4 className="text-md font-semibold text-gray-800">
                  {section.title}
                </h4>
              </div>
              <span className="text-gray-600">
                {openSection === index ? <FaChevronUp /> : <FaChevronDown />}
              </span>
            </div>

            {openSection === index && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                transition={{ duration: 0.3, ease: "easeInOut" }}
                className="mt-2"
              >
                <p className="text-sm text-gray-700">{section.description}</p>
                <ul className="list-disc list-inside mt-3 space-y-2">
                  {section.features.map((feature, idx) => (
                    <li key={idx} className="text-sm text-gray-700">
                      <span className="font-semibold">{feature.name}: </span>
                      {feature.details}
                    </li>
                  ))}
                </ul>
              </motion.div>
            )}
          </div>
        ))}
      </div>

      {/* FAQ Section */}
      <div className="mt-8 bg-white p-5 rounded-lg shadow-md">
        <h4 className="text-lg font-semibold text-gray-800 mb-3">FAQs</h4>
        {faqs.map((faq, index) => (
          <div
            key={index}
            className="border-b border-gray-200 cursor-pointer py-2"
            onClick={() => toggleFAQ(index)}
          >
            <div className="flex justify-between items-center">
              <p className="text-sm text-gray-800">{faq.question}</p>
              {openFAQ === index ? <FaChevronUp /> : <FaChevronDown />}
            </div>
            {openFAQ === index && (
              <p className="text-sm text-gray-600 mt-2">{faq.answer}</p>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default SupplierQuestionInterfaceUsage;
