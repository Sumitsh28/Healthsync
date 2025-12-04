"use client";
import Link from "next/link";
import {
  Heart,
  Activity,
  Shield,
  User,
  Thermometer,
  AlertCircle,
  ArrowRight,
} from "lucide-react";

export default function Home() {
  return (
    <div className="min-h-screen bg-gray-50 text-gray-800 font-sans selection:bg-teal-100">
      {/* --- Navigation --- */}
      <nav className="flex justify-between items-center px-8 py-5 bg-white border-b border-gray-100 sticky top-0 z-50">
        <div className="flex items-center gap-2">
          <div className="bg-teal-600 p-1.5 rounded-lg text-white">
            <Heart size={20} fill="white" />
          </div>
          <span className="text-xl font-bold text-gray-900 tracking-tight">
            WellSync
          </span>
        </div>

        <div className="flex items-center gap-6">
          <Link
            href="/login"
            className="text-sm font-medium text-gray-600 hover:text-teal-600 transition-colors"
          >
            Log In
          </Link>
          <Link
            href="/register"
            className="bg-teal-600 text-white px-5 py-2.5 rounded-lg text-sm font-medium hover:bg-teal-700 transition-all shadow-sm hover:shadow-md"
          >
            Get Started
          </Link>
        </div>
      </nav>

      {/* --- Hero Section --- */}
      <header className="flex flex-col items-center justify-center text-center px-4 pt-20 pb-16 max-w-4xl mx-auto">
        <span className="bg-teal-50 text-teal-700 text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wide mb-6 border border-teal-100">
          ✨ Your Health, Simplified
        </span>
        <h1 className="text-5xl md:text-6xl font-extrabold text-gray-900 mb-6 leading-tight">
          Take Control of Your <br />
          <span className="text-teal-600">Wellness Journey</span>
        </h1>
        <p className="text-lg text-gray-500 max-w-2xl mb-10 leading-relaxed">
          Track your health goals, stay on top of preventive care, and connect
          with healthcare providers—all in one place.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
          <Link
            href="/register"
            className="flex items-center justify-center gap-2 bg-teal-600 text-white px-8 py-3.5 rounded-xl font-semibold hover:bg-teal-700 transition-all shadow-lg hover:shadow-teal-200"
          >
            Start Your Journey <ArrowRight size={18} />
          </Link>
          <button className="px-8 py-3.5 rounded-xl font-semibold text-gray-600 bg-white border border-gray-200 hover:bg-gray-50 hover:border-gray-300 transition-all shadow-sm">
            Learn More
          </button>
        </div>
      </header>

      {/* --- Features Section --- */}
      <section className="py-16 px-4">
        <div className="text-center mb-12">
          <h2 className="text-2xl font-bold text-gray-900">
            Everything You Need
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          <FeatureCard
            icon={Activity}
            title="Track Your Goals"
            desc="Monitor steps, hydration, sleep, and more with easy-to-use trackers."
            color="text-teal-600"
            bg="bg-teal-50"
          />
          <FeatureCard
            icon={Shield}
            title="Preventive Care"
            desc="Never miss a checkup or vaccination with smart reminders."
            color="text-emerald-600"
            bg="bg-emerald-50"
          />
          <FeatureCard
            icon={User}
            title="Connect with Providers"
            desc="Share your progress and receive personalized guidance."
            color="text-blue-600"
            bg="bg-blue-50"
          />
        </div>
      </section>

      {/* --- Public Health Hub --- */}
      <section className="py-16 px-4 bg-white/50 border-t border-gray-100">
        <div className="text-center mb-10">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Public Health Hub
          </h2>
          <p className="text-gray-500 text-sm">
            Stay informed with the latest health updates and tips
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
          <InfoCard
            icon={Thermometer}
            title="Flu Season Tips"
            desc="Protect yourself and others during flu season. Get vaccinated, wash hands frequently, and stay home if sick."
            color="text-blue-500"
            border="border-blue-100"
          />
          <InfoCard
            icon={AlertCircle}
            title="COVID-19 Updates"
            desc="Stay informed about the latest guidelines. Boosters are available for eligible individuals."
            color="text-green-500"
            border="border-green-100"
          />
        </div>
      </section>

      {/* --- Simple Footer --- */}
      <footer className="bg-white border-t border-gray-100 py-12 mt-12 text-center">
        <p className="text-gray-400 text-sm">
          © 2024 WellSync. All rights reserved.
        </p>
      </footer>
    </div>
  );
}

// --- Helper Components ---

function FeatureCard({ icon: Icon, title, desc, color, bg }) {
  return (
    <div className="bg-white p-8 rounded-2xl shadow-[0_2px_20px_rgba(0,0,0,0.04)] border border-gray-100 hover:shadow-lg transition-shadow flex flex-col items-center text-center group">
      <div
        className={`w-14 h-14 rounded-2xl ${bg} ${color} flex items-center justify-center mb-6 group-hover:scale-110 transition-transform`}
      >
        <Icon size={28} />
      </div>
      <h3 className="text-lg font-bold text-gray-900 mb-3">{title}</h3>
      <p className="text-gray-500 leading-relaxed text-sm">{desc}</p>
    </div>
  );
}

function InfoCard({ icon: Icon, title, desc, color, border }) {
  return (
    <div
      className={`bg-white p-6 rounded-xl border ${border} shadow-sm flex gap-5 items-start`}
    >
      <div className={`mt-1 ${color}`}>
        <Icon size={24} />
      </div>
      <div className="text-left">
        <h4 className="font-bold text-gray-900 mb-2">{title}</h4>
        <p className="text-xs text-gray-500 leading-relaxed">{desc}</p>
      </div>
    </div>
  );
}
