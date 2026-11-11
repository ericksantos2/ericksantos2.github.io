"use client";

import React, { useState } from "react";
import { Mail, Copy, Check, ArrowUpRight, MessageSquare, Globe } from "lucide-react";
import { GithubIcon, LinkedinIcon } from "./Icons";
import { ContactData } from "@/types/project";
import { renderInline } from "./MarkdownContent";

interface ContactSectionProps {
  contactData?: ContactData;
}

export function ContactSection({ contactData }: ContactSectionProps) {
  const [copied, setCopied] = useState(false);
  const email = contactData?.email || "ericksgbarros@gmail.com";
  const title = contactData?.title || "VAMOS TRABALHAR JUNTOS?";
  const description =
    contactData?.description ||
    "Estou sempre aberto a novos projetos desafiadores, parcerias técnicas ou oportunidades full-time. Fale comigo diretamente por qualquer um dos canais abaixo.";
  const links = contactData?.links && contactData.links.length > 0
    ? contactData.links
    : [
        {
          id: "github",
          name: "GitHub",
          url: "https://github.com/ericksantos2",
          type: "card",
        },
        {
          id: "linkedin",
          name: "LinkedIn",
          url: "https://www.linkedin.com/in/ericksantos2/",
          type: "card",
        },
      ];

  const handleCopy = () => {
    navigator.clipboard.writeText(email);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const getIconForLink = (name: string) => {
    const n = name.toLowerCase();
    if (n.includes("github")) return <GithubIcon className="w-4 h-4" />;
    if (n.includes("linkedin")) return <LinkedinIcon className="w-4 h-4" />;
    if (n.includes("whats") || n.includes("zap")) return <MessageSquare className="w-4 h-4" />;
    return <Globe className="w-4 h-4" />;
  };

  return (
    <section id="contato" className="py-16 md:py-24 border-b-2 border-black dark:border-white bg-grid-pattern">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="neo-card p-8 md:p-12 max-w-4xl mx-auto">
          {/* Header */}
          <div className="border-b-2 border-black dark:border-white pb-6 mb-8 text-center md:text-left">
            <div className="inline-block w-fit px-2.5 py-0.5 mb-2 font-mono text-xs font-bold uppercase bg-[#D4FF00] text-black border border-black shadow-[2px_2px_0px_#000]">
              // 04. CONEXÃO DIRETA
            </div>
            <h2 className="text-3xl sm:text-5xl md:text-6xl font-black uppercase tracking-tight">
              {title}
            </h2>
            <p className="mt-3 text-sm sm:text-base font-mono text-neutral-600 dark:text-neutral-400 max-w-2xl">
              {renderInline(description)}
            </p>
          </div>

          {/* Email Box (Card Primário) */}
          <div className="p-4 md:p-6 border-2 border-black dark:border-white bg-neutral-100 dark:bg-neutral-900 mb-8 neo-shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="p-2.5 bg-black text-white dark:bg-white dark:text-black">
                <Mail className="w-5 h-5" />
              </div>
              <div>
                <div className="font-mono text-[11px] font-bold uppercase text-neutral-500">
                  EMAIL PRINCIPAL
                </div>
                <div className="font-mono text-sm sm:text-base font-bold break-all">
                  {email}
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2 w-full sm:w-auto">
              <button
                onClick={handleCopy}
                className="neo-btn flex-1 sm:flex-initial px-4 py-2 font-mono text-xs font-bold uppercase flex items-center justify-center gap-1.5 hover:bg-neutral-200 dark:hover:bg-neutral-800"
              >
                {copied ? <Check className="w-4 h-4 text-green-500" /> : <Copy className="w-4 h-4" />}
                <span>{copied ? "Copiado!" : "Copiar"}</span>
              </button>

              <a
                href={`mailto:${email}`}
                className="flex-1 sm:flex-initial px-4 py-2 font-mono text-xs font-bold uppercase flex items-center justify-center gap-1.5 bg-[#D4FF00] text-black border-2 border-black shadow-[3px_3px_0px_#000] hover:-translate-x-0.5 hover:-translate-y-0.5 hover:shadow-[5px_5px_0px_#000] transition-all"
              >
                <span>Enviar</span>
                <ArrowUpRight className="w-4 h-4 stroke-[2.5]" />
              </a>
            </div>
          </div>

          {/* Social Links Cards (Dinâmicos da Tabela Contato) */}
          <div
            className={`grid grid-cols-1 gap-4 ${
              links.length === 2 ? "sm:grid-cols-2" : "sm:grid-cols-2 md:grid-cols-3"
            }`}
          >
            {links.map((link) => (
              <a
                key={link.id}
                href={link.url}
                target="_blank"
                rel="noreferrer"
                className="neo-card p-4 flex items-center justify-between group hover:-translate-x-0.5 hover:-translate-y-0.5 transition-all dark:hover:border-[#D4FF00]"
              >
                <div className="flex items-center gap-2 font-mono text-xs font-bold uppercase">
                  {getIconForLink(link.name)}
                  <span>{link.name}</span>
                </div>
                <ArrowUpRight className="w-4 h-4 text-black dark:text-white group-hover:text-black dark:group-hover:text-[#D4FF00] group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all" />
              </a>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
