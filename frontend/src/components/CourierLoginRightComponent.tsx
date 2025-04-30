import React, { useState } from "react";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { loginCourier } from "../services/api";

const CourierLoginRightComponent: React.FC = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await loginCourier({ username, password });
      if (response.data && response.data.message === "Login successful") {
        localStorage.setItem("courierUsername", username);
        navigate("/courier/dashboard");
      }
    } catch (err: any) {
      setError(err.response?.data?.message || "Login failed");
    }
  };

  return (
    <div className="bg-white rounded-xl overflow-hidden flex flex-col text-gray-700 w-full md:w-[600px] h-[700px] mx-auto">
      <div className="p-8 flex-1 overflow-y-auto">
        <div className="mb-6">
          <h2 className="text-xl font-bold text-blue-600">Courier Login</h2>
          <p className="text-sm text-gray-500 mt-2">
            Please log in to access your courier dashboard.
          </p>
        </div>

        {error && <div className="text-red-600 text-sm mb-4">{error}</div>}

        <form onSubmit={handleLogin} className="space-y-4">
          <input
            id="username"
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="Username"
            className="w-full p-3 border rounded-md"
            required
          />

          <div className="relative">
            <input
              id="password"
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Password"
              className="w-full p-3 border rounded-md"
              required
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute inset-y-0 right-3 flex items-center text-gray-400"
            >
              {showPassword ? <FaEyeSlash /> : <FaEye />}
            </button>
          </div>

          <button
            type="submit"
            className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-md transition text-sm font-medium shadow-md mt-4"
          >
            Login
          </button>
        </form>

        <div className="text-center mt-6">
          <p className="text-sm text-gray-500">
            Don't have an account?{" "}
            <a href="/courier/signup" className="text-blue-600 font-bold">
              Sign Up
            </a>
          </p>
        </div>
      </div>

      <div className="w-full border-t border-gray-300 p-4 text-center text-xs text-gray-400">
        &copy; {new Date().getFullYear()} Paulih. All rights reserved.
      </div>
    </div>
  );
};

export default CourierLoginRightComponent;
