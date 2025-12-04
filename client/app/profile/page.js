"use client";
import { useAuth } from "@/context/AuthContext";
import {
  Mail,
  Phone,
  MapPin,
  Calendar,
  Ruler,
  Weight,
  Activity,
  Pill,
  AlertCircle,
  Edit2,
} from "lucide-react";

export default function Profile() {
  const { user } = useAuth();
  if (!user) return <div className="p-8">Loading...</div>;
  const { profile } = user;

  const calculateAge = (dob) =>
    dob
      ? Math.abs(
          new Date(Date.now() - new Date(dob).getTime()).getUTCFullYear() - 1970
        )
      : "N/A";

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      {/* Header */}
      <div className="bg-white rounded-[20px] shadow-sm border border-gray-100 overflow-hidden relative">
        <div className="h-40 bg-gradient-to-r from-blue-600 to-teal-500"></div>
        <div className="px-8 pb-8 flex flex-col md:flex-row items-start md:items-end -mt-12 gap-6">
          <div className="w-32 h-32 rounded-full border-4 border-white bg-gray-200 flex items-center justify-center text-4xl font-bold text-gray-500 shadow-md">
            {user.name?.charAt(0) || "U"}
          </div>
          <div className="flex-1 mb-2">
            <h1 className="text-3xl font-bold text-gray-800">{user.name}</h1>
            <p className="text-gray-500 font-medium capitalize flex items-center gap-2">
              {user.role}{" "}
              <span className="w-1.5 h-1.5 rounded-full bg-gray-300"></span>{" "}
              Member since {new Date(user.createdAt).getFullYear()}
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column */}
        <div className="space-y-8">
          <div className="bg-white p-8 rounded-[20px] shadow-sm border border-gray-100">
            <h3 className="font-bold text-lg text-gray-800 mb-6">About</h3>
            <div className="space-y-4">
              <InfoRow icon={Mail} label="Email" value={user.email} />
              <InfoRow icon={Phone} label="Phone" value="+1 (555) 000-0000" />
              <InfoRow icon={MapPin} label="Location" value="New York, USA" />
              <InfoRow
                icon={Calendar}
                label="Birthday"
                value={`${new Date(
                  profile?.dob
                ).toDateString()} (${calculateAge(profile?.dob)} yrs)`}
              />
            </div>
          </div>
        </div>

        {/* Right Column */}
        <div className="lg:col-span-2 space-y-8">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            <StatCard
              icon={Ruler}
              label="Height"
              value={`${profile?.height || 0} cm`}
              color="bg-blue-50 text-blue-600"
            />
            <StatCard
              icon={Weight}
              label="Weight"
              value={`${profile?.weight || 0} kg`}
              color="bg-purple-50 text-purple-600"
            />
            <StatCard
              icon={Activity}
              label="Blood Type"
              value="O+"
              sub="(Self-reported)"
              color="bg-red-50 text-red-600"
            />
          </div>

          <div className="bg-white p-8 rounded-[20px] shadow-sm border border-gray-100">
            <h3 className="font-bold text-lg text-gray-800 mb-6">
              Medical Profile
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <h4 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-3 flex items-center gap-2">
                  <Activity size={16} /> Conditions
                </h4>
                <div className="flex flex-wrap gap-2">
                  {profile?.conditions?.map((c, i) => (
                    <Badge key={i} text={c} color="bg-red-50 text-red-600" />
                  ))}
                </div>
              </div>
              <div>
                <h4 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-3 flex items-center gap-2">
                  <AlertCircle size={16} /> Allergies
                </h4>
                <div className="flex flex-wrap gap-2">
                  {profile?.allergies?.map((a, i) => (
                    <Badge
                      key={i}
                      text={a}
                      color="bg-orange-50 text-orange-600"
                    />
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

const InfoRow = ({ icon: Icon, label, value }) => (
  <div className="flex items-center gap-4 p-2 hover:bg-gray-50 rounded-lg">
    <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center text-gray-500">
      <Icon size={18} />
    </div>
    <div>
      <p className="text-xs text-gray-400 font-medium uppercase">{label}</p>
      <p className="text-gray-800 font-medium">{value || "Not set"}</p>
    </div>
  </div>
);

const StatCard = ({ icon: Icon, label, value, sub, color }) => (
  <div className="bg-white p-6 rounded-[20px] shadow-sm border border-gray-100 flex items-center gap-4">
    <div
      className={`w-12 h-12 rounded-full flex items-center justify-center ${color}`}
    >
      <Icon size={24} />
    </div>
    <div>
      <p className="text-gray-500 text-sm">{label}</p>
      <p className="text-2xl font-bold text-gray-800">{value}</p>
      {sub && <p className="text-xs text-gray-400">{sub}</p>}
    </div>
  </div>
);

const Badge = ({ text, color }) => (
  <span className={`px-3 py-1 ${color} rounded-lg text-sm font-medium`}>
    {text}
  </span>
);
