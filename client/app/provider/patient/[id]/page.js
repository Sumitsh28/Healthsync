"use client";
import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import api from "@/lib/api";
import { ActivityChart } from "@/components/DashboardWidgets"; // Reuse chart!

export default function PatientDetail() {
  const { id } = useParams();
  const router = useRouter();
  const [data, setData] = useState(null);

  useEffect(() => {
    api
      .get(`/provider/patients/${id}`)
      .then((res) => setData(res.data))
      .catch(() => alert("Error loading patient"));
  }, [id]);

  if (!data)
    return <div className="p-8 text-center">Loading Patient Data...</div>;

  const { patient, logs } = data;

  return (
    <div className="space-y-6">
      <button
        onClick={() => router.back()}
        className="text-gray-500 hover:underline"
      >
        ← Back to List
      </button>

      <div className="bg-white p-6 rounded-lg shadow border-l-4 border-blue-600">
        <h1 className="text-2xl font-bold">{patient.name}</h1>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4 text-sm">
          <div>
            <p className="text-gray-500">Email</p>
            <p>{patient.email}</p>
          </div>
          <div>
            <p className="text-gray-500">Age</p>
            <p>
              {patient.profile?.dob
                ? new Date().getFullYear() -
                  new Date(patient.profile.dob).getFullYear()
                : "N/A"}
            </p>
          </div>
          <div>
            <p className="text-gray-500">Conditions</p>
            <p>{patient.profile?.conditions?.join(", ") || "None"}</p>
          </div>
          <div>
            <p className="text-gray-500">Score</p>
            <p className="font-bold">{patient.wellnessScore}</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="font-bold mb-4">Activity Trend</h3>
          <ActivityChart data={logs.slice().reverse()} />
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="font-bold mb-4">Recent Logs</h3>
          <div className="max-h-60 overflow-y-auto">
            {logs.map((log) => (
              <div
                key={log._id}
                className="flex justify-between border-b py-2 text-sm"
              >
                <span>{log.date}</span>
                <span className="text-gray-600">{log.steps} steps</span>
                <span>{log.mood === "Sad" ? "🔴" : "🟢"}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
