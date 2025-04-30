import React, { useState } from "react";
import { X } from "lucide-react";

interface UpgradeProps {
  onClose: () => void;
}

const Upgrade: React.FC<UpgradeProps> = ({ onClose }) => {
  const [plan, setPlan] = useState<"monthly" | "annual">("monthly");
  const [upgradeMessage, setUpgradeMessage] = useState("");

  const handleUpgradeClick = () => {
    setUpgradeMessage(
      "Pro'ya yükseltme işlemi çalışmıyor. Paulih, Hacettepe öğrencileri için tamamen ücretsizdir."
    );
    setTimeout(() => {
      setUpgradeMessage("");
      onClose();
    }, 3000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
      {/* Background Overlay */}
      <div
        className="absolute inset-0 bg-black bg-opacity-40 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal Card */}
      <div className="relative w-full max-w-md bg-white rounded-xl shadow-2xl p-6 sm:p-8 z-10">
        {/* Close Button */}
        <button
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition"
          onClick={onClose}
        >
          <X size={20} />
        </button>

        {/* Icon */}
        <div className="flex justify-center mb-4">
          <img
            src="https://api.iconify.design/twemoji:star-struck.svg"
            alt="star"
            className="w-12 h-12"
          />
        </div>

        {/* Title */}
        <h2 className="text-center text-xl font-semibold text-gray-900 mb-2">
          Paulih ile Her Şey Ücretsiz!
        </h2>

        {/* Message */}
        {upgradeMessage && (
          <div className="text-center text-sm text-red-600 mb-2">
            {upgradeMessage}
          </div>
        )}

        {/* Description */}
        <p className="text-center text-sm text-gray-600 mb-6">
          Arkadaşlarınızla bağlantı kurun, içeriklerinizi paylaşın ve
          topluluğunuzu büyütün. Paulih Hacettepe öğrencileri için tamamen
          ücretsizdir.
        </p>

        {/* Plan Selection */}
        <div className="mb-4">
          <div className="flex items-center justify-center gap-2">
            <button
              onClick={() => setPlan("monthly")}
              className={`px-4 py-2 text-sm rounded-full border transition font-medium ${
                plan === "monthly"
                  ? "bg-blue-100 border-blue-300 text-blue-700"
                  : "bg-gray-100 border-gray-300 text-gray-600"
              }`}
            >
              Aylık
            </button>
            <button
              onClick={() => setPlan("annual")}
              className={`px-4 py-2 text-sm rounded-full border transition font-medium ${
                plan === "annual"
                  ? "bg-blue-100 border-blue-300 text-blue-700"
                  : "bg-gray-100 border-gray-300 text-gray-600"
              }`}
            >
              Yıllık
            </button>
            {plan === "annual" && (
              <span className="text-xs text-white bg-blue-600 rounded-full px-2 py-0.5">
                EN İYİ TEKLİF
              </span>
            )}
          </div>
        </div>

        {/* Features */}
        <ul className="text-sm text-gray-700 space-y-2 mb-6">
          <li>• Üniversite hayatınızı tek yerden yönetin.</li>
          <li>• Sosyal çevrenizi genişletin, bağlantılar kurun.</li>
          <li>• Öğrenci dostu fırsatlarla tasarruf edin.</li>
        </ul>

        {/* Note */}
        <div className="text-xs text-center text-gray-500 bg-gray-100 p-2 rounded mb-6">
          Not: Tüm hizmetler Hacettepe öğrencilerine ücretsizdir.
        </div>

        {/* Price */}
        <div className="text-center text-lg font-semibold text-blue-700 mb-4">
          {plan === "monthly" ? "₺59,99 / ay" : "₺599,90 / yıl"}
        </div>

        {/* Button */}
        <button
          onClick={handleUpgradeClick}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2.5 rounded-full text-sm font-semibold transition shadow-md"
        >
          Pro'ya Yükselt
        </button>
      </div>
    </div>
  );
};

export default Upgrade;
