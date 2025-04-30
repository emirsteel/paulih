// src/components/Signup/Right/SignupPageRightComponentTermsOfService.tsx
import React, { useState, useRef, useEffect } from "react";
import { X, Info, FileText, Shield, Edit } from "lucide-react";

interface TermsOfServicePopupProps {
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
    title: "Giriş ve Tanımlar",
    content: (
      <div className="bg-gray-100 p-3 rounded">
        <p className="text-xs text-gray-700">
          Bu Sözleşme, Paulih (bundan böyle “Site” olarak anılacaktır) üzerinden
          sunulan çevrimiçi çeviri, dil danışmanlığı ve metin düzenleme
          hizmetlerinin kullanımına ilişkin şartları belirler. Site’de sunulan
          tüm içerik, araç, hizmet ve materyaller Site’nin sahibi veya ilgili
          üçüncü taraflara aittir.
        </p>
        <p className="mt-2 text-xs text-gray-700">
          “Kullanıcı”, Site’ye erişen ve hizmetleri kullanan gerçek ya da tüzel
          kişiyi ifade eder. Sözleşmede geçen diğer terimler, ilgili bağlamda
          yorumlanacaktır.
        </p>
        <ol className="list-decimal list-inside text-xs text-gray-700 mt-2 space-y-1">
          <li>
            Üyelik: Site’ye kayıt olan kullanıcıların sağladığı bilgilerin
            doğruluğu.
          </li>
          <li>
            Hizmet: Paulih’in sunduğu çevrimiçi çeviri ve ilgili danışmanlık
            hizmetleri.
          </li>
          <li>
            Telif Hakkı: Site üzerinde yer alan tüm içeriklerin fikri mülkiyet
            hakları.
          </li>
        </ol>
      </div>
    ),
    icon: <Info className="w-4 h-4 text-blue-600" />,
  },
  {
    id: "uyelik",
    title: "Üyelik ve Hesap Güvenliği",
    content: (
      <>
        <p className="text-xs text-gray-700">
          Siteye kayıt olan kullanıcılar, doğru, eksiksiz ve güncel bilgileri
          sağlamayı taahhüt eder. Kullanıcı, hesabının güvenliğinden tamamen
          sorumludur; şifre gizliliğine özen göstermeli, herhangi bir yetkisiz
          erişimi derhal Site yönetimine bildirmelidir.
        </p>
        <p className="mt-2 text-xs text-gray-700">
          Hesap güvenliği ihmalinden doğacak zararlardan Site hiçbir şekilde
          sorumlu tutulamaz. Kullanıcılar, hesap bilgilerinin üçüncü kişilerle
          paylaşılmaması gerektiğini kabul eder.
        </p>
      </>
    ),
    icon: <FileText className="w-4 h-4 text-blue-600" />,
  },
  {
    id: "hizmet",
    title: "Hizmetlerin Kullanımı",
    content: (
      <div className="bg-gray-100 p-3 rounded">
        <p className="text-xs text-gray-700">
          Paulih, kullanıcılarına çevrimiçi çeviri, metin düzenleme ve dil
          danışmanlığı hizmetleri sunar. Hizmetler, kullanıcı ihtiyaçlarına göre
          sağlanır ancak kesintisiz, hatasız veya güncel hizmet verileceğine
          dair kesin bir garanti verilmez.
        </p>
        <ul className="list-disc list-inside text-xs text-gray-700 mt-2 space-y-1">
          <li>
            Hizmet kalitesi, kullanıcı geri bildirimlerine göre sürekli
            geliştirilmektedir.
          </li>
          <li>
            Site, hizmetlerin kullanılmasından kaynaklanabilecek dolaylı
            zararlar için sorumluluk kabul etmez.
          </li>
          <li>Kullanıcı, hizmetleri kendi riskleri altında kullanır.</li>
        </ul>
      </div>
    ),
    icon: <Shield className="w-4 h-4 text-blue-600" />,
  },
  {
    id: "mulk",
    title: "Fikri Mülkiyet Hakları",
    content: (
      <>
        <p className="text-xs text-gray-700">
          Site üzerindeki tüm içerikler; metin, grafik, logo, tasarım, yazılım
          ve diğer materyaller Paulih veya ilgili üçüncü taraflara aittir. Bu
          içeriklerin izinsiz kopyalanması, dağıtılması veya türev
          çalışmalarının oluşturulması yasaktır.
        </p>
        <p className="mt-2 text-xs text-gray-700">
          Kullanıcılar, Site’deki içeriklerden yalnızca kişisel kullanım
          amacıyla yararlanabilir; ticari amaçlı kullanımlar için Site
          yönetiminden yazılı izin alınmalıdır.
        </p>
      </>
    ),
    icon: <Edit className="w-4 h-4 text-blue-600" />,
  },
  {
    id: "sorumluluk",
    title: "Sorumluluk Reddi ve Garantiler",
    content: (
      <div className="bg-gray-100 p-3 rounded">
        <p className="text-xs text-gray-700">
          Site, sunulan hizmetlerin doğruluğu, güncelliği veya kesintisiz
          çalışacağına dair hiçbir garanti vermez. Kullanıcı, hizmetleri
          kullanırken ortaya çıkabilecek doğrudan ya da dolaylı zarar ve
          kayıplardan tamamen kendi sorumluluğu altında hareket eder.
        </p>
        <p className="mt-2 text-xs text-gray-700">
          Paulih, hizmetlerin kullanımı sonucu oluşabilecek herhangi bir zarar
          veya kayıptan sorumlu tutulamaz.
        </p>
      </div>
    ),
    icon: <Info className="w-4 h-4 text-blue-600" />,
  },
  {
    id: "gizlilik",
    title: "Gizlilik ve Kişisel Verilerin Korunması",
    content: (
      <>
        <p className="text-xs text-gray-700">
          Site üzerinde sunulan hizmetlerin bir parçası olarak, kullanıcıların
          kişisel verileri toplanmakta, işlenmekte ve saklanmaktadır. Bu
          veriler, 6698 sayılı Kişisel Verilerin Korunması Kanunu ve ilgili
          diğer mevzuata uygun olarak yönetilir.
        </p>
        <p className="mt-2 text-xs text-gray-700">
          Kullanılan veriler, yalnızca hizmet kalitesini artırmak ve kullanıcı
          deneyimini kişiselleştirmek amacıyla işlenir. Verilerin üçüncü
          taraflarla paylaşımı, yasal zorunluluklar dışında gerçekleşmez.
        </p>
      </>
    ),
    icon: <FileText className="w-4 h-4 text-blue-600" />,
  },
  {
    id: "degisiklik",
    title: "Hizmet Şartlarının Değiştirilmesi ve Uyuşmazlık Çözümü",
    content: (
      <div className="bg-gray-100 p-3 rounded">
        <p className="text-xs text-gray-700">
          Paulih, bu Sözleşme üzerinde tek taraflı değişiklik yapma hakkını
          saklı tutar. Yapılan değişiklikler, Site üzerinden duyurulur ve duyuru
          tarihinden itibaren geçerli olur.
        </p>
        <ul className="list-disc list-inside text-xs text-gray-700 mt-2 space-y-1">
          <li>Değişiklikler duyurulduktan sonra uygulanır.</li>
          <li>Güncel Sözleşme, sitede sürekli erişilebilir olacaktır.</li>
          <li>
            Uyuşmazlık durumlarında İstanbul Mahkemeleri ve İcra Daireleri
            yetkilidir.
          </li>
        </ul>
      </div>
    ),
    icon: <Shield className="w-4 h-4 text-blue-600" />,
  },
];

const SignupPageRightComponentTermsOfService: React.FC<
  TermsOfServicePopupProps
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
              Kullanım Şartları
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
              <p className="text-xs text-gray-600 leading-relaxed">
                {section.content}
              </p>
            </div>
          ))}
          {/* Mobile: "E-postama kopyasını gönder" + "KABUL EDİYORUM" */}
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

export default SignupPageRightComponentTermsOfService;
