import React from "react";

const UserSettingsSharing: React.FC = () => {
  return (
    <div className="w-full min-h-screen bg-gray-100 flex items-start justify-center py-10 px-4">
      <div className="max-w-4xl w-full space-y-8">
        {/* Sayfa Başlığı */}
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            Paylaşım Ayarları
          </h1>
          <p className="text-gray-600 text-sm mt-1">
            Verilerinizin ve içeriklerinizin nasıl paylaşıldığını yönetin.
          </p>
        </div>

        {/* Giriş ve Temel İlkeler */}
        <div className="bg-white p-6 rounded-2xl border shadow-sm space-y-4">
          <h2 className="text-xl font-bold text-gray-800">
            Giriş ve Temel İlkeler
          </h2>
          <p className="text-gray-700 text-sm leading-relaxed">
            Paulih, kullanıcıların içerik ve verilerini paylaşma biçimlerini
            tamamen kontrol etmelerine olanak tanır. Hangi bilgilerin kimlerle
            paylaşılacağı, hangi içeriklerin herkese açık veya sadece
            arkadaşlarla sınırlı olacağı tamamen sizin tercihinize bağlıdır.
            Uygulama, KVKK ve ilgili yasal düzenlemelere uygun olarak şeffaflık
            sağlar.
          </p>
        </div>

        {/* Verileriniz Güvende */}
        <div className="bg-white p-6 rounded-2xl border shadow-sm space-y-4">
          <h2 className="text-xl font-bold text-gray-800">
            Verileriniz Güvende
          </h2>
          <p className="text-gray-700 text-sm leading-relaxed">
            Paulih, kullanıcılarına ait hiçbir kişisel veriyi veya içerik
            bilgisini üçüncü taraflarla paylaşmaz. Sadece sizin açık onayınızla
            ve yalnızca belirttiğiniz sınırlar çerçevesinde veri işlenir.
            Paulih, veri güvenliğini bir öncelik olarak görmekte ve kullanıcı
            gizliliğini tam anlamıyla korumaktadır.
          </p>
          <p className="text-gray-700 text-sm leading-relaxed">
            Kendi tercihleriniz doğrultusunda paylaşılan içerikler haricinde,
            hiçbir veriniz satılmaz, kiralanmaz veya yetkisiz platformlarla
            paylaşılmaz.
          </p>
        </div>

        {/* İçerik ve Medya Paylaşımı */}
        <div className="bg-white p-6 rounded-2xl border shadow-sm space-y-4">
          <h2 className="text-xl font-bold text-gray-800">
            İçerik ve Medya Paylaşımı
          </h2>
          <p className="text-gray-700 text-sm leading-relaxed">
            Paulih, gönderileriniz, fotoğraflarınız ve videolarınız gibi medya
            içeriklerinin paylaşımını kontrol etmenize olanak tanır. Hangi
            gönderilerinizin tüm kullanıcılar, sadece arkadaşlarınız veya
            belirli gruplar tarafından görüntülenebileceğini seçebilirsiniz.
            Böylece hem gizliliğinizi korur hem de sosyal etkileşimi optimize
            edersiniz.
          </p>
        </div>

        {/* Üçüncü Taraf Entegrasyonlar */}
        <div className="bg-white p-6 rounded-2xl border shadow-sm space-y-4">
          <h2 className="text-xl font-bold text-gray-800">
            Üçüncü Taraf Entegrasyonlar
          </h2>
          <p className="text-gray-700 text-sm leading-relaxed">
            Paulih, üçüncü taraf uygulamalarla entegrasyon sağlar. Ancak bu
            yalnızca sizin açık izninizle etkinleştirilir. Sosyal medya
            hesaplarınızla bağlantı kurabilir ve içeriklerinizi diğer
            platformlarda paylaşabilirsiniz. Tüm entegrasyonlar KVKK'ya tam
            uyumludur.
          </p>
        </div>

        {/* Dış Platformlarla Paylaşım */}
        <div className="bg-white p-6 rounded-2xl border shadow-sm space-y-4">
          <h2 className="text-xl font-bold text-gray-800">
            Dış Platformlarla Paylaşım
          </h2>
          <p className="text-gray-700 text-sm leading-relaxed">
            Verilerinizi dış platformlarla paylaşmadan önce size detaylı
            seçenekler sunarız. Paylaşım sıklığı, kapsamı ve içerik türü gibi
            kriterleri siz belirlersiniz. Böylece hem gizliliğinizi korur hem de
            dilediğiniz kitleye erişebilirsiniz.
          </p>
        </div>

        {/* KVKK ve Yasal Çerçeve */}
        <div className="bg-white p-6 rounded-2xl border shadow-sm space-y-4">
          <h2 className="text-xl font-bold text-gray-800">
            KVKK ve Yasal Çerçeve
          </h2>
          <p className="text-gray-700 text-sm leading-relaxed">
            Paulih, Türkiye'deki KVKK yasalarına tam uyum sağlar. Verilerinizin
            nasıl işleneceği, kimlere aktarılacağı ve hangi koşullarda
            saklanacağı konusunda size şeffaf bilgi sunar. Tüm paylaşım
            işlemleri yasal düzenlemelere göre gerçekleştirilir.
          </p>
        </div>

        {/* Uygulama Politikaları ve Ek Bilgiler */}
        <div className="bg-white p-6 rounded-2xl border shadow-sm space-y-4">
          <h2 className="text-xl font-bold text-gray-800">
            Uygulama Politikaları ve Ek Bilgiler
          </h2>
          <p className="text-gray-700 text-sm leading-relaxed">
            Paulih, kullanıcı deneyimini iyileştirmek için veri politikalarını
            sürekli günceller. Yardım Merkezi ve destek ekibimiz üzerinden
            paylaşım ayarlarıyla ilgili tüm sorularınıza yanıt bulabilirsiniz.
            Verilerinizin güvenliği her zaman önceliğimizdir.
          </p>
        </div>
      </div>
    </div>
  );
};

export default UserSettingsSharing;
