export interface Project {
  id: string;
  title: string;
  description: string;
  category: "Full-Stack" | "Frontend" | "Backend" | "Mobile" | "Ferramenta";
  tags: string[];
  featured: boolean;
  year: string;
  role: string;
  githubUrl?: string;
  liveUrl?: string;
  status: "Concluído" | "Em Progresso" | "Conceito";
}

export type CategoryFilter = "Todos" | "Full-Stack" | "Frontend" | "Backend" | "Mobile" | "Ferramenta";
