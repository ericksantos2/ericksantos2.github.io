import { getProjects, getSiteContent, getContactData, getExperiences, getTechStacks } from "@/lib/notion";
import { PortfolioApp } from "@/components/PortfolioApp";

export default async function HomePage() {
  const [{ projects, categories, source }, siteContent, contactData, experiences, techStacks] =
    await Promise.all([
      getProjects(),
      getSiteContent(),
      getContactData(),
      getExperiences(),
      getTechStacks(),
    ]);

  return (
    <PortfolioApp
      initialProjects={projects}
      categories={categories}
      siteContent={siteContent}
      contactData={contactData}
      experiences={experiences}
      techStacks={techStacks}
      source={source}
    />
  );
}
