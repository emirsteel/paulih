// src/components/Signup/Right/SignupPageRightComponentPrivacyPolicy.tsx
import React, { useState, useRef, useEffect } from "react";
import { X, Info, FileText, Shield, Edit } from "lucide-react";

interface PrivacyPolicyPopupProps {
  onClose: () => void;
}

interface Section {
  id: string;
  title: string;
  content: JSX.Element;
  icon: React.ReactElement;
}

const sections: Section[] = [
  {
    id: "giris",
    title: "Giriş ve Amaç",
    content: (
      <div className="bg-gray-100 p-3 rounded">
        <p className="text-xs text-gray-700">
          Paulih, kullanıcılarına profesyonel çeviri hizmetleri sunan kapalı
          kaynaklı bir platformdur. Bu gizlilik politikası, platformumuzda
          toplanan kişisel verilerin hangi amaçlarla, nasıl toplandığını,
          kullanıldığını, saklandığını ve korunduğunu detaylı bir şekilde
          açıklar. Amacımız, kullanıcı verilerinin güvenliğini en üst düzeyde
          korumak ve ilgili yasal düzenlemelere tam uyum sağlamaktır.
        </p>
        <ol className="list-decimal list-inside text-xs text-gray-700 mt-2 space-y-1">
          <li>Veri gizliliği temel önceliğimizdir.</li>
          <li>
            Toplanan veriler yalnızca hizmet kalitesini artırmak amacıyla
            kullanılır.
          </li>
          <li>
            Tüm işlemler 6698 sayılı Kişisel Verilerin Korunması Kanunu’na
            uygundur.
          </li>
        </ol>
      </div>
    ),
    icon: <Info className="w-4 h-4 text-blue-600" />,
  },
  {
    id: "veriToplama",
    title: "Veri Toplama Yöntemleri",
    content: (
      <>
        <p className="text-xs text-gray-700">
          Paulih, kullanıcılarından çeşitli yöntemlerle kişisel veriler toplar.
          Bu yöntemler şunlardır:
        </p>
        <p className="mt-2 text-xs text-gray-700">
          Kayıt formları aracılığıyla kullanıcı adı, tam ad, e-posta gibi temel
          bilgiler; çerezler ve izleme teknolojileri ile tarayıcı bilgileri, IP
          adresi, cihaz türü ve gezinme alışkanlıkları; ayrıca site içi
          etkileşimler ve analitik araçlar kullanılarak elde edilen veriler.
        </p>
      </>
    ),
    icon: <FileText className="w-4 h-4 text-blue-600" />,
  },
  {
    id: "veriIsleme",
    title: "Veri Kullanımı ve İşlenmesi",
    content: (
      <div className="bg-gray-100 p-3 rounded">
        <p className="text-xs text-gray-700">
          Toplanan kişisel veriler, aşağıdaki amaçlarla işlenir:
        </p>
        <ul className="list-disc list-inside text-xs text-gray-700 mt-2 space-y-1">
          <li>Hizmetlerin kişiselleştirilmesi ve geliştirilmesi,</li>
          <li>Pazarlama ve iletişim faaliyetlerinin yürütülmesi,</li>
          <li>Kullanıcı deneyiminin iyileştirilmesi,</li>
          <li>Yasal yükümlülüklerin yerine getirilmesi.</li>
        </ul>
        <p className="mt-2 text-xs text-gray-700">
          Tüm veri işleme faaliyetleri, ilgili yasal düzenlemelere uygun olarak
          gerçekleştirilir.
        </p>
      </div>
    ),
    icon: <Shield className="w-4 h-4 text-blue-600" />,
  },
  {
    id: "veriSaklama",
    title: "Veri Saklama ve Koruma",
    content: (
      <>
        <p className="text-xs text-gray-700">
          Paulih, kullanıcı verilerini yalnızca hizmetlerin sunulabilmesi için
          gerekli süre boyunca saklar. Verilerin korunması için modern şifreleme
          teknikleri, erişim kontrol mekanizmaları ve düzenli güvenlik
          denetimleri uygulanır.
        </p>
        <p className="mt-2 text-xs text-gray-700">
          Veriler, yetkisiz erişim, kayıp veya kötüye kullanım gibi risklere
          karşı maksimum düzeyde korunmaktadır.
        </p>
      </>
    ),
    icon: <Edit className="w-4 h-4 text-blue-600" />,
  },
  {
    id: "kullaniciHaklari",
    title: "Kullanıcı Hakları ve Erişim",
    content: (
      <>
        <p className="text-xs text-gray-700">
          Paulih, kapalı kaynaklı bir platform olduğundan, kullanıcıların
          kişisel verilerine ilişkin erişim, düzeltme, silme veya veri
          taşınabilirliği taleplerini kabul etmemektedir. Toplanan tüm veriler,
          yalnızca dahili analiz ve hizmet geliştirme amacıyla kullanılır ve
          üçüncü şahıslarla paylaşılmaz. Verilerin yönetimi tamamen şirketimiz
          tarafından yapılmaktadır; bu nedenle, kullanıcıların veriler üzerinde
          herhangi bir müdahale talebi yasal olarak değerlendirilmeyecek ve
          karşılanmayacaktır.
        </p>
      </>
    ),
    icon: <Info className="w-4 h-4 text-blue-600" />,
  },
  {
    id: "degisiklikler",
    title: "Değişiklikler ve Bildirim",
    content: (
      <div className="bg-gray-100 p-3 rounded">
        <p className="text-xs text-gray-700">
          Gizlilik politikasında yapılacak tüm güncellemeler, kullanıcılarımıza
          e-posta veya site duyuruları aracılığıyla bildirilecektir. Yapılan
          değişiklikler duyurulduğu andan itibaren geçerli olacak ve güncel
          politika sitede yayınlanacaktır.
        </p>
        <ul className="list-disc list-inside text-xs text-gray-700 mt-2 space-y-1">
          <li>Değişiklikler duyurulduktan sonra uygulanır.</li>
          <li>
            Güncel politika, sitede sürekli olarak erişilebilir olacaktır.
          </li>
          <li>Periyodik olarak güncellemeler gözden geçirilir.</li>
        </ul>
      </div>
    ),
    icon: <FileText className="w-4 h-4 text-blue-600" />,
  },
];

