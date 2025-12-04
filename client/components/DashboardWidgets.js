"use client";
import { motion } from "framer-motion";

// --- Circular Wellness Gauge (SVG) ---
export const WellnessGauge = ({ score }) => {
  const radius = 40;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (score / 100) * circumference;

  return (
    <div className="relative w-32 h-32 flex items-center justify-center">
      <svg className="w-full h-full transform -rotate-90">
        <circle
          cx="64"
          cy="64"
          r={radius}
          stroke="#e5e7eb"
          strokeWidth="8"
          fill="transparent"
        />
        <motion.circle
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset: offset }}
          transition={{ duration: 1 }}
          cx="64"
          cy="64"
          r={radius}
          stroke="#3b82f6"
          strokeWidth="8"
          fill="transparent"
          strokeDasharray={circumference}
          strokeLinecap="round"
        />
      </svg>
      <span className="absolute text-xl font-bold text-blue-600">{score}%</span>
    </div>
  );
};

// --- Log Data Modal ---
export const LogDataModal = ({ isOpen, onClose, onSave }) => {
  if (!isOpen) return null;
  const today = new Date().toISOString().split("T")[0];

  const handleSubmit = (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    onSave({
      date: today,
      steps: formData.get("steps"),
      sleepHours: formData.get("sleep"),
      mood: formData.get("mood"),
    });
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg w-96">
        <h3 className="text-xl font-bold mb-4">Log Today's Data</h3>
        <form onSubmit={handleSubmit} className="space-y-3">
          <input
            name="steps"
            type="number"
            placeholder="Steps (e.g. 5000)"
            className="w-full border p-2 rounded"
            required
          />
          <input
            name="sleep"
            type="number"
            placeholder="Sleep (Hours)"
            className="w-full border p-2 rounded"
            required
          />
          <select name="mood" className="w-full border p-2 rounded">
            <option value="Happy">Happy 😀</option>
            <option value="Neutral">Neutral 😐</option>
            <option value="Sad">Sad 😔</option>
          </select>
          <div className="flex justify-end gap-2 mt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-gray-200 rounded"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white rounded"
            >
              Save
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

// --- Simple SVG Line Chart ---
export const ActivityChart = ({ data }) => {
  if (!data || data.length === 0) return <p>No data yet</p>;

  // Normalize data for SVG coordinates
  const maxSteps = Math.max(...data.map((d) => d.steps), 1000);
  const points = data
    .map((d, i) => {
      const x = (i / (data.length - 1 || 1)) * 100;
      const y = 100 - (d.steps / maxSteps) * 100;
      return `${x},${y}`;
    })
    .join(" ");

  return (
    <div className="w-full h-32 relative border-l border-b border-gray-300 mt-4">
      <svg viewBox="0 0 100 100" className="w-full h-full overflow-visible">
        <polyline
          fill="none"
          stroke="#10b981"
          strokeWidth="2"
          points={points}
        />
        {data.map((d, i) => (
          <circle
            key={i}
            cx={(i / (data.length - 1 || 1)) * 100}
            cy={100 - (d.steps / maxSteps) * 100}
            r="1.5"
            fill="#10b981"
          />
        ))}
      </svg>
      <div className="flex justify-between text-xs text-gray-400 mt-2">
        <span>{data[0]?.date.slice(5)}</span>
        <span>{data[data.length - 1]?.date.slice(5)}</span>
      </div>
    </div>
  );
};
