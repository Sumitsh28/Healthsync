"use client";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";

export default function Navbar() {
  const { user, logout } = useAuth();

  return (
    <nav className="p-4 bg-blue-600 text-white flex justify-between items-center shadow-md">
      <Link href="/" className="text-xl font-bold">
        Health Sync
      </Link>
      <div className="space-x-4">
        {user ? (
          <>
            <span className="font-medium">Hi, {user.name}</span>
            <button
              onClick={logout}
              className="bg-red-500 px-3 py-1 rounded hover:bg-red-600"
            >
              Logout
            </button>
          </>
        ) : (
          <>
            <Link href="/login" className="hover:underline">
              Login
            </Link>
            <Link
              href="/register"
              className="bg-white text-blue-600 px-3 py-1 rounded hover:bg-gray-100"
            >
              Get Started
            </Link>
          </>
        )}
      </div>
    </nav>
  );
}
