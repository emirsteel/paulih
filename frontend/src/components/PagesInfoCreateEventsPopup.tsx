// src/components/PagesInfoCreateEventsPopup.tsx
import React, { useState } from "react";
import {
  X,
  Calendar,
  MapPin,
  Users,
  ArrowLeft,
  Plus,
  ChevronDown,
  Clock,
  Tag,
  MessageSquare,
  Heading,
} from "lucide-react";
import Input from "../ui/Input";
import { createEvent } from "../services/api"; // Import the createEvent API function

interface CategoryOption {
  label: string;
  emoji: string;
}

const categoryOptions: CategoryOption[] = [
  { label: "Akademik", emoji: "🎓" },
  { label: "Atölye", emoji: "🛠" },
  { label: "Sosyal", emoji: "🍻" },
  { label: "Seminer", emoji: "🤝" },
  { label: "Kariyer", emoji: "💼" },
  { label: "Parti", emoji: "🎉" },
  { label: "Sergi", emoji: "🖼" },
  { label: "Yemek", emoji: "🍽" },
];

// ----- Helper functions for date/time formatting -----
function formatDateToDay(dateStr: string) {
  if (!dateStr) return "--";
  const d = new Date(dateStr);
  return d.toLocaleDateString("en-US", { weekday: "short" }).toUpperCase();
}

function formatDateToBadge(dateStr: string) {
  if (!dateStr) return "--";
  const d = new Date(dateStr);
  return d
    .toLocaleDateString("en-US", { month: "short", day: "numeric" })
    .toUpperCase();
}

function formatTimeToBadge(timeStr: string) {
  if (!timeStr) return "-";
  const [hour, minute] = timeStr.split(":").map(Number);
  let h = hour % 12 || 12;
  const suffix = hour < 12 ? "AM" : "PM";
  return `${h}:${minute.toString().padStart(2, "0")} ${suffix}`;
}

interface PagesInfoCreateEventsPopupProps {
  onClose: () => void;
  pageId: string; // New prop: the page id for the event
}

