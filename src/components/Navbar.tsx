"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useTheme } from "./ThemeProvider";
import { Sun, Moon, Menu, X } from "lucide-react";

export function Navbar() {
  const { theme, toggleTheme } = useTheme();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 w-full bg-white dark:bg-[#121212] border-b-2 border-black dark:!border-b-[#D4FF00] neo-shadow-sm">
      <div className="relative max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
        {/* Brand / Logo */}
        <Link
          href="/"
          className="flex items-center gap-2 font-mono font-black text-lg md:text-xl tracking-tight group"
        >
          <span className="px-2 py-1 bg-black text-white dark:bg-white dark:text-black border-2 border-black dark:border-white transition-transform group-hover:-translate-x-0.5 group-hover:-translate-y-0.5">
            ED
          </span>
          <span className="uppercase tracking-wider">ERICK.DEV</span>
        </Link>

        {/* Desktop Nav - Centralizado perfeitamente no container */}
        <nav className="hidden md:flex items-center gap-6 font-mono text-sm font-bold uppercase absolute left-1/2 -translate-x-1/2">
          <Link
            href="/#projetos"
            className="hover:underline underline-offset-4 decoration-2 transition-all"
          >
            Projetos
          </Link>
          <Link
            href="/#stack"
            className="hover:underline underline-offset-4 decoration-2 transition-all"
          >
            Stack
          </Link>
          <Link
            href="/#sobre"
            className="hover:underline underline-offset-4 decoration-2 transition-all"
          >
            Sobre
          </Link>
          <Link
            href="/#contato"
            className="hover:underline underline-offset-4 decoration-2 transition-all"
          >
            Contato
          </Link>
        </nav>

        {/* Actions (Status Badge + Theme Toggle + Mobile Menu) */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Status badge */}
          <div className="hidden sm:flex items-center gap-1.5 px-2.5 py-1 text-[11px] font-mono font-bold uppercase bg-neutral-100 dark:bg-neutral-900 border border-black dark:border-white">
            <span className="w-2 h-2 rounded-full bg-[#D4FF00] ring-1 ring-black/80 dark:ring-0 animate-pulse" />
            <span>DISPONÍVEL</span>
          </div>

          {/* Theme Toggle Button */}
          <button
            onClick={toggleTheme}
            className="neo-btn p-2 hover:bg-neutral-100 dark:hover:bg-neutral-800"
            aria-label="Alternar tema claro e escuro"
            title={theme === "light" ? "Mudar para modo escuro" : "Mudar para modo claro"}
          >
            {theme === "light" ? (
              <Moon className="w-4 h-4" />
            ) : (
              <Sun className="w-4 h-4" />
            )}
          </button>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden neo-btn p-2"
            aria-label="Abrir menu"
          >
            {mobileMenuOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t-2 border-black dark:border-white bg-white dark:bg-neutral-900 p-4 space-y-3 font-mono text-sm font-bold uppercase text-center">
          <Link
            href="/#projetos"
            onClick={() => setMobileMenuOpen(false)}
            className="block p-2 border border-black dark:border-white hover:bg-neutral-100 dark:hover:bg-neutral-800"
          >
            // 01. Projetos
          </Link>
          <Link
            href="/#stack"
            onClick={() => setMobileMenuOpen(false)}
            className="block p-2 border border-black dark:border-white hover:bg-neutral-100 dark:hover:bg-neutral-800"
          >
            // 02. Stack Técnica
          </Link>
          <Link
            href="/#sobre"
            onClick={() => setMobileMenuOpen(false)}
            className="block p-2 border border-black dark:border-white hover:bg-neutral-100 dark:hover:bg-neutral-800"
          >
            // 03. Sobre Mim
          </Link>
          <Link
            href="/#contato"
            onClick={() => setMobileMenuOpen(false)}
            className="block p-2 border border-black dark:border-white hover:bg-neutral-100 dark:hover:bg-neutral-800"
          >
            // 04. Contato
          </Link>
        </div>
      )}
    </header>
  );
}
