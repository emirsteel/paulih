import React, { useState } from "react";
import { X } from "lucide-react";

interface BadgesPopupProps {
  badges: string[]; // Rozet isimleri veya ID'leri
  onClose: () => void;
}

const BadgesPopup: React.FC<BadgesPopupProps> = ({ badges, onClose }) => {
  // Aktif sekmeyi takip et
  const [activeTab, setActiveTab] = useState("Hepsi");

  // Seçili rozeti takip et
  const [selectedBadge, setSelectedBadge] = useState<string | null>(null);

  // Kupon kodu
  const couponCode = "PAULIH2025";

  // Copied state for showing the bubble
  const [copied, setCopied] = useState(false);

  // Örnek rozet detayları (kendi verinizle değiştirin veya sunucudan çekin)
  const badgeDetails = {
    title: "Altın Ödül",
    description:
      "Güzel Hacettepe'nin güzel öğrencilerine Paulih'ten küçük bir hediye.",
    cost: "100₺ (350 TL ve üstü alışverişlerde geçerlidir.)",
    icon: "https://www.redditstatic.com/gold/awards/icon/gold_512.png", // Kendi ikon URL'inizle değiştirin
  };

  // Dummy sekme etiketleri ve ikonları
  const tabs = [
    { label: "Hepsi", icon: "🔔" },
    { label: "Tepkiler", icon: "❤️" },
    { label: "Madalya", icon: "🏅" },
    { label: "Premium", icon: "💎" },
    { label: "Animasyonlu", icon: "✨" },
  ];

  const handleCopyCoupon = () => {
    navigator.clipboard.writeText(couponCode);
    setCopied(true);
    // Hide the "Copied!" box after 2 seconds
    setTimeout(() => {
      setCopied(false);
    }, 2000);
  };

  // Redirect user to /order/food when clicking "Sipariş Et"
  const handleOrderClick = () => {
    window.location.href = "/order/food";
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      {/* Konteyner */}
      <div className="relative flex flex-col bg-white rounded-lg w-full max-w-5xl h-[80vh] shadow-lg">
        {/* Kapatma butonu */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-full hover:bg-gray-200 transition"
        >
          <X className="w-5 h-5 text-gray-600" />
        </button>

        {/* Üst Kısım / Sekmeler */}
        <div className="border-b border-gray-200 px-6 pt-6 pb-0">
          <h2 className="text-xl font-bold mb-3 text-gray-700">Ödül Ver</h2>
          <div className="flex space-x-4 text-sm font-medium">
            {tabs.map((tab) => (
              <button
                key={tab.label}
                onClick={() => setActiveTab(tab.label)}
                className={`flex items-center gap-1 py-2 px-3 rounded hover:bg-gray-100 ${
                  activeTab === tab.label
                    ? "text-blue-600 bg-gray-100"
                    : "text-gray-500"
                }`}
              >
                <span>{tab.icon}</span>
                <span>{tab.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Ana içerik: solda rozetler, sağda detaylar */}
        <div className="flex flex-1 overflow-hidden">
          {/* Sol Kısım: Rozet Grid */}
          <div className="w-2/3 border-r border-gray-200 p-4 overflow-y-auto">
            <div className="grid grid-cols-5 gap-3">
              {badges.map((badge, index) => {
                const isSelected = selectedBadge === badge;
                const badgeImage =
                  badge === "Hacettepe Üniversitesi"
                    ? "https://upload.wikimedia.org/wikipedia/commons/thumb/2/2c/Hacettepe_Üniversitesi_logo.svg/1432px-Hacettepe_Üniversitesi_logo.svg.png"
                    : "https://picsum.photos/50";
                return (
                  <button
                    key={index}
                    onClick={() => setSelectedBadge(badge)}
                    className={`flex flex-col items-center p-2 rounded hover:bg-gray-100 ${
                      isSelected ? "bg-blue-100" : ""
                    }`}
                  >
                    <img
                      src={badgeImage}
                      alt={badge}
                      className="w-10 h-10 mb-1 object-contain"
                    />
                    <span className="text-xs text-gray-600">{badge}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Sağ Kısım: Seçili rozet detayları */}
          <div className="w-1/3 p-4 overflow-y-auto">
            {selectedBadge ? (
              <>
                <div className="flex items-center mb-3">
                  <img
                    src={badgeDetails.icon}
                    alt="Rozet İkonu"
                    className="w-10 h-10 mr-2"
                  />
                  <div>
                    <h3 className="text-lg font-bold text-gray-700">
                      {badgeDetails.title}
                    </h3>
                    <p className="text-yellow-500 font-bold">
                      {badgeDetails.cost}
                    </p>
                  </div>
                </div>
                <p className="text-sm text-gray-600 mb-4">
                  {badgeDetails.description}
                </p>
                {/* Kupon Kodu Bölümü */}
                <label
                  htmlFor="coupon"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Kupon Kodu
                </label>
                <div className="flex items-center mb-4 relative">
                  <input
                    id="coupon"
                    type="text"
                    readOnly
                    value={couponCode}
                    className="border border-gray-300 rounded-l-md px-3 py-2 text-sm w-full focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                  />
                  <button
                    onClick={handleCopyCoupon}
                    className="bg-blue-600 text-white text-sm font-semibold px-4 py-2 rounded-r-md hover:bg-blue-700 transition"
                  >
                    Copy
                  </button>
                  {/* Copied Box */}
                  {copied && (
                    <div className="absolute top-full mt-2 right-0 transform translate-x-0 bg-blue-600 text-white text-sm py-1 px-3 rounded-md flex items-center animate-fadeIn">
                      Copied!
                      <span className="ml-1">✔️</span>
                    </div>
                  )}
                </div>
                <button
                  onClick={handleOrderClick}
                  className="w-full bg-blue-600 text-white font-semibold py-2 rounded hover:bg-blue-700 transition"
                >
                  Sipariş Et
                </button>
              </>
            ) : (
              <div className="text-gray-500 text-sm">
                Detaylarını görmek için soldaki rozetlerden birini seçin.
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default BadgesPopup;
