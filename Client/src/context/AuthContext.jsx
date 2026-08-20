import React, { createContext, useContext, useState, useEffect } from "react";
import axios from "axios";
import toast from "react-hot-toast";

const AuthContext = createContext(null);

// Axios base config — all requests go to the same origin (proxied via Vite)
axios.defaults.baseURL = "/api";
axios.defaults.withCredentials = true; // Send cookies with every request

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);        // current logged-in user
  const [loading, setLoading] = useState(true);  // initial auth check

  // ── On mount: restore session from cookie ──
  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    try {
      const { data } = await axios.get("/auth/me");
      if (data.success) setUser(data.user);
    } catch {
      setUser(null); // Not authenticated
    } finally {
      setLoading(false);
    }
  };

  // ── Signup ──
  const signup = async (name, email, password) => {
    const { data } = await axios.post("/auth/signup", { name, email, password });
    if (data.success) {
      setUser(data.user);
      toast.success(`Welcome to Mingo, ${data.user.name}! 🚀`);
      return true;
    }
    return false;
  };

  // ── Login ──
  const login = async (email, password) => {
    const { data } = await axios.post("/auth/login", { email, password });
    if (data.success) {
      setUser(data.user);
      toast.success(`Welcome back, ${data.user.name}! 👋`);
      return true;
    }
    return false;
  };

  // ── Logout ──
  const logout = async () => {
    try {
      await axios.post("/auth/logout");
      setUser(null);
      toast.success("Logged out successfully!");
    } catch (err) {
      toast.error("Logout failed. Please try again.");
    }
  };

  return (
    <AuthContext.Provider value={{ user, setUser, loading, login, logout, signup }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside AuthProvider");
  return ctx;
};
