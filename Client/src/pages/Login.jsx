import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { useNavigate, useSearchParams, Link } from "react-router-dom";
import {
  FiEye,
  FiEyeOff,
  FiArrowRight,
  FiMessageCircle,
  FiLock,
  FiMail,
  FiUser,
  FiCheckCircle,
} from "react-icons/fi";
import toast from "react-hot-toast";
import { useAuth } from "../context/AuthContext";

const Login = () => {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const { login, signup } = useAuth();

  // Mode derived from URL search param if present (?mode=signup or ?mode=login)
  const initialMode = searchParams.get("mode") === "signup" ? "signup" : "login";
  const [mode, setMode] = useState(initialMode);
  const [showPass, setShowPass] = useState(false);
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Sync mode state if URL param changes
  useEffect(() => {
    const urlMode = searchParams.get("mode");
    if (urlMode === "signup" || urlMode === "login") {
      setMode(urlMode);
    }
  }, [searchParams]);

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    setError(""); // Clear error on typing
  };

  const handleModeChange = (newMode) => {
    setMode(newMode);
    setSearchParams({ mode: newMode });
    setForm({ name: "", email: "", password: "" });
    setError("");
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
          ? "Invalid email or password. Please try again."
          : "Registration failed. Please check your details and retry.");
      setError(msg);
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="min-h-[calc(100vh-60px)] flex items-center justify-center px-4 py-12 theme-transition relative overflow-hidden"
      style={{ background: "var(--bg)" }}
    >
      {/* Background ambient lighting */}
      <div
        className="fixed top-0 right-0 w-[550px] h-[550px] rounded-full opacity-15 pointer-events-none"
        style={{
          background:
            "radial-gradient(circle, var(--primary) 0%, transparent 70%)",
          transform: "translate(30%, -30%)",
        }}
      />
      <div
        className="fixed bottom-0 left-0 w-[450px] h-[450px] rounded-full opacity-10 pointer-events-none"
        style={{
          background:
            "radial-gradient(circle, var(--primary-dark) 0%, transparent 70%)",
          transform: "translate(-40%, 40%)",
        }}
      />

      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45, ease: "easeOut" }}
        className="w-full max-w-md relative z-10"
      >
        {/* Card */}
        <div
          className="rounded-3xl p-8 md:p-10 shadow-2xl theme-transition backdrop-blur-sm"
          style={{
            background: "var(--surface)",
            border: "1px solid var(--border)",
            boxShadow: "var(--card-shadow)",
          }}
        >
          {/* Logo & Header */}
          <div className="flex flex-col items-center mb-8 text-center">
            <motion.div
              whileHover={{ rotate: 8, scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="w-16 h-16 rounded-2xl flex items-center justify-center text-white mb-4 shadow-xl select-none"
              style={{
                background:
                  "linear-gradient(135deg, var(--primary) 0%, var(--primary-dark) 100%)",
                boxShadow: "0 10px 30px var(--glow)",
              }}
            >
              <FiMessageCircle size={32} />
            </motion.div>

            <h1
              className="text-2xl md:text-3xl font-extrabold tracking-tight"
              style={{ color: "var(--text)" }}
            >
              {mode === "login" ? "Welcome Back 👋" : "Create Account 🚀"}
            </h1>
            <p
              className="text-xs md:text-sm mt-1.5"
              style={{ color: "var(--text-muted)" }}
            >
              {mode === "login"
                ? "Sign in with your credentials to access your chats."
                : "Register in seconds to start messaging your friends."}
            </p>
          </div>

          {/* Mode Switcher Tabs */}
          <div
            className="flex rounded-2xl p-1.5 mb-7 theme-transition"
            style={{
              background: "var(--surface-alt)",
              border: "1px solid var(--border)",
            }}
          >
            <button
              type="button"
              onClick={() => handleModeChange("login")}
              className={`flex-1 py-2.5 rounded-xl text-xs md:text-sm font-bold transition-all duration-200 cursor-pointer flex items-center justify-center gap-1.5 ${
                mode === "login"
                  ? "bg-[var(--primary)] text-white shadow-md"
                  : "text-[var(--text-muted)] hover:text-[var(--text)]"
              }`}
              id="tab-login-btn"
            >
              <FiLock size={14} />
              <span>Sign In</span>
            </button>

            <button
              type="button"
              onClick={() => handleModeChange("signup")}
              className={`flex-1 py-2.5 rounded-xl text-xs md:text-sm font-bold transition-all duration-200 cursor-pointer flex items-center justify-center gap-1.5 ${
                mode === "signup"
                  ? "bg-[var(--primary)] text-white shadow-md"
                  : "text-[var(--text-muted)] hover:text-[var(--text)]"
              }`}
              id="tab-register-btn"
            >
              <FiCheckCircle size={14} />
              <span>Register</span>
            </button>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <AnimatePresence mode="wait">
              {mode === "signup" && (
                <motion.div
                  key="signup-name-field"
                  initial={{ opacity: 0, height: 0, y: -10 }}
                  animate={{ opacity: 1, height: "auto", y: 0 }}
                  exit={{ opacity: 0, height: 0, y: -10 }}
                  transition={{ duration: 0.25 }}
                >
                  <label
                    className="block text-[11px] font-bold mb-1.5 uppercase tracking-wider"
                    style={{ color: "var(--text-muted)" }}
                  >
                    Full Name
                  </label>
                  <div className="relative">
                    <FiUser
                      className="absolute left-3.5 top-1/2 -translate-y-1/2"
                      size={16}
                      style={{ color: "var(--text-muted)" }}
                    />
                    <input
                      type="text"
                      name="name"
                      value={form.name}
                      onChange={handleChange}
                      placeholder="e.g. Mann Verma"
                      required={mode === "signup"}
                      id="signup-name-input"
                      className="w-full pl-10 pr-4 py-3 rounded-xl text-sm outline-none transition-all duration-200"
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
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Email Field */}
            <div>
              <label
                className="block text-[11px] font-bold mb-1.5 uppercase tracking-wider"
                style={{ color: "var(--text-muted)" }}
              >
                Email Address
              </label>
              <div className="relative">
                <FiMail
                  className="absolute left-3.5 top-1/2 -translate-y-1/2"
                  size={16}
                  style={{ color: "var(--text-muted)" }}
                />
                <input
                  type="email"
                  name="email"
                  value={form.email}
                  onChange={handleChange}
                  placeholder="name@example.com"
                  required
                  id="email-input"
                  className="w-full pl-10 pr-4 py-3 rounded-xl text-sm outline-none transition-all duration-200"
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
              </div>
            </div>

            {/* Password Field */}
            <div>
              <label
                className="block text-[11px] font-bold mb-1.5 uppercase tracking-wider"
                style={{ color: "var(--text-muted)" }}
              >
                Password
              </label>
              <div className="relative">
                <FiLock
                  className="absolute left-3.5 top-1/2 -translate-y-1/2"
                  size={16}
                  style={{ color: "var(--text-muted)" }}
                />
                <input
                  type={showPass ? "text" : "password"}
                  name="password"
                  value={form.password}
                  onChange={handleChange}
                  placeholder="••••••••"
                  required
                  minLength={6}
                  id="password-input"
                  className="w-full pl-10 pr-12 py-3 rounded-xl text-sm outline-none transition-all duration-200"
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
                <button
                  type="button"
                  tabIndex={-1}
                  onClick={() => setShowPass((v) => !v)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 cursor-pointer p-1 transition-colors"
                  style={{ color: "var(--text-muted)" }}
                  title={showPass ? "Hide password" : "Show password"}
                >
                  {showPass ? <FiEyeOff size={17} /> : <FiEye size={17} />}
                </button>
              </div>
            </div>

            {/* Error Message */}
            {error && (
              <motion.div
                initial={{ opacity: 0, y: -6 }}
                animate={{ opacity: 1, y: 0 }}
                className="px-4 py-3 rounded-xl text-xs md:text-sm font-medium flex items-center gap-2"
                style={{
                  background: "rgba(239, 68, 68, 0.10)",
                  border: "1px solid rgba(239, 68, 68, 0.25)",
                  color: "#EF4444",
                }}
              >
                <span>⚠️</span>
                <span>{error}</span>
              </motion.div>
            )}

            {/* Submit Button */}
            <motion.button
              whileHover={{
                scale: 1.02,
                boxShadow: "0 12px 30px var(--glow)",
              }}
              whileTap={{ scale: 0.98 }}
              type="submit"
              id="auth-submit-btn"
              disabled={loading}
              className="flex items-center justify-center gap-2 w-full py-3.5 rounded-2xl text-white font-bold text-sm mt-3 transition-all cursor-pointer shadow-lg"
              style={{
                background:
                  "linear-gradient(135deg, var(--primary) 0%, var(--primary-dark) 100%)",
                opacity: loading ? 0.8 : 1,
              }}
            >
              {loading ? (
                <span className="inline-block w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
              ) : (
                <>
                  <span>{mode === "login" ? "Sign In" : "Create Account"}</span>
                  <FiArrowRight size={16} />
                </>
              )}
            </motion.button>
          </form>

          {/* Footer toggle note */}
          <div
            className="mt-6 pt-5 text-center text-xs theme-transition"
            style={{
              borderTop: "1px solid var(--border)",
              color: "var(--text-muted)",
            }}
          >
            {mode === "login" ? (
              <p>
                Don't have an account yet?{" "}
                <button
                  type="button"
                  onClick={() => handleModeChange("signup")}
                  className="font-bold underline cursor-pointer hover:opacity-80 transition-opacity"
                  style={{ color: "var(--primary)" }}
                >
                  Register now
                </button>
              </p>
            ) : (
              <p>
                Already have an account?{" "}
                <button
                  type="button"
                  onClick={() => handleModeChange("login")}
                  className="font-bold underline cursor-pointer hover:opacity-80 transition-opacity"
                  style={{ color: "var(--primary)" }}
                >
                  Sign in here
                </button>
              </p>
            )}
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default Login;
