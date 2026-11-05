"use client";

import React, { useState } from "react";
import { Project } from "@/types/project";
import { ThemeProvider } from "./ThemeProvider";
import { Navbar } from "./Navbar";
import { Hero } from "./Hero";
import { ProjectList } from "./ProjectList";
import { TechStack } from "./TechStack";
import { About } from "./About";
import { ContactSection } from "./ContactSection";
import { Footer } from "./Footer";
import { NotionModalGuide } from "./NotionModalGuide";

interface PortfolioAppProps {
  initialProjects: Project[];
  source: "notion" | "mock";
}

export function PortfolioApp({ initialProjects, source }: PortfolioAppProps) {
  const [guideOpen, setGuideOpen] = useState(false);

  return (
    <ThemeProvider>
      <div className="min-h-screen flex flex-col bg-neutral-100 dark:bg-[#0a0a0a] text-black dark:text-white transition-colors duration-200">
        <Navbar
          onOpenNotionGuide={() => setGuideOpen(true)}
          isNotionLive={source === "notion"}
        />

        <main className="flex-1">
          <Hero
            onOpenNotionGuide={() => setGuideOpen(true)}
            projectsCount={initialProjects.length}
            isNotionLive={source === "notion"}
          />

          <ProjectList
            initialProjects={initialProjects}
            source={source}
            onOpenNotionGuide={() => setGuideOpen(true)}
          />

          <TechStack />

          <About />

          <ContactSection />
        </main>

        <Footer />

        <NotionModalGuide
          isOpen={guideOpen}
          onClose={() => setGuideOpen(false)}
        />
      </div>
    </ThemeProvider>
  );
}
