import React, { useState } from "react";
import { motion } from "framer-motion";
import { FaChevronDown, FaChevronUp } from "react-icons/fa";

const faqs = [
  // Orders
  {
    category: "Orders",
    questions: [
      {
        question: "How do I accept an order?",
        answer:
          "Go to your dashboard, navigate to 'New Orders', and click 'Accept' to confirm the order.",
      },
      {
        question: "Can I cancel an order after accepting it?",
        answer:
          "Yes, but only under special circumstances. Contact customer support if you need to cancel an order after acceptance.",
      },
      {
        question: "How do I update the status of an order?",
        answer:
          "You can update an order's status from 'Processing' to 'Out for Delivery' and then to 'Completed' through the order management panel.",
      },
      {
        question: "What happens if I miss an order notification?",
        answer:
          "If you do not respond to an order within the set timeframe, it may be automatically canceled, and your acceptance rate could be affected.",
      },
      {
        question: "How do I handle delayed orders?",
        answer:
          "Contact the customer via the platform’s messaging system and update the estimated delivery time in the order details.",
      },
    ],
  },

  // Payments
  {
    category: "Payments",
    questions: [
      {
        question: "When are payouts processed?",
        answer:
          "Payments are processed every two weeks on Monday by Paulih Yemek. You can check your payout history in your account.",
      },
      {
        question: "What payment methods are available?",
        answer:
          "We offer payments via bank transfer and PayPal. Ensure your bank details are updated for seamless transactions.",
      },
      {
        question: "How do I track my earnings?",
        answer:
          "Your earnings summary is available in your dashboard, where you can track total earnings, pending payouts, and transaction history.",
      },
      {
        question: "Are there any platform fees?",
        answer:
          "Yes, a small service fee is deducted before each payout. The detailed breakdown is available in your transaction history.",
      },
      {
        question: "What is the minimum payout amount?",
        answer:
          "The minimum payout threshold is 100 TRY. Any amount below will be carried over to the next payout cycle.",
      },
    ],
  },

  // Account & Security
  {
    category: "Account & Security",
    questions: [
      {
        question: "How do I change my password?",
        answer:
          "Go to 'Account Settings', select 'Security', and click 'Change Password'. Enter your old password and set a new one.",
      },
      {
        question: "How can I enable Two-Factor Authentication (2FA)?",
        answer:
          "Navigate to 'Security Settings' under Account Settings, enable 2FA, and choose SMS or an authenticator app for verification.",
      },
      {
        question: "How do I update my bank details for payments?",
        answer:
          "Go to 'Payment Settings' under your profile and update your bank details. Changes may take up to 24 hours to be verified.",
      },
      {
        question: "What should I do if I detect unauthorized access?",
        answer:
          "Change your password immediately and enable Two-Factor Authentication (2FA). Contact support if you notice any suspicious activity.",
      },
      {
        question: "How do I deactivate my account?",
        answer:
          "You can request account deactivation by contacting customer support. Keep in mind that this action is irreversible.",
      },
    ],
  },

  // Customer Interaction
  {
    category: "Customer Interaction",
    questions: [
      {
        question: "How can I respond to customer inquiries?",
        answer:
          "You can respond to customer messages through the built-in messaging system on your dashboard.",
      },
      {
        question: "What should I do if a customer requests a refund?",
        answer:
          "Direct them to the platform’s refund policy. Refund requests are handled based on order completion and delivery confirmation.",
      },
      {
        question: "Can I message a customer after an order is completed?",
        answer:
          "Yes, you can message customers regarding feedback or issues related to the completed order within 24 hours after delivery.",
      },
      {
        question: "What if a customer provides incorrect delivery details?",
        answer:
          "Contact the customer via the messaging system to verify the correct address before proceeding with delivery.",
      },
      {
        question: "How do I handle negative reviews?",
        answer:
          "Respond professionally, acknowledge the issue, and offer a resolution where possible. Reviews help improve service quality.",
      },
    ],
  },

  // Troubleshooting & Technical Support
  {
    category: "Troubleshooting & Technical Support",
    questions: [
      {
        question: "Why is my dashboard not loading?",
        answer:
          "Try clearing your browser cache, refreshing the page, or switching to a different device. If the issue persists, contact support.",
      },
      {
        question: "What should I do if my order notifications aren’t working?",
        answer:
          "Check your notification settings and ensure they are enabled in both your browser and account preferences.",
      },
      {
        question: "Why is my payout delayed?",
        answer:
          "Payouts may be delayed due to bank processing times. Check your payout history and ensure your bank details are correct.",
      },
      {
        question: "What should I do if I’m unable to log in?",
        answer:
          "Use the 'Forgot Password' option to reset your credentials. If the issue continues, contact support for assistance.",
      },
      {
        question: "How do I report a bug?",
        answer:
          "Go to the 'Support' section and submit a bug report detailing the issue. Our team will investigate and provide a resolution.",
      },
    ],
  },
];

const SupplierQuestionFAQ: React.FC = () => {
  const [openCategory, setOpenCategory] = useState<number | null>(null);
  const [openQuestion, setOpenQuestion] = useState<number | null>(null);

  const toggleCategory = (index: number) => {
    setOpenCategory(openCategory === index ? null : index);
    setOpenQuestion(null);
  };

  const toggleQuestion = (index: number) => {
    setOpenQuestion(openQuestion === index ? null : index);
  };

  return (
    <div className="p-6 bg-gradient-to-b from-gray-100 to-gray-300 min-h-screen">
      <motion.h3
        className="text-2xl font-bold text-gray-900 border-b-2 border-blue-600 pb-4 text-center"
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
      >
        Frequently Asked Questions
      </motion.h3>

      <p className="text-gray-700 text-center mt-2 text-sm">
        Find answers to common questions regarding orders, payments, platform
        usage, and security.
      </p>

      {/* FAQ Categories */}
      <div className="mt-6 space-y-4">
        {faqs.map((category, index) => (
          <div
            key={index}
            className="bg-white p-5 rounded-lg shadow-md border-l-4 border-blue-600 cursor-pointer"
          >
            <div
              className="flex items-center justify-between"
              onClick={() => toggleCategory(index)}
            >
              <h4 className="text-md font-semibold text-gray-800">
                {category.category}
              </h4>
              <span className="text-gray-600">
                {openCategory === index ? <FaChevronUp /> : <FaChevronDown />}
              </span>
            </div>

            {openCategory === index &&
              category.questions.map((faq, qIndex) => (
                <div
                  key={qIndex}
                  className="mt-3 border-b border-gray-200 py-2 cursor-pointer"
                >
                  <div
                    className="flex justify-between"
                    onClick={() => toggleQuestion(qIndex)}
                  >
                    <p className="text-sm text-gray-800">{faq.question}</p>
                    {openQuestion === qIndex ? (
                      <FaChevronUp />
                    ) : (
                      <FaChevronDown />
                    )}
                  </div>
                  {openQuestion === qIndex && (
                    <p className="text-sm text-gray-600 mt-2">{faq.answer}</p>
                  )}
                </div>
              ))}
          </div>
        ))}
      </div>
    </div>
  );
};

export default SupplierQuestionFAQ;
