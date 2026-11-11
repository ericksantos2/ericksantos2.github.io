"use client";

import React, { useEffect } from "react";
import { Project, SiteContent, ContactData, Experience, TechStackCategory, Education } from "@/types/project";
import { ThemeProvider } from "./ThemeProvider";
import { Navbar } from "./Navbar";
import { Hero } from "./Hero";
import { ProjectList } from "./ProjectList";
import { TechStack } from "./TechStack";
import { About } from "./About";
import { ContactSection } from "./ContactSection";
import { Footer } from "./Footer";

interface PortfolioAppProps {
  initialProjects: Project[];
  categories?: string[];
  siteContent?: SiteContent;
  contactData?: ContactData;
  experiences?: Experience[];
  techStacks?: TechStackCategory[];
  education?: Education[];
  source: "notion" | "mock";
}

export function PortfolioApp({
  initialProjects,
  categories,
  siteContent,
  contactData,
  experiences,
  techStacks,
  education,
  source,
}: PortfolioAppProps) {
  // 🕵️ Status log no Console do navegador (ativo também em produção)
  useEffect(() => {
    if (source === "notion") {
      console.log(
        "%c[PORTFOLIO STATUS] 🟢 NOTION LIVE CONECTADO",
        "background: #000; color: #00ff66; font-size: 13px; font-weight: 900; padding: 4px 10px; border: 2px solid #00ff66; border-radius: 4px;",
        `\n• Status: Dados em tempo real sincronizados com o Notion API.\n• Projetos carregados: ${initialProjects.length}\n• Filtros ativos: ${categories?.join(", ") || "Padrão"}`
      );
    } else {
      console.warn(
        "%c[PORTFOLIO STATUS] 🟡 MODO FALLBACK LOCAL (OFFLINE)",
        "background: #000; color: #ffcc00; font-size: 13px; font-weight: 900; padding: 4px 10px; border: 2px solid #ffcc00; border-radius: 4px;",
        `\n• Status: Utilizando dados de cache/fallback local (Notion offline ou não configurado).\n• Projetos carregados: ${initialProjects.length}`
      );
    }
  }, [source, initialProjects.length, categories]);

  return (
    <ThemeProvider>
      <div className="min-h-screen flex flex-col bg-neutral-100 dark:bg-[#0a0a0a] text-black dark:text-white transition-colors duration-200">
        <Navbar />

        <main className="flex-1">
          <Hero
            projectsCount={initialProjects.length}
            heroText={siteContent?.heroText}
          />

          <ProjectList
            initialProjects={initialProjects}
            categories={categories}
          />

          <TechStack stacks={techStacks} />

          <About
            aboutParagraphs={siteContent?.aboutParagraphs}
            principles={siteContent?.principles}
            experiences={experiences}
            education={education}
          />

          <ContactSection contactData={contactData} />
        </main>

        <Footer />
      </div>
    </ThemeProvider>
  );
}
