import React from "react";
import { useNavigate } from "react-router-dom";
import { DotLottieReact } from "@lottiefiles/dotlottie-react";

const NotFound: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-white px-6 py-12">
      {/* Başlık */}
      <h1 className="text-6xl md:text-7xl font-extrabold text-center mb-4 bg-gradient-to-r from-red-400 via-purple-500 to-blue-500 text-transparent bg-clip-text">
        404 - Sayfa Bulunamadı
      </h1>

      {/* Açıklama */}
      <p className="text-gray-600 text-center max-w-2xl text-base md:text-lg mb-2">
        Üzgünüz, aradığınız sayfa mevcut değil.
      </p>

      <p className="text-gray-400 text-center max-w-2xl text-sm mb-10">
        Sayfa silinmiş, taşınmış veya hiç var olmamış olabilir. Endişelenmeyin,
        sizi doğru yere yönlendirebiliriz!
      </p>

      {/* Geri Dön Butonu */}
      <button
        onClick={() => navigate("/home")}
        className="px-6 py-3 bg-black text-white rounded-full text-sm font-semibold hover:bg-gray-800 transition-all shadow-md"
      >
        Anasayfaya Dön
      </button>

      {/* Alt Mini Yazı */}
      <p className="text-gray-400 text-xs italic mt-8">
        _ Paulih her zaman bir çıkış yolu bulur! _
      </p>
    </div>
  );
};

export default NotFound;
