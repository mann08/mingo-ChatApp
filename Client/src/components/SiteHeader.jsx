import React from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useTheme } from "../context/ThemeContext";
import { motion } from "motion/react";
import {
  FiMessageCircle,
  FiHome,
  FiMail,
  FiLogIn,
  FiUserPlus,
  FiLogOut,
} from "react-icons/fi";
import { useAuth } from "../context/AuthContext";

const SiteHeader = () => {
  const { theme, setTheme } = useTheme();
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const isHome = location.pathname === "/";
  const isChat = location.pathname === "/chat";
  const isContact = location.pathname === "/contact";
  const isAuthPage = location.pathname === "/login" || location.pathname === "/register";

  return (
    <header
      className="sticky top-0 z-50 px-4 md:px-8 py-2.5 flex items-center justify-between theme-transition backdrop-blur-md"
      style={{
        background: "rgba(var(--surface-rgb, 18, 24, 38), 0.85)",
        borderBottom: "1px solid var(--border)",
        boxShadow: "0 4px 20px rgba(0, 0, 0, 0.08)",
      }}
    >
      {/* ── Left: Brand logo ── */}
      <motion.div
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        className="flex items-center gap-2.5 cursor-pointer select-none"
        onClick={() => navigate("/")}
        id="header-brand-logo"
      >
        <div
          className="w-9 h-9 rounded-xl flex items-center justify-center text-white font-bold text-base shadow-md"
          style={{
            background:
              "linear-gradient(135deg, var(--primary) 0%, var(--primary-dark) 100%)",
            boxShadow: "0 4px 14px var(--glow)",
          }}
        >
          <FiMessageCircle size={18} />
        </div>
        <div className="flex flex-col">
          <span
            className="text-lg font-extrabold tracking-tight leading-none"
            style={{ color: "var(--text)" }}
          >
            Mingo<span style={{ color: "var(--primary)" }}>.</span>
          </span>
          <span
            className="text-[10px] font-semibold tracking-wider uppercase opacity-60 mt-0.5"
            style={{ color: "var(--text-muted)" }}
          >
            ChatApp
          </span>
        </div>
      </motion.div>

      {/* ── Center / Right: Nav links & Actions ── */}
      <div className="flex items-center gap-2 md:gap-3">
        {/* Navigation items */}
        <div className="hidden sm:flex items-center gap-1 mr-1">
          <button
            onClick={() => navigate("/")}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold transition-all duration-150 cursor-pointer ${
              isHome
                ? "bg-[var(--primary)] text-white shadow-sm"
                : "text-[var(--text-muted)] hover:text-[var(--text)] hover:bg-[var(--surface-alt)]"
            }`}
            id="nav-home-btn"
          >
            <FiHome size={13} />
            <span>Home</span>
          </button>

          <button
            onClick={() => navigate("/contact")}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold transition-all duration-150 cursor-pointer ${
              isContact
                ? "bg-[var(--primary)] text-white shadow-sm"
                : "text-[var(--text-muted)] hover:text-[var(--text)] hover:bg-[var(--surface-alt)]"
            }`}
            id="nav-contact-btn"
          >
            <FiMail size={13} />
            <span>Contact</span>
          </button>

          {user && (
            <button
              onClick={() => navigate("/chat")}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold transition-all duration-150 cursor-pointer ${
                isChat
                  ? "bg-[var(--primary)] text-white shadow-sm"
                  : "text-[var(--text-muted)] hover:text-[var(--text)] hover:bg-[var(--surface-alt)]"
              }`}
              id="nav-chat-btn"
            >
              <FiMessageCircle size={13} />
              <span>Chat</span>
            </button>
          )}
        </div>

        {/* ── User Auth State ── */}
        {user ? (
          /* Logged In State: User Profile Pill + Logout */
          <div className="flex items-center gap-2">
            {/* User Profile Pill */}
            <motion.div
              whileHover={{ scale: 1.03 }}
              onClick={() => navigate("/chat")}
              className="flex items-center gap-2 px-3 py-1.5 rounded-full cursor-pointer transition-all duration-150"
              style={{
                background: "var(--surface-alt)",
                border: "1px solid var(--border)",
              }}
              title="Open Chat"
              id="user-profile-pill"
            >
              <div
                className="w-6 h-6 rounded-full flex items-center justify-center text-white text-[11px] font-bold shadow-sm select-none"
                style={{ background: user.avatarColor || "var(--primary)" }}
              >
                {user.avatar || "U"}
              </div>
              <span
                className="text-xs font-semibold hidden md:inline truncate max-w-[100px]"
                style={{ color: "var(--text)" }}
              >
                {user.name}
              </span>
            </motion.div>

            {/* Logout Button */}
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={logout}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold cursor-pointer transition-all duration-150"
              style={{
                background: "rgba(239, 68, 68, 0.1)",
                color: "#EF4444",
                border: "1px solid rgba(239, 68, 68, 0.2)",
              }}
              id="header-logout-btn"
              title="Logout"
            >
              <FiLogOut size={13} />
              <span className="hidden sm:inline">Logout</span>
            </motion.button>
          </div>
        ) : (
          /* Not Logged In State: Professional Login & Register Buttons */
          <div className="flex items-center gap-2">
            {/* Login Button */}
            <motion.button
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              onClick={() => navigate("/login?mode=login")}
              className="flex items-center gap-1.5 px-4 py-1.5 rounded-xl text-xs font-bold transition-all duration-150 cursor-pointer"
              style={{
                background: isAuthPage ? "var(--surface-alt)" : "transparent",
                color: "var(--text)",
                border: "1px solid var(--border)",
              }}
              id="header-login-btn"
            >
              <FiLogIn size={13} style={{ color: "var(--primary)" }} />
              <span>Login</span>
            </motion.button>

            {/* Register Button */}
            <motion.button
              whileHover={{
                scale: 1.04,
                boxShadow: "0 6px 20px var(--glow)",
              }}
              whileTap={{ scale: 0.97 }}
              onClick={() => navigate("/login?mode=signup")}
              className="flex items-center gap-1.5 px-4 py-1.5 rounded-xl text-xs font-bold text-white transition-all duration-150 cursor-pointer shadow-sm"
              style={{
                background:
                  "linear-gradient(135deg, var(--primary) 0%, var(--primary-dark) 100%)",
              }}
              id="header-register-btn"
            >
              <FiUserPlus size={13} />
              <span>Register</span>
            </motion.button>
          </div>
        )}

        {/* ── Theme Selector ── */}
        <div
          className="flex items-center rounded-xl px-2 py-1 theme-transition"
          style={{
            background: "var(--surface-alt)",
            border: "1px solid var(--border)",
          }}
        >
          <select
            name="theme"
            id="theme-select"
            className="bg-transparent text-xs font-semibold outline-none cursor-pointer"
            style={{ color: "var(--text)" }}
            value={theme}
            onChange={(e) => setTheme(e.target.value)}
          >
            <option value="light">☀️ Light</option>
            <option value="dark">🌙 Dark</option>
            <option value="black">⚫ Black</option>
            <option value="spotify">🟢 Spotify</option>
            <option value="claude">🟠 Claude</option>
            <option value="corporate">💼 Corporate</option>
            <option value="ghibli">🌿 Ghibli</option>
            <option value="halloween">🎃 Halloween</option>
          </select>
        </div>
      </div>
    </header>
  );
};

export default SiteHeader;
