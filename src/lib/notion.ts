import { Project, SiteContent, ContactData, Experience, TechStackCategory } from "@/types/project";
import mockProjects from "@/data/projects.json";
import defaultSiteContent from "@/data/site-content.json";
import defaultContactData from "@/data/contact.json";
import defaultExperiences from "@/data/experiences.json";
import defaultTechStacks from "@/data/tech-stacks.json";

// Verifica se as credenciais do Notion estão preenchidas no ambiente
export const isNotionConfigured = Boolean(
  process.env.NOTION_API_KEY && process.env.NOTION_DATABASE_ID
);

/**
 * Converte qualquer texto em formato amigável para URL (slug)
 * Exemplo: "Scout Store" -> "scout-store"
 */
export function slugify(text: string): string {
  return text
    .toString()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/[\s_-]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

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
 * Converte blocos de rich text do Notion para texto Markdown formatado
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function richTextToMarkdown(richTexts: any[]): string {
  if (!Array.isArray(richTexts)) return "";
  return richTexts
    .map((t) => {
      let text = t.plain_text || "";
      if (t.annotations?.bold) text = `**${text}**`;
      if (t.annotations?.italic) text = `*${text}*`;
      if (t.annotations?.code) text = `\`${text}\``;
      if (t.annotations?.strikethrough) text = `~~${text}~~`;
      if (t.href) text = `[${text}](${t.href})`;
      return text;
    })
    .join("");
}

/**
 * Converte a lista de blocos filhos do Notion para Markdown estruturado
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function blocksToMarkdown(blocks: any[]): string {
  if (!Array.isArray(blocks)) return "";
  return blocks
    .map((block) => {
      const type = block.type;
      const value = block[type];
      if (!value) return "";

      switch (type) {
        case "heading_1":
          return `# ${richTextToMarkdown(value.rich_text)}`;
        case "heading_2":
          return `## ${richTextToMarkdown(value.rich_text)}`;
        case "heading_3":
          return `### ${richTextToMarkdown(value.rich_text)}`;
        case "paragraph":
          return richTextToMarkdown(value.rich_text);
        case "bulleted_list_item":
          return `- ${richTextToMarkdown(value.rich_text)}`;
        case "numbered_list_item":
          return `1. ${richTextToMarkdown(value.rich_text)}`;
        case "to_do":
          return `- [${value.checked ? "x" : " "}] ${richTextToMarkdown(value.rich_text)}`;
        case "code":
          return `\`\`\`${value.language || ""}\n${richTextToMarkdown(value.rich_text)}\n\`\`\``;
        case "quote":
          return `> ${richTextToMarkdown(value.rich_text)}`;
        case "divider":
          return "---";
        case "image": {
          const url = value.file?.url || value.external?.url || "";
          const caption = richTextToMarkdown(value.caption);
          return url ? `![${caption || "Imagem"}](${url})` : "";
        }
        default:
          return "";
      }
    })
    .filter((line) => line.trim().length > 0)
    .join("\n\n");
}

/**
 * Busca blocos filhos (conteúdo interno) de uma página no Notion
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
async function getPageBlocks(apiKey: string, pageId: string): Promise<any[]> {
  try {
    const res = await fetch(`https://api.notion.com/v1/blocks/${pageId}/children?page_size=100`, {
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Notion-Version": "2022-06-28",
      },
      next: { revalidate: 60 },
    });
    if (!res.ok) return [];
    const data = await res.json();
    return data.results || [];
  } catch {
    return [];
  }
}

/**
 * Normaliza os dados dos mocks garantindo campos adicionais (slug, showcaseUrl, etc.)
 */
function normalizeMockProjects(): Project[] {
  return (mockProjects as unknown as Project[]).map((p, idx) => ({
    ...p,
    id: p.id || String(idx + 1),
    slug: p.slug || slugify(p.title),
    fullDescription: p.fullDescription || p.description,
  }));
}

/**
 * Busca todos os projetos configurados no Notion com descrição simples, completa e filtros dinâmicos de stack.
 */
export async function getProjects(): Promise<{
  projects: Project[];
  categories: string[];
  source: "notion" | "mock";
}> {
  const apiKey = process.env.NOTION_API_KEY;
  const databaseId = process.env.NOTION_DATABASE_ID;

  if (!apiKey || !databaseId) {
    const mockList = normalizeMockProjects();
    const mockCategories = ["Todos", ...Array.from(new Set(mockList.map((p) => p.category)))];
    return {
      projects: mockList,
      categories: mockCategories,
      source: "mock",
    };
  }

  try {
    // 1. Obtém o schema da tabela de projetos para detectar a relação com a Tabela Stacks
    const schemaRes = await fetch(`https://api.notion.com/v1/databases/${databaseId}`, {
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Notion-Version": "2022-06-28",
      },
      next: { revalidate: 60 },
    });

    let stackRelationDbId: string | undefined;
    if (schemaRes.ok) {
      const schemaData = await schemaRes.json();
      stackRelationDbId = schemaData.properties?.Stack?.relation?.database_id;
    }

    // 2. Se houver relação com a Tabela Stacks, busca todas as opções e o mapeamento de páginas
    let stackOptions: string[] = [];
    const stackPageMap = new Map<string, string>();

    if (stackRelationDbId) {
      try {
        const stacksDbRes = await fetch(`https://api.notion.com/v1/databases/${stackRelationDbId}`, {
          headers: {
            Authorization: `Bearer ${apiKey}`,
            "Notion-Version": "2022-06-28",
          },
          next: { revalidate: 60 },
        });

        if (stacksDbRes.ok) {
          const stacksDbData = await stacksDbRes.json();
          const stackProp = stacksDbData.properties?.Stack;
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          const rawOptions: any[] =
            stackProp?.multi_select?.options || stackProp?.select?.options || [];
          stackOptions = rawOptions.map((o) => o.name);
        }

        const stacksRowsRes = await fetch(`https://api.notion.com/v1/databases/${stackRelationDbId}/query`, {
          method: "POST",
          headers: {
            Authorization: `Bearer ${apiKey}`,
            "Notion-Version": "2022-06-28",
            "Content-Type": "application/json",
          },
          next: { revalidate: 60 },
        });

        if (stacksRowsRes.ok) {
          const stacksRowsData = await stacksRowsRes.json();
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          for (const sPage of stacksRowsData.results || []) {
            const pageStack =
              sPage.properties?.Stack?.multi_select?.[0]?.name ||
              sPage.properties?.Stack?.select?.name ||
              "";
            if (pageStack) {
              stackPageMap.set(sPage.id, pageStack);
            }
          }
        }
      } catch (err) {
        console.warn("[Notion] Não foi possível carregar detalhes da tabela de stacks relacionada:", err);
      }
    }

    // 3. Consulta a lista de projetos na Tabela Projetos
    const res = await fetch(`https://api.notion.com/v1/databases/${databaseId}/query`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Notion-Version": "2022-06-28",
        "Content-Type": "application/json",
      },
      next: { revalidate: 60 },
    });

    if (!res.ok) {
      const errText = await res.text();
      throw new Error(`Status ${res.status}: ${errText}`);
    }

    const response = await res.json();

    // 🕵️‍♂️ CONSOLE.LOG DOS DADOS BRUTOS RECEBIDOS DO NOTION
    console.log("\n=======================================================");
    console.log("📥 [NOTION API] RESPOSTA BRUTA RECEBIDA DO NOTION:");
    console.log("-------------------------------------------------------");
    console.log("📊 Quantidade de Projetos Retornados:", response.results?.length ?? 0);
    console.log("🏷️ Opções de Stack (Filtros extraídos da Tabela Stacks):", stackOptions);
    console.log("📋 Propriedades das Páginas Recebidas:");
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    response.results.forEach((page: any, idx: number) => {
      console.log(`\n--- [Projeto #${idx + 1} - ID: ${page.id}] ---`);
      console.log(JSON.stringify(page.properties, null, 2));
    });
    console.log("=======================================================\n");

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const parsedProjects: Project[] = await Promise.all(
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      response.results.map(async (page: any) => {
        const props = page.properties;

        // Título
        const title =
          extractText(props.Nome || props.Title || props.Name || props.Projeto) || "Sem Título";

        // Slug personalizado se preenchido na tabela, senão gera automaticamente pelo nome
        const customSlug = extractText(props.Slug || props.slug);
        const slug = customSlug ? slugify(customSlug) : slugify(title);

        // Descrição Simples (mostrada na home do projeto)
        const description =
          extractText(
            props["Descrição Simples"] ||
              props.DescricaoSimples ||
              props["Descricao Simples"] ||
              props.Description ||
              props.Descricao ||
              props.Resumo
          ) || "Sem descrição simples disponível.";

        // Categoria / Stack vinda da relação com a Tabela Stacks de Projetos
        const relationId = props.Stack?.relation?.[0]?.id;
        const resolvedStack =
          (relationId && stackPageMap.get(relationId)) ||
          extractSelect(props.Category || props.Categoria, "Full-stack");

        // Tags de Tecnologias
        const tags = extractMultiSelect(
          props.Tags || props.Stacks || props.Stack || props.Tecnologias
        );

        // Links
        const githubUrl =
          props["Link Código"]?.url ||
          props["Link Codigo"]?.url ||
          props.GitHub?.url ||
          props.Github?.url ||
          props.Repositorio?.url ||
          undefined;

        const liveUrl =
          props["Link Deploy"]?.url ||
          props.LiveUrl?.url ||
          props.Deploy?.url ||
          props.Demo?.url ||
          props.Link?.url ||
          undefined;

        const showcaseUrl =
          props["Link Showcase"]?.url ||
          props.Showcase?.url ||
          props.Video?.url ||
          props.Demonstracao?.url ||
          undefined;

        const featured = Boolean(
          props.Featured?.checkbox || props.Destaque?.checkbox || false
        );

        const year =
          extractText(props.Year || props.Ano) ||
          (props.Year?.number || props.Ano?.number
            ? String(props.Year?.number || props.Ano?.number)
            : "2026");

        const role =
          extractText(props.Role || props.Funcao || props.Cargo) || "Desenvolvedor Full-Stack";

        const status = (
          extractSelect(props.Status, "Concluído")
        ) as Project["status"];

        // Conteúdo da página (corpo com a descrição completa)
        const blocks = await getPageBlocks(apiKey, page.id);
        const fullDescription = blocksToMarkdown(blocks) || description;

        return {
          id: page.id,
          slug,
          title,
          description,
          fullDescription,
          category: resolvedStack,
          tags: tags.length > 0 ? tags : ["Tech"],
          featured,
          year,
          role,
          githubUrl,
          liveUrl,
          showcaseUrl,
          status,
        };
      })
    );

    // Constrói os filtros finais: "Todos" + todas as opções da Tabela Stacks de Projetos
    const assignedCategories = parsedProjects.map((p) => p.category).filter(Boolean);
    const combinedCategories = Array.from(
      new Set([...stackOptions, ...assignedCategories])
    ).filter(Boolean);

    const finalCategories = ["Todos", ...(combinedCategories.length > 0 ? combinedCategories : ["Full-stack", "Frontend", "Desktop"])];

    return {
      projects: parsedProjects.length > 0 ? parsedProjects : normalizeMockProjects(),
      categories: finalCategories,
      source: "notion",
    };
  } catch (error) {
    console.error("[Notion API Error] Falha ao consultar o banco de dados do Notion:", error);
    const mockList = normalizeMockProjects();
    const mockCategories = ["Todos", ...Array.from(new Set(mockList.map((p) => p.category)))];
    return {
      projects: mockList,
      categories: mockCategories,
      source: "mock",
    };
  }
}

