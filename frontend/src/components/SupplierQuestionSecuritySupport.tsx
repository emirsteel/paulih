import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  FaShieldAlt,
  FaLock,
  FaKey,
  FaUserShield,
  FaBell,
  FaPhone,
  FaChevronDown,
  FaChevronUp,
  FaEnvelopeOpenText,
  FaMapMarkerAlt,
  FaExclamationTriangle,
  FaFingerprint,
  FaRobot,
} from "react-icons/fa";
const recentLogins = [
  {
    location: "Istanbul, Turkey",
    device: "Windows PC",
    time: "Today, 10:45 AM",
  },
  {
    location: "Izmir, Turkey",
    device: "iPhone 13 Pro",
    time: "Yesterday, 9:30 PM",
  },
  {
    location: "Ankara, Turkey",
    device: "Macbook Air",
    time: "Jan 31, 5:15 PM",
  },
];

const securityStats = {
  securityScore: "85%", // Account security score
  lastPasswordChange: "January 25, 2024", // Date of last password update
  riskAlerts: ["Unusual login attempt from unknown device (Feb 2, 2024)"], // Any security warnings

  securityRiskLevel: "Moderate", // Security risk level
  riskPercentage: 45, // Percentage indicating risk level
  lastThreatDetected: "Unusual login attempt from a new device (Feb 3, 2024)", // Last detected security risk
  securityAdvice:
    "Consider enabling Two-Factor Authentication and updating your password for added security.", // AI-generated security advice
};

const threatLevels = [
  { level: "Low", color: "text-green-500", min: 0, max: 30 },
  { level: "Moderate", color: "text-yellow-500", min: 31, max: 60 },
  { level: "High", color: "text-orange-500", min: 61, max: 80 },
  { level: "Critical", color: "text-red-600", min: 81, max: 100 },
];

const getRiskLevel = (percentage: number) => {
  return (
    threatLevels.find(
      (level) => percentage >= level.min && percentage <= level.max
    ) || threatLevels[0]
  );
};
const securityFeatures = [
  {
    title: "Two-Factor Authentication (2FA)",
    icon: <FaUserShield className="text-lg text-blue-600" />,
    description:
      "Add an extra layer of protection to your account. With 2FA enabled, you’ll be required to enter a verification code from your phone or email during login.",
    steps: [
      "Go to 'Account Settings'.",
      "Navigate to 'Security Settings'.",
      "Enable 'Two-Factor Authentication'.",
      "Choose SMS or an Authenticator App for verification.",
      "Confirm and complete setup.",
    ],
  },
  {
    title: "Password Management",
    icon: <FaKey className="text-lg text-red-600" />,
    description:
      "Ensure your password is secure by using a mix of uppercase, lowercase, numbers, and symbols. Change your password regularly to stay safe.",
    steps: [
      "Use a password manager to store and generate strong passwords.",
      "Avoid using personal information in your password.",
      "Enable auto-lock on your devices to prevent unauthorized access.",
      "Reset your password immediately if you suspect a breach.",
    ],
  },
  {
    title: "Fraud Protection",
    icon: <FaShieldAlt className="text-lg text-green-600" />,
    description:
      "Be aware of fraudulent activities and ensure secure transactions. Always verify customer details and watch for suspicious order patterns.",
    steps: [
      "Verify all orders before proceeding with large transactions.",
      "Monitor account activity regularly.",
      "Enable alerts for suspicious login attempts.",
      "Contact support if you detect any fraudulent activities.",
    ],
  },
  {
    title: "Security Alerts",
    icon: <FaBell className="text-lg text-yellow-600" />,
    description:
      "Receive instant alerts if an unauthorized login or security breach is detected. Stay updated with security notifications in your dashboard.",
  },
];

const faqs = [
  {
    question: "How do I reset my password?",
    answer:
      "Go to 'Account Settings' → 'Security' → Click 'Change Password'. Enter your old password, set a new one, and confirm the change.",
  },
  {
    question: "What should I do if I suspect fraudulent activity?",
    answer:
      "Immediately go to 'Security Alerts' in your dashboard and review account activities. If necessary, report to customer support.",
  },
  {
    question: "How can I enable Two-Factor Authentication?",
    answer:
      "Navigate to 'Security Settings' under Account Settings, enable 2FA, and choose between SMS or an authentication app for added security.",
  },
  {
    question: "How do I contact support for security issues?",
    answer:
      "Use the 'Emergency Support' section below to contact us via phone or email for urgent security concerns.",
  },
];

