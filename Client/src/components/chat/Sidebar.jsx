import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { FiSearch, FiEdit, FiX, FiLogOut } from "react-icons/fi";
import { useChat } from "../../context/ChatContext";
import { useAuth } from "../../context/AuthContext";

/**
 * Sidebar — left panel showing current user info, search bar + contact list.
 * On mobile this is rendered inside a slide-over drawer (controlled by parent).
 */
const Sidebar = ({ onClose, isMobileDrawer }) => {
  const { users, usersLoading, selectedUser, setSelectedUser, onlineUsers } = useChat();
  const { user: me, logout } = useAuth();
  const [searchQuery, setSearchQuery] = useState("");

  const filteredUsers = users.filter(
    (u) =>
      u.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (u.lastMsg || "").toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleSelectUser = (u) => {
    setSelectedUser(u);
    if (isMobileDrawer) onClose?.();
  };

  return (
    <div
      className="flex flex-col h-full theme-transition"
      style={{
        background: "var(--surface)",
        borderRight: "1px solid var(--border)",
      }}
    >
      {/* ── Header ── */}
      <div
        className="flex items-center justify-between px-4 pt-4 pb-3 flex-shrink-0"
        style={{ borderBottom: "1px solid var(--border)" }}
      >
        <div className="flex items-center gap-2">
          {/* Mingo logo mark */}
          <div
            className="w-8 h-8 rounded-xl flex items-center justify-center text-white font-bold text-sm shadow-sm"
            style={{
              background:
                "linear-gradient(135deg, var(--primary) 0%, var(--primary-dark) 100%)",
            }}
          >
            M
          </div>
          <h1
            className="font-bold text-base leading-tight"
            style={{ color: "var(--text)" }}
          >
            Chats
          </h1>
        </div>

        <div className="flex items-center gap-1">
          {/* New chat / compose */}
          <motion.button
            whileHover={{ scale: 1.12 }}
            whileTap={{ scale: 0.92 }}
            className="p-2 rounded-full transition-colors duration-150 cursor-pointer"
            style={{ color: "var(--text-muted)" }}
            title="New chat"
            id="new-chat-btn"
          >
            <FiEdit size={17} />
          </motion.button>

          {/* Logout */}
          <motion.button
            whileHover={{ scale: 1.12 }}
            whileTap={{ scale: 0.92 }}
            onClick={logout}
            className="p-2 rounded-full transition-colors duration-150 cursor-pointer"
            style={{ color: "var(--text-muted)" }}
            title="Logout"
            id="logout-btn"
          >
            <FiLogOut size={17} />
          </motion.button>

          {/* Close button — only shown in mobile drawer */}
          {isMobileDrawer && (
            <motion.button
              whileHover={{ scale: 1.12 }}
              whileTap={{ scale: 0.92 }}
              onClick={onClose}
              className="p-2 rounded-full transition-colors duration-150 cursor-pointer"
              style={{ color: "var(--text-muted)" }}
              id="close-sidebar-btn"
            >
              <FiX size={18} />
            </motion.button>
          )}
        </div>
      </div>

      {/* ── Logged-in user info ── */}
      {me && (
        <div
          className="flex items-center gap-3 px-4 py-3 flex-shrink-0"
          style={{ borderBottom: "1px solid var(--border)", background: "var(--surface-alt)" }}
        >
          <div
            className="w-9 h-9 rounded-full flex items-center justify-center text-white font-bold text-sm flex-shrink-0"
            style={{ background: me.avatarColor || "var(--primary)" }}
          >
            {me.avatar}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold truncate" style={{ color: "var(--text)" }}>
              {me.name}
            </p>
            <p className="text-[11px] truncate" style={{ color: "var(--primary)" }}>
              ● You (online)
            </p>
          </div>
        </div>
      )}

      {/* ── Search Bar ── */}
      <div className="px-3 py-3 flex-shrink-0">
        <div
          className="flex items-center gap-2 px-3 py-2 rounded-xl transition-all duration-200"
          style={{
            background: "var(--surface-alt)",
            border: "1px solid var(--border)",
          }}
        >
          <FiSearch
            size={15}
            style={{ color: "var(--text-muted)", flexShrink: 0 }}
          />
          <input
            type="text"
            placeholder="Search contacts…"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="flex-1 bg-transparent outline-none text-sm"
            style={{
              color: "var(--text)",
              fontFamily: "inherit",
            }}
            id="sidebar-search"
          />
          {searchQuery && (
            <motion.button
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => setSearchQuery("")}
              style={{ color: "var(--text-muted)" }}
            >
              <FiX size={14} />
            </motion.button>
          )}
        </div>
      </div>

      {/* ── Contact List ── */}
      <div className="flex-1 overflow-y-auto">
        {/* Section label */}
        <p
          className="px-4 pb-2 text-[10px] font-semibold uppercase tracking-widest select-none"
          style={{ color: "var(--text-muted)" }}
        >
          Contacts ({filteredUsers.length})
        </p>

        {usersLoading ? (
          // Loading skeleton
          <div className="flex flex-col gap-1 px-3">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="flex items-center gap-3 px-3 py-3 rounded-xl animate-pulse"
                style={{ background: "var(--surface-alt)" }}
              >
                <div
                  className="w-11 h-11 rounded-full flex-shrink-0"
                  style={{ background: "var(--border)" }}
                />
                <div className="flex-1">
                  <div
                    className="h-3 rounded mb-2 w-24"
                    style={{ background: "var(--border)" }}
                  />
                  <div
                    className="h-2.5 rounded w-32"
                    style={{ background: "var(--border)" }}
                  />
                </div>
              </div>
            ))}
          </div>
        ) : (
          <AnimatePresence>
            {filteredUsers.length === 0 ? (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex flex-col items-center justify-center py-12 gap-2"
              >
                <FiSearch
                  size={28}
                  style={{ color: "var(--text-muted)", opacity: 0.4 }}
                />
                <p className="text-sm" style={{ color: "var(--text-muted)" }}>
                  {users.length === 0 ? "No other users yet" : "No contacts found"}
                </p>
                {users.length === 0 && (
                  <p className="text-xs text-center px-4" style={{ color: "var(--text-muted)", opacity: 0.6 }}>
                    Sign up another account to start chatting!
                  </p>
                )}
              </motion.div>
            ) : (
              filteredUsers.map((u, i) => (
                <ChatItem
                  key={u._id}
                  user={u}
                  index={i}
                  isActive={selectedUser?._id === u._id}
                  isOnline={onlineUsers.includes(u._id)}
                  onClick={() => handleSelectUser(u)}
                />
              ))
            )}
          </AnimatePresence>
        )}
      </div>

      {/* ── Footer branding ── */}
      <div
        className="px-4 py-3 flex-shrink-0 text-center"
        style={{ borderTop: "1px solid var(--border)" }}
      >
        <p
          className="text-[10px]"
          style={{ color: "var(--text-muted)", opacity: 0.5 }}
        >
          Mingo ChatApp · End-to-end encrypted
        </p>
      </div>
    </div>
  );
};

