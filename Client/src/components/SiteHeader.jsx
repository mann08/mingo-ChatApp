import React from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useTheme } from "../context/ThemeContext";
import { motion } from "motion/react";
import { FiMessageCircle, FiHome, FiMail, FiLogIn } from "react-icons/fi";

const SiteHeader = () => {
  const { theme, setTheme } = useTheme();
  const navigate = useNavigate();
  const location = useLocation();
  const isChat = location.pathname === "/chat";

  return (
    <>
      <div
        className="px-4 py-2 flex items-center justify-between theme-transition"
        style={{ background: "var(--primary-dark)" }}
      >
        {/* ── Left: Brand logo ── */}
        <h1
          className="text-xl font-bold text-white whitespace-nowrap select-none cursor-pointer"
          onClick={() => navigate("/")}
        >
          Mingo ChatApp
        </h1>

        {/* ── Right: Nav + Theme dropdown ── */}
        <div className="flex items-center gap-2">
          {/* Contact Us */}
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            transition={{ duration: 0.2 }}
            onClick={() => navigate("/contact")}
            className="hidden sm:flex items-center gap-1.5 px-3 py-2 rounded-full text-sm font-medium text-white/80 hover:text-white cursor-pointer select-none whitespace-nowrap transition-colors duration-150"
            id="contact-nav-btn"
          >
            <FiMail size={14} />
            <span className="hidden md:inline">Contact</span>
          </motion.button>

          {/* Login */}
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            transition={{ duration: 0.2 }}
            onClick={() => navigate("/login")}
            className="hidden sm:flex items-center gap-1.5 px-3 py-2 rounded-full text-sm font-medium text-white/80 hover:text-white cursor-pointer select-none whitespace-nowrap transition-colors duration-150"
            id="login-nav-btn"
          >
            <FiLogIn size={14} />
            <span className="hidden md:inline">Login</span>
          </motion.button>

          {/* Open Chat / Go Home button */}
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
            onClick={() => navigate(isChat ? "/" : "/chat")}
            className="flex items-center gap-2 px-5 py-2.5 rounded-full font-semibold text-sm text-white shadow-md cursor-pointer select-none whitespace-nowrap"
            style={{
              background: "var(--primary)",
              boxShadow: "0 4px 14px var(--glow)",
            }}
            id="open-chat-btn"
          >
            {isChat ? (
              <>
                <FiHome size={15} />
                <span className="hidden sm:inline">Home</span>
              </>
            ) : (
              <>
                <FiMessageCircle size={15} />
                <span className="hidden sm:inline">Open Chat</span>
              </>
            )}
          </motion.button>

          {/* Theme dropdown */}
          <select
            name="theme"
            id="theme"
            className="select select-bordered w-fit text-sm"
            value={theme}
            onChange={(e) => setTheme(e.target.value)}
          >
            <option value="light">Light</option>
            <option value="dark">Dark</option>
            <option value="black">Black</option>
            <option value="spotify">Spotify</option>
            <option value="claude">Claude</option>
            <option value="corporate">Corporate</option>
            <option value="ghibli">Ghibli</option>
            <option value="halloween">Halloween</option>
          </select>
        </div>
      </div>
    </>
  );
};

export default SiteHeader;
