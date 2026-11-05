import { getProjects } from "@/lib/notion";
import { PortfolioApp } from "@/components/PortfolioApp";

export default async function HomePage() {
  const { projects, source } = await getProjects();

  return <PortfolioApp initialProjects={projects} source={source} />;
}
