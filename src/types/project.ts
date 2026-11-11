export interface Project {
  id: string;
  slug: string;
  title: string;
  description: string;
  fullDescription?: string;
  category: string;
  tags: string[];
  featured: boolean;
  year: string;
  role: string;
  githubUrl?: string;
  liveUrl?: string;
  showcaseUrl?: string;
  status: "Concluído" | "Em Progresso" | "Conceito";
  order?: number;
}

export type CategoryFilter = string;

export interface SiteContent {
  heroText?: string;
  aboutParagraphs?: string[];
  principles?: string[];
}

export interface ContactLink {
  id: string;
  name: string;
  url: string;
  type: string;
}

export interface ContactData {
  title?: string;
  description?: string;
  email?: string;
  links: ContactLink[];
}

export interface Experience {
  id: string;
  role: string;
  company: string;
  period: string;
  description: string;
}

export interface TechStackCategory {
  id: string;
  title: string;
  description: string;
  skills: string[];
}

export interface Education {
  id: string;
  course: string;
  institution: string;
  period: string;
  type?: string;
  description?: string;
}
