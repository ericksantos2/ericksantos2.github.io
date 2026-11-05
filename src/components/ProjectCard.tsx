"use client";

import React from "react";
import { Project } from "@/types/project";
import { Code2, ArrowUpRight } from "lucide-react";
import { GithubIcon } from "./Icons";

interface ProjectCardProps {
  project: Project;
  index: number;
}

export function ProjectCard({ project, index }: ProjectCardProps) {
  const indexStr = (index + 1).toString().padStart(2, "0");

  return (
    <article className="neo-card flex flex-col justify-between p-5 md:p-6 hover:-translate-x-1 hover:-translate-y-1 hover:shadow-[7px_7px_0px_#000] dark:hover:shadow-[7px_7px_0px_#fff] transition-all">
      <div>
        {/* Top Header Row */}
        <div className="flex items-center justify-between gap-2 border-b-2 border-black dark:border-white pb-3 mb-4">
          <div className="flex items-center gap-2">
            <span className="font-mono text-xs font-black px-2 py-0.5 bg-black text-white dark:bg-white dark:text-black">
              #{indexStr}
            </span>
            <span className="font-mono text-xs font-bold uppercase tracking-wider px-2 py-0.5 bg-neutral-200 dark:bg-neutral-800 border border-black dark:border-white">
              {project.category}
            </span>
          </div>

          <div className="flex items-center gap-2 font-mono text-xs font-bold text-neutral-600 dark:text-neutral-400">
            <span>{project.year}</span>
            <span>•</span>
            <span
              className={`inline-flex items-center gap-1 ${
                project.status === "Concluído"
                  ? "text-black dark:text-white"
                  : "text-neutral-500"
              }`}
            >
              <span
                className={`w-1.5 h-1.5 rounded-full ${
                  project.status === "Concluído"
                    ? "bg-black dark:bg-white"
                    : "bg-neutral-400"
                }`}
              />
              {project.status}
            </span>
          </div>
        </div>

        {/* Brutalist Geometric Pattern Header */}
        <div className="h-28 w-full border-2 border-black dark:border-white bg-neutral-100 dark:bg-neutral-900 mb-4 p-3 flex flex-col justify-between relative overflow-hidden group">
          <div className="flex justify-between items-start font-mono text-[10px] text-neutral-500 dark:text-neutral-400">
            <span>// ARCHITECTURE.SPEC</span>
            <span>{project.role}</span>
          </div>

          <div className="font-mono text-xs font-bold uppercase text-neutral-800 dark:text-neutral-200 flex items-center gap-2">
            <Code2 className="w-4 h-4" />
            <span className="truncate">{project.tags.slice(0, 3).join(" • ")}</span>
          </div>

          {/* Decorative corner box */}
          <div className="absolute -bottom-6 -right-6 w-16 h-16 border-2 border-black dark:border-white rotate-12 opacity-10 group-hover:rotate-45 transition-transform duration-300" />
        </div>

        {/* Project Title */}
        <h3 className="text-xl md:text-2xl font-black uppercase tracking-tight mb-2 group-hover:underline">
          {project.title}
        </h3>

        {/* Description */}
        <p className="text-sm font-mono text-neutral-600 dark:text-neutral-300 mb-5 leading-relaxed line-clamp-3">
          {project.description}
        </p>

        {/* Tags */}
        <div className="flex flex-wrap gap-1.5 mb-6">
          {project.tags.map((tag) => (
            <span
              key={tag}
              className="px-2 py-0.5 text-[11px] font-mono font-bold uppercase bg-neutral-100 dark:bg-neutral-800 border border-black dark:border-white"
            >
              #{tag}
            </span>
          ))}
        </div>
      </div>

      {/* Footer Links */}
      <div className="pt-4 border-t-2 border-black dark:border-white flex items-center justify-between gap-3">
        {project.githubUrl ? (
          <a
            href={project.githubUrl}
            target="_blank"
            rel="noreferrer"
            className="neo-btn flex items-center gap-1.5 px-3 py-1.5 text-xs font-mono font-bold uppercase hover:bg-neutral-100 dark:hover:bg-neutral-800"
            title="Ver código fonte no GitHub"
          >
            <GithubIcon className="w-3.5 h-3.5" />
            <span>Código</span>
          </a>
        ) : (
          <span className="text-xs font-mono text-neutral-400 dark:text-neutral-600 uppercase">
            // Repo Privado
          </span>
        )}

        {project.liveUrl ? (
          <a
            href={project.liveUrl}
            target="_blank"
            rel="noreferrer"
            className="neo-btn-primary flex items-center gap-1.5 px-3 py-1.5 text-xs font-mono font-bold uppercase"
            title="Abrir projeto ao vivo"
          >
            <span>Live Demo</span>
            <ArrowUpRight className="w-3.5 h-3.5" />
          </a>
        ) : (
          <span className="text-xs font-mono text-neutral-400 dark:text-neutral-600 uppercase">
            // Offline
          </span>
        )}
      </div>
    </article>
  );
}