const SupplierQuestionSecuritySupport: React.FC = () => {
  const [aiSecurityAnalysis, setAiSecurityAnalysis] = useState(securityStats);
  const [currentRiskLevel, setCurrentRiskLevel] = useState(
    getRiskLevel(aiSecurityAnalysis.riskPercentage)
  );
  const [openFeature, setOpenFeature] = useState<number | null>(null);
  const [openFAQ, setOpenFAQ] = useState<number | null>(null);

  const toggleFeature = (index: number) => {
    setOpenFeature(openFeature === index ? null : index);
  };
  const toggleFAQ = (index: number) => {
    setOpenFAQ(openFAQ === index ? null : index);
  };

  useEffect(() => {
    setCurrentRiskLevel(getRiskLevel(aiSecurityAnalysis.riskPercentage));
  }, [aiSecurityAnalysis]);

  return (
    <div className="p-6 bg-gradient-to-b from-gray-100 to-gray-300 min-h-screen">
      <motion.h3
        className="text-2xl font-bold text-gray-900 border-b-2 border-blue-600 pb-4 text-center"
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
      >
        AI Security Assistant – Smart Threat Detection
      </motion.h3>

      {/* 🔐 Live Security Dashboard */}
      <div className="mt-6 flex flex-col items-center">
        <div className="relative w-full max-w-3xl bg-gray-900 rounded-lg shadow-lg p-4">
          {/* Dashboard Header */}
          <div className="flex justify-between items-center px-3 py-2 bg-gray-800 rounded-t-lg">
            <span className="text-gray-400 text-sm">
              Live Security Dashboard
            </span>
            <FaFingerprint className="text-gray-400 text-lg" />
          </div>

          {/* Security Overview */}
          <div className="bg-black p-4 rounded-b-lg text-gray-300">
            <div className="mb-3 flex justify-between">
              <div>
                <h4 className="text-md font-semibold">🔒 Security Score</h4>
                <p className="text-lg font-bold text-green-400">
                  {securityStats.securityScore}
                </p>
              </div>
              <div>
                <h4 className="text-md font-semibold">
                  ⏳ Last Password Change
                </h4>
                <p className="text-sm text-gray-400">
                  {securityStats.lastPasswordChange}
                </p>
              </div>
            </div>

            {/* Recent Logins */}
            <h4 className="text-md font-semibold mt-3">
              📍 Recent Login Locations
            </h4>
            <ul className="text-sm mt-2">
              {recentLogins.map((login, index) => (
                <li
                  key={index}
                  className="flex items-center gap-2 text-gray-400"
                >
                  <FaMapMarkerAlt className="text-blue-400" /> {login.location}{" "}
                  - {login.device} ({login.time})
                </li>
              ))}
            </ul>

            {/* Risk Alerts */}
            {securityStats.riskAlerts.length > 0 && (
              <div className="mt-4 p-3 bg-red-600 text-sm text-white rounded-md">
                <FaExclamationTriangle className="inline mr-2" />
                {securityStats.riskAlerts[0]}
              </div>
            )}
          </div>
        </div>
      </div>

      <p className="text-gray-700 text-center mt-2 text-sm">
        Monitor security risks, receive AI-powered recommendations, and protect
        your account in real time.
      </p>

      {/* 🔍 AI Security Assistant */}
      <div className="mt-6 flex flex-col items-center">
        <div className="relative w-full max-w-3xl bg-gray-900 rounded-lg shadow-lg p-4">
          {/* AI Assistant Header */}
          <div className="flex justify-between items-center px-3 py-2 bg-gray-800 rounded-t-lg">
            <span className="text-gray-400 text-sm">AI Security Assistant</span>
            <FaRobot className="text-gray-400 text-lg" />
          </div>

          {/* AI Security Analysis */}
          <div className="bg-black p-4 rounded-b-lg text-gray-300">
            <div className="mb-3 flex justify-between">
              <div>
                <h4 className="text-md font-semibold">⚠️ Risk Level</h4>
                <p className={`text-lg font-bold ${currentRiskLevel.color}`}>
                  {aiSecurityAnalysis.securityRiskLevel} (
                  {aiSecurityAnalysis.riskPercentage}%)
                </p>
              </div>
              <div>
                <h4 className="text-md font-semibold">
                  🔍 Last Threat Detected
                </h4>
                <p className="text-sm text-gray-400">
                  {aiSecurityAnalysis.lastThreatDetected}
                </p>
              </div>
            </div>

            {/* Security Advice */}
            <h4 className="text-md font-semibold mt-3">
              📢 AI Security Recommendation
            </h4>
            <p className="text-sm text-gray-400 mt-2">
              {aiSecurityAnalysis.securityAdvice}
            </p>
          </div>
        </div>
      </div>

      {/* Security Features Accordion */}
      <div className="mt-6 space-y-4">
        {securityFeatures.map((feature, index) => (
          <div
            key={index}
            className="bg-white p-5 rounded-lg shadow-md border-l-4 border-blue-600 cursor-pointer"
            onClick={() => toggleFeature(index)}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                {feature.icon}
                <h4 className="text-md font-semibold text-gray-800">
                  {feature.title}
                </h4>
              </div>
              <span className="text-gray-600">
                {openFeature === index ? <FaChevronUp /> : <FaChevronDown />}
              </span>
            </div>

            {openFeature === index && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                transition={{ duration: 0.3, ease: "easeInOut" }}
                className="mt-2"
              >
                <p className="text-sm text-gray-700">{feature.description}</p>
                {feature.steps && (
                  <ul className="list-disc list-inside mt-3 space-y-2">
                    {feature.steps.map((step, idx) => (
                      <li key={idx} className="text-sm text-gray-700">
                        {step}
                      </li>
                    ))}
                  </ul>
                )}
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

      {/* Emergency Support */}
      <div className="mt-8 bg-white p-5 rounded-lg shadow-md">
        <h4 className="text-lg font-semibold text-gray-800 mb-3">
          🚨 Emergency Support
        </h4>
        <p className="text-sm text-gray-700">
          If you detect suspicious activity or need urgent help, contact us
          immediately:
        </p>
        <div className="mt-3 flex items-center gap-3">
          <FaPhone className="text-blue-600" />
          <p className="text-sm text-gray-700 font-semibold">
            +90 123 456 78 90
          </p>
        </div>
        <div className="mt-3 flex items-center gap-3">
          <FaShieldAlt className="text-blue-600" />
          <p className="text-sm text-gray-700 font-semibold">
            security@paulih.com
          </p>
        </div>
      </div>
    </div>
  );
};

export default SupplierQuestionSecuritySupport;
