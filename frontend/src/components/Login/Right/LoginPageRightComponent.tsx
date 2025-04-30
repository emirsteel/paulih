// src/components/Login/Right/LoginPageRightComponent.tsx
import React, { useState } from "react";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { useNavigate, Link } from "react-router-dom";
import { loginUser } from "../../../services/api";
import { useAuth } from "../../../context/AuthContext";
import Input from "../../../ui/Input";
import { AlertBox } from "../../../components/Alerts"; // Adjust the path as needed

const LoginPageRightComponent: React.FC = () => {
  const [emailOrUsername, setEmailOrUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    try {
      setLoading(true);
      const response = await loginUser({ emailOrUsername, password });
      const { token, name, username, profileImage, userId, bio } =
        response.data;
      login(token, name, username, profileImage, bio);
      localStorage.setItem("userId", userId);
      localStorage.setItem("bio", bio);
      navigate("/home");
      // Refresh the logged in page after navigation
      window.location.reload();
    } catch (err: any) {
      setError(
        err.response?.data?.message || "Giriş başarısız. Lütfen tekrar deneyin."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-xl overflow-hidden flex flex-col text-gray-700 w-full md:w-[600px] h-auto md:h-[700px] mx-auto">
      <div className="p-8 flex-1">
        {/* Enhanced Header Area */}
        <div className="mb-6">
          <h2 className="text-xl font-bold text-blue-600">
            Hesabınıza Giriş Yapın
          </h2>
          <p className="text-sm text-gray-500 mt-2">
            Devam etmek için bilgilerinizi girin.
          </p>
        </div>

        {/* Display error using AlertBox */}
        {error && <AlertBox variant="error" title="Hata" description={error} />}

        <form onSubmit={handleLogin} className="space-y-4">
          <Input
            id="emailOrUsername"
            value={emailOrUsername}
            onChange={(e) => setEmailOrUsername(e.target.value)}
            placeholder="E-posta veya Kullanıcı Adı"
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

          {/* Forgot Password aligned to right */}
          <div className="text-right mt-6">
            <p className="text-sm text-gray-500">
              Şifrenizi mi unuttunuz?{" "}
              <Link to="/forgot-password" className="text-blue-600 font-bold">
                Sıfırlayın!
              </Link>
            </p>
          </div>

          <button
            type="submit"
            className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-md transition text-sm font-medium shadow-md mt-4"
            disabled={loading}
          >
            {loading ? "Giriş Yapılıyor..." : "Giriş Yap"}
          </button>
        </form>

        {/* Sign Up Prompt */}
        <div className="text-center mt-6">
          <p className="text-sm text-gray-500">
            Hesabınız yok mu?{" "}
            <Link to="/signup" className="text-blue-600 font-bold">
              Buradan kaydolun!
            </Link>
          </p>
        </div>
      </div>

      {/* Footer */}
      <div className="w-full border-t border-gray-300 p-4 text-center text-xs text-gray-400">
        &copy; {new Date().getFullYear()} Paulih. Tüm hakları saklıdır.
      </div>
    </div>
  );
};

export default LoginPageRightComponent;
