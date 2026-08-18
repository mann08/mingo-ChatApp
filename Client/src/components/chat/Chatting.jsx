/**
 * Chatting.jsx — legacy component, now superseded by ChatLayout.
 * Kept here for reference. The active chat experience is in ChatLayout.jsx.
 */
import React from "react";

const Chatting = () => {
  return (
    <div
      className="flex items-center justify-center h-full"
      style={{ color: "var(--text-muted)" }}
    >
      <p className="text-sm">Use ChatLayout for the full chat experience.</p>
    </div>
  );
};

export default Chatting;
