import React, { useState, useEffect } from "react";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { signupUser } from "../../../services/api";
import Input from "../../../ui/Input";
import TermsOfServicePopup from "../../SignupPageRightComponentTermsOfService";
import PrivacyPolicyPopup from "../../SignupPageRightComponentPrivacyPolicy";
import { AlertBox, AlertVariant } from "../../../components/Alerts";

const SignupPageRightComponent: React.FC = () => {
  const [name, setName] = useState("");
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showTerms, setShowTerms] = useState(false);
  const [showPrivacy, setShowPrivacy] = useState(false);
  const navigate = useNavigate();

  // Şifre doğrulama durumları
  const [isLengthValid, setIsLengthValid] = useState(false);
  const [hasUppercase, setHasUppercase] = useState(false);
  const [hasLowercase, setHasLowercase] = useState(false);
  const [passwordsMatch, setPasswordsMatch] = useState(true);

  const isNameValid = name.length >= 4 && name.length <= 36;
  const isUsernameValid = /^[a-z0-9.]{1,30}$/.test(username);

  // Hacettepe e-posta kontrolü
  const validateEmailDomain = (email: string) =>
    email.trim().toLowerCase().endsWith("@hacettepe.edu.tr");

  useEffect(() => {
    setIsLengthValid(password.length >= 8 && password.length <= 16);
    setHasUppercase(/[A-Z]/.test(password));
    setHasLowercase(/[a-z]/.test(password));
    setPasswordsMatch(password === confirmPassword || confirmPassword === "");
  }, [password, confirmPassword]);

  useEffect(() => {
    // Reset error on field changes
    setError(null);
  }, [name, username, email, password, confirmPassword]);

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateEmailDomain(email)) {
      setError("Lütfen hacettepe.edu.tr uzantılı e-posta adresinizi kullanın.");
      return;
    }
    if (!isNameValid) {
      setError("Ad 4 ile 36 karakter arasında olmalıdır.");
      return;
    }
    if (!isUsernameValid) {
      setError(
        "Kullanıcı adı küçük harflerden oluşmalı ve yalnızca harfler, rakamlar ve nokta içerebilir."
      );
      return;
    }
    if (!isLengthValid || !hasUppercase || !hasLowercase) {
      setError(
        "Lütfen şifrenizin tüm gereksinimleri karşıladığından emin olun."
      );
      return;
    }
    if (password !== confirmPassword) {
      setError("Şifreler eşleşmiyor.");
      return;
    }

    try {
      setLoading(true);
      const payload: any = { name, username, email, password };
      if (validateEmailDomain(email)) {
        payload.badges = ["Hacettepe Üniversitesi"];
      }
      await signupUser(payload);
      navigate(`/verify?email=${encodeURIComponent(email)}`);
    } catch (err: any) {
      setError(
        err.response?.data?.message || "Kayıt başarısız. Lütfen tekrar deneyin."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-xl overflow-hidden flex flex-col text-gray-700 w-full md:w-[600px] h-[700px] mx-auto">
      <div className="p-8 flex-1 overflow-y-auto">
        <div className="mb-6">
          <h2 className="text-xl font-bold text-blue-600">Hesap Oluştur</h2>
          <p className="text-sm text-gray-500 mt-2">
            Hacettepe'deki üniversite yolculuğunuzun her anını yaşayın.
          </p>
        </div>

        {/* AlertBox for error messages */}
        {error && (
          <AlertBox
            variant="error"
            title="Hata"
            description={error}
            onClose={() => setError(null)}
          />
        )}

        <form onSubmit={handleSignup} className="space-y-4">
          <Input
            id="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Tam Ad"
          />
          <Input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="E-posta (sadece @hacettepe.edu.tr)"
          />
          <Input
            id="username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="Kullanıcı Adı"
          />

          <div className="relative">
            <Input
              id="password"
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Şifre"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute inset-y-0 right-3 flex items-center text-gray-400"
            >
              {showPassword ? <FaEyeSlash /> : <FaEye />}
            </button>
          </div>

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

          <Input
            id="confirm-password"
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            placeholder="Şifreyi Onayla"
          />

          <button
            type="submit"
            className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-md transition text-sm font-medium shadow-md mt-4"
            disabled={loading}
          >
            {loading ? "Kayıt Olunuyor..." : "Kayıt Ol"}
          </button>
        </form>

        <div className="text-center mt-6">
          <p className="text-sm text-gray-500">
            Zaten hesabınız var mı?{" "}
            <a href="/login" className="text-blue-600 font-bold">
              Giriş Yap!
            </a>
          </p>
        </div>

        <div className="text-left text-xs text-gray-500 mt-6 leading-relaxed">
          Kayıt Ol butonuna basarak, Paulih'in{" "}
          <button
            type="button"
            onClick={() => setShowTerms(true)}
            className="underline text-blue-600"
          >
            Kullanım Şartları
          </button>{" "}
          ve{" "}
          <button
            type="button"
            onClick={() => setShowPrivacy(true)}
            className="underline text-blue-600"
          >
            Gizlilik Politikası
          </button>{" "}
          kabul ediyorum.
        </div>
      </div>

      <div className="w-full border-t border-gray-300 p-4 text-center text-xs text-gray-400">
        &copy; {new Date().getFullYear()} Paulih. Tüm hakları saklıdır.
      </div>

      {showTerms && <TermsOfServicePopup onClose={() => setShowTerms(false)} />}
      {showPrivacy && (
        <PrivacyPolicyPopup onClose={() => setShowPrivacy(false)} />
      )}
    </div>
  );
};

export default SignupPageRightComponent;
