"use client";

import React, { useState } from "react";
import { User, Sparkles } from "lucide-react";

export function PhotoFrame() {
  const [imageError, setImageError] = useState(false);

  return (
    <div className="relative group max-w-sm mx-auto lg:max-w-none">
      {/* Moldura Externa Neobrutalista */}
      <div className="border-[3px] border-black dark:border-white bg-white dark:bg-neutral-900 shadow-[8px_8px_0px_#000] dark:shadow-[8px_8px_0px_#fff] hover:-translate-x-1 hover:-translate-y-1 hover:shadow-[11px_11px_0px_#000] dark:hover:shadow-[11px_11px_0px_#fff] transition-all p-3">
        {/* Barra de Janela Superior Estilo Sistema/Brutalista */}
        <div className="flex items-center justify-between border-b-2 border-black dark:border-white pb-2 mb-3 font-mono text-[11px] font-bold">
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 bg-black dark:bg-white inline-block" />
            <span className="w-2.5 h-2.5 border border-black dark:border-white inline-block" />
            <span className="w-2.5 h-2.5 bg-neutral-300 dark:bg-neutral-700 inline-block" />
          </div>
          <span className="uppercase tracking-widest text-neutral-800 dark:text-neutral-200">
            PORTRAIT.RAW // [01]
          </span>
          <span className="text-[10px] text-neutral-500">
            4:5 RATIO
          </span>
        </div>

        {/* Área da Foto / Placeholder */}
        <div className="relative aspect-[4/5] w-full border-2 border-black dark:border-white bg-neutral-100 dark:bg-neutral-800 overflow-hidden flex flex-col items-center justify-center">
          {!imageError ? (
            /* Imagem real */
            /* eslint-disable-next-line @next/next/no-img-element */
            <img
              src="./foto.jpg"
              alt="Foto de perfil de Erick"
              onError={() => setImageError(true)}
              className="w-full h-full object-cover grayscale contrast-125 group-hover:grayscale-0 group-hover:scale-105 transition-all duration-300"
            />
          ) : (
            /* Placeholder estilizado Neobrutalista */
            <div className="w-full h-full flex flex-col items-center justify-between p-6 bg-grid-pattern relative">
              {/* Marcadores técnicos nos cantos */}
              <div className="absolute top-2 left-2 font-mono text-[10px] text-neutral-400 font-bold">+ 00.1</div>
              <div className="absolute top-2 right-2 font-mono text-[10px] text-neutral-400 font-bold">+ 00.2</div>
              <div className="absolute bottom-2 left-2 font-mono text-[10px] text-neutral-400 font-bold">+ 00.3</div>
              <div className="absolute bottom-2 right-2 font-mono text-[10px] text-neutral-400 font-bold">+ 00.4</div>

              <div className="flex-1 flex flex-col items-center justify-center text-center">
                <div className="w-24 h-24 border-2 border-black dark:border-white bg-white dark:bg-black flex items-center justify-center neo-shadow-sm mb-4 group-hover:rotate-3 transition-transform">
                  <User className="w-12 h-12 text-black dark:text-white" />
                </div>
                
                <div className="font-mono text-xs font-black uppercase tracking-wider text-black dark:text-white mb-1">
                  [ ESPAÇO RESERVADO ]
                </div>
                <div className="font-mono text-[11px] text-neutral-600 dark:text-neutral-400 max-w-[200px]">
                  Salve sua foto como <code className="bg-neutral-200 dark:bg-neutral-700 px-1 py-0.5 font-bold">foto.jpg</code> na pasta <code className="bg-neutral-200 dark:bg-neutral-700 px-1 py-0.5 font-bold">public/</code>
                </div>
              </div>

              <div className="w-full pt-2 border-t border-dashed border-neutral-400 dark:border-neutral-600 flex items-center justify-between font-mono text-[10px] text-neutral-500">
                <span>ESTILO // B&W</span>
                <span className="flex items-center gap-1">
                  <Sparkles className="w-3 h-3" /> PRONTO
                </span>
              </div>
            </div>
          )}

          {/* Mira / Linhas de foco brutalistas (decorativo) */}
          <div className="absolute inset-0 pointer-events-none border border-black/10 dark:border-white/10 m-2" />
        </div>

        {/* Rodapé da moldura */}
        <div className="mt-3 pt-2 border-t-2 border-black dark:border-white flex items-center justify-between font-mono text-xs font-bold">
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-black dark:bg-white animate-pulse" />
            <span className="uppercase text-[11px]">DISPONÍVEL</span>
          </div>
          <span className="text-[11px] uppercase text-neutral-500">
            SÃO PAULO, BR
          </span>
        </div>
      </div>

      {/* Selo / Sticker sobreposto no canto inferior esquerdo */}
      <div className="absolute -bottom-3 -left-3 font-mono text-xs font-black uppercase bg-black text-white dark:bg-white dark:text-black px-3 py-1 border-2 border-black dark:border-white shadow-[3px_3px_0px_#000] dark:shadow-[3px_3px_0px_#fff] -rotate-3 hover:rotate-0 transition-transform cursor-default">
        ERICK // DEV
      </div>
    </div>
  );
}
