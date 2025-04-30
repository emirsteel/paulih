import React, { useEffect, useState } from "react";
import { X } from "lucide-react";

interface MapStudentCafeteriaPopupProps {
  onClose: () => void;
}

interface MenuItemProps {
  text: string;
  details: string;
}

interface DayMenu {
  date: string;
  dayNumber: number;
  dayName: string;
  items: MenuItemProps[];
  calories: number;
}

const MapStudentCafeteriaPopup: React.FC<MapStudentCafeteriaPopupProps> = ({
  onClose,
}) => {
  const [showAllergens, setShowAllergens] = useState(false);
  const [selectedDay, setSelectedDay] = useState<number | null>(null);

  // Only available meals
  const menuData: DayMenu[] = [
    {
      date: "21.04.2025 Pazartesi",
      dayNumber: 21,
      dayName: "Pazartesi",
      calories: 1114,
      items: [
        { text: "Çerkez Çorba", details: "(A*C*D) (260)" },
        { text: "Etli Türlü", details: "(A) (300)" },
        { text: "Patatesli Kol Böreği", details: "(A*C*D) (343)" },
        { text: "Hoşaf", details: "(L) (211)" },
      ],
    },
    {
      date: "22.04.2025 Salı",
      dayNumber: 22,
      dayName: "Salı",
      calories: 980,
      items: [
        { text: "Mercimek Çorbası", details: "(A) (220)" },
        { text: "Tavuk Sote", details: "(A*D) (340)" },
        { text: "Pirinç Pilavı", details: "(A) (270)" },
        { text: "Ayran", details: "(D) (150)" },
      ],
    },
    {
      date: "23.04.2025 Çarşamba",
      dayNumber: 23,
      dayName: "Çarşamba",
      calories: 1050,
      items: [
        { text: "Ezogelin Çorbası", details: "(A) (240)" },
        { text: "Kıymalı Makarna", details: "(A*C*D) (450)" },
        { text: "Mevsim Salata", details: "( ) (160)" },
        { text: "Yoğurt", details: "(D) (200)" },
      ],
    },
  ];

  const monthName = new Date().toLocaleString("tr-TR", { month: "long" });

  useEffect(() => {
    const today = new Date().getDate();
    setSelectedDay(today);
  }, []);

  const handleDayClick = (dayNumber: number) => {
    setSelectedDay(dayNumber);
  };

  const getDayName = (dayNumber: number) => {
    const year = 2025;
    const month = 3; // Nisan (April) => 0-indexed
    const date = new Date(year, month, dayNumber);
    return date.toLocaleDateString("tr-TR", { weekday: "long" });
  };

  const selectedMenu = menuData.find((day) => day.dayNumber === selectedDay);

  return (
    <div className="font-sans w-full max-w-[600px] h-[500px] p-4 box-border rounded-lg relative overflow-y-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-4 px-1">
        <h2 className="text-sm font-semibold text-gray-800">
          Öğrenci Kafeteryası
        </h2>
        <button
          onClick={(e) => {
            e.stopPropagation();
            onClose();
          }}
          className="w-7 h-7 flex items-center justify-center rounded-full hover:bg-gray-100 transition-all"
        >
          <X size={16} className="text-gray-600" />
        </button>
      </div>

      {/* Month Title */}
      <div className="text-lg font-bold text-blue-600 mb-2">
        {monthName} 2025
      </div>

      {/* Day Selector */}
      <div className="flex overflow-x-auto overflow-y-hidden space-x-2 mb-4 pb-2">
        {Array.from({ length: 30 }, (_, index) => {
          const day = index + 1;
          const dayName = getDayName(day);

          return (
            <button
              key={day}
              onClick={() => handleDayClick(day)}
              className={`min-w-[60px] flex flex-col items-center justify-center rounded-md p-2 text-center ${
                selectedDay === day
                  ? "bg-blue-600 text-white"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              <span className="text-lg font-bold">{day}</span>
              <span className="text-xs">{dayName}</span>
            </button>
          );
        })}
      </div>

      {/* Selected Day Menu */}
      <div className="text-sm text-gray-600">
        {selectedMenu ? (
          <div className="border border-gray-200 rounded-md p-4 mb-4">
            <p className="font-bold mb-2">{selectedMenu.date}</p>
            <div className="flex flex-col gap-2 mb-2">
              {selectedMenu.items.map((item, idx) => (
                <MenuItem key={idx} text={item.text} details={item.details} />
              ))}
            </div>
            <p className="text-xs text-gray-500">
              <strong>Kalori:</strong> {selectedMenu.calories}
            </p>
          </div>
        ) : (
          <div className="text-gray-400 italic p-4 border border-dashed border-gray-300 rounded-md">
            Bu güne ait yemek listesi bulunamadı.
          </div>
        )}
      </div>

      {/* Allergens Toggle */}
      <div className="mt-6">
        <button
          className="text-blue-600 hover:underline focus:outline-none"
          onClick={() => setShowAllergens(!showAllergens)}
        >
          <strong>Alerjen Listesi:</strong> (A-N)
        </button>
        {showAllergens && (
          <div className="mt-2 p-2 border border-gray-200 rounded">
            <AllergensList />
          </div>
        )}
      </div>
    </div>
  );
};

const MenuItem: React.FC<MenuItemProps> = ({ text, details }) => (
  <div className="flex justify-between p-2 bg-gray-50 rounded">
    <span className="font-bold text-gray-800">{text}</span>
    <span className="text-gray-600">{details}</span>
  </div>
);

const AllergensList = () => (
  <div className="text-sm text-gray-600">
    <p>
      <strong>Alerjen Maddeler veya Ürünler</strong>
    </p>
    <p className="mt-2 leading-relaxed">
      <strong>A.</strong> Gluten içeren tahıllar
      <br />
      <strong>B.</strong> Kabuklular
      <br />
      <strong>C.</strong> Yumurta ve ürünleri
      <br />
      <strong>D.</strong> Süt ve ürünleri (laktoz dahil)
      <br />
      <strong>E.</strong> Balık ve balık ürünleri
      <br />
      <strong>F.</strong> Hardal ve ürünleri
      <br />
      <strong>G.</strong> Yerfıstığı ve ürünleri
      <br />
      <strong>H.</strong> Soya fasulyesi ve ürünleri
      <br />
      <strong>İ.</strong> Kereviz ve ürünleri
      <br />
      <strong>J.</strong> Acı bakla ve ürünleri
      <br />
      <strong>K.</strong> Sert kabuklu meyveler
      <br />
      <strong>L.</strong> Kükürt dioksit ve sülfitler
      <br />
      <strong>M.</strong> Yumuşakçalar
      <br />
      <strong>N.</strong> Susam ve susam ürünleri
    </p>
  </div>
);

export default MapStudentCafeteriaPopup;
