import React from "react";
import { Link } from "lucide-react";
import { FcGoogle } from "react-icons/fc";
import { FaFacebook, FaApple } from "react-icons/fa";

const UserSettingsThirdParty: React.FC = () => {
  return (
    <div className="w-full min-h-screen bg-gray-100 flex items-start justify-center py-10 px-4">
      <div className="max-w-4xl w-full space-y-8">
        {/* Sayfa Başlığı */}
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            Harici Servis Bağlantıları
          </h1>
          <p className="text-gray-600 text-sm mt-1">
            Dış servis girişlerini ve entegrasyonlarını yönetin.
          </p>
        </div>

        {/* Kart Alanı */}
        <div className="bg-white p-8 rounded-2xl border shadow-sm space-y-6">
          {/* Bilgilendirme */}
          <div className="space-y-4">
            <p className="text-gray-700 text-sm leading-relaxed">
              Şu anda Paulih ile entegre edilmiş herhangi bir üçüncü taraf
              servisi bulunmamaktadır. Paulih hesabınıza sadece Hacettepe email
              hesabınız ve oluşturduğunuz şifre ile giriş yapabilirsiniz. Harici
              servislerinizi yönetebileceğiniz bölümü yakında aktif hale
              getireceğiz.
            </p>
          </div>

          {/* Servis Listesi */}
          <div className="space-y-4">
            {/* Google */}
            <div className="flex items-center justify-between bg-gray-50 p-4 rounded-lg border cursor-not-allowed opacity-50">
              <div className="flex items-center space-x-3">
                <FcGoogle size={24} />
                <div>
                  <h2 className="text-sm font-semibold text-gray-800">
                    Google (Pasif)
                  </h2>
                  <p className="text-xs text-gray-600">
                    Paulih hesabınızla henüz Google bağlantısı bulunmamaktadır.
                  </p>
                </div>
              </div>
              <button
                disabled
                className="bg-gray-200 text-gray-400 text-xs font-medium px-3 py-1.5 rounded-md cursor-not-allowed"
              >
                Bağlan
              </button>
            </div>

            {/* Facebook */}
            <div className="flex items-center justify-between bg-gray-50 p-4 rounded-lg border cursor-not-allowed opacity-50">
              <div className="flex items-center space-x-3">
                <FaFacebook size={24} className="text-blue-600" />
                <div>
                  <h2 className="text-sm font-semibold text-gray-800">
                    Facebook (Pasif)
                  </h2>
                  <p className="text-xs text-gray-600">
                    Paulih hesabınızla henüz Facebook bağlantısı
                    bulunmamaktadır.
                  </p>
                </div>
              </div>
              <button
                disabled
                className="bg-gray-200 text-gray-400 text-xs font-medium px-3 py-1.5 rounded-md cursor-not-allowed"
              >
                Bağlan
              </button>
            </div>

            {/* Apple */}
            <div className="flex items-center justify-between bg-gray-50 p-4 rounded-lg border cursor-not-allowed opacity-50">
              <div className="flex items-center space-x-3">
                <FaApple size={24} className="text-black" />
                <div>
                  <h2 className="text-sm font-semibold text-gray-800">
                    Apple (Pasif)
                  </h2>
                  <p className="text-xs text-gray-600">
                    Paulih hesabınızla henüz Apple bağlantısı bulunmamaktadır.
                  </p>
                </div>
              </div>
              <button
                disabled
                className="bg-gray-200 text-gray-400 text-xs font-medium px-3 py-1.5 rounded-md cursor-not-allowed"
              >
                Bağlan
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserSettingsThirdParty;
