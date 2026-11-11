import React from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getProjects, getProjectBySlug } from "@/lib/notion";
import { MarkdownContent } from "@/components/MarkdownContent";
import { GithubIcon } from "@/components/Icons";
import {
  ArrowLeft,
  ArrowUpRight,
  ArrowDown,
  Play,
  Calendar,
  UserCheck,
  CheckCircle2,
  Clock,
  PauseCircle,
  Layers,
  Sparkles,
  FileText,
} from "lucide-react";

interface ProjectDetailPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  const { projects } = await getProjects();
  return projects.map((p) => ({
    slug: p.slug,
  }));
}

/**
 * Helper para extrair o ID de vídeos do YouTube a partir de várias formas de URL
 */
function getYouTubeVideoId(url?: string): string | null {
  if (!url) return null;
  const match = url.match(
    /(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=))([\w-]{11})/
  );
  return match ? match[1] : null;
}

/**
 * Badge estilizado para o Status do Projeto (Concluído, Em Andamento, Parado)
 */
function StatusBadge({ status }: { status: string }) {
  const norm = status?.toLowerCase().trim() || "";

  if (norm.includes("conclui") || norm.includes("concluí")) {
    return (
      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 border border-black dark:border-white bg-green-50 dark:bg-green-950/40 text-black dark:text-white font-mono text-xs font-bold uppercase">
        <CheckCircle2 className="w-3.5 h-3.5 text-green-600 dark:text-green-400 shrink-0" />
        <span>Concluído</span>
      </span>
    );
  }

  if (norm.includes("andamento") || norm.includes("progresso")) {
    return (
      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 border border-black dark:border-white bg-blue-50 dark:bg-blue-950/40 text-black dark:text-white font-mono text-xs font-bold uppercase">
        <Clock className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400 animate-pulse shrink-0" />
        <span>Em Andamento</span>
      </span>
    );
  }

  if (norm.includes("parado") || norm.includes("pausa")) {
    return (
      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 border border-black dark:border-white bg-amber-50 dark:bg-amber-950/40 text-black dark:text-white font-mono text-xs font-bold uppercase">
        <PauseCircle className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400 shrink-0" />
        <span>Parado</span>
      </span>
    );
  }

  return (
    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 border border-black dark:border-white bg-neutral-100 dark:bg-neutral-800 text-black dark:text-white font-mono text-xs font-bold uppercase">
      <span className="w-2 h-2 rounded-full bg-neutral-500 shrink-0" />
      <span>{status || "Concluído"}</span>
    </span>
  );
}

