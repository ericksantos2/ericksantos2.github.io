"use client";

import React, { useState } from "react";
import { Mail, Copy, Check, ArrowUpRight, MessageSquare } from "lucide-react";
import { GithubIcon, LinkedinIcon } from "./Icons";

export function ContactSection() {
  const [copied, setCopied] = useState(false);
  const email = "erick.contato@exemplo.com";

  const handleCopy = () => {
    navigator.clipboard.writeText(email);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <section id="contato" className="py-16 md:py-24 border-b-2 border-black dark:border-white bg-grid-pattern">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="neo-card p-8 md:p-12 max-w-4xl mx-auto">
          {/* Header */}
          <div className="border-b-2 border-black dark:border-white pb-6 mb-8 text-center md:text-left">
            <div className="inline-block px-2.5 py-0.5 mb-2 font-mono text-xs font-bold uppercase bg-neutral-200 dark:bg-neutral-800 border border-black dark:border-white">
              // 04. CONEXÃO DIRETA
            </div>
            <h2 className="text-3xl sm:text-5xl md:text-6xl font-black uppercase tracking-tight">
              VAMOS TRABALHAR JUNTOS?
            </h2>
            <p className="mt-3 text-sm sm:text-base font-mono text-neutral-600 dark:text-neutral-400 max-w-2xl">
              Estou sempre aberto a novos projetos desafiadores, parcerias técnicas ou oportunidades full-time.
              Fale comigo diretamente por qualquer um dos canais abaixo.
            </p>
          </div>

          {/* Email Box */}
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
                className="neo-btn-primary flex-1 sm:flex-initial px-4 py-2 font-mono text-xs font-bold uppercase flex items-center justify-center gap-1.5"
              >
                <span>Enviar</span>
                <ArrowUpRight className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Social Links */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <a
              href="https://github.com"
              target="_blank"
              rel="noreferrer"
              className="neo-card p-4 flex items-center justify-between group hover:-translate-x-0.5 hover:-translate-y-0.5 transition-all"
            >
              <div className="flex items-center gap-2 font-mono text-xs font-bold uppercase">
                <GithubIcon className="w-4 h-4" />
                <span>GitHub</span>
              </div>
              <ArrowUpRight className="w-4 h-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
            </a>

            <a
              href="https://linkedin.com"
              target="_blank"
              rel="noreferrer"
              className="neo-card p-4 flex items-center justify-between group hover:-translate-x-0.5 hover:-translate-y-0.5 transition-all"
            >
              <div className="flex items-center gap-2 font-mono text-xs font-bold uppercase">
                <LinkedinIcon className="w-4 h-4" />
                <span>LinkedIn</span>
              </div>
              <ArrowUpRight className="w-4 h-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
            </a>

            <a
              href="https://wa.me/"
              target="_blank"
              rel="noreferrer"
              className="neo-card p-4 flex items-center justify-between group hover:-translate-x-0.5 hover:-translate-y-0.5 transition-all"
            >
              <div className="flex items-center gap-2 font-mono text-xs font-bold uppercase">
                <MessageSquare className="w-4 h-4" />
                <span>WhatsApp</span>
              </div>
              <ArrowUpRight className="w-4 h-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