/**
 * Busca um projeto individual pelo slug ou pelo ID
 */
export async function getProjectBySlug(slug: string): Promise<Project | null> {
  const { projects } = await getProjects();
  const found = projects.find(
    (p) => p.slug === slug || slugify(p.title) === slug || p.id === slug
  );
  return found || null;
}

/**
 * Busca textos globais do site (Página Inicial, Sobre mim, Princípios) na Tabela Dados
 */
export async function getSiteContent(): Promise<SiteContent> {
  const apiKey = process.env.NOTION_API_KEY;
  const dadosDatabaseId =
    process.env.NOTION_DADOS_DATABASE_ID || "41542128-8869-8062-a768-c65389acd289";

  if (!apiKey || !dadosDatabaseId) {
    return defaultSiteContent as SiteContent;
  }

  try {
    const res = await fetch(`https://api.notion.com/v1/databases/${dadosDatabaseId}/query`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Notion-Version": "2022-06-28",
        "Content-Type": "application/json",
      },
      next: { revalidate: 60 },
    });

    if (!res.ok) {
      console.warn(`[Notion] Não foi possível consultar a Tabela Dados (${res.status}). Usando defaults.`);
      return defaultSiteContent as SiteContent;
    }

    const data = await res.json();
    const siteContent: SiteContent = {
      heroText: defaultSiteContent.heroText,
      aboutParagraphs: defaultSiteContent.aboutParagraphs,
      principles: defaultSiteContent.principles,
    };

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    for (const page of data.results || []) {
      const props = page.properties;
      const title =
        extractText(props["Nome do Texto"] || props.Nome || props.Title) || "";
      const blocks = await getPageBlocks(apiKey, page.id);

      const titleNorm = title.toLowerCase();

      if (titleNorm.includes("inicial") || titleNorm.includes("hero")) {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const paragraphs = blocks
          .filter((b: any) => b.type === "paragraph")
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          .map((b: any) => richTextToMarkdown(b.paragraph.rich_text))
          .filter((t: string) => t.trim().length > 0);
        if (paragraphs.length > 0) {
          siteContent.heroText = paragraphs.join("\n\n");
        }
      } else if (titleNorm.includes("sobre") || titleNorm.includes("about")) {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const paragraphs = blocks
          .filter((b: any) => b.type === "paragraph")
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          .map((b: any) => richTextToMarkdown(b.paragraph.rich_text))
          .filter((t: string) => t.trim().length > 0);
        if (paragraphs.length > 0) {
          siteContent.aboutParagraphs = paragraphs;
        }
      } else if (titleNorm.includes("princípio") || titleNorm.includes("principio")) {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const items = blocks
          .filter((b: any) => b.type === "bulleted_list_item" || b.type === "paragraph")
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          .map((b: any) => {
            const val = b[b.type];
            return richTextToMarkdown(val.rich_text);
          })
          .filter((t: string) => t.trim().length > 0);
        if (items.length > 0) {
          siteContent.principles = items;
        }
      }
    }

    console.log("📝 [NOTION DADOS] Textos do site carregados com sucesso da Tabela Dados!");
    return siteContent;
  } catch (err) {
    console.error("[Notion] Erro ao carregar Tabela Dados:", err);
    return defaultSiteContent as SiteContent;
  }
}

