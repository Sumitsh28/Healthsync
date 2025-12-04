"use client";
import { Bell, Search, User as UserIcon } from "lucide-react";
import { useAuth } from "@/context/AuthContext";

export default function Header() {
  const { user } = useAuth();

  return (
    <header className="bg-white border-b border-gray-100 h-16 flex items-center justify-between px-8 sticky top-0 z-10">
      {/* Search Bar */}
      <div className="flex items-center gap-2 bg-gray-50 px-4 py-2 rounded-full w-96 border border-gray-100">
        <Search size={18} className="text-gray-400" />
        <input
          type="text"
          placeholder="Search health records..."
          className="bg-transparent border-none focus:outline-none text-sm w-full"
        />
      </div>

      {/* Right Actions */}
      <div className="flex items-center gap-6">
        <button className="relative text-gray-400 hover:text-gray-600">
          <Bell size={20} />
          <span className="absolute -top-1 -right-1 w-2 h-2 bg-red-500 rounded-full"></span>
        </button>

        <div className="flex items-center gap-3">
          <div className="text-right hidden sm:block">
            <p className="text-sm font-bold text-gray-700">
              {user?.name || "Patient"}
            </p>
            <p className="text-xs text-green-500 font-medium">Online</p>
          </div>
          <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center text-blue-600">
            <UserIcon size={20} />
          </div>
        </div>
      </div>
    </header>
  );
}
