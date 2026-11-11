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
  source?: "notion" | "mock";
}

export function PortfolioApp({
  initialProjects,
  categories,
  siteContent,
  contactData,
  experiences,
  techStacks,
  education,
}: PortfolioAppProps) {
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
