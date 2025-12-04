"use client";
import { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import Link from "next/link";
import { Facebook, Instagram, Linkedin, Chrome } from "lucide-react";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { login } = useAuth();

  const handleSubmit = (e) => {
    e.preventDefault();
    login(email, password);
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
      <div className="bg-white rounded-[2rem] shadow-2xl overflow-hidden max-w-4xl w-full flex flex-col md:flex-row min-h-[600px]">
        {/* LEFT SIDE: LOGIN FORM */}
        <div className="w-full md:w-1/2 p-8 md:p-12 flex flex-col justify-center">
          <h2 className="text-3xl font-bold text-center text-gray-800 mb-6">
            Sign In
          </h2>

          <div className="flex justify-center gap-4 mb-6">
            <SocialIcon icon={<Facebook size={20} />} />
            <SocialIcon icon={<Chrome size={20} />} />
            <SocialIcon icon={<Instagram size={20} />} />
            <SocialIcon icon={<Linkedin size={20} />} />
          </div>

          <p className="text-center text-gray-400 text-sm mb-6">
            Or use your account
          </p>

          <form onSubmit={handleSubmit} className="space-y-4">
            <input
              type="email"
              placeholder="Email Address"
              // FIXED: Added text-gray-900
              className="w-full bg-gray-50 text-gray-900 border-none p-4 rounded-xl text-sm focus:ring-2 focus:ring-teal-800 outline-none placeholder:text-gray-400"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <input
              type="password"
              placeholder="Password"
              // FIXED: Added text-gray-900
              className="w-full bg-gray-50 text-gray-900 border-none p-4 rounded-xl text-sm focus:ring-2 focus:ring-teal-800 outline-none placeholder:text-gray-400"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />

            <div className="text-center">
              <a href="#" className="text-xs text-gray-500 hover:text-gray-800">
                Forget your password?
              </a>
            </div>

            <button
              type="submit"
              className="w-full bg-[#1F4D4F] text-white py-3 rounded-full font-semibold hover:bg-teal-900 transition-colors shadow-lg mt-4"
            >
              Sign In
            </button>
          </form>
        </div>

        {/* RIGHT SIDE: HERO IMAGE */}
        <div className="w-full md:w-1/2 relative bg-gray-900 flex flex-col items-center justify-center text-white p-12 text-center overflow-hidden">
          <div
            className="absolute inset-0 z-0 opacity-60"
            style={{
              backgroundImage:
                'url("https://images.unsplash.com/photo-1557683316-973673baf926?q=80&w=2029&auto=format&fit=crop")',
              backgroundSize: "cover",
              backgroundPosition: "center",
              filter: "blur(4px)",
            }}
          ></div>
          <div className="absolute inset-0 bg-[#1F4D4F]/30 z-0"></div>

          <div className="relative z-10">
            <h2 className="text-3xl font-bold mb-4">Hey There!</h2>
            <p className="mb-8 text-gray-200">
              Create your account now and step into an amazing new journey of
              health tracking.
            </p>
            <Link
              href="/register"
              className="border-2 border-white px-10 py-3 rounded-full font-semibold hover:bg-white hover:text-[#1F4D4F] transition-all"
            >
              Sign Up
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

function SocialIcon({ icon }) {
  return (
    <button className="w-10 h-10 rounded-full border border-gray-200 flex items-center justify-center text-gray-600 hover:bg-gray-50 hover:border-gray-300 transition-colors">
      {icon}
    </button>
  );
}