const PagesInfoCreateEventsPopup: React.FC<PagesInfoCreateEventsPopupProps> = ({
  onClose,
  pageId,
}) => {
  // Step state: 1 = Etkinlik Hakkında, 2 = Tarih ve Yer, 3 = Etkinlik Özeti
  const [step, setStep] = useState(1);

  // Step 1 fields
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState<CategoryOption | null>(null);
  const [description, setDescription] = useState("");
  const [photo, setPhoto] = useState<File | null>(null);
  const [showCategoryDropdown, setShowCategoryDropdown] = useState(false);

  // Step 2 fields
  const [date, setDate] = useState("");
  const [startTime, setStartTime] = useState("13:00");
  const [endTime, setEndTime] = useState("17:00");
  const [locationType, setLocationType] = useState<"fiziksel" | "sanal">(
    "fiziksel"
  );
  const [locationLink, setLocationLink] = useState("");

  // Navigation functions
  const goNext = () => {
    if (step < 3) setStep(step + 1);
  };
  const goBack = () => {
    if (step > 1) setStep(step - 1);
  };
  const handleCancel = () => {
    onClose();
  };

  /**
   * Final submission: call createEvent from your API
   */
  const handleCreateEvent = async () => {
    try {
      const eventData = {
        title,
        category: category?.label || "",
        description,
        date,
        startTime,
        endTime,
        locationType,
        locationLink,
        photo, // file or null
        pageId, // include the page id here
      };

      const response = await createEvent(eventData);
      console.log("Event created successfully:", response);
      onClose();
    } catch (error) {
      console.error("Failed to create event:", error);
    }
  };

  // Render progress, header, summary card, etc.
  // (Your existing renderProgress, renderStepHeader, and renderSummaryCard functions remain unchanged.)

  const renderProgress = () => (
    <div className="px-4 py-2">
      <div className="flex items-center justify-between">
        <div className="flex flex-col items-center">
          <div
            className={`w-8 h-8 rounded-full border-2 flex items-center justify-center text-sm font-semibold ${
              step >= 1
                ? "border-blue-600 bg-blue-600 text-white"
                : "border-gray-300 bg-white text-gray-500"
            }`}
          >
            1
          </div>
          <span className="mt-1 text-xs text-gray-700">Details</span>
        </div>
        <div
          className={`flex-1 border-t ${
            step >= 2 ? "border-blue-600" : "border-gray-300"
          }`}
        />
        <div className="flex flex-col items-center">
          <div
            className={`w-8 h-8 rounded-full border-2 flex items-center justify-center text-sm font-semibold ${
              step >= 2
                ? "border-blue-600 bg-blue-600 text-white"
                : "border-gray-300 bg-white text-gray-500"
            }`}
          >
            2
          </div>
          <span className="mt-1 text-xs text-gray-700">
            Date &amp; Location
          </span>
        </div>
        <div
          className={`flex-1 border-t ${
            step === 3 ? "border-blue-600" : "border-gray-300"
          }`}
        />
        <div className="flex flex-col items-center">
          <div
            className={`w-8 h-8 rounded-full border-2 flex items-center justify-center text-sm font-semibold ${
              step === 3
                ? "border-blue-600 bg-blue-600 text-white"
                : "border-gray-300 bg-white text-gray-500"
            }`}
          >
            3
          </div>
          <span className="mt-1 text-xs text-gray-700">Özet</span>
        </div>
      </div>
    </div>
  );

  const renderStepHeader = () => {
    let Icon;
    let headerText = "";
    if (step === 1) {
      Icon = Calendar;
      headerText = "Etkinlik Bilgileri";
    } else if (step === 2) {
      Icon = MapPin;
      headerText = "Tarih & Konum";
    } else if (step === 3) {
      Icon = Users;
      headerText = "Etkinlik Özeti";
    }

    return (
      <div className="flex items-center justify-between px-6 py-4 bg-white rounded-t-md">
        <div className="flex items-center space-x-2">
          <Icon className="w-5 h-5 text-blue-600" />
          <h2 className="text-base font-medium text-gray-800">{headerText}</h2>
        </div>
        <button
          onClick={handleCancel}
          className="p-2 rounded-full hover:bg-gray-100 transition"
          aria-label="Kapat"
        >
          <X className="w-4 h-4 text-gray-500" />
        </button>
      </div>
    );
  };

  const renderSummaryCard = () => {
    const dayOfWeek = formatDateToDay(date);
    const startTimeBadge = formatTimeToBadge(startTime);
    const leftBadge = `${dayOfWeek} ${startTimeBadge}`;
    const rightBadge = formatDateToBadge(date);
    const locationLabel =
      locationType === "sanal"
        ? `Konum • (Sanal) ${locationLink || "-"}`
        : `Konum • ${locationLink || "-"}`;

    return (
      <div className="bg-white border border-gray-200 rounded-xl p-4 shadow-sm relative">
        {/* Image */}
        <div className="relative w-full h-40 overflow-hidden rounded-lg mb-4">
          <img
            src={
              photo
                ? URL.createObjectURL(photo)
                : "https://via.placeholder.com/400x160?text=Etkinlik+Fotoğrafı"
            }
            alt={title || "Etkinlik Fotoğrafı"}
            className="w-full h-full object-cover"
          />

          {/* Left Badge */}
          <span className="absolute top-3 left-3 bg-emerald-100 text-emerald-700 text-[11px] px-3 py-1 rounded-full font-medium shadow-sm">
            {leftBadge}
          </span>

          {/* Right Badge */}
          <span className="absolute top-3 right-3 bg-gray-100 text-gray-800 text-xs px-3 py-1 rounded-full font-medium shadow-sm">
            {rightBadge}
          </span>
        </div>

        {/* Title */}
        <h3 className="text-base font-semibold text-gray-900 truncate">
          {title || "Etkinlik Başlığı"}
        </h3>

        {/* Location */}
        <p className="text-sm text-gray-500 mt-1 truncate">{locationLabel}</p>

        {/* Attendees */}
        <div className="flex items-center space-x-1 mt-3">
          {[1, 2, 3, 4].map((num) => (
            <img
              key={num}
              src={`https://i.pravatar.cc/32?img=${num + 10}`}
              alt="attendee"
              className="w-6 h-6 rounded-full border border-white shadow-sm"
            />
          ))}
          <span className="text-xs text-gray-500 ml-2">+2</span>
        </div>
      </div>
    );
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-md shadow-xl w-full max-w-md mx-4">
        {renderStepHeader()}
        {renderProgress()}
        <div className="p-4 space-y-4">
          {step === 1 && (
            <div className="space-y-6">
              {/* Title */}
              <div className="space-y-1">
                <label
                  htmlFor="event-title"
                  className="block text-sm font-medium text-gray-700"
                >
                  Etkinlik Başlığı
                </label>
                <Input
                  id="event-title"
                  placeholder="Etkinlik Başlığı"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                />
              </div>

              {/* Category Dropdown */}
              <div className="space-y-1 relative">
                <label className="block text-sm font-medium text-gray-700">
                  Kategori
                </label>
                <div
                  onClick={() => setShowCategoryDropdown(!showCategoryDropdown)}
                  className="flex items-center justify-between px-3 py-2 bg-white border border-gray-300 rounded-md cursor-pointer hover:border-gray-400 transition"
                >
                  <span className="text-sm text-gray-700">
                    {category
                      ? `${category.emoji} ${category.label}`
                      : "Kategori seçin"}
                  </span>
                  <ChevronDown className="w-4 h-4 text-gray-500" />
                </div>
                {showCategoryDropdown && (
                  <div className="absolute z-20 mt-1 w-full bg-white border border-gray-200 rounded-md shadow-lg">
                    {categoryOptions.map((cat) => (
                      <div
                        key={cat.label}
                        onClick={() => {
                          setCategory(cat);
                          setShowCategoryDropdown(false);
                        }}
                        className="px-3 py-2 flex items-center space-x-2 hover:bg-blue-50 cursor-pointer"
                      >
                        <span>{cat.emoji}</span>
                        <span className="text-sm text-gray-700">
                          {cat.label}
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div className="space-y-1 w-full">
                <label
                  htmlFor="event-description"
                  className="block text-sm font-medium text-gray-700"
                >
                  Açıklama
                </label>
                <Input
                  id="event-description"
                  as="textarea"
                  placeholder="Kısa bir açıklama yazın..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="min-h-[100px] w-full"
                />
              </div>

              {/* Photo Upload */}
              <div className="space-y-1">
                <label className="block text-sm font-medium text-gray-700">
                  Etkinlik Fotoğrafı
                </label>
                <input
                  type="file"
                  onChange={(e) =>
                    setPhoto(e.target.files ? e.target.files[0] : null)
                  }
                  className="block w-full text-sm border border-gray-300 rounded-md px-3 py-2 text-gray-700 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-600 hover:file:bg-blue-100"
                />
              </div>
            </div>
          )}
          {step === 2 && (
            <div className="space-y-4">
              <div>
                <Input
                  id="event-date"
                  type="date"
                  placeholder="Tarih Seçin"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                />
              </div>
              <div className="flex space-x-2">
                <div className="flex-1">
                  <Input
                    id="event-start-time"
                    type="time"
                    placeholder="Başlangıç Saati"
                    value={startTime}
                    onChange={(e) => setStartTime(e.target.value)}
                  />
                </div>
                <div className="flex-1">
                  <Input
                    id="event-end-time"
                    type="time"
                    placeholder="Bitiş Saati"
                    value={endTime}
                    onChange={(e) => setEndTime(e.target.value)}
                  />
                </div>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-700 mb-2">
                  Yer Türü
                </p>
                <div className="space-y-2">
                  {["Fiziksel", "Sanal"].map((item) => {
                    const isSelected = locationType === item.toLowerCase();
                    return (
                      <button
                        key={item}
                        onClick={() =>
                          setLocationType(
                            item.toLowerCase() as "fiziksel" | "sanal"
                          )
                        }
                        className={`w-full flex items-center px-3 py-2 rounded-lg text-sm transition ${
                          isSelected
                            ? "bg-blue-50 text-blue-600 font-medium"
                            : "text-gray-600 hover:bg-gray-100 hover:text-gray-800"
                        }`}
                      >
                        {isSelected && (
                          <div className="w-6 h-6 mr-2 flex-shrink-0 rounded-full bg-blue-600 text-white flex items-center justify-center text-xs">
                            ✓
                          </div>
                        )}
                        <span>{item}</span>
                      </button>
                    );
                  })}
                </div>
              </div>
              <div className="mt-4">
                {locationType === "sanal" ? (
                  <div className="relative">
                    <Input
                      id="event-location-link"
                      placeholder="Toplantı linkini yapıştırın"
                      value={locationLink}
                      onChange={(e) => setLocationLink(e.target.value)}
                    />
                    <button
                      onClick={async () => {
                        try {
                          const text = await navigator.clipboard.readText();
                          setLocationLink(text);
                        } catch (error) {
                          console.error("Yapıştırma hatası:", error);
                        }
                      }}
                      className="absolute inset-y-0 right-0 flex items-center px-2 bg-blue-600 text-white text-xs rounded-r-md hover:bg-blue-700"
                    >
                      Yapıştır
                    </button>
                  </div>
                ) : (
                  <Input
                    id="event-location-link"
                    placeholder="Mekan adresi girin"
                    value={locationLink}
                    onChange={(e) => setLocationLink(e.target.value)}
                  />
                )}
              </div>
            </div>
          )}

          {step === 3 && <div className="space-y-4">{renderSummaryCard()}</div>}
        </div>

        <div className="border-t p-4 space-y-3">
          {step > 1 && (
            <button
              onClick={goBack}
              className="w-full text-sm text-gray-700 border border-gray-300 rounded-md py-2 hover:bg-gray-50 transition"
            >
              Geri
            </button>
          )}

          {step < 3 ? (
            <button
              onClick={goNext}
              className="w-full bg-blue-600 text-white px-4 py-2 text-sm rounded-md hover:bg-blue-700 transition"
            >
              İleri
            </button>
          ) : (
            <button
              onClick={handleCreateEvent}
              className="w-full bg-blue-600 text-white px-4 py-2 text-sm rounded-md hover:bg-blue-700 transition"
            >
              Etkinlik Oluştur
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default PagesInfoCreateEventsPopup;
