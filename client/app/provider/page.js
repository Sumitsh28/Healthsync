"use client";
import { useEffect, useState, useMemo } from "react";
import Link from "next/link";
import api from "@/lib/api";
import {
  Users,
  AlertCircle,
  CheckCircle2,
  Bell,
  Search,
  MoreHorizontal,
} from "lucide-react";

export default function ProviderDashboard() {
  const [patients, setPatients] = useState([]);
  const [showRiskOnly, setShowRiskOnly] = useState(false);
  const [loading, setLoading] = useState(true);

  // Fetch Data
  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await api.get("/provider/patients");
        setPatients(res.data);
      } catch (err) {
        console.error("Failed to fetch patients", err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  // Calculate Stats
  const stats = useMemo(() => {
    const total = patients.length;
    const risk = patients.filter((p) => (p.wellnessScore || 0) < 50).length;
    const compliant = total - risk;
    return { total, risk, compliant };
  }, [patients]);

  // Filter Logic
  const filteredPatients = showRiskOnly
    ? patients.filter((p) => (p.wellnessScore || 0) < 50)
    : patients;

  if (loading)
    return <div className="p-8 text-gray-500">Loading Dashboard...</div>;

  return (
    <div className="space-y-8">
      {/* Header Section */}
      <div className="flex flex-col gap-1">
        <h1 className="text-2xl font-bold text-gray-800">Provider Dashboard</h1>
        <p className="text-sm text-gray-500">
          Monitor patient health and manage care plans
        </p>
      </div>

      {/* KPI Cards Row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Total Patients Card */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex justify-between items-center">
          <div>
            <p className="text-sm font-medium text-gray-500 mb-1">
              Total Patients
            </p>
            <h2 className="text-3xl font-bold text-gray-800">{stats.total}</h2>
          </div>
          <div className="p-3 bg-gray-50 rounded-lg text-gray-600">
            <Users size={24} />
          </div>
        </div>

        {/* At-Risk Card */}
        <div className="bg-red-50 p-6 rounded-xl shadow-sm border border-red-100 flex justify-between items-center">
          <div>
            <p className="text-sm font-medium text-red-600 mb-1">
              At-Risk Patients
            </p>
            <h2 className="text-3xl font-bold text-red-700">{stats.risk}</h2>
          </div>
          <div className="p-3 bg-white rounded-lg text-red-500 shadow-sm">
            <AlertCircle size={24} />
          </div>
        </div>

        {/* Compliant Card */}
        <div className="bg-green-50 p-6 rounded-xl shadow-sm border border-green-100 flex justify-between items-center">
          <div>
            <p className="text-sm font-medium text-green-600 mb-1">
              Compliant Patients
            </p>
            <h2 className="text-3xl font-bold text-green-700">
              {stats.compliant}
            </h2>
          </div>
          <div className="p-3 bg-white rounded-lg text-green-500 shadow-sm">
            <CheckCircle2 size={24} />
          </div>
        </div>
      </div>

      {/* Patient Overview Section */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        {/* Table Header / Toolbar */}
        <div className="p-6 border-b border-gray-100 flex flex-col sm:flex-row justify-between items-center gap-4">
          <h2 className="text-lg font-semibold text-gray-800">
            Patient Overview
          </h2>

          {/* Controls: Search & Toggle */}
          <div className="flex items-center gap-6">
            <div className="relative hidden md:block">
              <Search
                className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                size={16}
              />
              <input
                type="text"
                placeholder="Search..."
                className="pl-9 pr-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 w-64"
              />
            </div>

            {/* Custom Toggle Switch */}
            <div className="flex items-center gap-3">
              <span
                className={`text-sm font-medium ${
                  showRiskOnly ? "text-gray-500" : "text-gray-900"
                }`}
              >
                All
              </span>
              <button
                onClick={() => setShowRiskOnly(!showRiskOnly)}
                className={`w-12 h-6 rounded-full p-1 transition-colors duration-200 ease-in-out ${
                  showRiskOnly ? "bg-red-500" : "bg-gray-200"
                }`}
              >
                <div
                  className={`bg-white w-4 h-4 rounded-full shadow-sm transform transition-transform duration-200 ease-in-out ${
                    showRiskOnly ? "translate-x-6" : "translate-x-0"
                  }`}
                />
              </button>
              <span
                className={`text-sm font-medium ${
                  showRiskOnly ? "text-red-600" : "text-gray-500"
                }`}
              >
                Show At-Risk Only
              </span>
            </div>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50/50 text-gray-500 text-xs uppercase tracking-wider font-semibold border-b border-gray-100">
                <th className="px-6 py-4">Name</th>
                <th className="px-6 py-4">Age</th>
                <th className="px-6 py-4">Last Active</th>
                <th className="px-6 py-4">Wellness</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {filteredPatients.map((patient) => {
                const score = patient.wellnessScore || 0;
                const isRisk = score < 50;

                return (
                  <tr
                    key={patient._id}
                    className="hover:bg-gray-50 transition-colors group"
                  >
                    <td className="px-6 py-4">
                      <div className="font-medium text-gray-900">
                        {patient.name}
                      </div>
                      <div className="text-xs text-gray-400">
                        {patient.email}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">
                      {patient.age || "N/A"}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">
                      Today {/* Replace with dynamic date if available */}
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`font-bold ${
                          isRisk ? "text-orange-500" : "text-green-600"
                        }`}
                      >
                        {score}%
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium border
                          ${
                            isRisk
                              ? "bg-red-50 text-red-600 border-red-100"
                              : "bg-green-50 text-green-600 border-green-100"
                          }`}
                      >
                        <span
                          className={`w-1.5 h-1.5 rounded-full ${
                            isRisk ? "bg-red-500" : "bg-green-500"
                          }`}
                        ></span>
                        {isRisk ? "Needs Attention" : "On Track"}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button
                        onClick={() =>
                          alert(`Reminder sent to ${patient.name}`)
                        }
                        className="text-gray-400 hover:text-blue-600 transition-colors flex items-center gap-1 ml-auto text-sm font-medium"
                      >
                        <Bell size={16} /> Remind
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>

          {filteredPatients.length === 0 && (
            <div className="p-12 text-center text-gray-400">
              No patients found matching current filters.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
