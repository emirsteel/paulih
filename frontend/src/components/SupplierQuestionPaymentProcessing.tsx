import React, { useState } from "react";
import { motion } from "framer-motion";
import {
  FaWallet,
  FaMoneyBillWave,
  FaClock,
  FaChartLine,
  FaBuilding,
  FaCreditCard,
  FaInfoCircle,
  FaChevronDown,
  FaChevronUp,
} from "react-icons/fa";

const paymentSummary = {
  nextPayout: "February 12, 2024",
  payoutFrequency: "Every 2 Weeks on Monday",
  lastPayout: "January 29, 2024",
  totalEarnings: "$4,230.50",
  pendingAmount: "$1,890.75",
  platformFees: "$210.50",
  netEarnings: "$4,020.00",
};

const transactions = [
  {
    id: "#INV-1024",
    date: "February 5, 2024",
    amount: "$850.00",
    status: "Pending",
    details: "Order #5678, Delivery Fee: $10.50, Tax: $30.00",
  },
  {
    id: "#INV-1023",
    date: "January 29, 2024",
    amount: "$1,040.50",
    status: "Paid",
    details: "Order #5432, Delivery Fee: $15.00, Tax: $50.00",
  },
  {
    id: "#INV-1022",
    date: "January 15, 2024",
    amount: "$1,300.25",
    status: "Paid",
    details: "Order #5321, Delivery Fee: $12.75, Tax: $60.00",
  },
  {
    id: "#INV-1021",
    date: "January 1, 2024",
    amount: "$1,039.75",
    status: "Paid",
    details: "Order #5210, Delivery Fee: $10.00, Tax: $40.00",
  },
];

const faqs = [
  {
    question: "How often are payments processed?",
    answer:
      "Payments are processed every two weeks on Monday by Paulih Yemek. The payout includes all earnings from the previous cycle.",
  },
  {
    question: "What payment methods are available?",
    answer:
      "Suppliers can receive payments via bank transfer or PayPal. Ensure your banking details are up to date to avoid delays.",
  },
  {
    question: "How can I track my earnings?",
    answer:
      "Your earnings summary is available on your dashboard, where you can view total earnings, pending amounts, and past payouts.",
  },
  {
    question: "Are there any fees deducted?",
    answer:
      "Yes, a small platform service fee is deducted before your payout. The details are listed in your transaction breakdown.",
  },
];

const bankTransferDetails = [
  {
    bank: "Ziraat Bankası",
    transferTime: "EFT: 09:00 - 17:00 on weekdays",
    minTransferAmount: "No minimum specified",
  },
  {
    bank: "VakıfBank",
    transferTime: "EFT: 09:00 - 17:15 on weekdays",
    minTransferAmount: "No minimum specified",
  },
  {
    bank: "Halkbank",
    transferTime: "EFT: 08:00 - 16:30 on weekdays",
    minTransferAmount: "No minimum specified",
  },
  {
    bank: "Türkiye İş Bankası",
    transferTime: "EFT: 09:00 - 17:00 on weekdays",
    minTransferAmount: "No minimum specified",
  },
  {
    bank: "Garanti BBVA",
    transferTime: "EFT: 08:00 - 17:15 on weekdays",
    minTransferAmount: "No minimum specified",
  },
  {
    bank: "Akbank",
    transferTime: "EFT: 09:00 - 17:00 on weekdays",
    minTransferAmount: "No minimum specified",
  },
  {
    bank: "Yapı Kredi",
    transferTime: "EFT: 09:00 - 16:45 on weekdays",
    minTransferAmount: "No minimum specified",
  },
  {
    bank: "QNB Finansbank",
    transferTime: "EFT: 09:00 - 17:15 on weekdays",
    minTransferAmount: "No minimum specified",
  },
  {
    bank: "DenizBank",
    transferTime: "EFT: 08:00 - 16:30 on weekdays",
    minTransferAmount: "No minimum specified",
  },
  {
    bank: "TEB",
    transferTime: "EFT: 09:00 - 17:15 on weekdays",
    minTransferAmount: "No minimum specified",
  },
  {
    bank: "ING",
    transferTime: "EFT: 09:00 - 17:15 on weekdays",
    minTransferAmount: "No minimum specified",
  },
  {
    bank: "HSBC",
    transferTime: "EFT: 09:00 - 17:00 on weekdays",
    minTransferAmount: "No minimum specified",
  },
  {
    bank: "Fibabanka",
    transferTime: "EFT: 09:00 - 17:15 on weekdays",
    minTransferAmount: "No minimum specified",
  },
  {
    bank: "ICBC Turkey Bank",
    transferTime: "EFT: 09:00 - 17:00 on weekdays",
    minTransferAmount: "No minimum specified",
  },
  {
    bank: "Odeabank",
    transferTime: "EFT: 09:00 - 17:00 on weekdays",
    minTransferAmount: "No minimum specified",
  },
  {
    bank: "Şekerbank",
    transferTime: "EFT: 09:00 - 17:15 on weekdays",
    minTransferAmount: "No minimum specified",
  },
];

