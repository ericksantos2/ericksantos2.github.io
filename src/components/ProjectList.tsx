"use client";

import React, { useState, useMemo } from "react";
import { Project, CategoryFilter } from "@/types/project";
import { ProjectCard } from "./ProjectCard";
import { Search, Layers } from "lucide-react";

interface ProjectListProps {
  initialProjects: Project[];
  categories?: string[];
}

export function ProjectList({
  initialProjects,
  categories,
}: ProjectListProps) {
  const [selectedCategory, setSelectedCategory] = useState<CategoryFilter>("Todos");
  const [searchQuery, setSearchQuery] = useState("");

  // Categorias/filtros dinâmicos vindos da Tabela Stacks de Projetos do Notion
  const availableCategories = useMemo(() => {
    if (categories && categories.length > 0) return categories;
    const fromProjects = Array.from(
      new Set(initialProjects.map((p) => p.category))
    ).filter(Boolean);
    return [
      "Todos",
      ...(fromProjects.length > 0
        ? fromProjects
        : ["Full-stack", "Frontend", "Desktop"]),
    ];
  }, [categories, initialProjects]);

  const filteredProjects = useMemo(() => {
    return initialProjects.filter((project) => {
      // Filtro por categoria (Stack da relação)
      const matchesCategory =
        selectedCategory === "Todos" ||
        project.category?.toLowerCase() === selectedCategory.toLowerCase();

      // Filtro por busca de texto
      const query = searchQuery.toLowerCase().trim();
      if (!query) return matchesCategory;

      const matchesSearch =
        project.title.toLowerCase().includes(query) ||
        project.description.toLowerCase().includes(query) ||
        project.tags.some((tag) => tag.toLowerCase().includes(query)) ||
        project.role.toLowerCase().includes(query);

      return matchesCategory && matchesSearch;
    });
  }, [initialProjects, selectedCategory, searchQuery]);

  return (
    <section id="projetos" className="py-16 md:py-24 border-b-2 border-black dark:border-white">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
          <div>
            <div className="inline-block px-2.5 py-0.5 mb-2 font-mono text-xs font-bold uppercase bg-neutral-200 dark:bg-neutral-800 border border-black dark:border-white">
              // 01. DIRETÓRIO DE PROJETOS
            </div>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-black uppercase tracking-tight">
              TRABALHOS EM DESTAQUE
            </h2>
          </div>
        </div>

        {/* Filter Controls Bar (Categorias dinâmicas da Tabela Stacks) */}
        <div className="p-4 mb-8 border-2 border-black dark:border-white bg-white dark:bg-neutral-900 neo-shadow flex flex-col md:flex-row gap-4 justify-between items-center">
          {/* Categories */}
          <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
            {availableCategories.map((cat) => {
              const isActive =
                selectedCategory.toLowerCase() === cat.toLowerCase();
              return (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-3 py-1.5 font-mono text-xs font-bold uppercase transition-all ${
                    isActive
                      ? "bg-[#D4FF00] text-black border-2 border-black dark:border-black shadow-[3px_3px_0px_#000] dark:shadow-[3px_3px_0px_#262626]"
                      : "bg-neutral-100 dark:bg-neutral-800 text-neutral-800 dark:text-neutral-200 border border-black dark:border-white hover:bg-neutral-200 dark:hover:bg-neutral-700"
                  }`}
                >
                  {cat}
                </button>
              );
            })}
          </div>

          {/* Search Input */}
          <div className="relative w-full md:w-72">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Buscar por tag, nome..."
              className="w-full pl-9 pr-3 py-1.5 font-mono text-xs uppercase bg-neutral-50 dark:bg-neutral-800 border-2 border-black dark:border-white focus:outline-none focus:ring-0 placeholder:text-neutral-400"
            />
            <Search className="w-4 h-4 absolute left-2.5 top-1/2 -translate-y-1/2 text-neutral-500" />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className="absolute right-2 top-1/2 -translate-y-1/2 font-mono text-xs font-bold text-neutral-500 hover:text-black dark:hover:text-white"
              >
                ✕
              </button>
            )}
          </div>
        </div>

        {/* Projects Counter & Info */}
        <div className="flex items-center justify-between font-mono text-xs text-neutral-600 dark:text-neutral-400 mb-6 uppercase">
          <div className="flex items-center gap-1.5">
            <Layers className="w-3.5 h-3.5" />
            <span>Exibindo {filteredProjects.length} de {initialProjects.length} projetos</span>
          </div>

          {selectedCategory !== "Todos" && (
            <span>Filtro Stack: [{selectedCategory}]</span>
          )}
        </div>

        {/* Projects Grid */}
        {filteredProjects.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredProjects.map((project, index) => (
              <ProjectCard key={project.id} project={project} index={index} />
            ))}
          </div>
        ) : (
          /* Empty state */
          <div className="p-12 border-2 border-black dark:border-white bg-white dark:bg-neutral-900 neo-shadow text-center">
            <div className="font-mono text-xl font-bold uppercase mb-2">
              Nenhum projeto encontrado
            </div>
            <p className="font-mono text-xs text-neutral-600 dark:text-neutral-400 mb-4">
              Não encontramos nenhum projeto com os filtros selecionados.
            </p>
            <button
              onClick={() => {
                setSelectedCategory("Todos");
                setSearchQuery("");
              }}
              className="neo-btn-primary px-4 py-2 font-mono text-xs font-bold uppercase"
            >
              Limpar Filtros
            </button>
          </div>
        )}
      </div>
    </section>
  );
}
