import React from "react";
import {
  Mail,
  Phone,
  MapPin,
  Facebook,
  Instagram,
  Twitter,
} from "lucide-react";

const UserSettingsContact: React.FC = () => {
  return (
    <div className="w-full min-h-screen bg-gray-100 flex items-start justify-center py-10 px-4">
      <div className="max-w-4xl w-full space-y-8">
        {/* Sayfa Başlığı */}
        <div>
          <h1 className="text-2xl font-bold text-gray-900">İletişim</h1>
          <p className="text-gray-600 text-sm mt-1">
            Paulih ekibi ile iletişime geçmenin tüm yolları burada.
          </p>
        </div>

        {/* Bize Ulaşın Kartı */}
        <div className="bg-white p-8 rounded-2xl border shadow-sm space-y-6">
          <h2 className="text-xl font-bold text-gray-800">Bize Ulaşın</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div className="flex items-center">
              <Mail size={24} className="text-blue-600 mr-3" />
              <div>
                <p className="text-sm text-gray-500">Email</p>
                <p className="text-base font-medium text-gray-700">
                  destek@paulih.com
                </p>
              </div>
            </div>
            <div className="flex items-center">
              <Phone size={24} className="text-blue-600 mr-3" />
              <div>
                <p className="text-sm text-gray-500">Telefon</p>
                <p className="text-base font-medium text-gray-700">
                  +90 212 123 4567
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Sosyal Medya Kartı */}
        <div className="bg-white p-8 rounded-2xl border shadow-sm space-y-6">
          <h2 className="text-xl font-bold text-gray-800">Sosyal Medya</h2>
          <p className="text-gray-700 text-sm leading-relaxed">
            En güncel haberler, etkinlikler ve kampanyalar için bizi sosyal
            medya hesaplarımızdan takip edin.
          </p>
          <div className="flex flex-wrap gap-6 mt-4">
            <a
              href="https://www.instagram.com/paulih"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center space-x-2 text-blue-600 hover:underline"
            >
              <Instagram size={24} />
              <span className="text-sm font-medium">Instagram</span>
            </a>
            <a
              href="https://twitter.com/paulih"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center space-x-2 text-blue-600 hover:underline"
            >
              <Twitter size={24} />
              <span className="text-sm font-medium">Twitter</span>
            </a>
            <a
              href="https://facebook.com/paulih"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center space-x-2 text-blue-600 hover:underline"
            >
              <Facebook size={24} />
              <span className="text-sm font-medium">Facebook</span>
            </a>
          </div>
        </div>

        {/* Destek ve Yardım Kartı */}
        <div className="bg-white p-8 rounded-2xl border shadow-sm space-y-6">
          <h2 className="text-xl font-bold text-gray-800">Destek & Yardım</h2>
          <p className="text-gray-700 text-sm leading-relaxed">
            Paulih Destek Ekibi, her gün 09:00 - 18:00 saatleri arasında hizmet
            vermektedir. Canlı destek, Sıkça Sorulan Sorular ve Yardım Merkezi
            üzerinden sorularınıza hızlıca çözüm bulabilirsiniz.
          </p>
          <p className="text-gray-700 text-sm leading-relaxed">
            Tüm taleplerinize en geç 24 saat içerisinde dönüş sağlıyoruz. Size
            en iyi hizmeti sunabilmek için geri bildirimlerinizi de memnuniyetle
            bekliyoruz.
          </p>
        </div>

        {/* Harita Kartı */}
        <div className="bg-white p-8 rounded-2xl border shadow-sm space-y-6">
          <h2 className="text-xl font-bold text-gray-800">Konumumuz</h2>
          <p className="text-gray-700 text-sm leading-relaxed">
            Ofisimizi ziyaret etmek isterseniz aşağıdaki haritadan konumumuza
            kolayca ulaşabilirsiniz.
          </p>
          <div className="rounded-lg overflow-hidden mt-4">
            <iframe
              src="https://api.mapbox.com/styles/v1/mapbox/streets-v11.html?title=false&access_token=pk.eyJ1IjoicGF1bGloIiwiYSI6ImNtNnRjbjlibDAxeWQyanNnbGpnazAwbzAifQ.b5EiudBGiXOuZdAE6ZxxBA&zoomwheel=false#15.5/39.86902/32.734444"
              title="Paulih Lokasyonu"
              width="100%"
              height="300"
              style={{ border: 0 }}
              loading="lazy"
              allowFullScreen
            ></iframe>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserSettingsContact;
