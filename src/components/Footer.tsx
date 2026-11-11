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
            className="p-2 bg-[#D4FF00] text-black border-2 border-black shadow-[3px_3px_0px_#000] hover:-translate-x-0.5 hover:-translate-y-0.5 hover:shadow-[5px_5px_0px_#000] transition-all cursor-pointer"
            aria-label="Voltar ao topo"
            title="Voltar ao topo"
          >
            <ArrowUp className="w-4 h-4 stroke-[2.5]" />
          </button>
        </div>
      </div>
    </footer>
  );
}