const SupplierQuestionPaymentProcessing: React.FC = () => {
  const [openTransaction, setOpenTransaction] = useState<string | null>(null);
  const [openFAQ, setOpenFAQ] = useState<number | null>(null);
  const toggleTransactionDetails = (id: string) => {
    setOpenTransaction(openTransaction === id ? null : id);
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
        Payment Processing Overview
      </motion.h3>

      <p className="text-gray-700 text-center mt-2 text-sm">
        Manage your earnings, view transaction history, and track payouts.
      </p>

      {/* Payment Summary */}
      <div className="mt-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="bg-white p-5 rounded-lg shadow-md">
          <div className="flex items-center gap-3">
            <FaWallet className="text-3xl text-blue-600" />
            <h4 className="text-lg font-semibold text-gray-800">
              Total Earnings
            </h4>
          </div>
          <p className="text-2xl font-bold text-gray-900 mt-3">
            {paymentSummary.totalEarnings}
          </p>
        </div>

        <div className="bg-white p-5 rounded-lg shadow-md">
          <div className="flex items-center gap-3">
            <FaMoneyBillWave className="text-3xl text-green-600" />
            <h4 className="text-lg font-semibold text-gray-800">
              Pending Payments
            </h4>
          </div>
          <p className="text-2xl font-bold text-gray-900 mt-3">
            {paymentSummary.pendingAmount}
          </p>
        </div>

        <div className="bg-white p-5 rounded-lg shadow-md">
          <div className="flex items-center gap-3">
            <FaClock className="text-3xl text-yellow-600" />
            <h4 className="text-lg font-semibold text-gray-800">
              Payout Schedule
            </h4>
          </div>
          <p className="text-md font-semibold text-gray-800 mt-3">
            {paymentSummary.payoutFrequency}
          </p>
        </div>
      </div>

      {/* Transaction History */}
      <div className="mt-8 bg-white p-5 rounded-lg shadow-md">
        <h4 className="text-lg font-semibold text-gray-800 mb-3">
          Payment History
        </h4>
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white">
            <thead>
              <tr className="bg-blue-100 text-blue-700 text-sm">
                <th className="py-3 px-4 text-left">Invoice ID</th>
                <th className="py-3 px-4 text-left">Date</th>
                <th className="py-3 px-4 text-right">Amount</th>
                <th className="py-3 px-4 text-center">Status</th>
              </tr>
            </thead>
            <tbody>
              {transactions.map((transaction) => (
                <tr key={transaction.id} className="text-sm">
                  <td className="py-3 px-4">{transaction.id}</td>
                  <td className="py-3 px-4">{transaction.date}</td>
                  <td className="py-3 px-4 text-right">{transaction.amount}</td>
                  <td className="py-3 px-4 text-center">
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-semibold ${
                        transaction.status === "Paid"
                          ? "bg-green-100 text-green-700"
                          : "bg-yellow-100 text-yellow-700"
                      }`}
                    >
                      {transaction.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Bank Transfer Details */}
      <div className="mt-8 bg-white p-5 rounded-lg shadow-md">
        <h4 className="text-lg font-semibold text-gray-800 mb-3">
          Bank Transfer Details (Turkey)
        </h4>
        <table className="min-w-full bg-white border border-gray-300">
          <thead>
            <tr className="bg-blue-100 text-blue-700 text-sm">
              <th className="py-3 px-4 text-left">Bank</th>
              <th className="py-3 px-4 text-left">Transfer Time</th>
              <th className="py-3 px-4 text-left">Min Transfer Amount</th>
            </tr>
          </thead>
          <tbody>
            {bankTransferDetails.map((bank, index) => (
              <tr key={index} className="text-sm border-t border-gray-200">
                <td className="py-3 px-4">{bank.bank}</td>
                <td className="py-3 px-4">{bank.transferTime}</td>
                <td className="py-3 px-4">{bank.minTransferAmount}</td>
              </tr>
            ))}
          </tbody>
        </table>
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

export default SupplierQuestionPaymentProcessing;
