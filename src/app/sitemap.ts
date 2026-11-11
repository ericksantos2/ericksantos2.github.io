import type { MetadataRoute } from "next";
import { getProjects } from "@/lib/notion";

export const dynamic = "force-static";

const SITE_URL = "https://ericksantos2.github.io";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const { projects } = await getProjects();

  const projectRoutes: MetadataRoute.Sitemap = projects.map((project) => ({
    url: `${SITE_URL}/projetos/${project.slug}`,
    lastModified: new Date(),
    changeFrequency: "weekly",
    priority: 0.8,
  }));

  return [
    {
      url: SITE_URL,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 1.0,
    },
    ...projectRoutes,
  ];
}
