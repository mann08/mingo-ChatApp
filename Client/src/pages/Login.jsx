import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { useNavigate } from "react-router-dom";
import { FiEye, FiEyeOff, FiArrowRight, FiMessageCircle } from "react-icons/fi";
import toast from "react-hot-toast";
import axios from "axios";
import { useAuth } from "../context/AuthContext";

const Login = () => {
  const navigate = useNavigate();
  const { login, signup } = useAuth();
  const [mode, setMode] = useState("login"); // "login" | "signup"
  const [showPass, setShowPass] = useState(false);
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    setError(""); // Clear error on input change
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      let success = false;

      if (mode === "signup") {
        if (!form.name.trim()) {
          setError("Please enter your full name.");
          setLoading(false);
          return;
        }
        if (form.password.length < 6) {
          setError("Password must be at least 6 characters.");
          setLoading(false);
          return;
        }
        success = await signup(form.name.trim(), form.email, form.password);
      } else {
        success = await login(form.email, form.password);
      }

      if (success) {
        navigate("/chat");
      }
    } catch (err) {
      const msg =
        err?.response?.data?.message ||
        (mode === "login"
          ? "Login failed. Check your credentials."
          : "Signup failed. Please try again.");
      setError(msg);
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  const toggleMode = () => {
    setMode((m) => (m === "login" ? "signup" : "login"));
    setForm({ name: "", email: "", password: "" });
  };

  return (
    <div
      className="min-h-[calc(100vh-48px)] flex items-center justify-center px-4 py-12 theme-transition"
      style={{ background: "var(--bg)" }}
    >
      {/* Background blobs */}
      <div
        className="fixed top-0 right-0 w-[500px] h-[500px] rounded-full opacity-10 pointer-events-none"
        style={{
          background:
            "radial-gradient(circle, var(--primary) 0%, transparent 70%)",
          transform: "translate(30%, -30%)",
        }}
      />
      <div
        className="fixed bottom-0 left-0 w-[400px] h-[400px] rounded-full opacity-10 pointer-events-none"
        style={{
          background:
            "radial-gradient(circle, var(--primary-dark) 0%, transparent 70%)",
          transform: "translate(-40%, 40%)",
        }}
      />

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md relative z-10"
      >
        {/* Card */}
        <div
          className="rounded-3xl p-8 md:p-10 shadow-2xl theme-transition"
          style={{
            background: "var(--surface)",
            border: "1px solid var(--border)",
            boxShadow: "var(--card-shadow)",
          }}
        >
          {/* Logo & Title */}
          <div className="flex flex-col items-center mb-8">
            <motion.div
              whileHover={{ rotate: 10 }}
              className="w-16 h-16 rounded-2xl flex items-center justify-center text-white mb-4 shadow-lg"
              style={{
                background:
                  "linear-gradient(135deg, var(--primary), var(--primary-dark))",
                boxShadow: "0 10px 30px var(--glow)",
              }}
            >
              <FiMessageCircle size={30} />
            </motion.div>
            <h1
              className="text-2xl font-extrabold tracking-tight"
              style={{ color: "var(--text)" }}
            >
              {mode === "login" ? "Welcome back 👋" : "Join Mingo 🚀"}
            </h1>
            <p
              className="text-sm mt-1 text-center"
              style={{ color: "var(--text-muted)" }}
            >
              {mode === "login"
                ? "Sign in to continue chatting."
                : "Create your free account today."}
            </p>
          </div>

          {/* Mode Toggle Pills */}
          <div
            className="flex rounded-xl p-1 mb-8 theme-transition"
            style={{ background: "var(--surface-alt)" }}
          >
            {["login", "signup"].map((m) => (
              <button
                key={m}
                onClick={() => {
                  setMode(m);
                  setForm({ name: "", email: "", password: "" });
                }}
                className="flex-1 py-2.5 rounded-lg text-sm font-semibold transition-all duration-250 cursor-pointer capitalize"
                style={{
                  background: mode === m ? "var(--primary)" : "transparent",
                  color: mode === m ? "#fff" : "var(--text-muted)",
                  boxShadow: mode === m ? "0 4px 12px var(--glow)" : "none",
                }}
              >
                {m === "login" ? "Sign In" : "Sign Up"}
              </button>
            ))}
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <AnimatePresence>
              {mode === "signup" && (
                <motion.div
                  key="name-field"
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.25 }}
                >
                  <label
                    className="block text-xs font-semibold mb-1.5 uppercase tracking-wider"
                    style={{ color: "var(--text-muted)" }}
                  >
                    Full Name
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={form.name}
                    onChange={handleChange}
                    placeholder="Your name"
                    required={mode === "signup"}
                    id="signup-name"
                    className="w-full px-4 py-3 rounded-xl text-sm outline-none transition-all duration-200"
                    style={{
                      background: "var(--surface-alt)",
                      border: "1.5px solid var(--border)",
                      color: "var(--text)",
                      fontFamily: "inherit",
                    }}
                    onFocus={(e) =>
                      (e.target.style.borderColor = "var(--primary)")
                    }
                    onBlur={(e) =>
                      (e.target.style.borderColor = "var(--border)")
                    }
                  />
                </motion.div>
              )}
            </AnimatePresence>

            {/* Email */}
            <div>
              <label
                className="block text-xs font-semibold mb-1.5 uppercase tracking-wider"
                style={{ color: "var(--text-muted)" }}
              >
                Email
              </label>
              <input
                type="email"
                name="email"
                value={form.email}
                onChange={handleChange}
                placeholder="you@example.com"
                required
                id="login-email"
                className="w-full px-4 py-3 rounded-xl text-sm outline-none transition-all duration-200"
                style={{
                  background: "var(--surface-alt)",
                  border: "1.5px solid var(--border)",
                  color: "var(--text)",
                  fontFamily: "inherit",
                }}
                onFocus={(e) => (e.target.style.borderColor = "var(--primary)")}
                onBlur={(e) => (e.target.style.borderColor = "var(--border)")}
              />
            </div>

            {/* Password */}
            <div>
              <label
                className="block text-xs font-semibold mb-1.5 uppercase tracking-wider"
                style={{ color: "var(--text-muted)" }}
              >
                Password
              </label>
              <div className="relative">
                <input
                  type={showPass ? "text" : "password"}
                  name="password"
                  value={form.password}
                  onChange={handleChange}
                  placeholder="••••••••"
                  required
                  id="login-password"
                  className="w-full px-4 py-3 pr-12 rounded-xl text-sm outline-none transition-all duration-200"
                  style={{
                    background: "var(--surface-alt)",
                    border: "1.5px solid var(--border)",
                    color: "var(--text)",
                    fontFamily: "inherit",
                  }}
                  onFocus={(e) =>
                    (e.target.style.borderColor = "var(--primary)")
                  }
                  onBlur={(e) => (e.target.style.borderColor = "var(--border)")}
                />
                <button
                  type="button"
                  tabIndex={-1}
                  onClick={() => setShowPass((v) => !v)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 cursor-pointer p-1"
                  style={{ color: "var(--text-muted)" }}
                >
                  {showPass ? <FiEyeOff size={17} /> : <FiEye size={17} />}
                </button>
              </div>
              {mode === "login" && (
                <p
                  className="text-xs mt-1.5 text-right cursor-pointer hover:underline transition-all"
                  style={{ color: "var(--primary)" }}
                >
                  Forgot password?
                </p>
              )}
            </div>

            {/* Error Message */}
            {error && (
              <motion.div
                initial={{ opacity: 0, y: -6 }}
                animate={{ opacity: 1, y: 0 }}
                className="px-4 py-3 rounded-xl text-sm font-medium"
                style={{
                  background: "rgba(239,68,68,0.10)",
                  border: "1px solid rgba(239,68,68,0.25)",
                  color: "#EF4444",
                }}
              >
                ⚠️ {error}
              </motion.div>
            )}

            {/* Submit */}
            <motion.button
              whileHover={{ scale: 1.02, boxShadow: "0 12px 30px var(--glow)" }}
              whileTap={{ scale: 0.97 }}
              type="submit"
              id="login-submit-btn"
              disabled={loading}
              className="flex items-center justify-center gap-2 w-full py-3.5 rounded-2xl text-white font-bold text-sm mt-2 transition-all cursor-pointer"
              style={{
                background:
                  "linear-gradient(135deg, var(--primary), var(--primary-dark))",
                opacity: loading ? 0.8 : 1,
              }}
            >
              {loading ? (
                <span className="inline-block w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
              ) : (
                <>
                  {mode === "login" ? "Sign In" : "Create Account"}
                  <FiArrowRight size={16} />
                </>
              )}
            </motion.button>
          </form>

          {/* Divider */}
          <div className="flex items-center gap-3 my-6">
            <div
              className="flex-1 h-px"
              style={{ background: "var(--border)" }}
            />
            <span className="text-xs" style={{ color: "var(--text-muted)" }}>
              or continue as
            </span>
            <div
              className="flex-1 h-px"
              style={{ background: "var(--border)" }}
            />
          </div>

          {/* Guest mode */}
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.97 }}
            onClick={() => navigate("/chat")}
            id="guest-btn"
            className="w-full py-3 rounded-2xl text-sm font-semibold transition-all cursor-pointer theme-transition"
            style={{
              background: "var(--surface-alt)",
              border: "1px solid var(--border)",
              color: "var(--text-muted)",
            }}
          >
            Guest (Demo Mode)
          </motion.button>

          {/* Footer toggle */}
          <p
            className="text-center text-xs mt-6"
            style={{ color: "var(--text-muted)" }}
          >
            {mode === "login"
              ? "Don't have an account? "
              : "Already have an account? "}
            <span
              onClick={toggleMode}
              className="cursor-pointer font-semibold hover:underline transition-all"
              style={{ color: "var(--primary)" }}
            >
              {mode === "login" ? "Sign Up" : "Sign In"}
            </span>
          </p>
        </div>
      </motion.div>
    </div>
  );
};

export default Login;
