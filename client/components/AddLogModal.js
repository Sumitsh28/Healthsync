"use client";
import { useState } from "react";
import { X } from "lucide-react";

export default function AddLogModal({ isOpen, onClose, onSubmit }) {
  const [form, setForm] = useState({
    steps: "",
    sleepHours: "",
    mood: "Happy",
  });

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    // Use local date string to ensure it logs for "Today" in your timezone
    const today = new Date().toLocaleDateString("en-CA");

    onSubmit({
      date: today,
      steps: Number(form.steps),
      sleepHours: Number(form.sleepHours),
      mood: form.mood,
    });

    setForm({ steps: "", sleepHours: "", mood: "Happy" });
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 backdrop-blur-sm">
      <div className="bg-white p-6 rounded-2xl w-full max-w-md shadow-2xl relative animate-in fade-in zoom-in duration-200">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors"
        >
          <X size={20} />
        </button>
        <h2 className="text-xl font-bold mb-1 text-gray-800">
          Log Daily Activity
        </h2>
        <p className="text-sm text-gray-500 mb-6">Keep your streak alive!</p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-gray-500 uppercase mb-1">
              Steps
            </label>
            <input
              type="number"
              required
              placeholder="e.g. 10500"
              // FIXED: Added text-gray-900 and bg-gray-50
              className="w-full p-3 bg-gray-50 text-gray-900 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:bg-white outline-none transition-all"
              value={form.steps}
              onChange={(e) => setForm({ ...form, steps: e.target.value })}
            />
          </div>
          <div>
            <label className="block text-xs font-bold text-gray-500 uppercase mb-1">
              Sleep (Hours)
            </label>
            <input
              type="number"
              step="0.1"
              required
              placeholder="e.g. 7.5"
              // FIXED: Added text-gray-900 and bg-gray-50
              className="w-full p-3 bg-gray-50 text-gray-900 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:bg-white outline-none transition-all"
              value={form.sleepHours}
              onChange={(e) => setForm({ ...form, sleepHours: e.target.value })}
            />
          </div>
          <div>
            <label className="block text-xs font-bold text-gray-500 uppercase mb-1">
              Mood
            </label>
            <select
              // FIXED: Added text-gray-900 and bg-gray-50
              className="w-full p-3 bg-gray-50 text-gray-900 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:bg-white outline-none transition-all"
              value={form.mood}
              onChange={(e) => setForm({ ...form, mood: e.target.value })}
            >
              <option value="Happy">Happy 😊</option>
              <option value="Neutral">Neutral 😐</option>
              <option value="Sad">Sad 😔</option>
              <option value="Tired">Tired 😴</option>
              <option value="Energetic">Energetic ⚡</option>
            </select>
          </div>
          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-3 rounded-xl font-bold hover:bg-blue-700 active:scale-95 transition-all shadow-lg shadow-blue-200"
          >
            Save Log
          </button>
        </form>
      </div>
    </div>
  );
}
