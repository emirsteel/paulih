import React, { useState } from "react";
import SupplierQuestionOrderInitiation from "./SupplierQuestionOrderInitiation";
import SupplierQuestionAccountSettings from "./SupplierQuestionAccountSettings";
import SupplierQuestionPaymentProcessing from "./SupplierQuestionPaymentProcessing";
import SupplierQuestionInterfaceUsage from "./SupplierQuestionInterfaceUsage";
import SupplierQuestionSecuritySupport from "./SupplierQuestionSecuritySupport";
import SupplierQuestionFAQ from "./SupplierQuestionFAQ";
import SupplierQuestionCommunity from "./SupplierQuestionCommunity";
import SupplierQuestionServerSettings from "./SupplierQuestionServerSettings";

const supportTopics = [
  {
    title: "Order Initiation",
    description: "Learn how to start the order process.",
    icon: "📦",
    content:
      "To place an order, go to the homepage, select your products, and proceed.",
    component: "OrderInitiation",
  },
  {
    title: "Account Settings",
    description: "Keep your account secure and update your information.",
    icon: "⚙️",
    content: "Update your account details in the Settings section.",
    component: "AccountSettings",
  },
  {
    title: "Payment Processing",
    description: "Learn about payment methods and invoices.",
    icon: "💳",
    content: "Explore credit card, bank transfer, and other payment options.",
    component: "PaymentProcessing",
  },
  {
    title: "Interface Usage",
    description: "Use our platform more efficiently.",
    icon: "🖥️",
    content:
      "Navigate the interface, manage orders, and receive notifications.",
    component: "InterfaceUsage",
  },
  {
    title: "Security & Support",
    description: "Tips for keeping your account secure.",
    icon: "🔒",
    content: "Enable two-factor authentication to secure your account.",
    component: "SecuritySupport",
  },
  {
    title: "Frequently Asked Questions",
    description: "Find answers to common questions.",
    icon: "❓",
    content: "Find solutions to frequently encountered issues here.",
    component: "FAQ",
  },
  {
    title: "Community",
    description: "Connect with other suppliers.",
    icon: "👥",
    content: "Join community forums and share your experiences.",
    component: "Community",
  },
  {
    title: "Server Settings",
    description: "Platform integrations and settings.",
    icon: "🔧",
    content: "Manage API keys, integrations, and server configurations.",
    component: "ServerSettings",
  },
];

// Function to dynamically return the selected component
const getComponent = (componentName: string | undefined) => {
  switch (componentName) {
    case "OrderInitiation":
      return <SupplierQuestionOrderInitiation />;
    case "AccountSettings":
      return <SupplierQuestionAccountSettings />;
    case "PaymentProcessing":
      return <SupplierQuestionPaymentProcessing />;
    case "InterfaceUsage":
      return <SupplierQuestionInterfaceUsage />;
    case "SecuritySupport":
      return <SupplierQuestionSecuritySupport />;
    case "FAQ":
      return <SupplierQuestionFAQ />;
    case "Community":
      return <SupplierQuestionCommunity />;
    case "ServerSettings":
      return <SupplierQuestionServerSettings />;
    default:
      return null;
  }
};

const SupplierSupport: React.FC = () => {
  const [selectedTopic, setSelectedTopic] = useState<
    (typeof supportTopics)[number] | null
  >(null);

  return (
    <div className="p-6 rounded-lg flex flex-col h-full">
      {!selectedTopic ? (
        <>
          {/* Header and Search Bar */}
          <div className="bg-white p-6 rounded-lg">
            <h1 className="text-2xl font-bold mb-2">
              Welcome to Supplier Support
            </h1>
            <p className="text-gray-600 mb-4">How can we assist you?</p>
            <div className="flex items-center border rounded-lg p-2 bg-gray-50">
              <input
                type="text"
                placeholder="Type your question here..."
                className="flex-1 p-2 outline-none bg-transparent"
              />
              <button className="bg-blue-500 text-white px-4 py-2 rounded-lg">
                Search
              </button>
            </div>
          </div>

          {/* Support Topics Grid */}
          <h2 className="text-xl font-bold mt-6 mb-4">Support Topics</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {supportTopics.map((topic, index) => (
              <button
                key={index}
                onClick={() => setSelectedTopic(topic)}
                className="bg-white p-4 rounded-lg flex flex-col items-center text-center hover:bg-gray-100 transition"
              >
                <div className="text-4xl mb-2">{topic.icon}</div>
                <h3 className="font-semibold text-lg">{topic.title}</h3>
                <p className="text-gray-600 text-sm mt-1">
                  {topic.description}
                </p>
              </button>
            ))}
          </div>
        </>
      ) : (
        <>
          <div className="bg-white p-6 rounded-lg">
            {/* Back Button */}
            <button
              onClick={() => setSelectedTopic(null)}
              className="text-blue-500 font-semibold mb-4 hover:underline"
            >
              ← Back to Topics
            </button>

            {/* Topic Title and Description */}
            <h2 className="text-2xl font-bold mb-2">{selectedTopic.title}</h2>
            <p className="text-gray-600 mb-4">{selectedTopic.description}</p>

            {/* Topic Content */}
            <div className="bg-gray-100 p-6 rounded-md shadow">
              <p className="text-gray-700">{selectedTopic.content}</p>
            </div>
          </div>

          {/* The selected component will appear BELOW the white container */}
          {selectedTopic?.component && (
            <div className="bg-white p-6 mt-6 rounded-lg">
              {getComponent(selectedTopic.component)}
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default SupplierSupport;
