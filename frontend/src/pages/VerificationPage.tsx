// src/pages/VerificationPage.tsx
import React, { useEffect, useState, useRef } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { verifyUser, resendVerificationCode } from "../services/api";
import SignupPageLeftComponent from "../components/Signup/Left/SignupPageLeftComponent";
import { AlertBox } from "../components/Alerts"; // Ensure the AlertBox is correctly imported

const VerificationPageRightComponent: React.FC = () => {
  const [code, setCode] = useState<string[]>(Array(6).fill(""));
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [resentMessage, setResentMessage] = useState<string | null>(null);
  const [timeLeft, setTimeLeft] = useState<number>(180); // 3 dakika geri sayım
  const [isResending, setIsResending] = useState<boolean>(false);
  const navigate = useNavigate();
  const query = new URLSearchParams(useLocation().search);
  const email = query.get("email");
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  // Timer effect: geri sayım
  useEffect(() => {
    if (timeLeft > 0) {
      const timerId = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timerId);
    } else {
      setError("Doğrulama kodunun süresi doldu. Lütfen yeni kod isteyin.");
    }
  }, [timeLeft]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    index: number
  ) => {
    const { value } = e.target;
    if (!/^\d$/.test(value) && value !== "") return;

    const newCode = [...code];
    newCode[index] = value;
    setCode(newCode);

    if (value && index < inputRefs.current.length - 1) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (
    e: React.KeyboardEvent<HTMLInputElement>,
    index: number
  ) => {
    if (e.key === "Backspace") {
      const newCode = [...code];
      if (code[index] === "") {
        inputRefs.current[index - 1]?.focus();
      } else {
        newCode[index] = "";
        setCode(newCode);
      }
    }
  };

  const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    const pastedData = e.clipboardData.getData("Text");
    if (pastedData.length === 6 && /^\d+$/.test(pastedData)) {
      const newCode = pastedData.split("");
      setCode(newCode);
      newCode.forEach((digit, index) => {
        if (inputRefs.current[index]) {
          inputRefs.current[index]!.value = digit;
        }
      });
      inputRefs.current[5]?.focus();
      e.preventDefault();
    }
  };

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccessMessage(null);
    const verificationCode = code.join("");

    try {
      const response = await verifyUser({ email, verificationCode });
      setSuccessMessage(response.data.message);
      setError(null);
      setTimeout(() => {
        navigate("/login");
      }, 2000);
    } catch (err: any) {
      setError(
        err.response?.data?.message ||
          "Doğrulama başarısız. Lütfen tekrar deneyin."
      );
    }
  };

  const handleResendCode = async () => {
    setIsResending(true);
    setError(null);
    setResentMessage(null);

    try {
      const response = await resendVerificationCode(email);
      setResentMessage(response.data.message);
      setTimeLeft(180); // geri sayımı sıfırla
      setCode(Array(6).fill(""));
      inputRefs.current[0]?.focus();
    } catch (err: any) {
      setError("Yeni kod gönderilemedi. Lütfen daha sonra tekrar deneyin.");
    } finally {
      setIsResending(false);
    }
  };

  return (
    <div className="bg-white rounded-xl overflow-hidden flex flex-col text-gray-700 w-full md:w-[600px] h-[700px] mx-auto">
      <div className="p-8 flex-1 overflow-y-auto">
        <h2 className="text-xl font-bold text-center text-blue-600 mb-6">
          E-posta Doğrulaması
        </h2>

        {error && <AlertBox variant="error" title="Hata" description={error} />}
        {successMessage && (
          <AlertBox
            variant="info"
            title="Başarılı"
            description={successMessage}
          />
        )}
        {resentMessage && (
          <AlertBox variant="info" title="Bilgi" description={resentMessage} />
        )}

        <form onSubmit={handleVerify}>
          <div className="flex justify-between mb-4">
            {code.map((digit, index) => (
              <input
                key={index}
                ref={(el) => (inputRefs.current[index] = el)}
                type="text"
                maxLength={1}
                className="w-12 h-12 text-center border border-gray-300 rounded-lg text-lg font-bold text-gray-700 focus:outline-none focus:border-blue-600"
                value={digit}
                onChange={(e) => handleChange(e, index)}
                onKeyDown={(e) => handleKeyDown(e, index)}
                onPaste={index === 0 ? handlePaste : undefined}
                autoFocus={index === 0}
                disabled={timeLeft <= 0}
              />
            ))}
          </div>

          <button
            type="submit"
            className={`w-full py-3 rounded-lg font-medium text-sm transition ${
              timeLeft > 0
                ? "bg-blue-600 text-white hover:bg-blue-600"
                : "bg-gray-300 text-gray-600 cursor-not-allowed"
            }`}
            disabled={timeLeft <= 0}
          >
            Kodu Doğrula
          </button>
        </form>

        <div className="mt-6 text-center">
          <p className="text-gray-700 text-sm">
            Kalan Süre: {Math.floor(timeLeft / 60)}:
            {(timeLeft % 60).toString().padStart(2, "0")}
          </p>
          <p className="text-gray-700 text-sm">
            Süre dolduğunda lütfen yeni kod isteyin.
          </p>
          {timeLeft <= 0 && (
            <button
              onClick={handleResendCode}
              className="w-full mt-4 bg-blue-500 text-white py-3 rounded-lg font-semibold text-lg hover:bg-blue-600 transition"
              disabled={isResending}
            >
              {isResending
                ? "Tekrar Gönderiliyor..."
                : "Yeni Doğrulama Kodu Gönder"}
            </button>
          )}
        </div>
      </div>

      <div className="w-full border-t border-gray-300 p-4 text-center text-xs text-gray-400">
        &copy; {new Date().getFullYear()} Paulih. Tüm hakları saklıdır.
      </div>
    </div>
  );
};

const VerificationPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-200 flex items-center justify-center p-4">
      <div className="flex flex-col md:flex-row gap-6 w-full max-w-5xl">
        <SignupPageLeftComponent />
        <VerificationPageRightComponent />
      </div>
    </div>
  );
};

export default VerificationPage;
