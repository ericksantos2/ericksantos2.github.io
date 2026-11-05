"use client";

import React, { useState } from "react";
import { useTheme } from "./ThemeProvider";
import { Sun, Moon, Database, Menu, X } from "lucide-react";

interface NavbarProps {
  onOpenNotionGuide: () => void;
  isNotionLive?: boolean;
}

export function Navbar({ onOpenNotionGuide, isNotionLive = false }: NavbarProps) {
  const { theme, toggleTheme } = useTheme();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 w-full bg-white dark:bg-black border-b-2 border-black dark:border-white neo-shadow-sm">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
        {/* Brand / Logo */}
        <div className="flex items-center gap-3">
          <a
            href="#"
            className="flex items-center gap-2 font-mono font-black text-lg md:text-xl tracking-tight group"
          >
            <span className="px-2 py-1 bg-black text-white dark:bg-white dark:text-black border-2 border-black dark:border-white transition-transform group-hover:-translate-x-0.5 group-hover:-translate-y-0.5">
              ED
            </span>
            <span className="uppercase tracking-wider">ERICK.DEV</span>
          </a>

          {/* Status badge */}
          <div className="hidden lg:flex items-center gap-1.5 px-2.5 py-1 text-[11px] font-mono font-bold uppercase bg-neutral-100 dark:bg-neutral-900 border border-black dark:border-white">
            <span className="w-2 h-2 rounded-full bg-black dark:bg-white animate-pulse" />
            <span>DISPONÍVEL</span>
          </div>
        </div>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-6 font-mono text-sm font-bold uppercase">
          <a
            href="#projetos"
            className="hover:underline underline-offset-4 decoration-2 transition-all"
          >
            Projetos
          </a>
          <a
            href="#stack"
            className="hover:underline underline-offset-4 decoration-2 transition-all"
          >
            Stack
          </a>
          <a
            href="#sobre"
            className="hover:underline underline-offset-4 decoration-2 transition-all"
          >
            Sobre
          </a>
          <a
            href="#contato"
            className="hover:underline underline-offset-4 decoration-2 transition-all"
          >
            Contato
          </a>
        </nav>

        {/* Actions (Notion Guide + Theme Toggle) */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Notion Status / Guide trigger */}
          <button
            onClick={onOpenNotionGuide}
            className="flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-mono font-bold uppercase neo-btn hover:bg-neutral-100 dark:hover:bg-neutral-800"
            title="Clique para ver o status e instruções do Notion CMS"
          >
            <Database className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">
              {isNotionLive ? "Notion: Ativo" : "Notion CMS"}
            </span>
            <span
              className={`w-2 h-2 rounded-full ${
                isNotionLive ? "bg-black dark:bg-white" : "bg-neutral-400 dark:bg-neutral-600"
              }`}
            />
          </button>

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
        <div className="md:hidden border-t-2 border-black dark:border-white bg-white dark:bg-neutral-900 p-4 space-y-3 font-mono text-sm font-bold uppercase">
          <a
            href="#projetos"
            onClick={() => setMobileMenuOpen(false)}
            className="block p-2 border border-black dark:border-white hover:bg-neutral-100 dark:hover:bg-neutral-800"
          >
            // 01. Projetos
          </a>
          <a
            href="#stack"
            onClick={() => setMobileMenuOpen(false)}
            className="block p-2 border border-black dark:border-white hover:bg-neutral-100 dark:hover:bg-neutral-800"
          >
            // 02. Stack Técnica
          </a>
          <a
            href="#sobre"
            onClick={() => setMobileMenuOpen(false)}
            className="block p-2 border border-black dark:border-white hover:bg-neutral-100 dark:hover:bg-neutral-800"
          >
            // 03. Sobre Mim
          </a>
          <a
            href="#contato"
            onClick={() => setMobileMenuOpen(false)}
            className="block p-2 border border-black dark:border-white hover:bg-neutral-100 dark:hover:bg-neutral-800"
          >
            // 04. Contato
          </a>
        </div>
      )}
    </header>
  );
}
