// src/pages/UserSettingsCreatePage.tsx
import React, { useState, useRef, useEffect } from "react";
import axios from "axios";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";
import Input from "../../../ui/Input";
import { Edit, Link, X } from "lucide-react";
import {
  FaInstagram,
  FaFacebookF,
  FaTwitter,
  FaTiktok,
  FaLinkedinIn,
  FaUsers,
  FaCalendarAlt,
  FaInfoCircle,
} from "react-icons/fa";
import {
  IoMdGlobe,
  IoMdPin,
  IoMdCall,
  IoMdCalendar,
  IoMdTime,
} from "react-icons/io";
import { DotLottieReact } from "@lottiefiles/dotlottie-react";
import StepProgressBar from "./StepProgressBar";

interface SuccessPopupProps {
  onClose: () => void;
}

const SuccessPopup: React.FC<SuccessPopupProps> = ({ onClose }) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40 backdrop-blur-sm p-4">
      <div className="relative bg-white w-full max-w-md p-8 rounded-2xl shadow-lg flex flex-col items-center space-y-4 animate-fade-in">
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-3 right-3 p-1 rounded-full hover:bg-gray-100 transition"
        >
          <X size={20} className="text-gray-500" />
        </button>

        {/* Lottie animation */}
        <DotLottieReact
          src="https://lottie.host/f96107f9-8851-4652-b355-dc1edd0c8ba0/6QvFJtDIox.lottie"
          loop={false}
          autoplay
          className="w-48 h-48"
        />

        {/* Success message */}
        <h2 className="text-2xl font-bold text-green-600 text-center">
          Sayfa Başarıyla Oluşturuldu
        </h2>

        {/* Description text */}
        <div className="text-sm text-gray-600 text-center space-y-2">
          <p>
            Oluşturduğunuz sayfa, profiliniz altında listelenecek ve kolayca
            erişilebilecektir.
          </p>
          <p>
            Ayarlardan <span className="font-semibold">"Sayfalarım"</span>{" "}
            sekmesine tıklayarak sayfanızı düzenleyebilir veya
            paylaşabilirsiniz.
          </p>
          <p>
            Şu anda, sayfalar yalnızca onları oluşturan hesaplar tarafından
            düzenlenebilmektedir.
          </p>
        </div>
      </div>
    </div>
  );
};

