// src/components/Layout.tsx

import type { ReactNode } from "react";
import { Link } from "react-router-dom";


interface LayoutProps {
  children: ReactNode;
}

export function Layout({ children }: LayoutProps) {
  return (
    <div className="app">
      <header className="app-header">
        <Link to="/" className="logo">
          Digital Item Catalog
        </Link>
      </header>

      <main className="app-main">{children}</main>

      <footer className="app-footer">
        <small>Intern Technical Task • React + Vite + FastAPI</small>
      </footer>
    </div>
  );
}
