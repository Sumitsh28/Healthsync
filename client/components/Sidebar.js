"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  User,
  Activity,
  FileText,
  Settings,
  LogOut,
} from "lucide-react";
import { useAuth } from "@/context/AuthContext";

const MENU_ITEMS = [
  { name: "Dashboard", icon: LayoutDashboard, href: "/dashboard" },
  { name: "My Profile", icon: User, href: "/profile" }, // You can create this page later
];

export default function Sidebar() {
  const pathname = usePathname();
  const { logout } = useAuth();

  return (
    <div className="w-64 bg-white h-screen border-r border-gray-100 flex flex-col fixed left-0 top-0 hidden md:flex z-10">
      {/* Logo Area */}
      <div className="p-6 flex items-center gap-2">
        <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center text-white font-bold">
          V
        </div>
        <span className="text-xl font-bold text-gray-800">Well Sync</span>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-4 space-y-2 mt-4">
        <div className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2 px-2">
          Menu
        </div>
        {MENU_ITEMS.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.name}
              href={item.href}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-colors ${
                isActive
                  ? "bg-blue-50 text-blue-600 font-medium"
                  : "text-gray-500 hover:bg-gray-50"
              }`}
            >
              <item.icon size={20} />
              {item.name}
            </Link>
          );
        })}
      </nav>

      {/* Logout */}
      <div className="p-4 border-t border-gray-100">
        <button
          onClick={logout}
          className="flex items-center gap-3 px-4 py-3 text-red-500 hover:bg-red-50 w-full rounded-xl transition-colors"
        >
          <LogOut size={20} />
          Log Out
        </button>
      </div>
    </div>
  );
}
