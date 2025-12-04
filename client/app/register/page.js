"use client";
import { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import Link from "next/link";
import { Facebook, Instagram, Linkedin, Chrome } from "lucide-react";

export default function Register() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    role: "patient",
    consentGiven: false,
  });
  const { register } = useAuth();

  const handleSubmit = (e) => {
    e.preventDefault();
    register(form);
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
      <div className="bg-white rounded-[2rem] shadow-2xl overflow-hidden max-w-4xl w-full flex flex-col md:flex-row min-h-[600px]">
        {/* LEFT SIDE: HERO IMAGE */}
        <div className="hidden md:flex w-full md:w-1/2 relative bg-gray-900 flex-col items-center justify-center text-white p-12 text-center overflow-hidden">
          <div
            className="absolute inset-0 z-0 opacity-60"
            style={{
              backgroundImage:
                'url("https://images.unsplash.com/photo-1550684848-fac1c5b4e853?q=80&w=2070&auto=format&fit=crop")',
              backgroundSize: "cover",
              backgroundPosition: "center",
              filter: "blur(4px)",
            }}
          ></div>
          <div className="absolute inset-0 bg-[#1F4D4F]/30 z-0"></div>

          <div className="relative z-10">
            <h2 className="text-3xl font-bold mb-4">Welcome Back!</h2>
            <p className="mb-8 text-gray-200">
              To keep connected with us please login with your personal info.
            </p>
            <Link
              href="/login"
              className="border-2 border-white px-10 py-3 rounded-full font-semibold hover:bg-white hover:text-[#1F4D4F] transition-all"
            >
              Sign In
            </Link>
          </div>
        </div>

        {/* RIGHT SIDE: REGISTER FORM */}
        <div className="w-full md:w-1/2 p-8 md:p-12 flex flex-col justify-center">
          <h2 className="text-3xl font-bold text-center text-gray-800 mb-6">
            Create Account
          </h2>

          <div className="flex justify-center gap-4 mb-6">
            <SocialIcon icon={<Facebook size={20} />} />
            <SocialIcon icon={<Chrome size={20} />} />
            <SocialIcon icon={<Instagram size={20} />} />
          </div>

          <p className="text-center text-gray-400 text-sm mb-6">
            or use your email for registration
          </p>

          <form onSubmit={handleSubmit} className="space-y-3">
            <input
              type="text"
              placeholder="Full Name"
              // FIXED: Added text-gray-900
              className="w-full bg-gray-50 text-gray-900 border-none p-3 rounded-xl text-sm outline-none focus:ring-2 focus:ring-teal-800 placeholder:text-gray-400"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              required
            />
            <input
              type="email"
              placeholder="Email"
              // FIXED: Added text-gray-900
              className="w-full bg-gray-50 text-gray-900 border-none p-3 rounded-xl text-sm outline-none focus:ring-2 focus:ring-teal-800 placeholder:text-gray-400"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              required
            />
            <input
              type="password"
              placeholder="Password"
              // FIXED: Added text-gray-900
              className="w-full bg-gray-50 text-gray-900 border-none p-3 rounded-xl text-sm outline-none focus:ring-2 focus:ring-teal-800 placeholder:text-gray-400"
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
              required
            />

            <div className="flex gap-2">
              <select
                // FIXED: Added text-gray-900
                className="w-full bg-gray-50 text-gray-900 border-none p-3 rounded-xl text-sm outline-none focus:ring-2 focus:ring-teal-800"
                value={form.role}
                onChange={(e) => setForm({ ...form, role: e.target.value })}
              >
                <option value="patient">Patient</option>
                <option value="provider">Provider</option>
              </select>
            </div>

            <div className="flex items-center gap-2 justify-center mt-2">
              <input
                type="checkbox"
                id="consent"
                checked={form.consentGiven}
                onChange={(e) =>
                  setForm({ ...form, consentGiven: e.target.checked })
                }
                required
                className="accent-teal-800"
              />
              <label htmlFor="consent" className="text-xs text-gray-500">
                I agree to the Privacy Policy.
              </label>
            </div>

            <button
              type="submit"
              className="w-full bg-[#1F4D4F] text-white py-3 rounded-full font-semibold hover:bg-teal-900 transition-colors shadow-lg mt-4"
            >
              Sign Up
            </button>

            <div className="md:hidden text-center mt-4">
              <Link
                href="/login"
                className="text-sm text-teal-800 font-semibold"
              >
                Already have an account? Sign In
              </Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

function SocialIcon({ icon }) {
  return (
    <button
      type="button"
      className="w-10 h-10 rounded-full border border-gray-200 flex items-center justify-center text-gray-600 hover:bg-gray-50 hover:border-gray-300 transition-colors"
    >
      {icon}
    </button>
  );
}
