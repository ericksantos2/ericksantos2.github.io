import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const SITE_URL = "https://ericksantos2.github.io";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "Erick Santos // Desenvolvedor Full-Stack",
    template: "%s | Erick Santos",
  },
  description:
    "Portfólio de Erick dos Santos Gouveia Barros — Desenvolvedor Full-Stack focado em Java, Spring Boot, React, TypeScript, Docker e arquitetura de sistemas.",
  keywords: [
    "Erick Santos",
    "Erick dos Santos Gouveia Barros",
    "Desenvolvedor Full-Stack",
    "Java",
    "Spring Boot",
    "React",
    "TypeScript",
    "Next.js",
    "Docker",
    "Portfólio",
    "Engenharia de Software",
  ],
  authors: [{ name: "Erick dos Santos Gouveia Barros", url: SITE_URL }],
  creator: "Erick dos Santos Gouveia Barros",
  alternates: {
    canonical: "/",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  openGraph: {
    type: "website",
    locale: "pt_BR",
    url: SITE_URL,
    siteName: "Erick Santos // Portfólio",
    title: "Erick Santos // Desenvolvedor Full-Stack",
    description:
      "Desenvolvedor Full-Stack focado no ecossistema Java (Spring Boot) e TypeScript (React). Confira meus projetos, stacks e arquitetura de software.",
  },
  twitter: {
    card: "summary_large_image",
    title: "Erick Santos // Desenvolvedor Full-Stack",
    description:
      "Desenvolvedor Full-Stack focado no ecossistema Java (Spring Boot) e TypeScript (React).",
  },
  icons: {
    icon: [{ url: "/favicon.svg", type: "image/svg+xml" }],
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "Person",
  name: "Erick dos Santos Gouveia Barros",
  alternateName: "Erick Santos",
  jobTitle: "Desenvolvedor Full-Stack",
  url: SITE_URL,
  email: "mailto:ericksgbarros@gmail.com",
  sameAs: ["https://github.com/ericksantos2"],
  knowsAbout: [
    "Java",
    "Spring Boot",
    "Spring Security",
    "React",
    "TypeScript",
    "Next.js",
    "MySQL",
    "Docker",
    "REST APIs",
  ],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="pt-BR"
      suppressHydrationWarning
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        <script
          dangerouslySetInnerHTML={{
            __html: `
              try {
                var stored = localStorage.getItem('portfolio-theme');
                var systemDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
                if (stored === 'dark' || (!stored && systemDark)) {
                  document.documentElement.classList.add('dark');
                } else {
                  document.documentElement.classList.remove('dark');
                }
              } catch (e) {}
            `,
          }}
        />
      </head>
      <body className="min-h-full flex flex-col font-sans selection:bg-black selection:text-white dark:selection:bg-white dark:selection:text-black">
        {children}
      </body>
    </html>
  );
}
