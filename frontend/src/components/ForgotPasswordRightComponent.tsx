// src/components/ForgotPasswordRightComponent.tsx
import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { FaEye, FaEyeSlash } from "react-icons/fa"; // If needed elsewhere
import { requestPasswordReset } from "../services/api";
import Input from "../ui/Input";
import { AlertBox } from "../components/Alerts"; // Adjust the path as needed

const containerVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.7 } },
};

const ForgotPasswordRightComponent: React.FC = () => {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [animate, setAnimate] = useState(false);
  const [timeLeft, setTimeLeft] = useState(180); // 3 minutes countdown
  const navigate = useNavigate();

  // Trigger container animation on mount
  useEffect(() => {
    setAnimate(true);
  }, []);

  // Countdown timer for resending code (if needed)
  useEffect(() => {
    if (timeLeft > 0) {
      const timerId = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timerId);
    }
  }, [timeLeft]);

  const handleRequestReset = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage(null);
    setError(null);
    try {
      setLoading(true);
      const response = await requestPasswordReset({ email });
      console.log("Sunucudan gelen yanıt:", response);
      setMessage("Parola sıfırlama bağlantısı e-posta adresinize gönderildi.");
    } catch (err: any) {
      console.error("Sunucudan gelen hata yanıtı:", err);
      setError(
        err.response?.data?.message ||
          "Sıfırlama bağlantısı gönderilemedi. Lütfen tekrar deneyin."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div
      className="bg-white rounded-xl overflow-hidden flex flex-col text-gray-700 w-full md:w-[600px] h-auto md:h-[700px] mx-auto"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      <div className="p-8 flex-1 overflow-y-auto">
        {/* Başlık */}
        <div className="mb-6">
          <h2 className="text-3xl font-bold text-blue-600 text-center mb-2">
            Şifremi Unuttum
          </h2>
          <p className="text-sm text-gray-500 text-center">
            Parola sıfırlama bağlantısını almak için lütfen e-posta adresinizi
            girin.
          </p>
        </div>

        {/* Alert Messages */}
        {error && <AlertBox variant="error" title="Hata" description={error} />}
        {message && (
          <AlertBox variant="success" title="Başarılı" description={message} />
        )}

        <form onSubmit={handleRequestReset} className="space-y-4">
          <div>
            <Input
              id="email"
              type="email"
              placeholder="E-posta adresinizi girin"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <button
            type="submit"
            className={`w-full py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-md transition text-sm font-medium shadow-md mt-4 ${
              loading ? "opacity-75 cursor-not-allowed" : ""
            }`}
            disabled={loading}
          >
            {loading ? "Gönderiliyor..." : "Sıfırlama Bağlantısını Gönder"}
          </button>
        </form>

        <div className="mt-6 text-center">
          <p className="text-gray-700 text-sm">
            Parolanızı hatırladınız mı?{" "}
            <Link to="/login" className="text-blue-600 font-bold underline">
              Giriş Yapın!
            </Link>
          </p>
        </div>

        <div className="text-left text-xs text-gray-500 mt-6 leading-relaxed">
          Sıfırlama talebinde bulunarak, Paulih’in{" "}
          <a href="#" className="underline text-blue-600">
            Hizmet Şartları
          </a>{" "}
          ve{" "}
          <a href="#" className="underline text-blue-600">
            Gizlilik Politikası
          </a>{" "}
          nı kabul etmiş olursunuz.
        </div>
      </div>

      {/* Altbilgi */}
      <div className="w-full border-t border-gray-300 p-4 text-center text-xs text-gray-400">
        &copy; {new Date().getFullYear()} Paulih. Tüm hakları saklıdır.
      </div>
    </motion.div>
  );
};

export default ForgotPasswordRightComponent;
