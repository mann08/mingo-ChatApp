import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import Sidebar from "./Sidebar";
import ChatHeader from "./ChatHeader";
import MessageList from "./MessageList";
import { useChat } from "../../context/ChatContext";
import { useAuth } from "../../context/AuthContext";

/**
 * ChatLayout — the full chat page.
 * - Left panel: Sidebar (contact list from real API)
 * - Right panel: ChatHeader + MessageList + MessageInput
 * - On mobile: drawer-based sidebar
 */
const ChatLayout = () => {
  const { selectedUser, messages, sendMessage, messagesLoading } = useChat();
  const { user: me } = useAuth();
  const [mobileDrawerOpen, setMobileDrawerOpen] = useState(false);

  // Convert DB messages to the shape the UI expects
  const formattedMessages = messages.map((msg) => ({
    id: msg._id,
    isMe: msg.senderId === me?._id, // true if I sent this message
    text: msg.text,
    time: new Date(msg.createdAt).toLocaleTimeString("en-IN", {
      hour: "2-digit",
      minute: "2-digit",
    }),
    status: msg.status || "sent",
  }));

  return (
    <div
      className="flex h-[calc(100vh-48px)] theme-transition overflow-hidden relative"
      style={{ background: "var(--bg)" }}
    >
      {/* ── Desktop Sidebar ── */}
      <div
        className="hidden md:flex flex-col w-80 flex-shrink-0 h-full"
        style={{ minWidth: "280px", maxWidth: "320px" }}
      >
        <Sidebar />
      </div>

      {/* ── Mobile Sidebar Drawer ── */}
      <AnimatePresence>
        {mobileDrawerOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="md:hidden fixed inset-0 z-40 bg-black/40 backdrop-blur-sm"
              onClick={() => setMobileDrawerOpen(false)}
            />
            {/* Drawer panel */}
            <motion.div
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ duration: 0.25, ease: "easeOut" }}
              className="md:hidden fixed left-0 top-0 bottom-0 z-50 w-[300px]"
            >
              <Sidebar
                onClose={() => setMobileDrawerOpen(false)}
                isMobileDrawer
              />
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* ── Main Chat Area ── */}
      <div className="flex flex-col flex-1 min-w-0 h-full">
        {selectedUser ? (
          <>
            <ChatHeader
              chat={selectedUser}
              onBack={() => setMobileDrawerOpen(true)}
            />
            {messagesLoading ? (
              <div className="flex-1 flex items-center justify-center">
                <div className="flex flex-col items-center gap-3">
                  <div
                    className="w-10 h-10 rounded-full border-4 border-t-transparent animate-spin"
                    style={{ borderColor: "var(--border)", borderTopColor: "var(--primary)" }}
                  />
                  <p className="text-sm" style={{ color: "var(--text-muted)" }}>
                    Loading messages…
                  </p>
                </div>
              </div>
            ) : (
              <MessageList messages={formattedMessages} onSend={sendMessage} />
            )}
          </>
        ) : (
          /* Empty state */
          <div
            className="flex-1 flex flex-col items-center justify-center gap-4 theme-transition"
            style={{ background: "var(--bg)" }}
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.5 }}
              className="w-24 h-24 rounded-3xl flex items-center justify-center shadow-xl"
              style={{
                background:
                  "linear-gradient(135deg, var(--primary), var(--primary-dark))",
                boxShadow: "0 20px 60px var(--glow)",
              }}
            >
              <span className="text-white font-extrabold text-4xl">M</span>
            </motion.div>
            <motion.h2
              initial={{ y: 10, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.15 }}
              className="text-xl font-bold"
              style={{ color: "var(--text)" }}
            >
              Select a contact to start chatting
            </motion.h2>
            <motion.p
              initial={{ y: 10, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.25 }}
              className="text-sm"
              style={{ color: "var(--text-muted)" }}
            >
              Your messages are end-to-end encrypted 🔒
            </motion.p>
            {/* Mobile: show open sidebar button */}
            <motion.button
              initial={{ y: 10, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.35 }}
              onClick={() => setMobileDrawerOpen(true)}
              className="md:hidden mt-2 px-6 py-3 rounded-2xl text-white font-semibold text-sm cursor-pointer"
              style={{
                background:
                  "linear-gradient(135deg, var(--primary), var(--primary-dark))",
                boxShadow: "0 8px 24px var(--glow)",
              }}
            >
              Open Contacts
            </motion.button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ChatLayout;
