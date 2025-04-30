import React, { useState } from "react";
import { motion } from "framer-motion";
import {
  FaServer,
  FaCode,
  FaKey,
  FaDatabase,
  FaSync,
  FaCloud,
  FaChevronDown,
  FaChevronUp,
} from "react-icons/fa";

const serverSettings = [
  {
    title: "API Keys & Security",
    icon: <FaKey className="text-lg text-blue-600" />,
    description:
      "Manage your API keys for secure integrations with external services.",
    steps: [
      "Navigate to 'Server Settings' → 'API Keys'.",
      "Generate a new API key for integrations.",
      "Store your keys securely and never share them.",
      "Regenerate keys if you suspect unauthorized access.",
    ],
  },
  {
    title: "Database Management",
    icon: <FaDatabase className="text-lg text-green-600" />,
    description:
      "Monitor and optimize your database performance for fast and reliable queries.",
    steps: [
      "View active database connections in the 'Database' tab.",
      "Optimize queries and indexes for faster response times.",
      "Backup your database regularly to prevent data loss.",
      "Monitor query performance using real-time logs.",
    ],
  },
  {
    title: "Server Sync & Backups",
    icon: <FaSync className="text-lg text-yellow-600" />,
    description:
      "Ensure your data remains safe with regular server sync and backup schedules.",
    steps: [
      "Enable auto-backups in the 'Backup Settings'.",
      "Set backup frequency (daily, weekly, monthly).",
      "Restore previous versions in case of server failure.",
      "Monitor sync logs for any potential errors.",
    ],
  },
];

const serverStatus = {
  uptime: "99.98%",
  lastDowntime: "January 28, 2024",
  responseTime: "320ms",
  activeConnections: "12,451",
};

const faqs = [
  {
    question: "How do I generate an API key?",
    answer:
      "Go to 'Server Settings' → 'API Keys'. Click 'Generate New Key' and securely store the key.",
  },
  {
    question: "How often are server backups performed?",
    answer:
      "By default, backups occur weekly. You can configure this in 'Server Sync & Backups'.",
  },
  {
    question: "How do I check server logs?",
    answer:
      "Server logs can be accessed from 'Server Settings' → 'Logs & Monitoring'.",
  },
  {
    question: "What should I do if my server goes down?",
    answer:
      "Check the live server status below. If issues persist, contact support immediately.",
  },
];

const SupplierQuestionServerSettings: React.FC = () => {
  const [openSetting, setOpenSetting] = useState<number | null>(null);
  const [openFAQ, setOpenFAQ] = useState<number | null>(null);

  const toggleSetting = (index: number) => {
    setOpenSetting(openSetting === index ? null : index);
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
        Server Settings & Management
      </motion.h3>

      <p className="text-gray-700 text-center mt-2 text-sm">
        Configure server settings, manage API keys, and monitor real-time server
        performance.
      </p>

      {/* 🚀 Real-Time Server Status */}
      <div className="mt-6 flex flex-col items-center">
        <div className="relative w-full max-w-3xl bg-gray-900 rounded-lg shadow-lg p-4">
          {/* Header */}
          <div className="flex justify-between items-center px-3 py-2 bg-gray-800 rounded-t-lg">
            <span className="text-gray-400 text-sm">Live Server Status</span>
            <FaCloud className="text-gray-400 text-lg" />
          </div>

          {/* Server Stats */}
          <div className="bg-black p-4 rounded-b-lg text-gray-300">
            <div className="mb-3 flex justify-between">
              <div>
                <h4 className="text-md font-semibold">⚡ Uptime</h4>
                <p className="text-lg font-bold text-green-400">
                  {serverStatus.uptime}
                </p>
              </div>
              <div>
                <h4 className="text-md font-semibold">🔴 Last Downtime</h4>
                <p className="text-sm text-gray-400">
                  {serverStatus.lastDowntime}
                </p>
              </div>
            </div>

            {/* Response Time & Connections */}
            <h4 className="text-md font-semibold mt-3">
              📊 Server Performance
            </h4>
            <p className="text-sm text-gray-400 mt-1">
              Response Time:{" "}
              <span className="text-blue-400">{serverStatus.responseTime}</span>
            </p>
            <p className="text-sm text-gray-400">
              Active Connections:{" "}
              <span className="text-blue-400">
                {serverStatus.activeConnections}
              </span>
            </p>
          </div>
        </div>
      </div>

      {/* 🔧 Server Settings Accordion */}
      <div className="mt-6 space-y-4">
        {serverSettings.map((setting, index) => (
          <div
            key={index}
            className="bg-white p-5 rounded-lg shadow-md border-l-4 border-blue-600 cursor-pointer"
            onClick={() => toggleSetting(index)}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                {setting.icon}
                <h4 className="text-md font-semibold text-gray-800">
                  {setting.title}
                </h4>
              </div>
              <span className="text-gray-600">
                {openSetting === index ? <FaChevronUp /> : <FaChevronDown />}
              </span>
            </div>

            {openSetting === index && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                transition={{ duration: 0.3, ease: "easeInOut" }}
                className="mt-2"
              >
                <p className="text-sm text-gray-700">{setting.description}</p>
                <ul className="list-disc list-inside mt-3 space-y-2">
                  {setting.steps.map((step, idx) => (
                    <li key={idx} className="text-sm text-gray-700">
                      {step}
                    </li>
                  ))}
                </ul>
              </motion.div>
            )}
          </div>
        ))}
      </div>

      {/* ❓ FAQ Section */}
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

export default SupplierQuestionServerSettings;
