"use client";

import React from "react";
import { ArrowUp } from "lucide-react";

export function Footer() {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <footer className="w-full bg-white dark:bg-black border-t-2 border-black dark:border-white py-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 flex flex-col sm:flex-row items-center justify-between gap-4 font-mono text-xs">
        <div>
          <div className="font-bold uppercase tracking-wider text-black dark:text-white">
            ERICK // PORTFÓLIO
          </div>
          <div className="text-neutral-500 dark:text-neutral-400 mt-1">
            Desenvolvido com Next.js & Notion Headless CMS.
          </div>
        </div>

        <div className="flex items-center gap-4">
          <span className="text-neutral-500 dark:text-neutral-400">
            © {new Date().getFullYear()} — MIT License
          </span>

          <button
            onClick={scrollToTop}
            className="neo-btn p-2 hover:bg-neutral-100 dark:hover:bg-neutral-800"
            aria-label="Voltar ao topo"
            title="Voltar ao topo"
          >
            <ArrowUp className="w-4 h-4" />
          </button>
        </div>
      </div>
    </footer>
  );
}
