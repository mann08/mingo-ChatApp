import React, { useState } from "react";
import { motion } from "motion/react";
import { FiSend, FiMail, FiUser, FiMessageSquare } from "react-icons/fi";

const ContactUs = () => {
  const [form, setForm] = useState({ name: "", email: "", message: "" });
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) =>
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setSent(true);
    }, 1200);
  };

  return (
    <div
      className="min-h-[calc(100vh-48px)] py-16 px-4 theme-transition"
      style={{ background: "var(--bg)" }}
    >
      {/* Background blob */}
      <div
        className="fixed top-0 left-0 w-[400px] h-[400px] rounded-full opacity-10 pointer-events-none"
        style={{
          background: "radial-gradient(circle, var(--primary) 0%, transparent 70%)",
          transform: "translate(-30%, -30%)",
        }}
      />

      <div className="max-w-6xl mx-auto relative z-10">
        {/* Heading */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-14"
        >
          <span
            className="inline-block text-sm font-semibold px-4 py-1.5 rounded-full mb-4 theme-transition"
            style={{ background: "var(--badge-bg)", color: "var(--badge-text)" }}
          >
            Get in Touch
          </span>
          <h1
            className="text-4xl md:text-5xl font-extrabold tracking-tight mb-4"
            style={{ color: "var(--text)" }}
          >
            We'd love to hear from you
          </h1>
          <p
            className="text-lg max-w-md mx-auto"
            style={{ color: "var(--text-muted)" }}
          >
            Have a question, feedback, or just want to say hi? Drop us a message!
          </p>
        </motion.div>

        <div className="flex flex-col lg:flex-row gap-10 items-start justify-center">
          {/* ── Info Panel ── */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="lg:w-80 flex-shrink-0"
          >
            {[
              {
                icon: <FiMail size={20} />,
                title: "Email Us",
                detail: "support@mingo.app",
              },
              {
                icon: <FiMessageSquare size={20} />,
                title: "Live Chat",
                detail: "Available Mon–Fri, 9AM–6PM IST",
              },
              {
                icon: <FiUser size={20} />,
                title: "Community",
                detail: "Join our Discord server",
              },
            ].map((item, i) => (
              <motion.div
                key={item.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 + i * 0.1 }}
                className="flex items-start gap-4 p-5 rounded-2xl mb-4 theme-transition"
                style={{
                  background: "var(--surface)",
                  border: "1px solid var(--border)",
                  boxShadow: "var(--card-shadow)",
                }}
              >
                <div
                  className="w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0 text-white"
                  style={{
                    background:
                      "linear-gradient(135deg, var(--primary), var(--primary-dark))",
                  }}
                >
                  {item.icon}
                </div>
                <div>
                  <p
                    className="font-semibold text-sm"
                    style={{ color: "var(--text)" }}
                  >
                    {item.title}
                  </p>
                  <p
                    className="text-xs mt-0.5"
                    style={{ color: "var(--text-muted)" }}
                  >
                    {item.detail}
                  </p>
                </div>
              </motion.div>
            ))}
          </motion.div>

          {/* ── Contact Form ── */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="flex-1 max-w-xl w-full"
          >
            <div
              className="rounded-3xl p-8 md:p-10 theme-transition"
              style={{
                background: "var(--surface)",
                border: "1px solid var(--border)",
                boxShadow: "var(--card-shadow)",
              }}
            >
              {sent ? (
                <motion.div
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  className="flex flex-col items-center justify-center py-12 text-center gap-4"
                >
                  <div
                    className="w-20 h-20 rounded-3xl flex items-center justify-center text-4xl shadow-lg"
                    style={{
                      background: "var(--badge-bg)",
                      boxShadow: "0 10px 30px var(--glow)",
                    }}
                  >
                    🎉
                  </div>
                  <h2
                    className="text-2xl font-bold"
                    style={{ color: "var(--text)" }}
                  >
                    Message Sent!
                  </h2>
                  <p className="text-sm" style={{ color: "var(--text-muted)" }}>
                    Thanks for reaching out. We'll get back to you within 24 hours.
                  </p>
                  <motion.button
                    whileHover={{ scale: 1.04 }}
                    whileTap={{ scale: 0.97 }}
                    onClick={() => {
                      setSent(false);
                      setForm({ name: "", email: "", message: "" });
                    }}
                    className="mt-4 px-6 py-2.5 rounded-2xl text-sm font-semibold text-white cursor-pointer"
                    style={{
                      background:
                        "linear-gradient(135deg, var(--primary), var(--primary-dark))",
                    }}
                  >
                    Send Another
                  </motion.button>
                </motion.div>
              ) : (
                <form onSubmit={handleSubmit} className="flex flex-col gap-5">
                  <h2
                    className="text-xl font-bold mb-1"
                    style={{ color: "var(--text)" }}
                  >
                    Send a Message
                  </h2>

                  {/* Name */}
                  <div>
                    <label
                      className="block text-xs font-semibold mb-1.5 uppercase tracking-wider"
                      style={{ color: "var(--text-muted)" }}
                    >
                      Your Name
                    </label>
                    <input
                      type="text"
                      name="name"
                      value={form.name}
                      onChange={handleChange}
                      required
                      placeholder="Mann Patel"
                      id="contact-name"
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
                  </div>

                  {/* Email */}
                  <div>
                    <label
                      className="block text-xs font-semibold mb-1.5 uppercase tracking-wider"
                      style={{ color: "var(--text-muted)" }}
                    >
                      Email Address
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={form.email}
                      onChange={handleChange}
                      required
                      placeholder="you@example.com"
                      id="contact-email"
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
                  </div>

                  {/* Message */}
                  <div>
                    <label
                      className="block text-xs font-semibold mb-1.5 uppercase tracking-wider"
                      style={{ color: "var(--text-muted)" }}
                    >
                      Message
                    </label>
                    <textarea
                      name="message"
                      value={form.message}
                      onChange={handleChange}
                      required
                      rows={5}
                      placeholder="Tell us what's on your mind…"
                      id="contact-message"
                      className="w-full px-4 py-3 rounded-xl text-sm outline-none resize-none transition-all duration-200"
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

                  <motion.button
                    whileHover={{ scale: 1.02, boxShadow: "0 12px 30px var(--glow)" }}
                    whileTap={{ scale: 0.97 }}
                    type="submit"
                    id="contact-submit-btn"
                    disabled={loading}
                    className="flex items-center justify-center gap-2 w-full py-3.5 rounded-2xl text-white font-bold text-sm transition-all cursor-pointer"
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
                        Send Message <FiSend size={15} />
                      </>
                    )}
                  </motion.button>
                </form>
              )}
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default ContactUs;
