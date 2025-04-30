import React, { useState, useContext } from "react";
import { ShieldCheck, Link } from "lucide-react";
import { toast } from "react-toastify";
import axios from "axios";
import { AuthUserContext } from "../../../context/AuthUserContext";

const UserSettingsDeactivateAccount: React.FC = () => {
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [isDeactivated, setIsDeactivated] = useState(false);

  const { user } = useContext(AuthUserContext); // 🔥 Get user data

  const handleDeactivateAccount = async () => {
    console.log("Deactivate button clicked!"); // ✅ Debugging log

    if (!user || !user._id) {
      toast.error("User not logged in.");
      console.log("No user ID found!"); // ✅ Debugging log
      return;
    }

    setLoading(true);
    try {
      console.log(`Sending deactivation request for user: ${user._id}`); // ✅ Debugging log

      const response = await axios.put(
        "http://localhost:5001/api/users/deactivate",
        {},
        { withCredentials: true }
      );

      console.log("Deactivation Response:", response.data); // ✅ Debugging log

      if (response.status === 200 && response.data.isDeactivated) {
        toast.success("Your account has been deactivated.");
        setIsDeactivated(true);
      } else {
        toast.error("Failed to deactivate account.");
      }
    } catch (error) {
      console.error("Error deactivating account:", error);
      toast.error("Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full h-full">
      {/* Header Section */}
      <div className="relative w-full h-64 bg-gradient-to-r from-gray-700 via-blue-700 to-blue-500 flex flex-col items-center justify-start pt-16 text-white">
        <h1 className="relative text-3xl font-bold z-10">Deactivate Account</h1>
        <p className="relative text-white/90 text-sm z-10">
          Temporarily disable your account.
        </p>
      </div>

      {/* Steps Section */}
      <div className="max-w-3xl mx-auto px-6 py-8">
        {step === 1 && (
          <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
            <h3 className="text-lg font-semibold text-gray-800 mb-2">
              What does deactivating your account mean?
            </h3>
            <p className="text-gray-700 mb-4">
              Deactivating your account will hide your profile and all of your
              activities. You can reactivate your account anytime by logging
              back in.
            </p>
            <button
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-md transition"
              onClick={() => setStep(2)}
            >
              Continue
            </button>
          </div>
        )}

        {step === 2 && (
          <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
            <h3 className="text-lg font-semibold text-gray-800 mb-2">
              Are you sure you want to deactivate your account?
            </h3>
            <p className="text-gray-700 mb-4">
              You can reactivate your account anytime by logging back in.
            </p>
            <div className="flex justify-between">
              <button
                className="bg-gray-400 hover:bg-gray-500 text-white font-medium py-2 px-4 rounded-md transition"
                onClick={() => setStep(1)}
              >
                Cancel
              </button>
              <button
                className="bg-red-600 hover:bg-red-700 text-white font-medium py-2 px-4 rounded-md transition"
                onClick={handleDeactivateAccount}
                disabled={loading || isDeactivated}
              >
                {loading ? "Deactivating..." : "Deactivate"}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default UserSettingsDeactivateAccount;