/**
 * Busca dados de contato na Tabela Contato do Notion (Email, Redes Sociais, Textos)
 */
export async function getContactData(): Promise<ContactData> {
  const apiKey = process.env.NOTION_API_KEY;
  const contatoDatabaseId =
    process.env.NOTION_CONTATO_DATABASE_ID || "41542128-8869-808e-a4d3-f2e7911b3663";

  if (!apiKey || !contatoDatabaseId) {
    return defaultContactData as ContactData;
  }

  try {
    const res = await fetch(`https://api.notion.com/v1/databases/${contatoDatabaseId}/query`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Notion-Version": "2022-06-28",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        sorts: [
          {
            timestamp: "created_time",
            direction: "ascending",
          },
        ],
      }),
      next: { revalidate: 60 },
    });

    if (!res.ok) {
      console.warn(`[Notion] Não foi possível consultar a Tabela Contato (${res.status}). Usando defaults.`);
      return defaultContactData as ContactData;
    }

    const data = await res.json();
    const contactData: ContactData = {
      title: defaultContactData.title,
      description: defaultContactData.description,
      email: defaultContactData.email,
      links: [],
    };

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    for (const page of data.results || []) {
      const props = page.properties;
      const contato =
        extractText(props.Contato || props.Nome || props.Title) || "";
      const tipo =
        props.Tipo?.multi_select?.[0]?.name ||
        props.Tipo?.select?.name ||
        "";
      const valor = extractText(props.Valor);

      const tipoNorm = tipo.toLowerCase();
      const contatoNorm = contato.toLowerCase();

      if (tipoNorm === "texto" || contatoNorm.includes("texto")) {
        const blocks = await getPageBlocks(apiKey, page.id);
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        for (const b of blocks || []) {
          if (b.type.startsWith("heading_")) {
            const hText = richTextToMarkdown(b[b.type]?.rich_text);
            if (hText.trim()) contactData.title = hText.trim();
          } else if (b.type === "paragraph") {
            const pText = richTextToMarkdown(b.paragraph?.rich_text);
            if (pText.trim()) contactData.description = pText.trim();
          }
        }
      } else if (tipoNorm === "card primario" || contatoNorm.includes("email")) {
        if (valor) contactData.email = valor;
      } else if (tipoNorm === "card" || valor) {
        contactData.links.push({
          id: page.id,
          name: contato ? contato.charAt(0).toUpperCase() + contato.slice(1) : "Link",
          url: valor,
          type: "card",
        });
      }
    }

    // Se nenhum link de card for retornado, usa os defaults
    if (contactData.links.length === 0) {
      contactData.links = defaultContactData.links;
    } else {
      // Garante que o GitHub venha antes do LinkedIn seguindo a ordem do Notion
      contactData.links.sort((a, b) => {
        const aIsGithub = a.name.toLowerCase().includes("github");
        const bIsGithub = b.name.toLowerCase().includes("github");
        if (aIsGithub && !bIsGithub) return -1;
        if (!aIsGithub && bIsGithub) return 1;
        return 0;
      });
    }

    console.log("📬 [NOTION CONTATO] Dados de contato carregados da Tabela Contato!");
    return contactData;
  } catch (err) {
    console.error("[Notion] Erro ao carregar Tabela Contato:", err);
    return defaultContactData as ContactData;
  }
}

