import React, { useState } from "react";
import { ChevronDown } from "lucide-react";

interface FAQItem {
  question: string;
  answer: string;
}

interface FAQCategory {
  title: string;
  items: FAQItem[];
}

const faqCategories: FAQCategory[] = [
  {
    title: "Hesap ve Giriş",
    items: [
      {
        question: "Paulih'e nasıl kaydolurum?",
        answer:
          "Paulih'e kaydolmak için ana sayfadaki 'Kayıt Ol' butonuna tıklayın ve gerekli bilgileri girin. E-posta doğrulaması tamamlandığında hesabınız aktif hale gelir.",
      },
      {
        question: "Giriş yapamıyorum, ne yapmalıyım?",
        answer:
          "Giriş yapamıyorsanız, şifrenizi sıfırlayın veya hesabınızın doğrulanmış olduğundan emin olun.",
      },
      {
        question: "Hesap bilgilerini nasıl güncellerim?",
        answer:
          "Profil ayarlarınız üzerinden kişisel bilgilerinizi ve profil fotoğrafınızı güncelleyebilirsiniz. Ayarlardan ise şifrenizi güncelleyebilir ve diğer ayarlarınızı kontrol edebilirsiniz.",
      },
    ],
  },
  {
    title: "Veri Paylaşımı",
    items: [
      {
        question: "Paulih hangi verileri toplar?",
        answer:
          "Paulih, temel kişisel bilgileriniz, gönderileriniz, iletişim bilgileriniz ve tercihlerinizi toplar. Bu veriler kullanıcı deneyimini geliştirmek ve güvenliği sağlamak için kullanılır.",
      },
      {
        question: "Verilerim üçüncü taraflarla paylaşılır mı?",
        answer:
          "Hayır. Paulih, kullanıcı verilerini hiçbir üçüncü tarafla paylaşmaz. Tüm bilgiler yalnızca sistem içi işlevsellik ve güvenlik amacıyla kullanılır. Açık rıza olmadan hiçbir veri aktarımı yapılmaz.",
      },
      {
        question: "Veri paylaşım tercihleri nasıl değiştirilir?",
        answer:
          "Hesabınızın veri paylaşım ayarlarını profil ayarlarınızdan güncelleyebilirsiniz.",
      },
    ],
  },
  {
    title: "Güvenlik ve Gizlilik",
    items: [
      {
        question: "Hesabımın güvenliği nasıl sağlanır?",
        answer:
          "Paulih, kullanıcı güvenliğini en üst düzeyde tutmak için birden fazla güvenlik katmanı uygular. Şifreleriniz gelişmiş algoritmalarla şifrelenerek saklanır. Ayrıca sistem, düzenli olarak güvenlik açıklarına karşı taranır ve gerekli güncellemeler hızla uygulanır. Şüpheli oturumlar ve giriş denemeleri sürekli izlenir ve kullanıcıya anında bildirilir.",
      },
      {
        question: "KVKK kapsamında hangi haklara sahibim?",
        answer:
          "KVKK, verilerinizin nasıl işlendiğini öğrenme, güncelleme ve silinmesini talep etme haklarınızı içerir.",
      },
      {
        question: "Gizlilik politikalarınız nelerdir?",
        answer:
          "Paulih, kullanıcı verilerinin gizliliğini korumak için kapsamlı gizlilik politikaları uygular.",
      },
    ],
  },
  {
    title: "İçerik ve Paylaşım Ayarları",
    items: [
      {
        question: "Gönderilerimi kimler görebilir?",
        answer:
          "Gönderileriniz, paylaşım ayarlarınıza bağlı olarak herkese açık, sadece arkadaşlarınıza veya belirli kullanıcı gruplarına özel olabilir.",
      },
      {
        question: "İçerik paylaşım ayarlarımı nasıl kontrol ederim?",
        answer:
          "Gönderi paylaşırken gönderi paylaşım seçeneklerinizi güncelleyerek, içeriklerinizin kimler tarafından görüntüleneceğini belirleyebilirsiniz.",
      },
      {
        question: "Medya içeriklerim nasıl yönetilir?",
        answer:
          "Fotoğraf ve video gibi medya içeriklerinizin paylaşım düzeyini istediğiniz şekilde ayarlayabilirsiniz.",
      },
    ],
  },
  {
    title: "Ek Bilgiler ve Destek",
    items: [
      {
        question: "Paulih hakkında daha fazla bilgiye nasıl ulaşabilirim?",
        answer:
          "Yardım merkezi ve sıkça sorulan sorular bölümü üzerinden detaylı bilgi alabilirsiniz. Destek ekibimizle iletişime geçerek sorularınızı sorabilirsiniz.",
      },
      {
        question: "Güncellemeler nasıl duyurulur?",
        answer:
          "Paulih, yeni özellikler ve güncellemeler hakkında e-posta ve uygulama içi bildirimlerle sizi bilgilendirir.",
      },
      {
        question:
          "Veri paylaşım ve gizlilik ile ilgili şikayetlerimi nereye iletebilirim?",
        answer:
          "Veri paylaşım veya gizlilik konusundaki şikayetlerinizi, yardım merkezimiz veya destek ekibimiz aracılığıyla bize iletebilirsiniz.",
      },
    ],
  },
];

const UserSettingsFaqs: React.FC = () => {
  const [openItems, setOpenItems] = useState<{
    [category: string]: number | null;
  }>({});

  const toggleItem = (category: string, index: number) => {
    setOpenItems((prev) => ({
      ...prev,
      [category]: prev[category] === index ? null : index,
    }));
  };

  return (
    <div className="w-full min-h-screen bg-gray-100 flex items-start justify-center py-10 px-4">
      <div className="max-w-4xl w-full space-y-8">
        {/* Başlık */}
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            Sık Sorulan Sorular
          </h1>
          <p className="text-sm text-gray-600 mt-1">
            Paulih hakkında merak ettiğin tüm bilgilere buradan ulaşabilirsin.
          </p>
        </div>

        {/* SSS Kartları */}
        <div className="bg-white p-8 rounded-2xl border shadow-sm space-y-8">
          {faqCategories.map((category) => (
            <div key={category.title}>
              <h2 className="text-lg font-bold text-gray-800 mb-4">
                - {category.title}
              </h2>
              <div className="space-y-3">
                {category.items.map((item, index) => {
                  const isOpen = openItems[category.title] === index;
                  return (
                    <div
                      key={index}
                      className={`border rounded-lg transition-colors duration-200 ${
                        isOpen ? "bg-gray-50" : "bg-white"
                      }`}
                    >
                      <button
                        onClick={() => toggleItem(category.title, index)}
                        className="w-full flex justify-between items-center px-4 py-3 focus:outline-none hover:bg-gray-50 rounded-lg transition"
                      >
                        <span className="text-sm font-medium text-gray-800 text-left">
                          {item.question}
                        </span>
                        <ChevronDown
                          size={20}
                          className={`transform transition-transform duration-300 ${
                            isOpen ? "rotate-180" : "rotate-0"
                          }`}
                        />
                      </button>

                      {/* Açıklama alanı animasyonlu */}
                      <div
                        className={`overflow-hidden transition-all duration-300 ease-in-out px-4 text-sm text-gray-700 leading-relaxed ${
                          isOpen ? "max-h-40 pb-4 pt-1" : "max-h-0"
                        }`}
                      >
                        {item.answer}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default UserSettingsFaqs;
