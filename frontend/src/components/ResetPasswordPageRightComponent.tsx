// src/components/ResetPassword/Right/ResetPasswordPageRightComponent.tsx
import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { resetPassword } from "../services/api"; // Adjust the path if needed
import Input from "../ui/Input";
import { AlertBox } from "../components/Alerts"; // Adjust the import path as necessary

const ResetPasswordPageRightComponent: React.FC = () => {
  const { token } = useParams<{ token: string }>();
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  // Şifre doğrulama durumları
  const [isLengthValid, setIsLengthValid] = useState(false);
  const [hasUppercase, setHasUppercase] = useState(false);
  const [hasLowercase, setHasLowercase] = useState(false);
  const [passwordsMatch, setPasswordsMatch] = useState(true);

  const navigate = useNavigate();

  useEffect(() => {
    setIsLengthValid(password.length >= 8 && password.length <= 16);
    setHasUppercase(/[A-Z]/.test(password));
    setHasLowercase(/[a-z]/.test(password));
    setPasswordsMatch(password === confirmPassword || confirmPassword === "");
  }, [password, confirmPassword]);

  const handlePasswordReset = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage(null);
    setError(null);

    if (password !== confirmPassword) {
      setError("Şifreler uyuşmuyor.");
      return;
    }
    if (!isLengthValid || !hasUppercase || !hasLowercase) {
      setError(
        "Lütfen şifrenizin tüm gereksinimleri karşıladığından emin olun."
      );
      return;
    }

    try {
      setLoading(true);
      await resetPassword(token, { password });
      setMessage(
        "Şifre sıfırlama başarılı. Giriş sayfasına yönlendiriliyorsunuz..."
      );
      setTimeout(() => {
        navigate("/login");
      }, 3000);
    } catch (err: any) {
      setError("Şifre sıfırlama başarısız oldu. Lütfen tekrar deneyin.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-xl overflow-hidden flex flex-col text-gray-700 w-full md:w-[600px] h-[700px] mx-auto shadow-xl">
      <div className="p-8 flex-1 overflow-y-auto">
        {/* Geliştirilmiş Başlık Alanı */}
        <div className="mb-6">
          <h2 className="text-3xl font-bold text-blue-600">Şifreyi Sıfırla</h2>
          <p className="text-sm text-gray-500 mt-2">
            Eski şifrenizi yenisi ile sıfırlayın!
          </p>
        </div>

        {/* Alert Messages */}
        {error && <AlertBox variant="error" title="Hata" description={error} />}
        {message && (
          <AlertBox variant="success" title="Başarılı" description={message} />
        )}

        <form onSubmit={handlePasswordReset} className="space-y-4">
          {/* Yeni Şifre Alanı */}
          <div className="mb-4">
            <div className="relative">
              <Input
                id="password"
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Yeni Şifre Girin"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-3 flex items-center text-gray-400"
              >
                {showPassword ? <FaEyeSlash /> : <FaEye />}
              </button>
            </div>
            {/* Şifre Gereksinimleri */}
            <div className="mt-2 text-xs text-gray-500 space-y-1">
              <div
                className={`flex items-center ${
                  isLengthValid ? "text-green-600" : "text-red-600"
                }`}
              >
                <span className="mr-1">•</span>
                Şifre 8 ile 16 karakter arasında olmalıdır.
              </div>
              <div
                className={`flex items-center ${
                  hasUppercase ? "text-green-600" : "text-red-600"
                }`}
              >
                <span className="mr-1">•</span>
                Şifre en az bir büyük harf içermelidir.
              </div>
              <div
                className={`flex items-center ${
                  hasLowercase ? "text-green-600" : "text-red-600"
                }`}
              >
                <span className="mr-1">•</span>
                Şifre en az bir küçük harf içermelidir.
              </div>
            </div>
          </div>

          {/* Şifreyi Onayla Alanı */}
          <div className="mb-4">
            <Input
              id="confirm-password"
              type="password"
              placeholder="Yeni şifreyi onaylayın"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />
          </div>

          {/* Şifreyi Sıfırla Butonu */}
          <button
            type="submit"
            className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-md transition text-sm font-medium shadow-md mt-4"
            disabled={loading}
          >
            {loading ? "Sıfırlanıyor..." : "Şifreyi Sıfırla"}
          </button>
        </form>
      </div>

      {/* Altbilgi */}
      <div className="w-full border-t border-gray-300 p-4 text-center text-xs text-gray-400">
        &copy; {new Date().getFullYear()} Paulih. Tüm hakları saklıdır.
      </div>
    </div>
  );
};

export default ResetPasswordPageRightComponent;