/**
 * Busca as experiências profissionais da Tabela Experiências do Notion
 */
export async function getExperiences(): Promise<Experience[]> {
  const apiKey = process.env.NOTION_API_KEY;
  const expDbId =
    process.env.NOTION_EXPERIENCIAS_DATABASE_ID ||
    "41542128886980708950d06c67d4f979";

  if (!apiKey || !expDbId) {
    return defaultExperiences as Experience[];
  }

  try {
    const formattedDbId = expDbId.replace(/-/g, "");
    const res = await fetch(`https://api.notion.com/v1/databases/${formattedDbId}/query`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Notion-Version": "2022-06-28",
        "Content-Type": "application/json",
      },
      next: { revalidate: 60 },
    });

    if (!res.ok) {
      console.warn(`[Notion] Tabela Experiências retornou HTTP ${res.status}. Usando fallback.`);
      return defaultExperiences as Experience[];
    }

    const data = await res.json();
    const experiences: Experience[] = [];

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    for (const page of data.results || []) {
      const props = page.properties;
      const role = extractText(props.Cargo || props.Role || props.Nome || props.Title) || "Cargo";
      const company = extractText(props.Local || props.Empresa || props.Company) || "";
      const period = extractText(props.Tempo || props.Periodo || props.Period) || "";

      // Lê o conteúdo dentro da página da experiência como descrição
      const blocks = await getPageBlocks(apiKey, page.id);
      let description = "";
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      for (const b of blocks || []) {
        if (b.type === "paragraph") {
          const pText = richTextToMarkdown(b.paragraph?.rich_text);
          if (pText.trim()) {
            description = pText.trim();
            break;
          }
        }
      }

      experiences.push({
        id: page.id,
        role,
        company,
        period,
        description,
      });
    }

    if (experiences.length === 0) {
      return defaultExperiences as Experience[];
    }

    // Ordena da mais recente para a mais antiga pelo ano no período
    experiences.sort((a, b) => {
      const getLatestYear = (str: string) => {
        const matches = str.match(/\d{4}/g);
        if (!matches) return 0;
        return Math.max(...matches.map(Number));
      };
      return getLatestYear(b.period) - getLatestYear(a.period);
    });

    console.log(`💼 [NOTION EXPERIÊNCIAS] ${experiences.length} experiências carregadas com sucesso!`);
    return experiences;
  } catch (err) {
    console.error("[Notion] Erro ao carregar Tabela Experiências:", err);
    return defaultExperiences as Experience[];
  }
}

