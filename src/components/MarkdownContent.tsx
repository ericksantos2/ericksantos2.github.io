"use client";

import React from "react";

interface MarkdownContentProps {
  content: string;
}

export function MarkdownContent({ content }: MarkdownContentProps) {
  if (!content) return null;

  // Quebra em linhas e processa blocos simples de Markdown
  const lines = content.split("\n");
  const elements: React.ReactNode[] = [];
  let inCodeBlock = false;
  let codeBuffer: string[] = [];
  let codeLang = "";
  let listBuffer: string[] = [];
  let isNumberedList = false;

  const flushList = (key: string) => {
    if (listBuffer.length === 0) return;
    if (isNumberedList) {
      elements.push(
        <ol key={key} className="list-decimal list-inside space-y-2 my-4 font-mono text-sm leading-relaxed pl-2">
          {listBuffer.map((item, idx) => (
            <li key={idx} className="text-neutral-800 dark:text-neutral-200">
              {renderInline(item)}
            </li>
          ))}
        </ol>
      );
    } else {
      elements.push(
        <ul key={key} className="space-y-2 my-4 font-mono text-sm leading-relaxed">
          {listBuffer.map((item, idx) => (
            <li key={idx} className="flex items-start gap-2 text-neutral-800 dark:text-neutral-200">
              <span className="font-bold select-none text-black dark:text-white">▪</span>
              <span>{renderInline(item)}</span>
            </li>
          ))}
        </ul>
      );
    }
    listBuffer = [];
  };

  const flushCode = (key: string) => {
    if (!inCodeBlock) return;
    elements.push(
      <div key={key} className="my-5 border-2 border-black dark:border-white bg-neutral-900 text-neutral-100 neo-shadow overflow-hidden">
        {codeLang && (
          <div className="px-4 py-1.5 border-b-2 border-black dark:border-white bg-neutral-800 font-mono text-xs font-bold uppercase tracking-wider text-neutral-300">
            // {codeLang}
          </div>
        )}
        <pre className="p-4 overflow-x-auto font-mono text-xs md:text-sm leading-relaxed">
          <code>{codeBuffer.join("\n")}</code>
        </pre>
      </div>
    );
    codeBuffer = [];
    inCodeBlock = false;
    codeLang = "";
  };

  for (let i = 0; i < lines.length; i++) {
    const rawLine = lines[i];
    const trimmed = rawLine.trim();

    // Início ou fim de bloco de código
    if (trimmed.startsWith("```")) {
      if (inCodeBlock) {
        flushCode(`code-${i}`);
      } else {
        flushList(`list-before-code-${i}`);
        inCodeBlock = true;
        codeLang = trimmed.replace(/^```/, "").trim();
      }
      continue;
    }

    if (inCodeBlock) {
      codeBuffer.push(rawLine);
      continue;
    }

    // Linha vazia
    if (!trimmed) {
      flushList(`list-empty-${i}`);
      continue;
    }

    // Heading 1
    if (trimmed.startsWith("# ")) {
      flushList(`list-h1-${i}`);
      elements.push(
        <h2 key={`h1-${i}`} className="text-2xl sm:text-3xl font-black uppercase tracking-tight mt-8 mb-4 border-b-2 border-black dark:border-white pb-2">
          {renderInline(trimmed.replace(/^#\s+/, ""))}
        </h2>
      );
      continue;
    }

    // Heading 2
    if (trimmed.startsWith("## ")) {
      flushList(`list-h2-${i}`);
      elements.push(
        <h3 key={`h2-${i}`} className="text-xl sm:text-2xl font-black uppercase tracking-tight mt-6 mb-3">
          {renderInline(trimmed.replace(/^##\s+/, ""))}
        </h3>
      );
      continue;
    }

    // Heading 3
    if (trimmed.startsWith("### ")) {
      flushList(`list-h3-${i}`);
      elements.push(
        <h4 key={`h3-${i}`} className="text-lg font-bold uppercase tracking-wide mt-5 mb-2 font-mono">
          {renderInline(trimmed.replace(/^###\s+/, ""))}
        </h4>
      );
      continue;
    }

    // Citações (Blockquote)
    if (trimmed.startsWith("> ")) {
      flushList(`list-quote-${i}`);
      elements.push(
        <blockquote key={`quote-${i}`} className="p-4 my-4 border-l-4 border-black dark:border-white bg-neutral-100 dark:bg-neutral-800 font-mono text-sm italic">
          {renderInline(trimmed.replace(/^>\s+/, ""))}
        </blockquote>
      );
      continue;
    }

    // Lista não-ordenada
    if (trimmed.startsWith("- ") || trimmed.startsWith("* ")) {
      isNumberedList = false;
      listBuffer.push(trimmed.replace(/^[-*]\s+/, ""));
      continue;
    }

    // Lista ordenada (1. )
    const numberedMatch = trimmed.match(/^\d+\.\s+(.*)$/);
    if (numberedMatch) {
      isNumberedList = true;
      listBuffer.push(numberedMatch[1]);
      continue;
    }

    // Se é texto normal, limpa listas pendentes
    flushList(`list-p-${i}`);

    // Divisores
    if (trimmed === "---") {
      elements.push(<hr key={`hr-${i}`} className="border-t-2 border-black dark:border-white my-6" />);
      continue;
    }

    // Parágrafo regular
    elements.push(
      <p key={`p-${i}`} className="font-mono text-sm sm:text-base leading-relaxed text-neutral-700 dark:text-neutral-300 my-3">
        {renderInline(trimmed)}
      </p>
    );
  }

  flushList("list-end");
  flushCode("code-end");

  return <div className="markdown-body space-y-2">{elements}</div>;
}

/**
 * Renderizador inline para negrito, itálico, código e links
 */
export function renderInline(text: string): React.ReactNode {
  // Regex para links [texto](url)
  const linkRegex = /\[([^\]]+)\]\(([^)]+)\)/g;
  const parts: React.ReactNode[] = [];
  let lastIndex = 0;
  let match: RegExpExecArray | null;

  while ((match = linkRegex.exec(text)) !== null) {
    if (match.index > lastIndex) {
      parts.push(parseFormatting(text.slice(lastIndex, match.index), `txt-${lastIndex}`));
    }
    const linkText = match[1];
    const linkUrl = match[2];
    parts.push(
      <a
        key={`link-${match.index}`}
        href={linkUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="font-bold underline underline-offset-2 hover:bg-black hover:text-white dark:hover:bg-white dark:hover:text-black px-1 transition-colors"
      >
        {linkText}
      </a>
    );
    lastIndex = match.index + match[0].length;
  }

  if (lastIndex < text.length) {
    parts.push(parseFormatting(text.slice(lastIndex), `txt-${lastIndex}`));
  }

  return parts;
}

function parseFormatting(text: string, keyPrefix: string): React.ReactNode {
  // Bold **texto**
  const boldParts = text.split(/(\*\*[^*]+\*\*)/g);
  return boldParts.map((bPart, bIdx) => {
    if (bPart.startsWith("**") && bPart.endsWith("**")) {
      return (
        <strong key={`${keyPrefix}-b-${bIdx}`} className="font-black text-black dark:text-white">
          {bPart.slice(2, -2)}
        </strong>
      );
    }

    // Inline code `código`
    const codeParts = bPart.split(/(`[^`]+`)/g);
    return codeParts.map((cPart, cIdx) => {
      if (cPart.startsWith("`") && cPart.endsWith("`")) {
        return (
          <code
            key={`${keyPrefix}-c-${cIdx}`}
            className="px-1.5 py-0.5 text-xs font-mono font-bold bg-neutral-200 dark:bg-neutral-800 border border-black dark:border-white"
          >
            {cPart.slice(1, -1)}
          </code>
        );
      }

      // Italic *texto*
      const itParts = cPart.split(/(\*[^*]+\*)/g);
      return itParts.map((iPart, iIdx) => {
        if (iPart.startsWith("*") && iPart.endsWith("*")) {
          return (
            <em key={`${keyPrefix}-i-${iIdx}`} className="italic">
              {iPart.slice(1, -1)}
            </em>
          );
        }
        return iPart;
      });
    });
  });
}
