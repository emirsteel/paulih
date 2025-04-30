import React, { useContext, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { AuthUserContext } from "../../../context/AuthUserContext";
import { Trash2 } from "lucide-react";

const UserSettingsDeleteAccount: React.FC = () => {
  const navigate = useNavigate();
  const authContext = useContext(AuthUserContext);

  if (!authContext) {
    throw new Error("AuthUserContext must be used within AuthUserProvider");
  }
  const { user } = authContext;

  const [step, setStep] = useState<number>(1);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [typedUsername, setTypedUsername] = useState<string>("");
  const [errorMsg, setErrorMsg] = useState<string>("");

  const handleNextStep = () => {
    setStep(2);
  };

  const handleBackStep = () => {
    setStep(1);
    setIsModalOpen(false); // 👈 If the modal was open, close it too
  };

  const handleDelete = async () => {
    try {
      const userId = user._id;
      await axios.delete(`http://localhost:5001/api/users/user/${userId}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      localStorage.clear();
      navigate("/signup");
    } catch (error) {
      console.error("Hesap silme hatası:", error);
      alert("Hesabınızı silerken bir hata oluştu.");
    }
  };

  const openModal = () => {
    setIsModalOpen(true);
    setTypedUsername("");
    setErrorMsg("");
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setTypedUsername("");
    setErrorMsg("");
  };

  const handleConfirmDeletion = () => {
    if (typedUsername.trim() === user.username) {
      handleDelete();
    } else {
      setErrorMsg("Kullanıcı adınız eşleşmiyor. Lütfen tekrar deneyin.");
    }
  };

  return (
    <div className="w-full min-h-screen bg-gray-100 flex items-start justify-center py-10 px-4">
      <div className="max-w-3xl w-full space-y-8">
        {/* Sayfa Başlığı */}
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">Hesabı Sil</h1>
          <p className="text-gray-600 text-sm mt-1">
            Hesabınızı kalıcı olarak silmeden önce lütfen dikkatlice okuyun.
          </p>
        </div>

        {/* Kart Alanı */}
        <div className="bg-white p-8 rounded-2xl border shadow-sm space-y-6">
          {step === 1 ? (
            <>
              <div className="space-y-4 text-sm text-gray-600 leading-relaxed">
                <p>
                  Hesabınızı silmek üzeresiniz. Bu işlem gerçekleştiğinde
                  hesabınız ve tüm verileriniz sistemimizden tamamen ve kalıcı
                  olarak silinecektir.
                </p>
                <p>
                  Hesabınızı sildikten sonra, verilerinizi kurtarma veya
                  hesabınıza yeniden erişme imkânınız olmayacaktır. Lütfen bir
                  sonraki adıma geçmeden önce bunu dikkate alın.
                </p>
              </div>

              {/* İleri Butonu */}
              <button
                onClick={handleNextStep}
                className="w-full bg-red-600 hover:bg-red-700 text-white font-medium py-2 rounded-md transition mt-6"
              >
                İleri
              </button>
            </>
          ) : (
            <>
              <div className="space-y-4 text-sm text-gray-600 leading-relaxed">
                <p>
                  Hesabınızı ve tüm verilerinizi kalıcı olarak silmek
                  üzeresiniz. Bu işlem <strong>geri alınamaz</strong>.
                </p>
                <p>
                  E-posta: <strong>{user.email}</strong> ile ilişkilendirilmiş
                  hesabınız <strong>Paulih</strong> sisteminden tamamen
                  kaldırılacaktır.
                </p>
                <p>
                  Gönderileriniz, mesajlarınız ve diğer tüm verileriniz tamamen
                  silinecek ve kurtarılamayacaktır.
                </p>
              </div>

              {/* Hesabımı Sil ve Geri Butonları */}
              <div className="flex flex-col gap-3 mt-6">
                <button
                  onClick={openModal}
                  className="w-full bg-red-600 hover:bg-red-700 text-white font-medium py-2 rounded-md transition"
                >
                  Son Adıma Geç
                </button>
                <button
                  onClick={handleBackStep}
                  className="w-full border border-gray-300 text-gray-700 hover:bg-gray-100 font-medium py-2 rounded-md transition"
                >
                  Geri
                </button>
              </div>
            </>
          )}
        </div>

        {/* Silme Onay Modali */}
        {isModalOpen && (
          <div className="bg-white p-8 rounded-2xl border shadow-sm space-y-6">
            <div className="flex items-center mb-4">
              <div className="bg-red-100 p-2 rounded-full">
                <Trash2 className="text-red-600" size={24} />
              </div>
              <h2 className="ml-3 text-lg font-semibold text-gray-800">
                Hesabı Sil
              </h2>
            </div>

            <p className="text-red-600 font-semibold text-sm">
              ! DİKKAT: Bu işlem kalıcıdır ve geri alınamaz!
            </p>
            <p className="text-gray-700 font-semibold text-sm">
              Tüm verileriniz ve içerikleriniz anında silinecektir.
            </p>

            {/* Kullanıcı Adı Doğrulama */}
            <div>
              <label className="block text-sm text-gray-600 mb-1">
                Kullanıcı adınızı yazın
              </label>
              <input
                type="text"
                value={typedUsername}
                onChange={(e) => setTypedUsername(e.target.value)}
                className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Kullanıcı adınızı girin"
              />
              {errorMsg && (
                <p className="text-red-500 text-sm mt-2">{errorMsg}</p>
              )}
            </div>

            {/* Modal Action Butonları */}
            <div className="flex flex-col gap-3">
              <button
                onClick={handleConfirmDeletion}
                className="w-full bg-red-600 hover:bg-red-700 text-white font-medium py-2 rounded-md transition"
              >
                {" "}
                Hesabımı Sil
              </button>
              <button
                onClick={closeModal}
                className="w-full border border-gray-300 text-gray-700 hover:bg-gray-100 font-medium py-2 rounded-md transition"
              >
                Vazgeç
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default UserSettingsDeleteAccount;
