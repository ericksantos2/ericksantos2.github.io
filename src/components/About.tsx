"use client";

import React from "react";
import { CheckCircle2, UserCheck, Briefcase } from "lucide-react";

export function About() {
  const experiences = [
    {
      period: "2023 — PRESENTE",
      role: "Engenheiro de Software Full-Stack",
      company: "Projetos Independentes & Consultoria",
      description:
        "Desenvolvimento de aplicações web completas, integrações com Notion/CMS headless, arquiteturas desacopladas e soluções orientadas a performance.",
    },
    {
      period: "2021 — 2023",
      role: "Desenvolvedor Frontend Sênior",
      company: "Tech Solutions Inc.",
      description:
        "Liderança técnica de times frontend, refatoração de sistemas legados para React/Next.js e implementação de design systems acessíveis.",
    },
    {
      period: "2019 — 2021",
      role: "Desenvolvedor Web & UI Designer",
      company: "Estúdio Criativo",
      description:
        "Criação de landing pages interativas, dashboards e interfaces de usuário com foco em tipografia forte e layouts de alto impacto.",
    },
  ];

  return (
    <section id="sobre" className="py-16 md:py-24 border-b-2 border-black dark:border-white">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
          {/* Left Column: Manifesto / Bio */}
          <div className="lg:col-span-5 space-y-6">
            <div>
              <div className="inline-block px-2.5 py-0.5 mb-2 font-mono text-xs font-bold uppercase bg-neutral-200 dark:bg-neutral-800 border border-black dark:border-white">
                // 03. BIO & FILOSOFIA
              </div>
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-black uppercase tracking-tight">
                SOBRE MIM
              </h2>
            </div>

            <div className="neo-card p-6 space-y-4 text-sm font-mono leading-relaxed">
              <div className="flex items-center gap-2 font-bold text-base border-b-2 border-black dark:border-white pb-3">
                <UserCheck className="w-5 h-5" />
                <span>ERICK // DEVELOPER</span>
              </div>
              <p className="text-neutral-700 dark:text-neutral-300">
                Acredito que o bom software é aquele que resolve o problema sem adornos
                inúteis. Minha abordagem combina a solidez da engenharia de software com
                o impacto visual cru do <strong>Neobrutalismo</strong>.
              </p>
              <p className="text-neutral-700 dark:text-neutral-300">
                Uso o <strong>Notion como banco de dados headless</strong> para manter o
                conteúdo sempre atualizado de forma ágil, permitindo gerar sites 100%
                estáticos, seguros e ultra velozes que rodam de graça no GitHub Pages.
              </p>
            </div>

            {/* Principles */}
            <div className="neo-card p-6 space-y-3">
              <div className="font-mono text-xs font-black uppercase text-neutral-500 tracking-wider">
                // PRINCÍPIOS FUNDAMENTAIS
              </div>
              <ul className="space-y-2 font-mono text-xs">
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 shrink-0 mt-0.5 text-black dark:text-white" />
                  <span>Código limpo, tipado e com zero dependências inúteis.</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 shrink-0 mt-0.5 text-black dark:text-white" />
                  <span>Design monocromático de alto contraste e fácil leitura.</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 shrink-0 mt-0.5 text-black dark:text-white" />
                  <span>Deploy 100% estático, sem custo de servidor para o portfólio.</span>
                </li>
              </ul>
            </div>
          </div>

          {/* Right Column: Timeline / Trajectory */}
          <div className="lg:col-span-7">
            <div className="flex items-center gap-2 mb-6 font-mono text-sm font-bold uppercase">
              <Briefcase className="w-4 h-4" />
              <span>TRAJETÓRIA & EXPERIÊNCIA</span>
            </div>

            <div className="space-y-4">
              {experiences.map((exp, idx) => (
                <div
                  key={idx}
                  className="neo-card p-6 hover:-translate-x-1 hover:-translate-y-1 transition-all"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 border-b border-neutral-300 dark:border-neutral-700 pb-3 mb-3">
                    <h3 className="font-mono font-black text-base uppercase">
                      {exp.role}
                    </h3>
                    <span className="font-mono text-xs font-bold px-2 py-0.5 bg-neutral-200 dark:bg-neutral-800 border border-black dark:border-white">
                      {exp.period}
                    </span>
                  </div>

                  <div className="font-mono text-xs font-bold text-neutral-600 dark:text-neutral-400 mb-2">
                    @ {exp.company}
                  </div>

                  <p className="font-mono text-xs text-neutral-700 dark:text-neutral-300 leading-relaxed">
                    {exp.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