// ── ChatItem (Contact Row) ────────────────────────────────────────────────────
const ChatItem = ({ user, index, isActive, isOnline, onClick }) => (
  <motion.button
    initial={{ opacity: 0, x: -16 }}
    animate={{ opacity: 1, x: 0 }}
    transition={{ duration: 0.2, delay: index * 0.04 }}
    whileHover={{ y: -1, boxShadow: "0 4px 12px rgba(0,0,0,0.06)" }}
    whileTap={{ scale: 0.985 }}
    onClick={onClick}
    className="w-full flex items-center gap-3 px-4 py-3 text-left transition-all duration-150 cursor-pointer relative"
    style={{
      background: isActive
        ? "linear-gradient(90deg, var(--badge-bg) 0%, transparent 100%)"
        : "transparent",
      borderLeft: isActive
        ? "3px solid var(--primary)"
        : "3px solid transparent",
    }}
    onMouseEnter={(e) => {
      if (!isActive) e.currentTarget.style.background = "var(--hover-bg)";
    }}
    onMouseLeave={(e) => {
      if (!isActive) e.currentTarget.style.background = "transparent";
    }}
    id={`chat-item-${user._id}`}
  >
    {/* Avatar with online indicator */}
    <div className="relative flex-shrink-0">
      <div
        className="w-11 h-11 rounded-full flex items-center justify-center text-white font-semibold text-sm shadow-sm select-none"
        style={{ background: user.avatarColor || "var(--primary)" }}
      >
        {user.avatar}
      </div>
      {isOnline && (
        <span
          className="absolute bottom-0 right-0 w-3 h-3 rounded-full border-2"
          style={{
            background: "var(--primary)",
            borderColor: "var(--surface)",
          }}
        />
      )}
    </div>

    {/* Name + Last message */}
    <div className="flex-1 min-w-0">
      <div className="flex items-center justify-between gap-1">
        <span
          className="font-semibold text-sm truncate leading-tight"
          style={{ color: "var(--text)" }}
        >
          {user.name}
        </span>
        <span
          className="text-[10px] flex-shrink-0 ml-1"
          style={{
            color: isOnline ? "var(--primary)" : "var(--text-muted)",
            fontWeight: isOnline ? "600" : "400",
          }}
        >
          {isOnline ? "online" : user.lastSeen
            ? new Date(user.lastSeen).toLocaleTimeString("en-IN", {
                hour: "2-digit",
                minute: "2-digit",
              })
            : ""}
        </span>
      </div>
      <p
        className="text-xs truncate leading-tight mt-0.5"
        style={{ color: "var(--text-muted)" }}
      >
        {user.lastMsg || (isOnline ? "● online" : "Tap to start chatting")}
      </p>
    </div>
  </motion.button>
);

export default Sidebar;
