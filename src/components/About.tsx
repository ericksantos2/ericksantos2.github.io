"use client";

import React from "react";
import { CheckCircle2, UserCheck, Briefcase, GraduationCap } from "lucide-react";
import { renderInline } from "./MarkdownContent";
import { Experience, Education } from "@/types/project";

interface AboutProps {
  aboutParagraphs?: string[];
  principles?: string[];
  experiences?: Experience[];
  education?: Education[];
}

export function About({ aboutParagraphs, principles, experiences, education }: AboutProps) {
  const hasExperiences = Boolean(experiences && experiences.length > 0);
  const hasEducation = Boolean(education && education.length > 0);
  const hasRightColumn = hasExperiences || hasEducation;

  return (
    <section id="sobre" className="py-16 md:py-24 border-b-2 border-black dark:border-white">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        {/* Section Header */}
        <div className="mb-10">
          <div className="inline-block px-2.5 py-0.5 mb-2 font-mono text-xs font-bold uppercase bg-neutral-200 dark:bg-neutral-800 border border-black dark:border-white">
            // 03. BIO & FILOSOFIA
          </div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-black uppercase tracking-tight">
            SOBRE MIM
          </h2>
        </div>

        <div
          className={`grid grid-cols-1 ${
            hasRightColumn ? "lg:grid-cols-12 gap-8 lg:gap-10 items-start" : "max-w-4xl mx-auto gap-8"
          }`}
        >
          {/* Left Column: Manifesto / Bio */}
          <div className={`${hasRightColumn ? "lg:col-span-6" : "w-full"} space-y-6`}>

            <div className="neo-card p-6 space-y-4 text-sm font-mono leading-relaxed">
              <div className="flex items-center gap-2 font-bold text-base border-b-2 border-black dark:border-white pb-3">
                <UserCheck className="w-5 h-5" />
                <span>ERICK // DEVELOPER</span>
              </div>

              {aboutParagraphs && aboutParagraphs.length > 0 ? (
                aboutParagraphs.map((p, idx) => (
                  <p key={idx} className="text-neutral-700 dark:text-neutral-300">
                    {renderInline(p)}
                  </p>
                ))
              ) : (
                <>
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
                </>
              )}
            </div>

            {/* Principles */}
            <div className="neo-card p-6 space-y-3">
              <div className="font-mono text-xs font-black uppercase text-neutral-500 tracking-wider">
                // PRINCÍPIOS FUNDAMENTAIS
              </div>
              <ul className="space-y-2 font-mono text-xs">
                {principles && principles.length > 0 ? (
                  principles.map((item, idx) => (
                    <li key={idx} className="flex items-start gap-2">
                      <CheckCircle2 className="w-4 h-4 shrink-0 mt-0.5 text-black dark:text-white" />
                      <span>{renderInline(item)}</span>
                    </li>
                  ))
                ) : (
                  <>
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
                  </>
                )}
              </ul>
            </div>
          </div>

          {/* Right Column: Trajetória & Educação */}
          {hasRightColumn && (
            <div className="lg:col-span-6 space-y-6">
              {/* Experiências (se houver) */}
              {hasExperiences && (
                <div>
                  <div className="flex items-center gap-2 mb-6 font-mono text-sm font-bold uppercase">
                    <Briefcase className="w-4 h-4" />
                    <span>TRAJETÓRIA & EXPERIÊNCIA</span>
                  </div>

                  <div className="space-y-4">
                    {experiences!.map((exp) => (
                      <div
                        key={exp.id}
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

                        {exp.description && (
                          <p className="font-mono text-xs text-neutral-700 dark:text-neutral-300 leading-relaxed">
                            {renderInline(exp.description)}
                          </p>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Formação Acadêmica & Cursos */}
              {hasEducation && (
                <div>
                  <div className="flex items-center gap-2 mb-6 font-mono text-sm font-bold uppercase">
                    <GraduationCap className="w-4 h-4" />
                    <span>FORMAÇÃO ACADÊMICA & CURSOS</span>
                  </div>

                  <div className="space-y-4">
                    {education!.map((edu) => (
                      <div
                        key={edu.id}
                        className="neo-card p-6 hover:-translate-x-1 hover:-translate-y-1 transition-all"
                      >
                        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3 border-b border-neutral-300 dark:border-neutral-700 pb-3 mb-3">
                          <div className="space-y-1.5">
                            {edu.type && (
                              <div>
                                <span className="inline-block font-mono text-[10px] font-bold px-2 py-0.5 bg-black text-white dark:bg-white dark:text-black uppercase">
                                  {edu.type}
                                </span>
                              </div>
                            )}
                            <h3 className="font-mono font-black text-base uppercase leading-snug">
                              {edu.course}
                            </h3>
                          </div>

                          {edu.period && (
                            <span className="font-mono text-xs font-bold px-2 py-0.5 bg-neutral-200 dark:bg-neutral-800 border border-black dark:border-white shrink-0 self-start">
                              {edu.period}
                            </span>
                          )}
                        </div>

                        <div className="font-mono text-xs font-bold text-neutral-600 dark:text-neutral-400 mb-1">
                          @ {edu.institution}
                        </div>

                        {edu.description && (
                          <p className="font-mono text-xs text-neutral-700 dark:text-neutral-300 leading-relaxed mt-2">
                            {renderInline(edu.description)}
                          </p>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
