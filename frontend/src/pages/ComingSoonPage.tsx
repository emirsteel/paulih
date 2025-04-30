import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { AlertBox } from "../components/Alerts";

const ComingSoonPage: React.FC = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [showSuccess, setShowSuccess] = useState(false);

  const handleNotifyClick = () => {
    if (email.trim()) {
      setShowSuccess(true);
      setEmail(""); // Clear the email field
      setTimeout(() => {
        setShowSuccess(false);
      }, 3000); // Auto-hide alert after 3 seconds
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-white px-6 py-12">
      {/* Başlık */}
      <h1 className="text-6xl md:text-7xl font-extrabold text-center mb-4 bg-gradient-to-r from-red-400 via-purple-500 to-blue-500 text-transparent bg-clip-text">
        Çok Yakında
      </h1>

      {/* Küçük Açıklama */}
      <p className="text-gray-600 text-center max-w-2xl text-base md:text-lg mb-2">
        Öğrenciler için kampüs içi ve çevresindeki restoranlardan hızlı, uygun
        fiyatlı ve güvenilir sipariş deneyimi sunmaya hazırlanıyoruz.
      </p>

      <p className="text-gray-400 text-center max-w-2xl text-sm mb-8">
        Çok yakında burada olacağız. Erken haberdar olmak için
        kaydolabilirsiniz.
      </p>

      {/* Success Alert */}
      {showSuccess && (
        <div className="w-full max-w-md mb-6">
          <AlertBox
            variant="success"
            title="Başarıyla kaydoldunuz!"
            description="Uygulama aktif olduğunda sizi bilgilendireceğiz."
          />
        </div>
      )}

      {/* Email Input + Button */}
      <div className="flex w-full max-w-md bg-gray-100 rounded-full overflow-hidden shadow-md mb-6">
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="E-posta adresinizi girin"
          className="flex-1 px-6 py-3 bg-gray-100 focus:outline-none text-gray-700 placeholder-gray-400 text-sm"
        />
        <button
          onClick={handleNotifyClick}
          className="px-6 py-3 bg-blue-600 text-white font-semibold hover:bg-blue-700 transition-all text-sm"
        >
          Haberdar Et
        </button>
      </div>

      {/* Anasayfaya Dön Button */}
      <button
        onClick={() => navigate("/home")}
        className="px-6 py-3 bg-black text-white rounded-full text-sm font-semibold hover:bg-gray-800 transition-all shadow-md"
      >
        Anasayfaya Dön
      </button>

      {/* Footer Text */}
      <p className="text-gray-400 text-xs italic mt-8">
        _ Uygulama yayına alındığında size bildirim göndereceğiz _
      </p>
    </div>
  );
};

export default ComingSoonPage;