const UserSettingsCreatePage: React.FC = () => {
  // Which step are we on? (1 or 2)
  const [step, setStep] = useState(1);

  // Form fields
  const [name, setName] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("");
  const [website, setWebsite] = useState("");
  const [location, setLocation] = useState("");
  const [phone, setPhone] = useState("");
  const [establishedDate, setEstablishedDate] = useState("");
  const [businessHours, setBusinessHours] = useState("");

  // Social links
  const [instagram, setInstagram] = useState("");
  const [facebook, setFacebook] = useState("");
  const [twitter, setTwitter] = useState("");
  const [tiktok, setTiktok] = useState("");
  const [linkedin, setLinkedin] = useState("");
  const [additionalInfo, setAdditionalInfo] = useState("");

  const [profileImage, setProfileImage] = useState<File | null>(null);
  const [bannerImage, setBannerImage] = useState<File | null>(null);

  const [loading, setLoading] = useState(false);
  // We'll use message only for errors now; success will trigger popup.
  const [message, setMessage] = useState("");
  const [showSuccessPopup, setShowSuccessPopup] = useState(false);

  // Move to Step 2
  const handleNextStep = (e: React.FormEvent) => {
    e.preventDefault();
    setStep(2);
  };

  // Go back to Step 1
  const handlePrevStep = (e: React.FormEvent) => {
    e.preventDefault();
    setStep(1);
  };

  // Final submit on Step 2
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    try {
      const formData = new FormData();
      formData.append("name", name);
      formData.append("username", username);
      formData.append("password", password);
      formData.append("description", description);
      formData.append("category", category);
      formData.append("website", website);
      formData.append("location", location);
      formData.append("phone", phone);
      formData.append("establishedDate", establishedDate);
      formData.append("businessHours", businessHours);

      // Build socialLinks object
      const socialLinksObject = {
        instagram,
        facebook,
        twitter,
        tiktok,
        linkedin,
      };
      formData.append("socialLinks", JSON.stringify(socialLinksObject));

      formData.append("additionalInfo", additionalInfo);

      // Append images if available
      if (profileImage) {
        formData.append("profileImage", profileImage);
      }
      if (bannerImage) {
        formData.append("bannerImage", bannerImage);
      }

      // Retrieve the userId (example: from localStorage)
      const userId = localStorage.getItem("userId");
      if (userId) {
        formData.append("userId", userId);
      }

      const response = await axios.post(
        "http://localhost:5001/api/pages/create",
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
        }
      );

      // Instead of setting a message text, show the success popup
      setShowSuccessPopup(true);
    } catch (error) {
      console.error("Sayfa oluşturma hatası:", error);
      setMessage("Sayfa oluşturulurken hata oluştu.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4 rounded-2xl">
      {showSuccessPopup && (
        <SuccessPopup onClose={() => setShowSuccessPopup(false)} />
      )}

      {/* Title & Description */}
      <div className="max-w-4xl mx-auto mt-6 mb-6 px-4">
        <h1 className="text-2xl font-bold text-gray-900">Sayfa Oluştur</h1>
        <p className="text-sm text-gray-600 mt-1">
          Yeni bir sayfa oluşturmak için aşağıdaki adımları takip edin.
        </p>
      </div>

      {/* Progress bar */}
      <div className="max-w-4xl mx-auto mb-8">
        <StepProgressBar step={step} />
      </div>

      {/* Form & Preview */}
      {/* Form & Preview */}
      <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow-sm border border-gray-200 p-8 px-4 flex flex-col md:flex-row">
        {/* LEFT COLUMN */}
        <div className="md:w-1/2 md:pr-4">
          {step === 1 ? (
            <StepOne
              name={name}
              setName={setName}
              username={username}
              setUsername={setUsername}
              password={password}
              setPassword={setPassword}
              description={description}
              setDescription={setDescription}
              category={category}
              setCategory={setCategory}
              handleNextStep={handleNextStep}
            />
          ) : (
            <StepTwo
              website={website}
              setWebsite={setWebsite}
              location={location}
              setLocation={setLocation}
              phone={phone}
              setPhone={setPhone}
              establishedDate={establishedDate}
              setEstablishedDate={setEstablishedDate}
              businessHours={businessHours}
              setBusinessHours={setBusinessHours}
              instagram={instagram}
              setInstagram={setInstagram}
              facebook={facebook}
              setFacebook={setFacebook}
              twitter={twitter}
              setTwitter={setTwitter}
              tiktok={tiktok}
              setTiktok={setTiktok}
              linkedin={linkedin}
              setLinkedin={setLinkedin}
              additionalInfo={additionalInfo}
              setAdditionalInfo={setAdditionalInfo}
              profileImage={profileImage}
              setProfileImage={setProfileImage}
              bannerImage={bannerImage}
              setBannerImage={setBannerImage}
              loading={loading}
              handleSubmit={handleSubmit}
              handlePrevStep={handlePrevStep}
              message={message}
            />
          )}
        </div>

        {/* RIGHT COLUMN */}
        <div className="md:w-1/2 md:pl-4 md:border-l md:border-gray-200 mt-8 md:mt-0">
          <PagePreview
            name={name}
            username={username}
            description={description}
            category={category}
            website={website}
            location={location}
            phone={phone}
            establishedDate={establishedDate}
            businessHours={businessHours}
            additionalInfo={additionalInfo}
            instagram={instagram}
            facebook={facebook}
            twitter={twitter}
            tiktok={tiktok}
            linkedin={linkedin}
            profileImage={profileImage}
            bannerImage={bannerImage}
            setProfileImage={setProfileImage}
            setBannerImage={setBannerImage}
          />
        </div>
      </div>
    </div>
  );
};

/* --------------------------- CATEGORY SELECT --------------------------- */
type CategorySelectProps = {
  value: string;
  onChange: (value: string) => void;
};

const categories = ["İşletme", "Topluluk", "Eğitim", "Sanat", "Diğer"];