const SignupPageRightComponentPrivacyPolicy: React.FC<
  PrivacyPolicyPopupProps
> = ({ onClose }) => {
  const [activeSection, setActiveSection] = useState<string>(sections[0].id);
  const [sendByEmail, setSendByEmail] = useState(false);
  const sectionRefs = useRef<{ [key: string]: HTMLDivElement | null }>({});

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveSection(entry.target.id);
          }
        });
      },
      { threshold: 0.5 }
    );

    sections.forEach((section) => {
      const ref = sectionRefs.current[section.id];
      if (ref) observer.observe(ref);
    });

    return () => {
      sections.forEach((section) => {
        const ref = sectionRefs.current[section.id];
        if (ref) observer.unobserve(ref);
      });
    };
  }, []);

  const scrollToSection = (id: string) => {
    const section = sectionRefs.current[id];
    if (section) {
      section.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="relative bg-white w-11/12 max-w-4xl h-4/5 rounded-lg shadow-lg overflow-hidden flex">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 text-xl font-bold transition transform hover:scale-110"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Left: Scrollable Content */}
        <div className="w-full md:w-3/5 p-6 overflow-y-auto">
          <div className="border-b pb-3 mb-3">
            <h1 className="text-xl font-bold text-gray-700">
              Gizlilik Politikası
            </h1>
            <p className="text-xs text-gray-400 mt-1">Güncellendi: Mart 2025</p>
          </div>
          {sections.map((section) => (
            <div
              key={section.id}
              id={section.id}
              ref={(el) => (sectionRefs.current[section.id] = el)}
              className="mb-4"
            >
              <h2 className="text-sm font-semibold text-gray-800 mb-1">
                {section.title}
              </h2>
              {section.content}
            </div>
          ))}
          {/* Mobile: "Send copy" + "KABUL EDİYORUM" */}
          <div className="md:hidden border-t pt-3 mt-4 flex flex-col gap-2">
            <label className="flex items-center text-xs text-gray-600">
              <input
                type="checkbox"
                className="mr-2 h-4 w-4"
                checked={sendByEmail}
                onChange={() => setSendByEmail(!sendByEmail)}
              />
              E-postama kopyasını gönder
            </label>
            <button className="bg-blue-600 text-white text-xs py-2 px-4 rounded hover:bg-blue-700 transition">
              KABUL EDİYORUM
            </button>
          </div>
        </div>

        {/* Right: Section Headers Sidebar */}
        <div className="w-full md:w-2/5 border-l p-6 flex flex-col justify-between overflow-y-auto">
          <div>
            {sections.map((section) => (
              <button
                key={section.id}
                onClick={() => scrollToSection(section.id)}
                className={`block w-full text-left py-2 px-2 rounded-md text-xs font-medium mb-1 transition ${
                  activeSection === section.id
                    ? "bg-blue-50 text-blue-600 border-l-4 border-blue-600"
                    : "text-gray-500 hover:bg-gray-100"
                }`}
              >
                {section.title}
              </button>
            ))}
          </div>
          <div className="border-t pt-4 mt-4 hidden md:block">
            <div className="w-full border-t border-gray-300 p-4 text-center text-xs text-gray-400">
              &copy; {new Date().getFullYear()} Paulih. Tüm hakları saklıdır.
            </div>
            <p className="text-xs text-gray-500">Sürüm: Paulih 1.0</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignupPageRightComponentPrivacyPolicy;
