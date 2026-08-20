import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import SiteHeader from "./components/SiteHeader";
import Home from "./pages/Home";
import Chat from "./pages/Chat";
import Login from "./pages/Login";
import ContactUs from "./pages/ContactUs";
import { AuthProvider, useAuth } from "./context/AuthContext";
import { ChatProvider } from "./context/ChatContext";

// ── Protected Route wrapper ──────────────────────────────────────────────────
const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth();

  if (loading) {
    // Splash loader while checking auth cookie
    return (
      <div
        className="min-h-screen flex items-center justify-center"
        style={{ background: "var(--bg)" }}
      >
        <div className="flex flex-col items-center gap-4">
          <div
            className="w-14 h-14 rounded-2xl flex items-center justify-center text-white font-extrabold text-2xl shadow-xl animate-pulse"
            style={{
              background: "linear-gradient(135deg, var(--primary), var(--primary-dark))",
            }}
          >
            M
          </div>
          <span className="text-sm" style={{ color: "var(--text-muted)" }}>
            Loading Mingo…
          </span>
        </div>
      </div>
    );
  }

  return user ? children : <Navigate to="/login" replace />;
};

// ── Public Route: redirect logged-in users away from /login ──────────────────
const PublicRoute = ({ children }) => {
  const { user, loading } = useAuth();
  if (loading) return null;
  return user ? <Navigate to="/chat" replace /> : children;
};

// ── App Shell ────────────────────────────────────────────────────────────────
const AppShell = () => {
  return (
    <>
      <SiteHeader />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/contact" element={<ContactUs />} />

        {/* Public only: redirect if already logged in */}
        <Route
          path="/login"
          element={
            <PublicRoute>
              <Login />
            </PublicRoute>
          }
        />
        <Route
          path="/register"
          element={
            <PublicRoute>
              <Login />
            </PublicRoute>
          }
        />

        {/* Protected: must be logged in */}
        <Route
          path="/chat"
          element={
            <ProtectedRoute>
              <Chat />
            </ProtectedRoute>
          }
        />

        {/* Fallback */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </>
  );
};

const App = () => {
  return (
    <BrowserRouter>
      <AuthProvider>
        <ChatProvider>
          <AppShell />
          <Toaster
            position="top-right"
            toastOptions={{
              duration: 3000,
              style: {
                background: "var(--surface)",
                color: "var(--text)",
                border: "1px solid var(--border)",
                borderRadius: "12px",
                fontSize: "14px",
              },
            }}
          />
        </ChatProvider>
      </AuthProvider>
    </BrowserRouter>
  );
};

export default App;
