// src/components/Layout.tsx
import type { ReactNode } from "react";
import { Link } from "react-router-dom";
import { useEffect, useState } from "react";

interface LayoutProps {
  children: ReactNode;
}

const STORAGE_KEY = "dic_theme"; // digital item catalog theme

export function Layout({ children }: LayoutProps) {
  const [theme, setTheme] = useState<"light" | "dark">(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored === "dark" || stored === "light") return stored;
    } catch {}
    // default: respect system preference
    const prefersDark = typeof window !== "undefined" && window.matchMedia?.("(prefers-color-scheme: dark)")?.matches;
    return prefersDark ? "dark" : "light";
  });

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, theme);
    } catch {}
    document.documentElement.dataset.theme = theme;
  }, [theme]);

  function toggleTheme() {
    setTheme((t) => (t === "light" ? "dark" : "light"));
  }

  return (
    <div className="app">
      <header className="app-header">
        <div className="header-inner">
          <Link to="/" className="logo">
            Digital Item Catalog
          </Link>

          <div className="header-actions">
            <button
              aria-label="Toggle theme"
              className="theme-toggle"
              onClick={toggleTheme}
              title={`Switch to ${theme === "light" ? "dark" : "light"} mode`}
            >
              {theme === "light" ? "🌙 Dark" : "☀️ Light"}
            </button>
          </div>
        </div>
      </header>

      <main className="app-main">{children}</main>

      <footer className="app-footer">
        <small>Intern Technical Task • React + Vite + FastAPI</small>
      </footer>
    </div>
  );
}
