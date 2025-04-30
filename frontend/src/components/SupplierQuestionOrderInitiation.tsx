import React, { useState } from "react";
import { motion } from "framer-motion";
import { FaUserPlus, FaBars, FaClipboardList } from "react-icons/fa";

const sections = [
  {
    title: "1. Register as a Supplier",
    icon: <FaUserPlus className="text-3xl text-blue-600" />,
    borderColor: "border-blue-600",
    description:
      "Becoming a supplier on our platform is a seamless process designed to help your business grow. Follow these structured steps to start receiving orders, gain credibility, and optimize your revenue.",
    list: [
      {
        title: "Sign up on the platform.",
        details:
          "Begin by creating an account using a valid business email. Your email should be professional (e.g., name@yourbusiness.com) for better credibility. Choose a strong password and set up two-factor authentication for added security. After signing up, verify your email to activate your account and unlock supplier features.",
      },
      {
        title: "Upload business details.",
        details:
          "Fill in essential details such as your restaurant name, operating hours, delivery areas, and accepted payment methods. Ensure your business profile is detailed, accurate, and up to date. Upload high-quality images of your best-selling dishes to attract customers.",
      },
      {
        title: "Provide legal documents.",
        details:
          "Compliance is key. Upload your business license, food safety certifications, tax ID, and health permits to ensure compliance with local laws. Verified businesses are prioritized for visibility and customer trust.",
      },
      {
        title: "Get approval.",
        details:
          "Once verified, you’ll receive an approval confirmation. Use this opportunity to complete your profile, set up pricing, and test order functionality. Your restaurant will go live once everything is reviewed.",
      },
    ],
  },
  {
    title: "2. Navigating the Dashboard",
    icon: <FaBars className="text-3xl text-green-600" />,
    borderColor: "border-green-600",
    description:
      "Your supplier dashboard is the control center for your business. It provides real-time insights into sales, customer interactions, and operational efficiency. Learn how to utilize the tools available for optimal business management.",
  },
  {
    title: "3. Managing Orders",
    icon: <FaClipboardList className="text-3xl text-red-600" />,
    borderColor: "border-red-600",
    description:
      "Handling orders efficiently is crucial for customer satisfaction. Follow these guidelines to process orders seamlessly, reduce delays, and improve ratings.",
    list: [
      {
        title: "New orders appear in the Orders section.",
        details:
          "When a customer places an order, it appears in your dashboard with a unique order ID. You will see the order’s status, estimated preparation time, and any special customer requests.",
      },
      {
        title: "View customer details.",
        details:
          "Each order includes customer information such as their address, contact number, and preferred delivery instructions. Use this information to personalize the experience and ensure smooth order handling.",
      },
      {
        title: "Update order status.",
        details:
          "Keep customers informed by updating order progress. Change statuses from 'Received' to 'Preparing,' 'Ready for Pickup,' or 'Out for Delivery.' Transparency increases trust and improves ratings.",
      },
      {
        title: "Ensure timely delivery.",
        details:
          "Partner with a reliable delivery service or optimize your in-house logistics. Aim for an average delivery time of under 30 minutes to boost customer satisfaction. Efficient deliveries reduce refund requests and improve repeat business rates.",
      },
    ],
  },
];

const SupplierQuestionOrderInitiation: React.FC = () => {
  // Store expanded state for each section separately
  const [openSubSections, setOpenSubSections] = useState<{
    [key: string]: number | null;
  }>({});

  const toggleSubSection = (sectionIndex: number, itemIndex: number) => {
    setOpenSubSections((prev) => ({
      ...prev,
      [`${sectionIndex}-${itemIndex}`]:
        prev[`${sectionIndex}-${itemIndex}`] === itemIndex ? null : itemIndex,
    }));
  };

  return (
    <div className="p-8 space-y-6 bg-gradient-to-b from-gray-100 to-gray-300 min-h-screen">
      <motion.h3
        className="text-3xl font-bold text-gray-900 border-b-2 border-blue-600 pb-4 text-center"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        Supplier Guide: Master Your Food Business
      </motion.h3>

      <div className="flex flex-col space-y-4">
        {sections.map((section, sectionIndex) => (
          <motion.div
            key={sectionIndex}
            className={`bg-white p-6 rounded-lg shadow-md border-l-4 ${section.borderColor}`}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.1 * sectionIndex }}
          >
            <div className="flex items-center gap-3 mb-3">
              {section.icon}
              <h4 className="text-xl font-semibold text-gray-800">
                {section.title}
              </h4>
            </div>
            <p className="text-gray-700 text-md">{section.description}</p>
            {section.list && (
              <ul className="list-none mt-3 space-y-2">
                {section.list.map((item, itemIndex) => (
                  <li key={itemIndex}>
                    <motion.div
                      className="bg-gray-200 p-3 rounded-md cursor-pointer flex justify-between items-center transition-all duration-300 hover:bg-gray-300"
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => toggleSubSection(sectionIndex, itemIndex)}
                    >
                      {item.title}
                      <span className="text-gray-600">
                        {openSubSections[`${sectionIndex}-${itemIndex}`] ===
                        itemIndex
                          ? "▲"
                          : "▼"}
                      </span>
                    </motion.div>
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{
                        height:
                          openSubSections[`${sectionIndex}-${itemIndex}`] ===
                          itemIndex
                            ? "auto"
                            : 0,
                        opacity:
                          openSubSections[`${sectionIndex}-${itemIndex}`] ===
                          itemIndex
                            ? 1
                            : 0,
                      }}
                      transition={{ duration: 0.3 }}
                      className={`overflow-hidden ${openSubSections[`${sectionIndex}-${itemIndex}`] === itemIndex ? "mt-2" : ""}`}
                    >
                      <p className="p-3 bg-gray-100 rounded-md text-gray-700">
                        {item.details}
                      </p>
                    </motion.div>
                  </li>
                ))}
              </ul>
            )}
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default SupplierQuestionOrderInitiation;
