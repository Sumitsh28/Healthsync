"use client";

import { createContext, useState, useEffect, useContext } from "react";
import api from "@/lib/api";
import { useRouter } from "next/navigation";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    // Check if user is logged in on page load
    const token = localStorage.getItem("token");
    if (token) {
      api
        .get("/auth/profile")
        .then((res) => setUser(res.data))
        .catch(() => localStorage.removeItem("token"))
        .finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, []);

  const login = async (email, password) => {
    const { data } = await api.post("/auth/login", { email, password });
    localStorage.setItem("token", data.token);
    setUser(data);
    router.push(data.role === "provider" ? "/provider" : "/dashboard");
  };

  const register = async (userData) => {
    const { data } = await api.post("/auth/register", userData);
    localStorage.setItem("token", data.token);
    setUser(data);
    // Redirect to onboarding if they are a patient
    router.push(data.role === "patient" ? "/onboarding" : "/provider");
  };

  const logout = () => {
    localStorage.removeItem("token");
    setUser(null);
    router.push("/login");
  };

  return (
    <AuthContext.Provider value={{ user, login, register, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
