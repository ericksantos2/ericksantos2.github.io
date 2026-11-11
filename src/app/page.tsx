import {
  getProjects,
  getSiteContent,
  getContactData,
  getExperiences,
  getTechStacks,
  getEducation,
} from "@/lib/notion";
import { PortfolioApp } from "@/components/PortfolioApp";

export default async function HomePage() {
  const [
    { projects, categories, source },
    siteContent,
    contactData,
    experiences,
    techStacks,
    education,
  ] = await Promise.all([
    getProjects(),
    getSiteContent(),
    getContactData(),
    getExperiences(),
    getTechStacks(),
    getEducation(),
  ]);

  return (
    <PortfolioApp
      initialProjects={projects}
      categories={categories}
      siteContent={siteContent}
      contactData={contactData}
      experiences={experiences}
      techStacks={techStacks}
      education={education}
      source={source}
    />
  );
}
