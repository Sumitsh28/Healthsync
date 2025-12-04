"use client";
import { useEffect, useState, useCallback } from "react";
import api from "@/lib/api";
import { useAuth } from "@/context/AuthContext";
import AddLogModal from "../../components/AddLogModal";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  AreaChart,
  Area,
} from "recharts";
import {
  format,
  startOfMonth,
  endOfMonth,
  eachDayOfInterval,
  isSameDay,
  differenceInDays,
  parseISO,
} from "date-fns";
import {
  Activity,
  Moon,
  Trophy,
  Flame,
  MoreHorizontal,
  Plus,
  Check, // Added Check Icon
} from "lucide-react";

export default function Dashboard() {
  const { user } = useAuth();
  const [history, setHistory] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [stats, setStats] = useState({
    steps: 0,
    sleep: 0,
    score: 0,
    streak: 0,
  });

  // 1. FIXED STREAK LOGIC: Checks for consecutive days
  const calculateStreak = (logs) => {
    if (!logs || logs.length === 0) return 0;

    // Sort Newest -> Oldest
    const sortedLogs = [...logs].sort(
      (a, b) => new Date(b.date) - new Date(a.date)
    );

    let streak = 0;
    const today = new Date();
    today.setHours(0, 0, 0, 0); // normalize today

    // Check if the most recent log is today or yesterday (to maintain active streak)
    const lastLogDate = new Date(sortedLogs[0].date);
    const diff = differenceInDays(today, lastLogDate);

    // If the last log is older than yesterday, streak is broken (0)
    if (diff > 1) return 0;

    // Count consecutive days meeting goal
    for (let i = 0; i < sortedLogs.length; i++) {
      const currentLog = sortedLogs[i];

      // Goal Check
      if (currentLog.steps >= 10000) {
        // Continuity Check
        if (i > 0) {
          const prevDate = new Date(sortedLogs[i - 1].date);
          const currDate = new Date(currentLog.date);
          const gap = differenceInDays(prevDate, currDate);
          if (gap > 1) break; // Gap detected, stop counting
        }
        streak++;
      } else {
        break; // Goal not met, stop counting
      }
    }
    return streak;
  };

  const fetchData = useCallback(async () => {
    try {
      const res = await api.get("/patient/history");
      const data = res.data;

      // Sort Chronological (Oldest -> Newest) for Charts
      const chartData = [...data].sort(
        (a, b) => new Date(a.date) - new Date(b.date)
      );
      setHistory(chartData);

      const todayLog = chartData[chartData.length - 1] || {};

      setStats({
        steps: todayLog.steps || 0,
        sleep: todayLog.sleepHours || 0,
        score: user?.wellnessScore || 0,
        streak: calculateStreak(chartData), // Pass data to streak calc
      });
    } catch (err) {
      console.error("Fetch error:", err);
    }
  }, [user]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleAddLog = async (logData) => {
    try {
      await api.post("/patient/log", logData);

      // 2. FIXED UPDATE: Add delay to allow DB to process write
      await new Promise((resolve) => setTimeout(resolve, 500));

      await fetchData(); // Fetch fresh data
      alert("Saved successfully!");
    } catch (err) {
      console.error("Save error:", err);
      const msg = err.response?.data?.message || "Failed to save.";
      alert(msg);
    }
  };

  return (
    <div className="space-y-8 relative">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-800">Health Overview</h1>
        <button
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-xl shadow-lg shadow-blue-200 hover:bg-blue-700 hover:scale-105 transition-all font-medium"
        >
          <Plus size={18} /> Log Activity
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <StatCard
          title="Steps Today"
          value={stats.steps}
          target="10,000"
          icon={Activity}
          color="blue"
          trend="+5%"
        />
        <StatCard
          title="Sleep Hours"
          value={`${stats.sleep}h`}
          target="8h"
          icon={Moon}
          color="purple"
          trend="-2%"
        />
        <StatCard
          title="Wellness Score"
          value={stats.score}
          target="100"
          icon={Trophy}
          color="green"
          trend="+12%"
        />
        <StatCard
          title="Current Streak"
          value={`${stats.streak} Days`}
          target="30 Days"
          icon={Flame}
          color="orange"
          trend="Keep going!"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
          <div className="flex justify-between items-center mb-6">
            <h3 className="font-bold text-lg text-gray-800">Activity Trends</h3>
          </div>
          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={history}>
                <defs>
                  <linearGradient id="colorSteps" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.1} />
                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid
                  strokeDasharray="3 3"
                  vertical={false}
                  stroke="#f3f4f6"
                />
                <XAxis
                  dataKey="date"
                  tickFormatter={(str) => str.slice(5)}
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: "#9ca3af", fontSize: 12 }}
                />
                <YAxis
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: "#9ca3af", fontSize: 12 }}
                />
                <Tooltip
                  contentStyle={{
                    borderRadius: "12px",
                    border: "none",
                    boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)",
                  }}
                />
                <Area
                  type="monotone"
                  dataKey="steps"
                  stroke="#3b82f6"
                  strokeWidth={3}
                  fillOpacity={1}
                  fill="url(#colorSteps)"
                />
                <Line
                  type="monotone"
                  dataKey={() => 10000}
                  stroke="#e5e7eb"
                  strokeDasharray="5 5"
                  strokeWidth={2}
                  dot={false}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
          <StreakCalendar logs={history} />
        </div>
      </div>

      <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
        <h3 className="font-bold text-lg text-gray-800 mb-4">Recent History</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-gray-50 text-gray-500 text-xs uppercase tracking-wider">
              <tr>
                <th className="p-4 rounded-l-xl">Date</th>
                <th className="p-4">Status</th>
                <th className="p-4">Steps</th>
                <th className="p-4">Sleep</th>
                <th className="p-4 rounded-r-xl">Mood</th>
              </tr>
            </thead>
            <tbody className="text-sm">
              {[...history].reverse().map((log, i) => {
                const metGoal = log.steps >= 10000;
                return (
                  <tr
                    key={i}
                    className="border-b border-gray-50 last:border-none hover:bg-gray-50 transition-colors"
                  >
                    <td className="p-4 font-medium text-gray-700">
                      {log.date}
                    </td>
                    <td className="p-4">
                      <span
                        className={`px-2 py-1 rounded-full text-xs font-semibold ${
                          metGoal
                            ? "bg-green-100 text-green-600"
                            : "bg-orange-100 text-orange-600"
                        }`}
                      >
                        {metGoal ? "Goal Met" : "Pending"}
                      </span>
                    </td>
                    <td className="p-4 font-bold text-gray-800">{log.steps}</td>
                    <td className="p-4 text-gray-500">{log.sleepHours}h</td>
                    <td className="p-4">
                      {log.mood === "Happy" && "😊"}
                      {log.mood === "Neutral" && "😐"}
                      {log.mood === "Sad" && "😔"}
                      {log.mood === "Tired" && "😴"}
                      {log.mood === "Energetic" && "⚡"}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      <AddLogModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleAddLog}
      />
    </div>
  );
}

// --- Sub Components ---

function StatCard({ title, value, target, icon: Icon, color, trend }) {
  const colors = {
    blue: "bg-blue-50 text-blue-600",
    purple: "bg-purple-50 text-purple-600",
    green: "bg-green-50 text-green-600",
    orange: "bg-orange-50 text-orange-600",
  };

  return (
    <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex flex-col justify-between hover:shadow-md transition-shadow">
      <div className="flex justify-between items-start">
        <div className={`p-3 rounded-xl ${colors[color]}`}>
          <Icon size={24} />
        </div>
        <MoreHorizontal className="text-gray-300 cursor-pointer" size={20} />
      </div>
      <div className="mt-4">
        <h4 className="text-gray-500 text-sm font-medium">{title}</h4>
        <div className="flex items-end gap-2 mt-1">
          <span className="text-2xl font-bold text-gray-800">{value}</span>
          <span className="text-xs text-gray-400 mb-1">/ {target}</span>
        </div>
        <p className="text-xs text-green-500 mt-2 font-medium bg-green-50 inline-block px-2 py-1 rounded-lg">
          {trend}{" "}
          <span className="text-gray-400 font-normal">vs last week</span>
        </p>
      </div>
    </div>
  );
}

function StreakCalendar({ logs }) {
  const today = new Date();
  const days = eachDayOfInterval({
    start: startOfMonth(today),
    end: endOfMonth(today),
  });

  const isGoalMet = (day) => {
    const formattedDate = format(day, "yyyy-MM-dd");
    const log = logs.find((l) => l.date === formattedDate);
    return log && log.steps >= 10000;
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h3 className="font-bold text-gray-800">Streak Calendar</h3>
        <span className="text-sm font-bold text-gray-500">
          {format(today, "MMMM yyyy")}
        </span>
      </div>

      <div className="grid grid-cols-7 gap-2 text-center text-xs text-gray-400 mb-2">
        {["S", "M", "T", "W", "T", "F", "S"].map((d, index) => (
          <span key={index}>{d}</span>
        ))}
      </div>

      <div className="grid grid-cols-7 gap-2">
        {days.map((day, i) => {
          const met = isGoalMet(day);
          const isToday = isSameDay(day, today);
          return (
            <div
              key={i}
              // 3. FIXED: Added logic for tick (Check icon)
              className={`
                h-8 w-8 rounded-full flex items-center justify-center text-xs font-medium transition-all
                ${
                  met
                    ? "bg-green-500 text-white shadow-md shadow-green-200"
                    : ""
                }
                ${!met && isToday ? "bg-blue-600 text-white" : ""}
                ${!met && !isToday ? "text-gray-600 hover:bg-gray-100" : ""}
              `}
            >
              {met ? <Check size={16} strokeWidth={3} /> : format(day, "d")}
            </div>
          );
        })}
      </div>
      <div className="flex items-center gap-2 mt-4 justify-center">
        <div className="w-2 h-2 rounded-full bg-green-500 flex items-center justify-center">
          <Check size={10} className="text-white" />
        </div>
        <span className="text-xs text-gray-500">Goal Met</span>
      </div>
    </div>
  );
}
