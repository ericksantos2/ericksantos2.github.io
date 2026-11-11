"use client";

import React from "react";
import { ArrowDownRight, Terminal } from "lucide-react";
import { PhotoFrame } from "./PhotoFrame";
import { renderInline } from "./MarkdownContent";

interface HeroProps {
  projectsCount: number;
  heroText?: string;
}

export function Hero({ projectsCount, heroText }: HeroProps) {
  return (
    <section className="relative pt-12 pb-16 md:pt-20 md:pb-24 border-b-2 border-black dark:border-white bg-grid-pattern">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        {/* Main Hero Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-center mb-16">
          {/* Left Column: Headlines & Content */}
          <div className="lg:col-span-7 space-y-6">
            {/* Top Badges */}
            <div className="flex flex-wrap items-center gap-2">
              <span className="px-3 py-1 font-mono text-xs font-bold uppercase bg-neutral-200 dark:bg-neutral-800 border-2 border-black dark:border-white neo-shadow-sm flex items-center gap-1.5">
                <Terminal className="w-3.5 h-3.5" />
                DESENVOLVEDOR FULL-STACK
              </span>
              <span className="px-3 py-1 font-mono text-xs font-bold uppercase bg-white dark:bg-black border-2 border-black dark:border-white neo-shadow-sm">
                CIÊNCIA DA COMPUTAÇÃO
              </span>
            </div>

            {/* Hero Title */}
            <div className="space-y-4">
              <h1 className="text-4xl sm:text-6xl md:text-7xl font-black uppercase tracking-tighter leading-[0.9]">
                CÓDIGO PURO.
                <br />
                <span className="inline-block bg-black text-white dark:bg-white dark:text-black px-2 md:px-3 py-1 mt-1 neo-shadow">
                  SEM DISTRAÇÕES.
                </span>
              </h1>

              <p className="max-w-xl text-base sm:text-lg font-mono text-neutral-700 dark:text-neutral-300 pt-2 leading-relaxed">
                {heroText ? (
                  renderInline(heroText)
                ) : (
                  <>
                    Desenvolvedor de software focado em aplicações web de alta performance,
                    interfaces funcionais em estilo neobrutalista e arquiteturas desacopladas
                    gerenciadas via <strong>Notion como Headless CMS</strong>.
                  </>
                )}
              </p>
            </div>

            {/* CTAs */}
            <div className="flex flex-wrap items-center gap-3 sm:gap-4 pt-2">
              <a
                href="#projetos"
                className="neo-btn-primary px-6 py-3.5 font-mono text-sm font-bold uppercase tracking-wider flex items-center gap-2"
              >
                <span>Ver Projetos</span>
                <ArrowDownRight className="w-5 h-5" />
              </a>

              <a
                href="#contato"
                className="neo-btn px-6 py-3.5 font-mono text-sm font-bold uppercase tracking-wider hover:bg-neutral-100 dark:hover:bg-neutral-800"
              >
                Contato
              </a>
            </div>
          </div>

          {/* Right Column: Neobrutalist Photo Frame */}
          <div className="lg:col-span-5 flex justify-center">
            <PhotoFrame />
          </div>
        </div>

        {/* Quick Highlights Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="neo-card p-4">
            <div className="font-mono text-3xl md:text-4xl font-black mb-1">
              FULL
            </div>
            <div className="font-mono text-xs uppercase text-neutral-600 dark:text-neutral-400 font-bold">
              Java & TypeScript
            </div>
          </div>

          <div className="neo-card p-4">
            <div className="font-mono text-3xl md:text-4xl font-black mb-1">
              {projectsCount.toString().padStart(2, "0")}
            </div>
            <div className="font-mono text-xs uppercase text-neutral-600 dark:text-neutral-400 font-bold">
              Projetos no Catálogo
            </div>
          </div>

          <div className="neo-card p-4">
            <div className="font-mono text-3xl md:text-4xl font-black mb-1">
              100%
            </div>
            <div className="font-mono text-xs uppercase text-neutral-600 dark:text-neutral-400 font-bold">
              Clean Architecture
            </div>
          </div>

          <div className="neo-card p-4">
            <div className="font-mono text-3xl md:text-4xl font-black mb-1">
              DOCKER
            </div>
            <div className="font-mono text-xs uppercase text-neutral-600 dark:text-neutral-400 font-bold">
              Testes & Ambientes
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
