import React, { useState } from "react";
import { motion } from "framer-motion";
import {
  FaLock,
  FaEnvelope,
  FaUserShield,
  FaBell,
  FaUserAlt,
} from "react-icons/fa";
import { FaChevronDown, FaChevronUp } from "react-icons/fa"; // Chevron Icons

const questions = [
  {
    title: "How do I update my email address?",
    icon: <FaEnvelope className="text-lg text-blue-600" />, // Smaller icon
    details:
      "To update your email address, go to the Account Settings page, locate the 'Email' section, and enter your new email. You’ll receive a confirmation email to verify the update.",
  },
  {
    title: "How do I change my password?",
    icon: <FaLock className="text-lg text-red-600" />,
    details:
      "To change your password, navigate to the Security section of your account settings. Enter your current password, then type and confirm your new password. Make sure to use a strong password with at least 8 characters, including a mix of uppercase, lowercase, numbers, and special symbols.",
  },
  {
    title: "How can I enable two-factor authentication (2FA)?",
    icon: <FaUserShield className="text-lg text-green-600" />,
    details:
      "Two-factor authentication adds an extra layer of security to your account. Go to the Security section, enable 2FA, and link your phone number or authentication app. You’ll be required to enter a verification code each time you log in.",
  },
  {
    title: "How do I manage my notification preferences?",
    icon: <FaBell className="text-lg text-amber-500" />,
    details:
      "You can customize notification settings in the 'Notifications' tab. Choose whether you want to receive email, SMS, or in-app notifications for orders, promotions, and account updates.",
  },
  {
    title: "Can I delete my supplier account?",
    icon: <FaUserAlt className="text-lg text-pink-400" />,
    details:
      "If you want to delete your account permanently, please visit the Account Deletion section under Settings. Keep in mind that this action is irreversible and will remove all your data. Contact support if you need assistance.",
  },
];

const SupplierQuestionAccountSettings: React.FC = () => {
  const [openQuestions, setOpenQuestions] = useState<number[]>([]);

  const toggleQuestion = (index: number) => {
    setOpenQuestions(
      (prevOpenQuestions) =>
        prevOpenQuestions.includes(index)
          ? prevOpenQuestions.filter((q) => q !== index) // Close if already open
          : [...prevOpenQuestions, index] // Open if not already open
    );
  };

  return (
    <div className="p-6 bg-gradient-to-b from-gray-100 to-gray-300 min-h-screen">
      <motion.h3
        className="text-2xl font-bold text-gray-900 border-b-2 border-blue-600 pb-4 text-center"
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
      >
        Account Settings Help Center
      </motion.h3>

      <p className="text-gray-700 text-center mt-2 text-sm">
        Find answers to common questions about managing your supplier account.
      </p>

      <div className="flex flex-col space-y-3 mt-6">
        {questions.map((question, index) => (
          <div
            key={index}
            className="bg-white p-3 rounded-lg shadow-md border-l-4 border-blue-600 cursor-pointer"
            onClick={() => toggleQuestion(index)}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                {question.icon}
                <h4 className="text-md font-semibold text-gray-800">
                  {question.title}
                </h4>
              </div>
              <motion.span
                animate={{ rotate: openQuestions.includes(index) ? 180 : 0 }}
                transition={{ duration: 0.3 }}
                className="text-gray-600"
              >
                <FaChevronDown className="text-xs" />
              </motion.span>
            </div>

            <motion.div
              initial={false}
              animate={{
                height: openQuestions.includes(index) ? "auto" : 0,
                opacity: openQuestions.includes(index) ? 1 : 0,
              }}
              transition={{ duration: 0.3, ease: "easeInOut" }}
              className={`overflow-hidden ${openQuestions.includes(index) ? "mt-2" : ""}`}
            >
              {openQuestions.includes(index) && (
                <p className="p-2 bg-gray-100 rounded-md text-gray-700 text-sm">
                  {question.details}
                </p>
              )}
            </motion.div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SupplierQuestionAccountSettings;
