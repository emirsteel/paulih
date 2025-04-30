import React from "react";

const UserSettingsPermissions: React.FC = () => {
  return (
    <div className="w-full min-h-screen bg-gray-100 flex items-start justify-center py-10 px-4">
      <div className="max-w-4xl w-full space-y-8">
        {/* Sayfa Başlığı */}
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Veri & İzinler</h1>
          <p className="text-gray-600 text-sm mt-1">
            Hesabınızın veri paylaşım ve erişim ayarlarını yönetin.
          </p>
        </div>

        {/* Giriş ve Genel Bakış */}
        <div className="bg-white p-6 rounded-2xl border shadow-sm space-y-4">
          <h2 className="text-xl font-bold text-gray-800">
            Giriş ve Genel Bakış
          </h2>
          <p className="text-gray-700 text-sm leading-relaxed">
            Paulih, kullanıcı verilerinizin gizliliğini ve güvenliğini en üst
            düzeyde tutar. Kişisel verilerinizin nasıl işlendiği, kimlerle
            paylaşıldığı ve hangi izinlerin verildiği konusunda şeffaflık
            sağlar. Verilerinizin kontrolü tamamen sizin elinizdedir.
          </p>
        </div>

        {/* Paulih Verileri Paylaşmaz */}
        <div className="bg-white p-6 rounded-2xl border shadow-sm space-y-4">
          <h2 className="text-xl font-bold text-gray-800">
            Paulih Verilerinizi Paylaşmaz
          </h2>
          <p className="text-gray-700 text-sm leading-relaxed">
            Paulih, kullanıcılarının kişisel bilgilerini veya verilerini hiçbir
            koşulda üçüncü taraflarla paylaşmaz, satmaz veya kiralamaz. Tüm
            veriler sadece kullanıcı izniyle işlenir ve korunur. Gizliliğiniz ve
            güvenliğiniz Paulih için birinci önceliktir.
          </p>
        </div>

        {/* Veri Paylaşım Tercihleri */}
        <div className="bg-white p-6 rounded-2xl border shadow-sm space-y-4">
          <h2 className="text-xl font-bold text-gray-800">
            Veri Paylaşım Tercihleri
          </h2>
          <p className="text-gray-700 text-sm leading-relaxed">
            Paulih, kişisel verilerinizin üçüncü taraflarla nasıl
            paylaşılacağını belirlemenizi sağlar. Verileriniz yalnızca sizin
            açık onayınız ile aktarılır. KVKK kapsamındaki tüm haklarınız
            korunur ve dilediğiniz zaman veri paylaşım tercihlerinizi
            güncelleyebilirsiniz.
          </p>
        </div>

        {/* Erişim İzinleri */}
        <div className="bg-white p-6 rounded-2xl border shadow-sm space-y-4">
          <h2 className="text-xl font-bold text-gray-800">Erişim İzinleri</h2>
          <p className="text-gray-700 text-sm leading-relaxed">
            Hesabınıza kimlerin erişebileceğini belirlemek sizin elinizdedir.
            Sadece onayladığınız kişiler ve uygulamalar verilerinize ulaşabilir.
            Bu sistem, hem uygulama içi güvenliği hem de gizliliğinizi maksimum
            seviyede korur.
          </p>
        </div>

        {/* Gizlilik Politikaları ve Yasal Standartlar */}
        <div className="bg-white p-6 rounded-2xl border shadow-sm space-y-4">
          <h2 className="text-xl font-bold text-gray-800">
            Gizlilik Politikaları ve Yasal Standartlar
          </h2>
          <p className="text-gray-700 text-sm leading-relaxed">
            Paulih, Türkiye'deki KVKK ve uluslararası veri güvenliği
            standartlarına tam uyum sağlar. Verilerinizin nasıl işlendiği,
            kimlere aktarıldığı ve ne kadar süreyle saklandığı konusunda şeffaf
            bilgi sunar.
          </p>
        </div>

        {/* Güvenlik ve Erişim Denetimleri */}
        <div className="bg-white p-6 rounded-2xl border shadow-sm space-y-4">
          <h2 className="text-xl font-bold text-gray-800">
            Güvenlik ve Erişim Denetimleri
          </h2>
          <p className="text-gray-700 text-sm leading-relaxed">
            Hesabınızın güvenliğini artırmak için çok faktörlü doğrulama,
            yetkisiz erişim engelleme ve erişim denetimleri uygulanır. Böylece
            verilerinizin korunması sağlanır ve KVKK yükümlülükleri eksiksiz
            yerine getirilir.
          </p>
        </div>
      </div>
    </div>
  );
};

export default UserSettingsPermissions;
