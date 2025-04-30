import React, { useState, useEffect } from "react";
import { Eye, EyeOff } from "lucide-react";
import { changePassword } from "../../../services/api";
import { AlertBox, AlertVariant } from "../../Alerts";
import { useNavigate } from "react-router-dom"; // ✅

const UserSettingsChangePassword: React.FC = () => {
  const navigate = useNavigate(); // ✅
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [formData, setFormData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [showPassword, setShowPassword] = useState({
    current: false,
    new: false,
    confirm: false,
  });
  const [loading, setLoading] = useState(false);

  const [alert, setAlert] = useState<{
    variant: AlertVariant;
    title: string;
    description?: string;
  } | null>(null);

  const [isLengthValid, setIsLengthValid] = useState(false);
  const [hasUppercase, setHasUppercase] = useState(false);
  const [hasLowercase, setHasLowercase] = useState(false);
  const [passwordsMatch, setPasswordsMatch] = useState(true);

  useEffect(() => {
    setIsLengthValid(password.length >= 8 && password.length <= 16);
    setHasUppercase(/[A-Z]/.test(password));
    setHasLowercase(/[a-z]/.test(password));
    setPasswordsMatch(password === confirmPassword || confirmPassword === "");
  }, [password, confirmPassword]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (name === "newPassword") setPassword(value);
    if (name === "confirmPassword") setConfirmPassword(value);
  };

  const togglePasswordVisibility = (field: "current" | "new" | "confirm") => {
    setShowPassword((prev) => ({ ...prev, [field]: !prev[field] }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!isLengthValid || !hasUppercase || !hasLowercase) {
      setAlert({
        variant: "error",
        title: "Geçersiz Şifre",
        description:
          "Lütfen şifrenizin tüm gereksinimleri karşıladığından emin olun.",
      });
      return;
    }

    if (formData.newPassword !== formData.confirmPassword) {
      setAlert({
        variant: "error",
        title: "Şifreler Uyuşmuyor",
        description: "Yeni şifre ve onay şifresi aynı olmalıdır.",
      });
      return;
    }

    setLoading(true);
    try {
      await changePassword({
        currentPassword: formData.currentPassword,
        newPassword: formData.newPassword,
      });

      setAlert({
        variant: "success",
        title: "Başarılı",
        description: "Şifre başarıyla güncellendi. Lütfen tekrar giriş yapın.",
      });

      setTimeout(() => {
        localStorage.removeItem("token"); // ✅ Logout
        navigate("/login"); // ✅ Redirect to login
      }, 2000);
    } catch (error) {
      console.error("Şifre güncelleme hatası:", error);
      setAlert({
        variant: "error",
        title: "Hata",
        description: "Şifre güncellenemedi. Lütfen tekrar deneyin.",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full min-h-screen bg-gray-100 flex items-start justify-center py-10 px-4">
      <div className="max-w-4xl w-full space-y-8">
        {/* Sayfa Başlığı */}
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Şifreyi Değiştir</h1>
          <p className="text-gray-600 text-sm mt-1">
            Hesabınızın güvenliğini güçlü bir şifre ile sağlayın.
          </p>
        </div>

        {/* Alert */}
        {alert && (
          <AlertBox
            variant={alert.variant}
            title={alert.title}
            description={alert.description}
            onClose={() => setAlert(null)}
          />
        )}

        {/* Form Kartı */}
        <form
          onSubmit={handleSubmit}
          className="bg-white p-8 rounded-2xl border shadow-sm space-y-6"
        >
          {/* Mevcut Şifre */}
          <div className="relative">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Mevcut Şifre
            </label>
            <div className="relative">
              <input
                type={showPassword.current ? "text" : "password"}
                name="currentPassword"
                value={formData.currentPassword}
                onChange={handleInputChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                required
              />
              <button
                type="button"
                onClick={() => togglePasswordVisibility("current")}
                className="absolute inset-y-0 right-3 flex items-center text-gray-500 hover:text-gray-700"
              >
                {showPassword.current ? (
                  <EyeOff size={18} />
                ) : (
                  <Eye size={18} />
                )}
              </button>
            </div>
          </div>

          {/* Yeni Şifre */}
          <div className="relative">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Yeni Şifre
            </label>
            <div className="relative">
              <input
                type={showPassword.new ? "text" : "password"}
                name="newPassword"
                value={formData.newPassword}
                onChange={handleInputChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                required
              />
              <button
                type="button"
                onClick={() => togglePasswordVisibility("new")}
                className="absolute inset-y-0 right-3 flex items-center text-gray-500 hover:text-gray-700"
              >
                {showPassword.new ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          {/* Şifre Gereksinimleri */}
          <div className="mt-2 text-xs text-gray-500 space-y-1">
            <div
              className={`flex items-center ${isLengthValid ? "text-green-600" : "text-red-600"}`}
            >
              <span className="mr-1">•</span>
              Şifre 8 ile 16 karakter arasında olmalıdır.
            </div>
            <div
              className={`flex items-center ${hasUppercase ? "text-green-600" : "text-red-600"}`}
            >
              <span className="mr-1">•</span>
              Şifre en az bir büyük harf içermelidir.
            </div>
            <div
              className={`flex items-center ${hasLowercase ? "text-green-600" : "text-red-600"}`}
            >
              <span className="mr-1">•</span>
              Şifre en az bir küçük harf içermelidir.
            </div>
          </div>

          {/* Şifreyi Onayla */}
          <div className="relative">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Yeni Şifreyi Onayla
            </label>
            <div className="relative">
              <input
                type={showPassword.confirm ? "text" : "password"}
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleInputChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                required
              />
              <button
                type="button"
                onClick={() => togglePasswordVisibility("confirm")}
                className="absolute inset-y-0 right-3 flex items-center text-gray-500 hover:text-gray-700"
              >
                {showPassword.confirm ? (
                  <EyeOff size={18} />
                ) : (
                  <Eye size={18} />
                )}
              </button>
            </div>
            {!passwordsMatch && confirmPassword && (
              <p className="text-red-500 text-sm mt-1">Şifreler uyuşmuyor.</p>
            )}
          </div>

          {/* Gönder Butonu */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 rounded-md flex items-center justify-center transition"
          >
            {loading ? "Güncelleniyor..." : "Şifreyi Güncelle"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default UserSettingsChangePassword;