export default async function ProjectDetailPage({ params }: ProjectDetailPageProps) {
  const { slug } = await params;
  const project = await getProjectBySlug(slug);

  if (!project) {
    notFound();
  }

  const youtubeId = getYouTubeVideoId(project.showcaseUrl);

  return (
    <main className="min-h-screen bg-neutral-50 dark:bg-neutral-950 text-black dark:text-white transition-colors duration-200">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-10 md:py-16">
        {/* Botão de retorno */}
        <div className="mb-8">
          <Link
            href="/#projetos"
            className="neo-btn inline-flex items-center gap-2 px-4 py-2 font-mono text-xs font-bold uppercase hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>← Voltar para o Portfólio</span>
          </Link>
        </div>

        {/* Hero Card do Projeto */}
        <header className="neo-card p-6 sm:p-8 md:p-10 mb-10 bg-white dark:bg-neutral-900">
          {/* Barra superior de status & metadados */}
          <div className="flex flex-wrap items-center justify-between gap-3 border-b-2 border-black dark:border-white pb-4 mb-6">
            <div className="flex items-center gap-2">
              <span className="font-mono text-xs font-black px-2.5 py-1 bg-black text-white dark:bg-white dark:text-black uppercase">
                {project.category}
              </span>
              {project.featured && (
                <span className="font-mono text-xs font-bold px-2 py-0.5 bg-yellow-300 text-black border border-black inline-flex items-center gap-1">
                  <Sparkles className="w-3 h-3" /> DESTAQUE
                </span>
              )}
            </div>

            <div className="flex flex-wrap items-center gap-4 font-mono text-xs font-bold text-neutral-600 dark:text-neutral-400">
              <span className="inline-flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5" />
                {project.year}
              </span>
              <span>•</span>
              <span className="inline-flex items-center gap-1.5">
                <UserCheck className="w-3.5 h-3.5" />
                {project.role}
              </span>
              <span>•</span>
              <StatusBadge status={project.status} />
            </div>
          </div>

          {/* Título Principal */}
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-black uppercase tracking-tight mb-4">
            {project.title}
          </h1>

          {/* Descrição Simples em Destaque */}
          <div className="p-4 mb-8 border-2 border-black dark:border-white bg-neutral-100 dark:bg-neutral-800 font-mono text-sm md:text-base leading-relaxed text-neutral-800 dark:text-neutral-200">
            <span className="font-bold text-black dark:text-white block mb-1 uppercase text-xs">
              // Resumo do Projeto:
            </span>
            {project.description}
          </div>

          {/* Barra de Ações Rápidas (Links e Atalhos de Scroll) */}
          <div className="flex flex-wrap items-center gap-3 pt-2">
            {project.githubUrl && (
              <a
                href={project.githubUrl}
                target="_blank"
                rel="noreferrer"
                className="neo-btn inline-flex items-center gap-2 px-4 py-2 font-mono text-xs font-bold uppercase hover:bg-neutral-100 dark:hover:bg-neutral-800"
              >
                <GithubIcon className="w-4 h-4" />
                <span>Ver Código no GitHub</span>
              </a>
            )}

            {project.liveUrl && (
              <a
                href={project.liveUrl}
                target="_blank"
                rel="noreferrer"
                className="neo-btn-primary inline-flex items-center gap-2 px-4 py-2 font-mono text-xs font-bold uppercase"
              >
                <span>Acessar Demo Online</span>
                <ArrowUpRight className="w-4 h-4" />
              </a>
            )}

            {project.showcaseUrl && (
              <a
                href="#video-showcase"
                className="neo-btn inline-flex items-center gap-2 px-4 py-2 font-mono text-xs font-bold uppercase hover:bg-neutral-100 dark:hover:bg-neutral-800"
              >
                <Play className="w-4 h-4 fill-current text-red-600 dark:text-red-400" />
                <span>Vídeo Showcase</span>
                <ArrowDown className="w-3.5 h-3.5" />
              </a>
            )}

            {/* Botão de Scroll para as Stacks */}
            <a
              href="#stacks"
              className="neo-btn inline-flex items-center gap-2 px-4 py-2 font-mono text-xs font-bold uppercase hover:bg-neutral-100 dark:hover:bg-neutral-800"
            >
              <Layers className="w-4 h-4" />
              <span>Ver Stacks</span>
              <ArrowDown className="w-3.5 h-3.5" />
            </a>

            {/* Botão de Scroll para os Detalhes */}
            <a
              href="#detalhes"
              className="neo-btn inline-flex items-center gap-2 px-4 py-2 font-mono text-xs font-bold uppercase hover:bg-neutral-100 dark:hover:bg-neutral-800"
            >
              <FileText className="w-4 h-4" />
              <span>Detalhes do Projeto</span>
              <ArrowDown className="w-3.5 h-3.5" />
            </a>
          </div>
        </header>

        {/* Vídeo Embed do YouTube se houver */}
        {youtubeId && (
          <section id="video-showcase" className="mb-10 scroll-mt-24">
            <div className="inline-block px-2.5 py-0.5 mb-3 font-mono text-xs font-bold uppercase bg-neutral-200 dark:bg-neutral-800 border border-black dark:border-white">
              // VÍDEO DE APRESENTAÇÃO
            </div>
            <div className="aspect-video w-full border-2 border-black dark:border-white neo-shadow overflow-hidden bg-black">
              <iframe
                src={`https://www.youtube-nocookie.com/embed/${youtubeId}?rel=0`}
                title={`Showcase: ${project.title}`}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                className="w-full h-full border-0"
              />
            </div>
          </section>
        )}

        {/* Stacks e Tecnologias */}
        <section id="stacks" className="neo-card p-6 sm:p-8 mb-10 bg-white dark:bg-neutral-900 scroll-mt-24">
          <div className="flex items-center gap-2 mb-4 border-b-2 border-black dark:border-white pb-3">
            <Layers className="w-4 h-4" />
            <h2 className="font-mono text-sm font-bold uppercase tracking-wider">
              STACK TECNOLÓGICA & FERRAMENTAS ({project.tags.length})
            </h2>
          </div>
          <div className="flex flex-wrap gap-2">
            {project.tags.map((tag) => (
              <span
                key={tag}
                className="px-3 py-1 font-mono text-xs font-bold uppercase bg-neutral-100 dark:bg-neutral-800 border-2 border-black dark:border-white neo-shadow-sm hover:-translate-y-0.5 transition-transform"
              >
                {tag}
              </span>
            ))}
          </div>
        </section>

        {/* Conteúdo Completo (Corpo da Página do Notion) */}
        <section id="detalhes" className="neo-card p-6 sm:p-8 md:p-10 mb-10 bg-white dark:bg-neutral-900 scroll-mt-24">
          <div className="border-b-2 border-black dark:border-white pb-3 mb-6">
            <div className="font-mono text-xs text-neutral-500 uppercase tracking-widest mb-1">
              // NOTION.PAGE_BODY
            </div>
            <h2 className="text-2xl font-black uppercase tracking-tight">
              DESCRIÇÃO COMPLETA & DETALHES
            </h2>
          </div>

          <div className="prose-neo">
            {project.fullDescription ? (
              <MarkdownContent content={project.fullDescription} />
            ) : (
              <p className="font-mono text-sm text-neutral-500 italic">
                Nenhum detalhe adicional documentado no corpo da página do Notion.
              </p>
            )}
          </div>
        </section>

        {/* Rodapé da Página do Projeto */}
        <div className="pt-8 border-t-2 border-black dark:border-white flex flex-col sm:flex-row items-center justify-between gap-4">
          <Link
            href="/#projetos"
            className="neo-btn inline-flex items-center gap-2 px-5 py-2.5 font-mono text-xs font-bold uppercase hover:bg-neutral-100 dark:hover:bg-neutral-800"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Ver Outros Projetos</span>
          </Link>

          <Link
            href="/#contato"
            className="neo-btn-primary inline-flex items-center gap-2 px-5 py-2.5 font-mono text-xs font-bold uppercase"
          >
            <span>Entrar em Contato</span>
            <ArrowUpRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </main>
  );
}
