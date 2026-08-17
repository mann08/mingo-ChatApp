/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useEffect, useState } from "react";
import { THEMES } from "./themes";

const STORAGE_KEY = "mingo-theme";

// ── Context ──────────────────────────────────────────────────────────────────
const ThemeContext = createContext({
  theme: "light",
  setTheme: () => {},
  themeVars: THEMES.light,
});

// ── Provider ─────────────────────────────────────────────────────────────────
export function ThemeProvider({ children }) {
  const [theme, setThemeState] = useState(() => {
    return localStorage.getItem(STORAGE_KEY) || "light";
  });

  const themeVars = THEMES[theme] || THEMES.light;

  // Apply CSS variables to :root on every theme change
  useEffect(() => {
    const root = document.documentElement;
    Object.entries(themeVars).forEach(([key, value]) => {
      root.style.setProperty(key, value);
    });
    // Also set the FlyonUI data-theme attribute for the header/components
    root.setAttribute("data-theme", theme);
    localStorage.setItem(STORAGE_KEY, theme);
  }, [theme, themeVars]);

  const setTheme = (newTheme) => {
    if (THEMES[newTheme]) setThemeState(newTheme);
  };

  return (
    <ThemeContext.Provider value={{ theme, setTheme, themeVars }}>
      {children}
    </ThemeContext.Provider>
  );
}

// ── Hook ─────────────────────────────────────────────────────────────────────
export function useTheme() {
  return useContext(ThemeContext);
}
