"use client";

import React from "react";
import Link from "next/link";
import { Project } from "@/types/project";
import { Code2, ArrowUpRight, ArrowRight, Play } from "lucide-react";
import { GithubIcon } from "./Icons";

interface ProjectCardProps {
  project: Project;
  index: number;
}

export function ProjectCard({ project, index }: ProjectCardProps) {
  const indexStr = (index + 1).toString().padStart(2, "0");
  const projectHref = `/projetos/${project.slug}`;

  return (
    <article className="neo-card flex flex-col justify-between p-5 md:p-6 hover:-translate-x-1 hover:-translate-y-1 hover:shadow-[7px_7px_0px_#000] dark:hover:shadow-[7px_7px_0px_#383838] hover:border-black dark:hover:border-neutral-500 transition-all bg-white dark:bg-neutral-900 group">
      <div>
        {/* Top Header Row */}
        <div className="flex items-center justify-between gap-2 border-b-2 border-black dark:border-white pb-3 mb-4">
          <div className="flex items-center gap-2">
            <span className="font-mono text-xs font-black px-2 py-0.5 bg-[#D4FF00] text-black border border-black shadow-[2px_2px_0px_#000]">
              #{indexStr}
            </span>
            <span className="font-mono text-xs font-bold uppercase tracking-wider px-2 py-0.5 bg-neutral-200 dark:bg-neutral-800 border border-black dark:border-white">
              {project.category}
            </span>
          </div>

          <div className="flex items-center gap-2 font-mono text-xs font-bold text-neutral-600 dark:text-neutral-400">
            <span>{project.year}</span>
            <span>•</span>
            {(() => {
              const norm = project.status?.toLowerCase().trim() || "";
              if (norm.includes("conclui") || norm.includes("concluí")) {
                return (
                  <span className="inline-flex items-center gap-1.5 text-neutral-600 dark:text-neutral-400">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#D4FF00] ring-1 ring-black/70 dark:ring-0" />
                    <span>Concluído</span>
                  </span>
                );
              }
              if (norm.includes("andamento") || norm.includes("progresso")) {
                return (
                  <span className="inline-flex items-center gap-1.5 text-blue-600 dark:text-blue-400">
                    <span className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-pulse" />
                    <span>Em Andamento</span>
                  </span>
                );
              }
              if (norm.includes("parado") || norm.includes("pausa")) {
                return (
                  <span className="inline-flex items-center gap-1.5 text-amber-600 dark:text-amber-400">
                    <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
                    <span>Parado</span>
                  </span>
                );
              }
              return (
                <span className="inline-flex items-center gap-1.5 text-neutral-500">
                  <span className="w-1.5 h-1.5 rounded-full bg-neutral-400" />
                  <span>{project.status || "Concluído"}</span>
                </span>
              );
            })()}
          </div>
        </div>

        {/* Brutalist Geometric Pattern Header */}
        <Link
          href={projectHref}
          className="block h-28 w-full border-2 border-black dark:border-white bg-neutral-100 dark:bg-neutral-900 mb-4 p-3 relative overflow-hidden cursor-pointer"
        >
          <div className="flex justify-between items-start font-mono text-[10px] text-neutral-500 dark:text-neutral-400">
            <span>// ARCHITECTURE.SPEC</span>
            <span>{project.role}</span>
          </div>

          <div className="font-mono text-xs font-bold uppercase text-neutral-800 dark:text-neutral-200 flex items-center gap-2 mt-4">
            <Code2 className="w-4 h-4 shrink-0" />
            <span className="truncate">{project.tags.slice(0, 3).join(" • ")}</span>
          </div>

          {/* Decorative corner box */}
          <div className="absolute -bottom-6 -right-6 w-16 h-16 border-2 border-black dark:border-white rotate-12 opacity-10 group-hover:rotate-45 transition-transform duration-300" />
        </Link>

        {/* Project Title -> Link to Dedicated Page */}
        <Link href={projectHref} className="block mb-2 group-hover:underline">
          <h3 className="text-xl md:text-2xl font-black uppercase tracking-tight flex items-center justify-between gap-2">
            <span>{project.title}</span>
            <ArrowRight className="w-5 h-5 opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all shrink-0" />
          </h3>
        </Link>

        {/* Simple Description (from Notion's 'Descrição Simples') */}
        <p className="text-sm font-mono text-neutral-600 dark:text-neutral-300 mb-5 leading-relaxed line-clamp-3">
          {project.description}
        </p>

        {/* Stacks / Tags (Sem as hashtags #) */}
        <div className="flex flex-wrap gap-1.5 mb-6">
          {project.tags.slice(0, 6).map((tag) => (
            <span
              key={tag}
              className="px-2 py-0.5 text-[11px] font-mono font-bold uppercase bg-neutral-100 dark:bg-neutral-800 border border-black dark:border-white"
            >
              {tag}
            </span>
          ))}
          {project.tags.length > 6 && (
            <span className="px-2 py-0.5 text-[11px] font-mono font-bold text-neutral-500 dark:text-neutral-400">
              +{project.tags.length - 6} mais
            </span>
          )}
        </div>
      </div>

      {/* Footer Links */}
      <div className="pt-4 border-t-2 border-black dark:border-white flex flex-wrap items-center justify-between gap-2">
        <Link
          href={projectHref}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-mono font-bold uppercase transition-all bg-[#D4FF00] text-black border-2 border-black dark:border-[#D4FF00] shadow-[3px_3px_0px_#000] dark:shadow-[3px_3px_0px_#D4FF00] hover:-translate-x-0.5 hover:-translate-y-0.5 hover:shadow-[5px_5px_0px_#000] dark:hover:shadow-[5px_5px_0px_#D4FF00]"
          title="Ver página completa do projeto"
        >
          <span>Página Completa</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </Link>

        <div className="flex items-center gap-2">
          {project.githubUrl && (
            <a
              href={project.githubUrl}
              target="_blank"
              rel="noreferrer"
              className="neo-btn flex items-center gap-1 px-2.5 py-1.5 text-xs font-mono font-bold uppercase hover:bg-neutral-100 dark:hover:bg-neutral-800"
              title="Código no GitHub"
            >
              <GithubIcon className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Repo</span>
            </a>
          )}

          {project.showcaseUrl && (
            <a
              href={project.showcaseUrl}
              target="_blank"
              rel="noreferrer"
              className="neo-btn flex items-center gap-1 px-2.5 py-1.5 text-xs font-mono font-bold uppercase text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950"
              title="Vídeo Showcase"
            >
              <Play className="w-3 h-3 fill-current" />
              <span className="hidden sm:inline">Vídeo</span>
            </a>
          )}

          {project.liveUrl && (
            <a
              href={project.liveUrl}
              target="_blank"
              rel="noreferrer"
              className="neo-btn-primary flex items-center gap-1 px-2.5 py-1.5 text-xs font-mono font-bold uppercase"
              title="Abrir demo ao vivo"
            >
              <span>Demo</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </a>
          )}
        </div>
      </div>
    </article>
  );
}
