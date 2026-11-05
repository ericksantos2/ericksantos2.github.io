"use client";

import React, { useState } from "react";
import { X, Copy, Check, Database, Key, Share2, Terminal } from "lucide-react";

interface NotionModalGuideProps {
  isOpen: boolean;
  onClose: () => void;
}

export function NotionModalGuide({ isOpen, onClose }: NotionModalGuideProps) {
  const [copiedKey, setCopiedKey] = useState(false);

  if (!isOpen) return null;

  const copyEnvSample = () => {
    navigator.clipboard.writeText(`NOTION_API_KEY=ntn_seu_token_secreto_aqui\nNOTION_DATABASE_ID=seu_database_id_aqui`);
    setCopiedKey(true);
    setTimeout(() => setCopiedKey(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-xs">
      <div className="relative w-full max-w-3xl max-h-[90vh] overflow-y-auto neo-card p-6 md:p-8 bg-white dark:bg-neutral-900">
        {/* Header */}
        <div className="flex items-start justify-between border-b-2 border-black dark:border-white pb-4 mb-6">
          <div>
            <div className="inline-block px-2 py-0.5 mb-2 font-mono text-xs font-bold uppercase bg-neutral-200 dark:bg-neutral-800 border border-black dark:border-white">
              GUIA DE CONFIGURAÇÃO // BACKEND
            </div>
            <h2 className="text-2xl md:text-3xl font-black uppercase tracking-tight">
              Como Conectar ao Notion
            </h2>
          </div>
          <button
            onClick={onClose}
            className="neo-btn p-2 hover:bg-neutral-200 dark:hover:bg-neutral-800"
            aria-label="Fechar"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Steps */}
        <div className="space-y-6 text-sm">
          {/* Passo 1 */}
          <div className="p-4 border-2 border-black dark:border-white bg-neutral-50 dark:bg-neutral-800/50 neo-shadow-sm">
            <div className="flex items-center gap-2 font-mono font-bold text-base mb-2">
              <Key className="w-5 h-5" />
              <span>PASSO 1: Criar a Integração no Notion</span>
            </div>
            <p className="text-neutral-700 dark:text-neutral-300 mb-2">
              Acesse o painel oficial de desenvolvedores do Notion:
            </p>
            <a
              href="https://www.notion.so/my-integrations"
              target="_blank"
              rel="noreferrer"
              className="inline-block px-3 py-1 font-mono text-xs font-bold underline bg-neutral-200 dark:bg-neutral-700 hover:bg-neutral-300 dark:hover:bg-neutral-600 mb-2"
            >
              notion.so/my-integrations ↗
            </a>
            <ul className="list-disc list-inside space-y-1 text-neutral-600 dark:text-neutral-400">
              <li>Clique em <strong>+ New integration</strong> (Nova integração).</li>
              <li>Dê um nome (ex: <code>Portfolio CMS</code>) e selecione o seu Workspace.</li>
              <li>Em Capabilities, deixe permissão de <strong>Read content</strong> (Leitura).</li>
              <li>Copie o <strong>Internal Integration Secret</strong> (começa com <code>ntn_...</code> ou <code>secret_...</code>).</li>
            </ul>
          </div>

          {/* Passo 2 */}
          <div className="p-4 border-2 border-black dark:border-white bg-neutral-50 dark:bg-neutral-800/50 neo-shadow-sm">
            <div className="flex items-center gap-2 font-mono font-bold text-base mb-2">
              <Database className="w-5 h-5" />
              <span>PASSO 2: Criar a Tabela (Database) no Notion</span>
            </div>
            <p className="text-neutral-700 dark:text-neutral-300 mb-3">
              No seu Notion, crie uma página com uma visualização de <strong>Tabela (Table view)</strong> com as seguintes colunas exatas:
            </p>
            <div className="overflow-x-auto border border-black dark:border-white">
              <table className="w-full text-left text-xs font-mono">
                <thead className="bg-neutral-200 dark:bg-neutral-800 border-b border-black dark:border-white">
                  <tr>
                    <th className="p-2">Nome da Coluna</th>
                    <th className="p-2">Tipo no Notion</th>
                    <th className="p-2">Exemplo de Valor</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-neutral-300 dark:divide-neutral-700">
                  <tr>
                    <td className="p-2 font-bold">Title (ou Nome)</td>
                    <td className="p-2">Title</td>
                    <td className="p-2">Minimalist Task OS</td>
                  </tr>
                  <tr>
                    <td className="p-2 font-bold">Description</td>
                    <td className="p-2">Text (Rich Text)</td>
                    <td className="p-2">App de produtividade local-first...</td>
                  </tr>
                  <tr>
                    <td className="p-2 font-bold">Category</td>
                    <td className="p-2">Select</td>
                    <td className="p-2">Full-Stack, Frontend, Backend, etc.</td>
                  </tr>
                  <tr>
                    <td className="p-2 font-bold">Tags</td>
                    <td className="p-2">Multi-select</td>
                    <td className="p-2">Next.js, TypeScript, Tailwind</td>
                  </tr>
                  <tr>
                    <td className="p-2 font-bold">Featured</td>
                    <td className="p-2">Checkbox</td>
                    <td className="p-2">Marcado [✓]</td>
                  </tr>
                  <tr>
                    <td className="p-2 font-bold">Year</td>
                    <td className="p-2">Text ou Number</td>
                    <td className="p-2">2026</td>
                  </tr>
                  <tr>
                    <td className="p-2 font-bold">Role</td>
                    <td className="p-2">Text</td>
                    <td className="p-2">Lead Developer</td>
                  </tr>
                  <tr>
                    <td className="p-2 font-bold">GitHub</td>
                    <td className="p-2">URL</td>
                    <td className="p-2">https://github.com/usuario/repo</td>
                  </tr>
                  <tr>
                    <td className="p-2 font-bold">LiveUrl</td>
                    <td className="p-2">URL</td>
                    <td className="p-2">https://demo.vercel.app</td>
                  </tr>
                  <tr>
                    <td className="p-2 font-bold">Status</td>
                    <td className="p-2">Select ou Status</td>
                    <td className="p-2">Concluído, Em Progresso</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          {/* Passo 3 */}
          <div className="p-4 border-2 border-black dark:border-white bg-neutral-50 dark:bg-neutral-800/50 neo-shadow-sm">
            <div className="flex items-center gap-2 font-mono font-bold text-base mb-2">
              <Share2 className="w-5 h-5" />
              <span>PASSO 3: Conectar a Integração à Base de Dados</span>
            </div>
            <ul className="list-disc list-inside space-y-1 text-neutral-600 dark:text-neutral-400">
              <li>Abra a sua base de dados no Notion.</li>
              <li>No canto superior direito, clique nos três pontinhos <strong>(...)</strong>.</li>
              <li>Role até <strong>Conexões (Connections)</strong> ou <strong>Connect to</strong>.</li>
              <li>Pesquise pelo nome da integração que você criou no Passo 1 e confirme o acesso.</li>
              <li>
                Copie o link da tabela. A URL tem o formato:
                <br />
                <code className="text-xs break-all bg-neutral-200 dark:bg-neutral-700 px-1 py-0.5 mt-1 inline-block">
                  https://www.notion.so/workspace/<strong>a8aec43384f447ed84390e8e42c2e089</strong>?v=...
                </code>
                <br />
                O código de 32 caracteres antes do <code>?v=</code> é o seu <strong>DATABASE_ID</strong>!
              </li>
            </ul>
          </div>

          {/* Passo 4 */}
          <div className="p-4 border-2 border-black dark:border-white bg-neutral-50 dark:bg-neutral-800/50 neo-shadow-sm">
            <div className="flex items-center gap-2 font-mono font-bold text-base mb-2">
              <Terminal className="w-5 h-5" />
              <span>PASSO 4: Configurar .env.local e Sincronizar</span>
            </div>
            <p className="text-neutral-700 dark:text-neutral-300 mb-2">
              Crie o arquivo <code>.env.local</code> na raiz deste projeto com:
            </p>
            <div className="relative font-mono text-xs bg-black text-white p-3 border border-neutral-700 mb-3">
              <pre>{`NOTION_API_KEY=ntn_seu_token_secreto_aqui\nNOTION_DATABASE_ID=seu_database_id_aqui`}</pre>
              <button
                onClick={copyEnvSample}
                className="absolute top-2 right-2 px-2 py-1 bg-white text-black text-xs font-bold flex items-center gap-1 hover:bg-neutral-200"
              >
                {copiedKey ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
                {copiedKey ? "Copiado!" : "Copiar"}
              </button>
            </div>
            <p className="text-neutral-700 dark:text-neutral-300 mb-1">
              Para atualizar seus dados a qualquer momento e gerar o arquivo estático:
            </p>
            <div className="font-mono text-xs bg-neutral-900 text-green-400 p-2 border border-black dark:border-white">
              npm run sync:notion
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-6 pt-4 border-t-2 border-black dark:border-white flex justify-end">
          <button
            onClick={onClose}
            className="neo-btn-primary px-6 py-2 font-mono text-sm font-bold uppercase tracking-wider"
          >
            Entendido! Fechar
          </button>
        </div>
      </div>
    </div>
  );
}