const CategorySelect: React.FC<CategorySelectProps> = ({ value, onChange }) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const selectedLabel = value || "Kategori Seçin";

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-white flex items-center justify-between text-sm font-medium text-gray-700 shadow-sm hover:border-blue-400 transition-all"
      >
        <span className={value ? "text-gray-800" : "text-gray-400"}>
          {selectedLabel}
        </span>
        <svg
          className={`w-4 h-4 ml-2 transform transition-transform ${
            isOpen ? "rotate-180" : "rotate-0"
          }`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M19 9l-7 7-7-7"
          />
        </svg>
      </button>

      {isOpen && (
        <div className="absolute z-10 mt-2 w-full rounded-lg border border-gray-200 bg-white shadow-md animate-fade-in">
          {categories.map((cat) => (
            <div
              key={cat}
              onClick={() => {
                onChange(cat);
                setIsOpen(false);
              }}
              className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-blue-50 cursor-pointer transition-all"
            >
              {cat}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

/* --------------------------- STEP 1 --------------------------- */
type StepOneProps = {
  name: string;
  setName: React.Dispatch<React.SetStateAction<string>>;
  username: string;
  setUsername: React.Dispatch<React.SetStateAction<string>>;
  password: string;
  setPassword: React.Dispatch<React.SetStateAction<string>>;
  description: string;
  setDescription: React.Dispatch<React.SetStateAction<string>>;
  category: string;
  setCategory: React.Dispatch<React.SetStateAction<string>>;
  handleNextStep: (e: React.FormEvent) => void;
};

function StepOne({
  name,
  setName,
  username,
  setUsername,
  password,
  setPassword,
  description,
  setDescription,
  category,
  setCategory,
  handleNextStep,
}: StepOneProps) {
  return (
    <form onSubmit={handleNextStep} className="space-y-6 p-2">
      {/* Form Title */}
      <div>
        <h2 className="text-xl font-bold text-gray-800 mb-2">
          Adım 1: Sayfa Bilgileri
        </h2>
        <p className="text-sm text-gray-500">
          Sayfanız için temel bilgileri doldurun.
        </p>
      </div>

      {/* Inputs */}
      <div>
        <Input
          id="name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="İsim"
          required
        />
      </div>
      <div>
        <Input
          id="username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          placeholder="Kullanıcı Adı"
          required
        />
      </div>
      <div>
        <Input
          id="password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Şifre"
          required
        />
      </div>
      <div>
        <Input
          id="description"
          as="textarea"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Açıklama"
          required
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Kategori
        </label>
        <CategorySelect value={category} onChange={setCategory} />
      </div>

      {/* Next Step Button */}
      <button
        type="submit"
        className="w-full py-2 bg-blue-600 text-white rounded-md text-md hover:bg-blue-700 transition"
      >
        Sonraki Adım
      </button>
    </form>
  );
}

/* --------------------------- STEP 2 --------------------------- */
type StepTwoProps = {
  website: string;
  setWebsite: React.Dispatch<React.SetStateAction<string>>;
  location: string;
  setLocation: React.Dispatch<React.SetStateAction<string>>;
  phone: string;
  setPhone: React.Dispatch<React.SetStateAction<string>>;
  establishedDate: string;
  setEstablishedDate: React.Dispatch<React.SetStateAction<string>>;
  businessHours: string;
  setBusinessHours: React.Dispatch<React.SetStateAction<string>>;
  instagram: string;
  setInstagram: React.Dispatch<React.SetStateAction<string>>;
  facebook: string;
  setFacebook: React.Dispatch<React.SetStateAction<string>>;
  twitter: string;
  setTwitter: React.Dispatch<React.SetStateAction<string>>;
  tiktok: string;
  setTiktok: React.Dispatch<React.SetStateAction<string>>;
  linkedin: string;
  setLinkedin: React.Dispatch<React.SetStateAction<string>>;
  additionalInfo: string;
  setAdditionalInfo: React.Dispatch<React.SetStateAction<string>>;
  profileImage: File | null;
  setProfileImage: React.Dispatch<React.SetStateAction<File | null>>;
  bannerImage: File | null;
  setBannerImage: React.Dispatch<React.SetStateAction<File | null>>;
  loading: boolean;
  handleSubmit: (e: React.FormEvent) => Promise<void>;
  handlePrevStep: (e: React.FormEvent) => void;
  message: string;
};

function StepTwo({
  website,
  setWebsite,
  location,
  setLocation,
  phone,
  setPhone,
  establishedDate,
  setEstablishedDate,
  businessHours,
  setBusinessHours,
  instagram,
  setInstagram,
  facebook,
  setFacebook,
  twitter,
  setTwitter,
  tiktok,
  setTiktok,
  linkedin,
  setLinkedin,
  additionalInfo,
  setAdditionalInfo,
  profileImage,
  setProfileImage,
  bannerImage,
  setBannerImage,
  loading,
  handleSubmit,
  handlePrevStep,
  message,
}: StepTwoProps) {
  return (
    <form onSubmit={handleSubmit} className="space-y-4 p-2">
      <div className="mb-8">
        <h2 className="text-xl font-bold text-gray-900 mb-2">
          Adım 2: Ek Bilgiler
        </h2>
        <p className="text-sm text-gray-500">
          Sayfanızı daha etkili tanıtmak için ek bilgiler ve detaylar girin.
          Ziyaretçilerinizin ilgisini çekin!
        </p>
      </div>
      {message && <p className="mb-4 text-green-600">{message}</p>}
      <div>
        <Input
          id="website"
          type="url"
          value={website}
          onChange={(e) => setWebsite(e.target.value)}
          placeholder="Web Sitesi"
        />
      </div>
      <div>
        <Input
          id="location"
          as="textarea"
          value={location}
          onChange={(e) => setLocation(e.target.value)}
          placeholder="Konum"
        />
      </div>
      <div>
        <label className="block text-sm font-medium mb-1">Telefon</label>
        <PhoneInput
          country="tr"
          value={phone}
          onChange={(phone) => setPhone(phone)}
          containerStyle={{ width: "100%" }}
          inputStyle={{ width: "100%" }}
        />
      </div>
      <div>
        <Input
          id="establishedDate"
          type="date"
          value={establishedDate}
          onChange={(e) => setEstablishedDate(e.target.value)}
          placeholder="Kuruluş Tarihi"
        />
      </div>
      <div>
        <Input
          id="businessHours"
          as="textarea"
          value={businessHours}
          onChange={(e) => setBusinessHours(e.target.value)}
          placeholder="Çalışma Saatleri"
        />
      </div>
      {/* Social Links - separate inputs with icons */}
      <div>
        <label className="block text-sm font-medium mb-1">
          Sosyal Bağlantılar
        </label>
        <div className="space-y-2">
          <div className="relative">
            <div className="absolute inset-y-0 left-0 flex items-center pl-2">
              <FaInstagram className="text-gray-500" />
            </div>
            <Input
              id="instagram"
              value={instagram}
              onChange={(e) => setInstagram(e.target.value)}
              placeholder="instagram.com/"
            />
          </div>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 flex items-center pl-2">
              <FaFacebookF className="text-gray-500" />
            </div>
            <Input
              id="facebook"
              value={facebook}
              onChange={(e) => setFacebook(e.target.value)}
              placeholder="facebook.com/"
            />
          </div>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 flex items-center pl-2">
              <FaTwitter className="text-gray-500" />
            </div>
            <Input
              id="twitter"
              value={twitter}
              onChange={(e) => setTwitter(e.target.value)}
              placeholder="twitter.com/"
            />
          </div>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 flex items-center pl-2">
              <FaTiktok className="text-gray-500" />
            </div>
            <Input
              id="tiktok"
              value={tiktok}
              onChange={(e) => setTiktok(e.target.value)}
              placeholder="tiktok.com/@"
            />
          </div>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 flex items-center pl-2">
              <FaLinkedinIn className="text-gray-500" />
            </div>
            <Input
              id="linkedin"
              value={linkedin}
              onChange={(e) => setLinkedin(e.target.value)}
              placeholder="linkedin.com/in/"
            />
          </div>
        </div>
      </div>
      <div>
        <Input
          id="additionalInfo"
          as="textarea"
          value={additionalInfo}
          onChange={(e) => setAdditionalInfo(e.target.value)}
          placeholder="Ek Bilgi"
        />
      </div>
      <div className="space-y-2">
        <button
          type="button"
          onClick={handlePrevStep}
          className="w-full py-2 bg-gray-300 text-gray-700 rounded-md"
        >
          Geri
        </button>
        <button
          type="submit"
          className="w-full py-2 bg-blue-600 text-white rounded-md"
          disabled={loading}
        >
          {loading ? "Oluşturuluyor..." : "Oluştur"}
        </button>
      </div>
    </form>
  );
}
/* --------------------------- PREVIEW COLUMN --------------------------- */
type PagePreviewProps = {
  name: string;
  username: string;
  description: string;
  category: string;
  website: string;
  location: string;
  phone: string;
  establishedDate: string;
  businessHours: string;
  additionalInfo: string;
  instagram: string;
  facebook: string;
  twitter: string;
  tiktok: string;
  linkedin: string;
  profileImage: File | null;
  bannerImage: File | null;
  setProfileImage: React.Dispatch<React.SetStateAction<File | null>>;
  setBannerImage: React.Dispatch<React.SetStateAction<File | null>>;
};

function PagePreview({
  name,
  username,
  description,
  category,
  website,
  location,
  phone,
  establishedDate,
  businessHours,
  additionalInfo,
  instagram,
  facebook,
  twitter,
  tiktok,
  linkedin,
  profileImage,
  bannerImage,
  setProfileImage,
  setBannerImage,
}: PagePreviewProps) {
  const displayName = name || "İsim";
  const displayCategory = category || "Kategori";
  const displayDescription = description || "Biyografi (isteğe bağlı)";

  // Default active tab is "Hakkında"
  const [activeTab, setActiveTab] = useState("Hakkında");

  const getTabClasses = (tabName: string) =>
    `flex-1 text-center py-2 text-sm ${
      activeTab === tabName
        ? "font-medium text-blue-600 border-b-2 border-blue-600"
        : "text-gray-600"
    }`;

  // Refs for hidden file inputs
  const bannerInputRef = useRef<HTMLInputElement>(null);
  const profileInputRef = useRef<HTMLInputElement>(null);

  const handleBannerEdit = () => {
    bannerInputRef.current?.click();
  };

  const handleProfileEdit = () => {
    profileInputRef.current?.click();
  };

  return (
    <div className="p-2">
      <div className="mb-6">
        <h2 className="text-xl font-bold text-gray-800 mb-1">
          Sayfa Önizlemesi
        </h2>
        <p className="text-sm text-gray-500">
          Sayfanızın profil görünümünü burada önizleyebilirsiniz.
        </p>
      </div>
      <div className="border rounded-lg bg-white shadow-sm">
        {/* BANNER SECTION */}
        <div className="relative h-36 w-full bg-gray-200 rounded-lg">
          {bannerImage ? (
            <img
              src={URL.createObjectURL(bannerImage)}
              alt="Banner Preview"
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="flex h-full items-center justify-center text-gray-500">
              Banner Görseli Yok
            </div>
          )}
          {/* Edit button on banner top right */}
          <button
            type="button"
            onClick={handleBannerEdit}
            className="absolute top-2 right-2 bg-white rounded-lg shadow flex items-center space-x-1 px-2 py-1 hover:bg-gray-100"
          >
            <Edit size={16} className="text-gray-600" />
            <span className="text-xs text-gray-600">Edit your cover image</span>
          </button>
          {/* Hidden banner file input */}
          <input
            type="file"
            accept="image/*"
            ref={bannerInputRef}
            onChange={(e) =>
              setBannerImage(e.target.files ? e.target.files[0] : null)
            }
            className="hidden"
          />
          {/* PROFILE IMAGE (overlapping) */}
          <div className="absolute -bottom-8 left-4 w-20 h-20 rounded-full overflow-hidden border-4 border-white shadow">
            {profileImage ? (
              <img
                src={URL.createObjectURL(profileImage)}
                alt="Profil Preview"
                className="h-full w-full object-cover"
              />
            ) : (
              <div className="flex items-center justify-center h-full w-full bg-gray-400 text-white text-sm">
                Profil Yok
              </div>
            )}
            {/* Edit icon on profile image bottom right */}
            <button
              type="button"
              onClick={handleProfileEdit}
              className="absolute bottom-[4px] right-[8px] bg-white rounded-full shadow p-1 hover:bg-gray-100"
            >
              <Edit size={16} className="text-gray-600" />
            </button>
            {/* Hidden profile file input */}
            <input
              type="file"
              accept="image/*"
              ref={profileInputRef}
              onChange={(e) =>
                setProfileImage(e.target.files ? e.target.files[0] : null)
              }
              className="hidden"
            />
          </div>
        </div>
        <div className="pt-10 px-4 pb-2">
          <h3 className="text-xl font-semibold">{displayName}</h3>
          {username && <p className="text-sm text-gray-500">@{username}</p>}
          <p className="text-sm text-gray-600">{displayCategory}</p>
        </div>
        <div className="mt-2 px-4 border-b border-gray-200 flex">
          <button
            onClick={() => setActiveTab("Künye")}
            className={getTabClasses("Künye")}
          >
            Künye
          </button>
          <button
            onClick={() => setActiveTab("Gönderiler")}
            className={getTabClasses("Gönderiler")}
          >
            Gönderiler
          </button>
          <button
            onClick={() => setActiveTab("Hakkında")}
            className={getTabClasses("Hakkında")}
          >
            Hakkında
          </button>
          <button
            onClick={() => setActiveTab("Takipçiler")}
            className={getTabClasses("Takipçiler")}
          >
            Takipçiler
          </button>
          <button
            onClick={() => setActiveTab("Etkinlikler")}
            className={getTabClasses("Etkinlikler")}
          >
            Etkinlikler
          </button>
        </div>

        <div className="p-4">
          {/* KÜNYE TAB */}
          {activeTab === "Künye" && (
            <div className="p-4 bg-gray-50 rounded-lg shadow-inner break-words">
              <h4 className="text-xl font-semibold mb-4">Künye</h4>
              <p className="text-sm text-gray-800">{displayDescription}</p>
            </div>
          )}

          {/* GÖNDERİLER TAB: Skeleton placeholder */}
          {activeTab === "Gönderiler" && (
            <div className="p-4 bg-gray-50 rounded-lg shadow-inner break-words">
              <h4 className="text-xl font-semibold mb-4">Gönderiler</h4>
              <p className="text-sm text-gray-800 mb-4">
                Gönderiler burada görünecek.
              </p>
              <div className="animate-pulse space-y-6">
                <div className="flex items-center space-x-4">
                  <div className="w-10 h-10 bg-gray-300 rounded-full" />
                  <div className="flex-1 space-y-2">
                    <div className="h-4 bg-gray-300 rounded w-1/2" />
                    <div className="h-4 bg-gray-300 rounded w-1/3" />
                  </div>
                </div>
                <div className="h-4 bg-gray-300 rounded w-3/4" />
                <div className="h-4 bg-gray-300 rounded w-2/3" />
                <div className="h-4 bg-gray-300 rounded w-1/2" />
                <hr className="my-4 border-gray-200" />
                <div className="flex items-center space-x-4">
                  <div className="w-10 h-10 bg-gray-300 rounded-full" />
                  <div className="flex-1 space-y-2">
                    <div className="h-4 bg-gray-300 rounded w-1/4" />
                    <div className="h-4 bg-gray-300 rounded w-1/2" />
                  </div>
                </div>
                <div className="h-4 bg-gray-300 rounded w-2/4" />
                <div className="h-4 bg-gray-300 rounded w-3/4" />
                <div className="h-4 bg-gray-300 rounded w-1/3" />
              </div>
            </div>
          )}

          {/* HAKKINDA TAB with icons */}
          {activeTab === "Hakkında" && (
            <div className="p-4 bg-gray-50 rounded-lg shadow-inner break-words">
              <h4 className="text-xl font-semibold mb-4">Hakkında</h4>
              <div className="grid grid-cols-1 gap-4">
                <div className="flex items-center">
                  <IoMdGlobe className="text-blue-600 mr-2" size={20} />
                  <div>
                    <p className="text-sm font-medium text-gray-600">
                      Web Sitesi
                    </p>
                    <p className="text-sm text-gray-800">
                      {website || "Belirtilmedi"}
                    </p>
                  </div>
                </div>
                <div className="flex items-center">
                  <IoMdPin className="text-blue-600 mr-2" size={20} />
                  <div>
                    <p className="text-sm font-medium text-gray-600">Konum</p>
                    <p className="text-sm text-gray-800">
                      {location || "Belirtilmedi"}
                    </p>
                  </div>
                </div>
                <div className="flex items-center">
                  <IoMdCall className="text-blue-600 mr-2" size={20} />
                  <div>
                    <p className="text-sm font-medium text-gray-600">Telefon</p>
                    <p className="text-sm text-gray-800">
                      {phone || "Belirtilmedi"}
                    </p>
                  </div>
                </div>
                <div className="flex items-center">
                  <IoMdCalendar className="text-blue-600 mr-2" size={20} />
                  <div>
                    <p className="text-sm font-medium text-gray-600">
                      Kuruluş Tarihi
                    </p>
                    <p className="text-sm text-gray-800">
                      {establishedDate || "Belirtilmedi"}
                    </p>
                  </div>
                </div>
                <div className="flex items-center">
                  <IoMdTime className="text-blue-600 mr-2" size={20} />
                  <div>
                    <p className="text-sm font-medium text-gray-600">
                      Çalışma Saatleri
                    </p>
                    <p className="text-sm text-gray-800">
                      {businessHours || "Belirtilmedi"}
                    </p>
                  </div>
                </div>
                <div className="flex items-center">
                  <FaInfoCircle className="text-blue-600 mr-2" size={20} />
                  <div>
                    <p className="text-sm font-medium text-gray-600">
                      Ek Bilgi
                    </p>
                    <p className="text-sm text-gray-800">
                      {additionalInfo || "Belirtilmedi"}
                    </p>
                  </div>
                </div>
              </div>
              <div className="mt-4">
                <p className="text-sm font-medium text-gray-600">
                  Sosyal Bağlantılar
                </p>
                <div className="flex space-x-4 mt-2">
                  {instagram && (
                    <a
                      href={
                        instagram.startsWith("http")
                          ? instagram
                          : `https://www.instagram/${instagram}`
                      }
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <FaInstagram size={20} className="text-gray-600" />
                    </a>
                  )}
                  {facebook && (
                    <a
                      href={
                        facebook.startsWith("http")
                          ? facebook
                          : `https://${facebook}`
                      }
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <FaFacebookF size={20} className="text-gray-600" />
                    </a>
                  )}
                  {twitter && (
                    <a
                      href={
                        twitter.startsWith("http")
                          ? twitter
                          : `https://${twitter}`
                      }
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <FaTwitter size={20} className="text-gray-600" />
                    </a>
                  )}
                  {tiktok && (
                    <a
                      href={
                        tiktok.startsWith("http") ? tiktok : `https://${tiktok}`
                      }
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <FaTiktok size={20} className="text-gray-600" />
                    </a>
                  )}
                  {linkedin && (
                    <a
                      href={
                        linkedin.startsWith("http")
                          ? linkedin
                          : `https://${linkedin}`
                      }
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <FaLinkedinIn size={20} className="text-gray-600" />
                    </a>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* TAKİPÇİLER TAB */}
          {activeTab === "Takipçiler" && (
            <div className="p-4 bg-gray-50 rounded-lg shadow-inner">
              <h4 className="text-xl font-semibold mb-4 flex items-center">
                <FaUsers className="mr-2 text-blue-600" /> Takipçiler
              </h4>
              <div className="grid grid-cols-2 gap-4">
                {[1, 2, 3, 4].map((id) => (
                  <div
                    key={id}
                    className="flex items-center bg-white p-3 rounded-lg shadow hover:shadow-md transition"
                  >
                    <div className="w-12 h-12 rounded-full overflow-hidden mr-3">
                      <img
                        src={`https://i.pravatar.cc/150?img=${id}`}
                        alt="Follower"
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div>
                      <p className="font-medium text-gray-800">
                        Kullanıcı {id}
                      </p>
                      <p className="text-xs text-gray-500">Takipte</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* 
            ETKİNLİKLER TAB with the "exact same design" 
            as in your provided screenshot 
          */}
          {activeTab === "Etkinlikler" && (
            <div className="p-4 bg-gray-50 rounded-lg shadow-inner">
              {/* Top row: Title + Sort */}
              <div className="flex items-center justify-between mb-6">
                <h4 className="text-2xl font-bold">Upcoming Event</h4>
                <div className="flex items-center space-x-2">
                  <span className="text-sm text-gray-500">Sort by:</span>
                  <select className="border border-gray-300 rounded px-2 py-1 text-sm">
                    <option>Most Recent</option>
                    <option>Popular</option>
                    <option>Nearest Date</option>
                  </select>
                </div>
              </div>

              {/* Always single-column (down by down) */}
              <div className="space-y-6">
                {/* CARD 1 */}
                <div className="bg-white rounded-lg shadow p-4 relative">
                  <div className="w-full h-40 rounded-md overflow-hidden mb-4">
                    <img
                      src="https://images.unsplash.com/photo-1542736488-1967b42fcf54?w=900&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MjR8fGZ1dHVyaXN0aWN8ZW58MHx8MHx8fDI%3D"
                      alt="Event 1"
                      className="w-full h-full object-cover"
                    />
                  </div>
                  {/* Day/time in top-left, date in top-right */}
                  <div className="absolute top-6 left-6 bg-green-100 text-green-700 px-3 py-1 rounded-full text-xs font-semibold">
                    THU 10:00 AM
                  </div>
                  <div className="absolute top-6 right-6 bg-gray-200 text-gray-800 px-3 py-1 rounded-full text-sm font-semibold">
                    AUG 24
                  </div>

                  <h3 className="text-lg font-semibold mb-1">
                    Planning Masterclass
                  </h3>
                  <p className="text-sm text-gray-500 mb-2">
                    Location • 24 Royal Ln. Mesa, New Jersey
                  </p>
                  {/* Avatars row */}
                  <div className="flex items-center space-x-2">
                    {/* 4 sample avatars */}
                    {[1, 2, 3, 4].map((num) => (
                      <img
                        key={num}
                        src={`https://i.pravatar.cc/32?img=${num + 10}`}
                        alt="attendee"
                        className="w-6 h-6 rounded-full border-2 border-white"
                      />
                    ))}
                    <span className="text-sm text-gray-500 ml-1">+2 more</span>
                  </div>
                </div>

                {/* CARD 2 */}
                <div className="bg-white rounded-lg shadow p-4 relative">
                  <div className="w-full h-40 rounded-md overflow-hidden mb-4">
                    <img
                      src="https://images.unsplash.com/photo-1513151233558-d860c5398176?w=900&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NXx8bW9udW1lbnRhbCUyMGV2ZW50fGVufDB8fDB8fHwy"
                      alt="Event 2"
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="absolute top-6 left-6 bg-green-100 text-green-700 px-3 py-1 rounded-full text-xs font-semibold">
                    WED 12:30 PM
                  </div>
                  <div className="absolute top-6 right-6 bg-gray-200 text-gray-800 px-3 py-1 rounded-full text-sm font-semibold">
                    AUG 27
                  </div>
                  <h3 className="text-lg font-semibold mb-1">
                    Monumental Event Planning
                  </h3>
                  <p className="text-sm text-gray-500 mb-2">
                    Location • 63 Elgin St. Celina, Delaware
                  </p>
                  <div className="flex items-center space-x-2">
                    {[5, 6, 7, 8].map((num) => (
                      <img
                        key={num}
                        src={`https://i.pravatar.cc/32?img=${num + 10}`}
                        alt="attendee"
                        className="w-6 h-6 rounded-full border-2 border-white"
                      />
                    ))}
                    <span className="text-sm text-gray-500 ml-1">+3 more</span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default UserSettingsCreatePage;