/**
 * Busca as categorias de Stack & Tecnologias da Tabela Stacks do Notion
 */
export async function getTechStacks(): Promise<TechStackCategory[]> {
  const apiKey = process.env.NOTION_API_KEY;
  const stacksDbId =
    process.env.NOTION_STACKS_DATABASE_ID ||
    "41542128886980879d2cf5a3aea21a2b";

  if (!apiKey || !stacksDbId) {
    return defaultTechStacks as TechStackCategory[];
  }

  try {
    const formattedDbId = stacksDbId.replace(/-/g, "");
    const res = await fetch(`https://api.notion.com/v1/databases/${formattedDbId}/query`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Notion-Version": "2022-06-28",
        "Content-Type": "application/json",
      },
      next: { revalidate: 60 },
    });

    if (!res.ok) {
      console.warn(`[Notion] Tabela Stacks retornou HTTP ${res.status}. Usando fallback.`);
      return defaultTechStacks as TechStackCategory[];
    }

    const data = await res.json();
    const categories: TechStackCategory[] = [];

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    for (const page of data.results || []) {
      const props = page.properties;
      const title =
        extractText(props.Nome || props.Title || props.Categoria) || "STACK";
      const description =
        extractText(props["Descrição"] || props.Descricao || props.Description) || "";
      const skills = extractMultiSelect(props.Tecnologias || props.Skills || props.Tags);

      categories.push({
        id: page.id,
        title,
        description,
        skills,
      });
    }

    if (categories.length === 0) {
      return defaultTechStacks as TechStackCategory[];
    }

    // Ordenação canônica pré-definida para exibição agradável
    const orderPriority = [
      "FRONTEND",
      "BACKEND",
      "DEVOPS",
      "DESIGN",
    ];

    categories.sort((a, b) => {
      const getPriority = (name: string) => {
        const idx = orderPriority.findIndex((p) =>
          name.toUpperCase().includes(p)
        );
        return idx !== -1 ? idx : 999;
      };
      return getPriority(a.title) - getPriority(b.title);
    });

    console.log(`⚡ [NOTION STACKS] ${categories.length} grupos de stacks carregados com sucesso!`);
    return categories;
  } catch (err) {
    console.error("[Notion] Erro ao carregar Tabela Stacks:", err);
    return defaultTechStacks as TechStackCategory[];
  }
}
