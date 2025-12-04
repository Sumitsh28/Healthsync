"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import api from "@/lib/api";
import {
  User,
  Activity,
  Heart,
  ChevronRight,
  ChevronLeft,
  Check,
  Cigarette,
  Wine,
  Flame,
} from "lucide-react";

export default function Onboarding() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [data, setData] = useState({
    sex: "Male",
    dob: "",
    height: "",
    weight: "",
    activityLevel: "Sedentary",
    smoking: "No",
    alcohol: "None",
    conditions: "",
  });

  const handleChange = (e) =>
    setData({ ...data, [e.target.name]: e.target.value });

  const handleSelect = (name, value) => setData({ ...data, [name]: value });

  const submitOnboarding = async () => {
    setIsLoading(true);
    try {
      const payload = {
        ...data,
        conditions: data.conditions.split(",").map((s) => s.trim()),
      };
      await api.put("/auth/profile", payload);
      router.push("/dashboard");
    } catch (error) {
      alert("Failed to save profile");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-6">
      <div className="max-w-3xl w-full bg-white rounded-3xl shadow-xl overflow-hidden border border-gray-100">
        {/* Header & Progress */}
        <div className="bg-slate-900 p-8 text-white">
          <h1 className="text-2xl font-bold mb-6">Let's set up your profile</h1>
          <div className="flex justify-between relative">
            {/* Progress Line Background */}
            <div className="absolute top-1/2 left-0 w-full h-1 bg-slate-700 -z-0 -translate-y-1/2 rounded-full"></div>

            {/* Progress Line Active */}
            <div
              className="absolute top-1/2 left-0 h-1 bg-teal-500 -z-0 -translate-y-1/2 rounded-full transition-all duration-500"
              style={{ width: step === 1 ? "0%" : step === 2 ? "50%" : "100%" }}
            ></div>

            <StepIndicator current={step} step={1} icon={User} label="Basics" />
            <StepIndicator
              current={step}
              step={2}
              icon={Activity}
              label="Lifestyle"
            />
            <StepIndicator
              current={step}
              step={3}
              icon={Heart}
              label="Medical"
            />
          </div>
        </div>

        {/* Form Body */}
        <div className="p-8 md:p-12 min-h-[400px] flex flex-col justify-between">
          {/* STEP 1: BASICS */}
          {step === 1 && (
            <div className="space-y-6 animate-in fade-in slide-in-from-right-8 duration-300">
              <h2 className="text-xl font-bold text-gray-800">Basic Details</h2>

              {/* Gender Selection */}
              <div>
                <label className="block text-sm font-medium text-gray-600 mb-2">
                  Biological Sex
                </label>
                <div className="grid grid-cols-3 gap-3">
                  {["Male", "Female", "Other"].map((opt) => (
                    <SelectionCard
                      key={opt}
                      selected={data.sex === opt}
                      onClick={() => handleSelect("sex", opt)}
                      label={opt}
                    />
                  ))}
                </div>
              </div>

              {/* DOB */}
              <div>
                <label className="block text-sm font-medium text-gray-600 mb-2">
                  Date of Birth
                </label>
                <input
                  type="date"
                  name="dob"
                  value={data.dob}
                  onChange={handleChange}
                  className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-teal-500 outline-none text-gray-900"
                />
              </div>

              {/* Height & Weight */}
              <div className="grid grid-cols-2 gap-4">
                <div className="relative">
                  <label className="block text-sm font-medium text-gray-600 mb-2">
                    Height
                  </label>
                  <input
                    type="number"
                    name="height"
                    value={data.height}
                    onChange={handleChange}
                    className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-teal-500 outline-none text-gray-900 pr-12"
                    placeholder="0"
                  />
                  <span className="absolute right-4 top-[38px] text-gray-400 text-sm font-medium">
                    cm
                  </span>
                </div>
                <div className="relative">
                  <label className="block text-sm font-medium text-gray-600 mb-2">
                    Weight
                  </label>
                  <input
                    type="number"
                    name="weight"
                    value={data.weight}
                    onChange={handleChange}
                    className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-teal-500 outline-none text-gray-900 pr-12"
                    placeholder="0"
                  />
                  <span className="absolute right-4 top-[38px] text-gray-400 text-sm font-medium">
                    kg
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* STEP 2: LIFESTYLE */}
          {step === 2 && (
            <div className="space-y-6 animate-in fade-in slide-in-from-right-8 duration-300">
              <h2 className="text-xl font-bold text-gray-800">
                Your Lifestyle
              </h2>

              {/* Activity Level */}
              <div>
                <label className="block text-sm font-medium text-gray-600 mb-2">
                  How active are you?
                </label>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {[
                    { label: "Sedentary", desc: "Little to no exercise" },
                    { label: "Lightly Active", desc: "1-3 days/week" },
                    { label: "Moderately Active", desc: "3-5 days/week" },
                    { label: "Very Active", desc: "6-7 days/week" },
                  ].map((opt) => (
                    <button
                      key={opt.label}
                      onClick={() => handleSelect("activityLevel", opt.label)}
                      className={`p-4 rounded-xl border text-left transition-all ${
                        data.activityLevel === opt.label
                          ? "border-teal-500 bg-teal-50 ring-1 ring-teal-500"
                          : "border-gray-200 hover:border-teal-200 hover:bg-gray-50"
                      }`}
                    >
                      <div className="font-semibold text-gray-900 text-sm">
                        {opt.label}
                      </div>
                      <div className="text-xs text-gray-500">{opt.desc}</div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Habits */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-600 mb-2 flex items-center gap-2">
                    <Cigarette size={16} /> Smoking
                  </label>
                  <select
                    name="smoking"
                    value={data.smoking}
                    onChange={handleChange}
                    className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-teal-500 outline-none text-gray-900"
                  >
                    <option>No</option>
                    <option>Yes</option>
                    <option>Occasional</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-600 mb-2 flex items-center gap-2">
                    <Wine size={16} /> Alcohol
                  </label>
                  <select
                    name="alcohol"
                    value={data.alcohol}
                    onChange={handleChange}
                    className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-teal-500 outline-none text-gray-900"
                  >
                    <option>None</option>
                    <option>Socially</option>
                    <option>Regularly</option>
                  </select>
                </div>
              </div>
            </div>
          )}

          {/* STEP 3: MEDICAL */}
          {step === 3 && (
            <div className="space-y-6 animate-in fade-in slide-in-from-right-8 duration-300">
              <h2 className="text-xl font-bold text-gray-800">
                Medical History
              </h2>

              <div>
                <label className="block text-sm font-medium text-gray-600 mb-2">
                  Do you have any existing conditions?
                </label>
                <div className="relative">
                  <textarea
                    name="conditions"
                    placeholder="e.g., Hypertension, Type 2 Diabetes, Asthma..."
                    value={data.conditions}
                    onChange={handleChange}
                    className="w-full p-4 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-teal-500 outline-none text-gray-900 h-40 resize-none"
                  />
                  <p className="text-xs text-gray-400 mt-2 text-right">
                    Separate multiple conditions with commas
                  </p>
                </div>
              </div>

              <div className="p-4 bg-blue-50 rounded-xl flex gap-3 items-start">
                <div className="p-1 bg-blue-100 rounded-full text-blue-600 mt-0.5">
                  <Check size={14} />
                </div>
                <p className="text-xs text-blue-700 leading-relaxed">
                  By clicking Complete, you confirm that this information is
                  accurate to the best of your knowledge. This helps us generate
                  personalized health insights.
                </p>
              </div>
            </div>
          )}

          {/* Navigation Buttons */}
          <div className="flex gap-4 mt-8 pt-6 border-t border-gray-100">
            {step > 1 && (
              <button
                onClick={() => setStep(step - 1)}
                className="flex items-center gap-2 px-6 py-3 rounded-full font-semibold text-gray-600 hover:bg-gray-100 transition-colors"
              >
                <ChevronLeft size={20} /> Back
              </button>
            )}

            {step < 3 ? (
              <button
                onClick={() => setStep(step + 1)}
                className="ml-auto flex items-center gap-2 bg-slate-900 text-white px-8 py-3 rounded-full font-semibold hover:bg-slate-800 transition-all shadow-lg shadow-slate-200"
              >
                Next Step <ChevronRight size={20} />
              </button>
            ) : (
              <button
                onClick={submitOnboarding}
                disabled={isLoading}
                className="ml-auto flex items-center gap-2 bg-teal-600 text-white px-8 py-3 rounded-full font-semibold hover:bg-teal-700 transition-all shadow-lg shadow-teal-200 disabled:opacity-50"
              >
                {isLoading ? "Saving..." : "Complete Setup"} <Check size={20} />
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

// --- Sub Components ---

function StepIndicator({ current, step, icon: Icon, label }) {
  const isActive = current >= step;
  const isCurrent = current === step;

  return (
    <div className="relative z-10 flex flex-col items-center gap-2">
      <div
        className={`w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300 border-2 
        ${
          isActive
            ? "bg-teal-500 border-teal-500 text-white shadow-lg shadow-teal-900/20"
            : "bg-slate-800 border-slate-600 text-slate-400"
        }`}
      >
        <Icon size={18} />
      </div>
      <span
        className={`text-xs font-medium transition-colors ${
          isCurrent ? "text-white" : "text-slate-400"
        }`}
      >
        {label}
      </span>
    </div>
  );
}

function SelectionCard({ selected, onClick, label }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`py-3 px-4 rounded-xl text-sm font-semibold transition-all border
      ${
        selected
          ? "bg-teal-50 border-teal-500 text-teal-800 shadow-sm"
          : "bg-white border-gray-200 text-gray-600 hover:border-gray-300 hover:bg-gray-50"
      }`}
    >
      {label}
    </button>
  );
}
