import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import SiteHeader from "./components/SiteHeader";
import Home from "./pages/Home";
import Chat from "./pages/Chat";
import Login from "./pages/Login";
import ContactUs from "./pages/ContactUs";

const App = () => {
  return (
    <BrowserRouter>
      <SiteHeader />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/chat" element={<Chat />} />
        <Route path="/login" element={<Login />} />
        <Route path="/contact" element={<ContactUs />} />
        {/* Fallback */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;