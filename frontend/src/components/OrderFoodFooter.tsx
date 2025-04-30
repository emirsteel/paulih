import React from "react";
import {
  FaGlobe,
  FaCookieBite,
  FaRegMoon,
  FaLocationDot,
} from "react-icons/fa6";

const OrderFoodFooter: React.FC = () => {
  return (
    <footer className="bg-white text-gray-900 py-12 w-full mt-10 border-t border-gray-300">
      {/* Footer İçeriği */}
      <div className="max-w-screen-xl mx-auto px-8 grid grid-cols-1 md:grid-cols-5 lg:grid-cols-5 gap-8">
        {/* İş Ortaklığı */}
        <div>
          <h3 className="font-semibold text-gray-700">
            Paulih ile İş Ortaklığı
          </h3>
          <ul className="mt-3 space-y-2 text-sm text-gray-600">
            <li>
              <a href="#" className="hover:underline">
                Kurye İçin
              </a>
            </li>
            <li>
              <a href="#" className="hover:underline">
                Tüccarlar İçin
              </a>
            </li>
            <li>
              <a href="#" className="hover:underline">
                İş Ortakları İçin
              </a>
            </li>
          </ul>
        </div>

        {/* Şirket */}
        <div>
          <h3 className="font-semibold text-gray-700">Şirket</h3>
          <ul className="mt-3 space-y-2 text-sm text-gray-600">
            <li>
              <a href="#" className="hover:underline">
                Hakkımızda
              </a>
            </li>
            <li>
              <a href="#" className="hover:underline">
                İlkelerimiz
              </a>
            </li>
            <li>
              <a href="#" className="hover:underline">
                İş İmkanları
              </a>
            </li>
            <li>
              <a href="#" className="hover:underline">
                Sürdürülebilirlik
              </a>
            </li>
            <li>
              <a href="#" className="hover:underline">
                Güvenlik
              </a>
            </li>
            <li>
              <a href="#" className="hover:underline">
                Yatırımcılar
              </a>
            </li>
          </ul>
        </div>

        {/* Ürünler */}
        <div>
          <h3 className="font-semibold text-gray-700">Ürünler</h3>
          <ul className="mt-3 space-y-2 text-sm text-gray-600">
            <li>
              <a href="#" className="hover:underline">
                Paulih Drive
              </a>
            </li>
            <li>
              <a href="#" className="hover:underline">
                Paulih Market
              </a>
            </li>
            <li>
              <a href="#" className="hover:underline">
                Paulih+
              </a>
            </li>
            <li>
              <a href="#" className="hover:underline">
                Paulih for Work
              </a>
            </li>
            <li>
              <a href="#" className="hover:underline">
                Paulih Reklamları
              </a>
            </li>
          </ul>
        </div>

        {/* Faydalı Bağlantılar */}
        <div>
          <h3 className="font-semibold text-gray-700">Faydalı Bağlantılar</h3>
          <ul className="mt-3 space-y-2 text-sm text-gray-600">
            <li>
              <a href="#" className="hover:underline">
                Destek
              </a>
            </li>
            <li>
              <a href="#" className="hover:underline">
                Haber Odası
              </a>
            </li>
            <li>
              <a href="#" className="hover:underline">
                İletişim
              </a>
            </li>
            <li>
              <a href="#" className="hover:underline">
                Fikrinizi Bildirin
              </a>
            </li>
            <li>
              <a href="#" className="hover:underline">
                Promosyon Kodları
              </a>
            </li>
            <li>
              <a href="#" className="hover:underline">
                Geliştiriciler
              </a>
            </li>
            <li>
              <a href="#" className="hover:underline">
                Ürün Güvenliği Geri Çağırmaları
              </a>
            </li>
          </ul>
        </div>

        {/* Bizi Takip Edin */}
        <div>
          <h3 className="font-semibold text-gray-700">Bizi Takip Edin</h3>
          <ul className="mt-3 space-y-2 text-sm text-gray-600">
            <li>
              <a href="#" className="hover:underline">
                Blog
              </a>
            </li>
            <li>
              <a href="#" className="hover:underline">
                Mühendislik Blogu
              </a>
            </li>
            <li>
              <a href="#" className="hover:underline">
                Instagram
              </a>
            </li>
            <li>
              <a href="#" className="hover:underline">
                Facebook
              </a>
            </li>
            <li>
              <a href="#" className="hover:underline">
                X
              </a>
            </li>
            <li>
              <a href="#" className="hover:underline">
                LinkedIn
              </a>
            </li>
            <li>
              <a href="#" className="hover:underline">
                Paulih Life
              </a>
            </li>
          </ul>
        </div>
      </div>

      {/* Alt Çubuk */}
      <div className="mt-12 border-t border-gray-300 pt-6 flex flex-col md:flex-row items-center justify-between text-gray-600 text-sm w-full px-8">
        {/* Sol Bölüm */}
        <div className="flex items-center space-x-6">
          <div className="flex items-center space-x-2">
            <FaLocationDot />
            <span>Almanya</span>
          </div>
          <div className="flex items-center space-x-2">
            <FaGlobe />
            <span>İngilizce</span>
          </div>
          <div className="flex items-center space-x-2">
            <FaRegMoon />
            <span>Tema</span>
          </div>
          <div className="flex items-center space-x-2">
            <FaCookieBite />
            <span>Çerezler</span>
          </div>
        </div>

        {/* Sağ Bölüm */}
        <div className="flex space-x-6 mt-4 md:mt-0">
          <a href="#" className="hover:underline">
            Erişilebilirlik Beyanı
          </a>
          <a href="#" className="hover:underline">
            Kullanım Şartları
          </a>
          <a href="#" className="hover:underline">
            Gizlilik İlkesi
          </a>
        </div>

        {/* Telif Hakkı */}
        <div className="mt-4 md:mt-0 flex items-center space-x-2">
          <span>© {new Date().getFullYear()} Paulih</span>
          <span className="border-l border-gray-500 h-4"></span>
          <span>Tüm hakları saklıdır.</span>
        </div>
      </div>
    </footer>
  );
};

export default OrderFoodFooter;
