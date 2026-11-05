"use client";

import React from "react";
import { Cpu, Terminal, Layout, ShieldCheck } from "lucide-react";

interface StackCategory {
  title: string;
  icon: React.ReactNode;
  description: string;
  skills: string[];
}

const STACKS: StackCategory[] = [
  {
    title: "FRONTEND ENGINEERING",
    icon: <Layout className="w-5 h-5" />,
    description: "Interfaces reativas, responsivas e construídas com tipagem estrita.",
    skills: [
      "React 19",
      "Next.js 16 (App Router)",
      "TypeScript",
      "TailwindCSS v4",
      "Zustand / Redux",
      "HTML5 Semântico",
    ],
  },
  {
    title: "BACKEND & APIS",
    icon: <Terminal className="w-5 h-5" />,
    description: "Serviços escaláveis, rotas de alto rendimento e modelagem de dados.",
    skills: [
      "Node.js / Express",
      "Notion SDK & REST APIs",
      "PostgreSQL",
      "SQLite / IndexedDB",
      "Redis Caching",
      "Autenticação JWT / WebAuthn",
    ],
  },
  {
    title: "DEVOPS & DEPLOYMENT",
    icon: <Cpu className="w-5 h-5" />,
    description: "Infraestrutura estática, automação e entregas contínuas seguras.",
    skills: [
      "GitHub Pages (Static Export)",
      "GitHub Actions (CI/CD)",
      "Vercel / Netlify",
      "Docker Containers",
      "Git Flow / Conventional Commits",
      "Linux / Bash",
    ],
  },
  {
    title: "DESIGN & ARQUITETURA",
    icon: <ShieldCheck className="w-5 h-5" />,
    description: "Decisões orientadas a clareza, usabilidade e manutenibilidade.",
    skills: [
      "Neobrutalismo Estético",
      "Design Monocromático",
      "Clean Architecture",
      "Web Core Vitals (100 Lighthouse)",
      "SEO & Metatags",
      "Local-First Architecture",
    ],
  },
];

export function TechStack() {
  return (
    <section id="stack" className="py-16 md:py-24 border-b-2 border-black dark:border-white bg-neutral-100/50 dark:bg-neutral-900/40">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        {/* Section Header */}
        <div className="mb-12">
          <div className="inline-block px-2.5 py-0.5 mb-2 font-mono text-xs font-bold uppercase bg-neutral-200 dark:bg-neutral-800 border border-black dark:border-white">
            // 02. HABILIDADES & FERRAMENTAS
          </div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-black uppercase tracking-tight">
            STACK & TECNOLOGIAS
          </h2>
          <p className="mt-2 text-sm md:text-base font-mono text-neutral-600 dark:text-neutral-400 max-w-2xl">
            Ferramentas selecionadas a dedo para entregar produtos sólidos, rápidos e sem dependências desnecessárias.
          </p>
        </div>

        {/* Stack Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {STACKS.map((item, index) => (
            <div
              key={item.title}
              className="neo-card p-6 md:p-8 flex flex-col justify-between hover:-translate-x-1 hover:-translate-y-1 transition-all"
            >
              <div>
                {/* Header */}
                <div className="flex items-center justify-between border-b-2 border-black dark:border-white pb-4 mb-4">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-black text-white dark:bg-white dark:text-black">
                      {item.icon}
                    </div>
                    <h3 className="font-mono text-base md:text-lg font-black uppercase tracking-tight">
                      {item.title}
                    </h3>
                  </div>
                  <span className="font-mono text-xs font-bold text-neutral-400">
                    [0{index + 1}]
                  </span>
                </div>

                <p className="text-sm font-mono text-neutral-600 dark:text-neutral-300 mb-6">
                  {item.description}
                </p>

                {/* Skills tags */}
                <div className="flex flex-wrap gap-2">
                  {item.skills.map((skill) => (
                    <span
                      key={skill}
                      className="px-2.5 py-1 text-xs font-mono font-bold uppercase bg-neutral-100 dark:bg-neutral-800 border-2 border-black dark:border-white neo-shadow-sm"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>

              {/* Bottom decorative bar */}
              <div className="mt-8 pt-3 border-t border-neutral-300 dark:border-neutral-700 font-mono text-[11px] text-neutral-500 uppercase flex justify-between">
                <span>STATUS // ATIVO</span>
                <span>NÍVEL // PRODUÇÃO</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
