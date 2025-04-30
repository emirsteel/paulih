// src/components/MapUserLocationPopup.tsx
import React from "react";
import { X } from "lucide-react";
import { FaApple } from "react-icons/fa";

const MapUserLocationPopup: React.FC<{ onClose: () => void }> = ({
  onClose,
}) => {
  return (
    <div className="p-4 bg-white rounded-lg max-w-lg mx-auto">
      {/* Başlık ve Kapatma Butonu */}
      <div className="flex justify-between items-center mb-4 border-b pb-2">
        <h2 className="text-xl font-bold text-gray-800">Konum Bilgileriniz</h2>
        <button
          onClick={onClose}
          className="text-gray-600 hover:text-gray-800 text-2xl leading-none"
        >
          <X size={24} />
        </button>
      </div>

      {/* Açıklama */}
      <p className="text-sm text-gray-700 mb-3">
        Kampüsteki mevcut konumunuz tespit edilmiştir. Bu bilgi, kampüs
        navigasyonu, servis saatleri, çalışma alanları ve öğrenci hizmetleri
        hakkında bilgi sağlamaktadır.
      </p>

      {/* Konum Paylaşım Bilgisi */}
      <div className="mb-4">
        <h3 className="text-sm font-semibold text-gray-800 mb-2">
          Konumunuzun Arkadaşlarla Paylaşılması
        </h3>
        <p className="text-sm text-gray-600">
          Konumunuzun arkadaşlarınızla paylaşılması ve arkadaşlarınızı haritada
          görebileceğiniz özelliğimiz çok yakında Paulih'te sizlerle olacaktır.
        </p>
      </div>

      {/* Safari Uyarısı */}
      <div className="flex items-center mt-4 text-xs text-gray-500">
        <FaApple className="mr-1" />
        <span>
          Safari kullanıcıları için: Lütfen içerik engelleyicileri devre dışı
          bırakın.
        </span>
      </div>
    </div>
  );
};

export default MapUserLocationPopup;
