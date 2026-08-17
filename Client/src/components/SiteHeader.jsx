import { useTheme } from "../context/ThemeContext";

const SiteHeader = () => {
  const { theme, setTheme } = useTheme();

  return (
    <header
      className="sticky top-0 z-50 backdrop-blur-md px-6 py-3 flex items-center justify-between border-b theme-transition shadow-sm"
      style={{
        background: "var(--surface)",
        borderColor: "var(--border)",
      }}
    >
      <div className="flex items-center gap-3">
        <div
          className="w-9 h-9 rounded-xl flex items-center justify-center text-white font-extrabold text-lg shadow-sm"
          style={{ background: "linear-gradient(135deg, var(--primary), var(--primary-dark))" }}
        >
          M
        </div>
        <h1 className="text-xl md:text-2xl font-extrabold tracking-tight" style={{ color: "var(--text)" }}>
          Mingo <span className="gradient-text">Chat</span>
        </h1>
      </div>

      <div className="flex items-center gap-3">
        <label htmlFor="theme" className="text-xs font-semibold uppercase tracking-wider hidden sm:inline-block" style={{ color: "var(--text-muted)" }}>
          Theme:
        </label>
        <select
          name="theme"
          id="theme"
          className="px-3 py-1.5 rounded-xl text-sm font-medium border outline-none cursor-pointer theme-transition shadow-sm"
          style={{
            background: "var(--surface-alt)",
            color: "var(--text)",
            borderColor: "var(--border)",
          }}
          value={theme}
          onChange={(e) => setTheme(e.target.value)}
        >
          <option value="light">☀️ Light</option>
          <option value="dark">🌙 Dark</option>
          <option value="black">🖤 Black</option>
          <option value="spotify">🟢 Spotify</option>
          <option value="claude">🪵 Claude</option>
          <option value="corporate">💼 Corporate</option>
          <option value="ghibli">🍃 Ghibli</option>
          <option value="halloween">🎃 Halloween</option>
        </select>
      </div>
    </header>
  );
};

export default SiteHeader;
