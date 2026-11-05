import { Client } from "@notionhq/client";
import { Project } from "@/types/project";
import mockProjects from "@/data/projects.json";

// Verifica se as credenciais do Notion estão preenchidas no ambiente
export const isNotionConfigured = Boolean(
  process.env.NOTION_API_KEY && process.env.NOTION_DATABASE_ID
);

/**
 * Helper para extrair texto de uma propriedade Rich Text ou Title do Notion
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function extractText(property: any): string {
  if (!property) return "";
  if (property.type === "title" && Array.isArray(property.title)) {
    return property.title.map((item: { plain_text?: string }) => item.plain_text || "").join("");
  }
  if (property.type === "rich_text" && Array.isArray(property.rich_text)) {
    return property.rich_text.map((item: { plain_text?: string }) => item.plain_text || "").join("");
  }
  if (property.type === "number") {
    return String(property.number ?? "");
  }
  return "";
}

/**
 * Helper para extrair opções selecionadas (Tags ou Multi-select)
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function extractMultiSelect(property: any): string[] {
  if (!property) return [];
  if (property.type === "multi_select" && Array.isArray(property.multi_select)) {
    return property.multi_select.map((item: { name: string }) => item.name);
  }
  return [];
}

/**
 * Helper para extrair valor select único
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function extractSelect(property: any, fallback: string = ""): string {
  if (!property) return fallback;
  if (property.type === "select" && property.select?.name) {
    return property.select.name;
  }
  if (property.type === "status" && property.status?.name) {
    return property.status.name;
  }
  return fallback;
}

/**
 * Busca todos os projetos configurados no Notion.
 * Caso o Notion não esteja configurado ou ocorra qualquer erro,
 * retorna a lista mockada com segurança.
 */
export async function getProjects(): Promise<{ projects: Project[]; source: "notion" | "mock" }> {
  const apiKey = process.env.NOTION_API_KEY;
  const databaseId = process.env.NOTION_DATABASE_ID;

  if (!apiKey || !databaseId) {
    return {
      projects: mockProjects as Project[],
      source: "mock",
    };
  }

  try {
    const notion = new Client({ auth: apiKey });

    // Busca linhas do banco de dados do Notion via endpoint oficial
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const response: any = await notion.request({
      path: `databases/${databaseId}/query`,
      method: "post",
    });

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const parsedProjects: Project[] = response.results.map((page: any) => {
      const props = page.properties;

      // Suporta nomes em inglês ou português para facilidade do usuário
      const title =
        extractText(props.Title || props.Nome || props.Name || props.Projeto) || "Sem Título";

      const description =
        extractText(props.Description || props.Descricao || props.Resumo) ||
        "Sem descrição disponível.";

      const category = (
        extractSelect(props.Category || props.Categoria, "Full-Stack")
      ) as Project["category"];

      const tags =
        extractMultiSelect(props.Tags || props.Tecnologias || props.Stack);

      const featured = Boolean(
        props.Featured?.checkbox || props.Destaque?.checkbox || false
      );

      const year =
        extractText(props.Year || props.Ano) ||
        (props.Year?.number || props.Ano?.number ? String(props.Year?.number || props.Ano?.number) : "2026");

      const role =
        extractText(props.Role || props.Funcao || props.Cargo) || "Desenvolvedor";

      const githubUrl =
        props.GitHub?.url || props.Github?.url || props.Repositorio?.url || undefined;

      const liveUrl =
        props.LiveUrl?.url || props.Deploy?.url || props.Demo?.url || props.Link?.url || undefined;

      const status = (
        extractSelect(props.Status, "Concluído")
      ) as Project["status"];

      return {
        id: page.id,
        title,
        description,
        category,
        tags: tags.length > 0 ? tags : ["Tech"],
        featured,
        year,
        role,
        githubUrl,
        liveUrl,
        status,
      };
    });

    return {
      projects: parsedProjects.length > 0 ? parsedProjects : (mockProjects as Project[]),
      source: "notion",
    };
  } catch (error) {
    console.error("[Notion API Error] Falha ao consultar o banco de dados do Notion:", error);
    return {
      projects: mockProjects as Project[],
      source: "mock",
    };
  }
}
