import React, { useState } from "react";
import { loginSupplier } from "../services/api";
import { useNavigate } from "react-router-dom";
import { FaGlobe, FaChartBar, FaBullhorn, FaCog } from "react-icons/fa";

const SupplierLogin: React.FC = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await loginSupplier({ username, password });
      localStorage.setItem("supplierToken", response.data.token);
      navigate("/supplier-dashboard");
    } catch (error) {
      console.error("Login failed", error);
      alert("Invalid login credentials.");
    }
  };

  return (
    <div className="flex h-screen relative">
      {/* Header */}
      <div className="absolute top-4 right-6 flex items-center space-x-2 border rounded-full px-3 py-1">
        <FaGlobe className="text-black text-lg" />
        <span className="text-black">EN</span>
      </div>

      {/* Left Side - Info Section (Hidden on Mobile) */}
      <div className="w-1/2 hidden md:flex flex-col justify-center items-start bg-gray-100 px-20">
        <img src="/partnerlogin.png" alt="Logo" className="h-36 mb-6" />
        <h1 className="text-xl md:text-3xl font-bold text-black mb-6">
          Transform your business with Yemeksepeti Partner
        </h1>
        <div className="space-y-6">
          <div className="flex items-center space-x-4">
            <div className="bg-white p-3 rounded-full flex items-center justify-center h-12 w-12">
              <FaChartBar className="text-blue-600 text-xl" />
            </div>
            <p className="text-sm md:text-base text-gray-600">
              Track performance and get invaluable insights to improve customer
              loyalty and sales.
            </p>
          </div>
          <div className="flex items-center space-x-4">
            <div className="bg-white p-3 rounded-full flex items-center justify-center h-12 w-12">
              <FaBullhorn className="text-blue-600 text-xl" />
            </div>
            <p className="text-sm md:text-base text-gray-600">
              Offer discounts and launch ad campaigns to attract new customers.
            </p>
          </div>
          <div className="flex items-center space-x-4">
            <div className="bg-white p-3 rounded-full flex items-center justify-center h-12 w-12">
              <FaCog className="text-blue-600 text-xl" />
            </div>
            <p className="text-sm md:text-base text-gray-600">
              Manage your menu and opening times more easily, so they’re always
              up to date.
            </p>
          </div>
        </div>
      </div>

      {/* Right Side - Login Section */}
      <div className="w-full md:w-1/2 flex flex-col justify-center items-center bg-white px-10">
        <h2 className="text-2xl font-bold text-black mb-6">
          Log in with your username
        </h2>
        <form onSubmit={handleLogin} className="w-full max-w-sm">
          <div className="mb-4">
            <input
              type="text"
              placeholder="Username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-600"
            />
          </div>
          <div className="mb-4 relative">
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-600"
            />
          </div>
          <div className="flex justify-end text-amber-500 text-sm mb-4">
            <a href="#">Forgot password?</a>
          </div>
          <button
            type="submit"
            className="w-full bg-blue-600 text-white p-3 rounded font-semibold hover:bg-blue-700 transition"
          >
            Log in
          </button>
        </form>
        <div className="mt-6 text-gray-600">
          No account?{" "}
          <a href="#" className="text-amber-500 font-semibold">
            Partner with Yemeksepeti
          </a>
        </div>
      </div>
    </div>
  );
};

export default SupplierLogin;
