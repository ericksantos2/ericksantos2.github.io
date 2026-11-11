import * as fs from "node:fs";
import * as path from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Carrega .env.local se existir
const envPath = path.resolve(__dirname, "../.env.local");
if (fs.existsSync(envPath)) {
  const envContent = fs.readFileSync(envPath, "utf-8");
  envContent.split("\n").forEach((line) => {
    const trimmed = line.trim();
    if (trimmed && !trimmed.startsWith("#")) {
      const [key, ...vals] = trimmed.split("=");
      if (key && vals.length > 0) {
        process.env[key.trim()] = vals.join("=").trim().replace(/^["']|["']$/g, "");
      }
    }
  });
}

const apiKey = process.env.NOTION_API_KEY;
const databaseId = process.env.NOTION_DATABASE_ID;

console.log("=========================================");
console.log(" 🚀 SINCRONIZADOR DE PROJETOS DO NOTION");
console.log("=========================================\n");

if (!apiKey || !databaseId) {
  console.error("❌ ERRO: NOTION_API_KEY ou NOTION_DATABASE_ID não configurados.");
  process.exit(1);
}

function slugify(text) {
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

function extractText(property) {
  if (!property) return "";
  if (property.type === "title" && Array.isArray(property.title)) {
    return property.title.map((i) => i.plain_text || "").join("");
  }
  if (property.type === "rich_text" && Array.isArray(property.rich_text)) {
    return property.rich_text.map((i) => i.plain_text || "").join("");
  }
  if (property.type === "number") {
    return String(property.number ?? "");
  }
  return "";
}

function extractMultiSelect(property) {
  if (!property) return [];
  if (property.type === "multi_select" && Array.isArray(property.multi_select)) {
    return property.multi_select.map((i) => i.name);
  }
  return [];
}

function extractSelect(property, fallback = "") {
  if (!property) return fallback;
  if (property.type === "select" && property.select?.name) {
    return property.select.name;
  }
  if (property.type === "status" && property.status?.name) {
    return property.status.name;
  }
  return fallback;
}

function richTextToMarkdown(richTexts) {
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

function blocksToMarkdown(blocks) {
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

async function getPageBlocks(pageId) {
  try {
    const res = await fetch(`https://api.notion.com/v1/blocks/${pageId}/children?page_size=100`, {
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Notion-Version": "2022-06-28",
      },
    });
    if (!res.ok) return [];
    const data = await res.json();
    return data.results || [];
  } catch {
    return [];
  }
}

async function run() {
  try {
    console.log("⏳ Conectando ao Notion e obtendo dados...");

    // 1. Schema
    const schemaRes = await fetch(`https://api.notion.com/v1/databases/${databaseId}`, {
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Notion-Version": "2022-06-28",
      },
    });
    const schemaData = await schemaRes.json();
    const stackRelationDbId = schemaData.properties?.Stack?.relation?.database_id;
    const orderProp =
      schemaData.properties?.Ordem ||
      schemaData.properties?.Order ||
      schemaData.properties?.ordem ||
      schemaData.properties?.Posicao ||
      schemaData.properties?.Posição;
    const orderPropName = orderProp?.name;

    let stackOptions = [];
    const stackPageMap = new Map();

    if (stackRelationDbId) {
      const stacksDbRes = await fetch(`https://api.notion.com/v1/databases/${stackRelationDbId}`, {
        headers: {
          Authorization: `Bearer ${apiKey}`,
          "Notion-Version": "2022-06-28",
        },
      });
      if (stacksDbRes.ok) {
        const stacksDbData = await stacksDbRes.json();
        const stackProp = stacksDbData.properties?.Stack;
        const rawOptions = stackProp?.multi_select?.options || stackProp?.select?.options || [];
        stackOptions = rawOptions.map((o) => o.name);
      }

      const stacksRowsRes = await fetch(`https://api.notion.com/v1/databases/${stackRelationDbId}/query`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${apiKey}`,
          "Notion-Version": "2022-06-28",
          "Content-Type": "application/json",
        },
      });
      if (stacksRowsRes.ok) {
        const stacksRowsData = await stacksRowsRes.json();
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
    }

    // 2. Query projetos respeitando a ordenação do Notion (Ordem manual se houver, ou ordem cronológica de criação)
    const sorts = orderPropName
      ? [{ property: orderPropName, direction: "ascending" }]
      : [{ timestamp: "created_time", direction: "ascending" }];

    const res = await fetch(`https://api.notion.com/v1/databases/${databaseId}/query`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Notion-Version": "2022-06-28",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ sorts }),
    });

    if (!res.ok) {
      const err = await res.text();
      throw new Error(`Erro na API do Notion (${res.status}): ${err}`);
    }

    const data = await res.json();

    // 🕵️ CONSOLE.LOG DOS DADOS DO NOTION
    console.log("\n=======================================================");
    console.log("📥 [NOTION RAW DATA] Resposta Recebida:");
    console.log("-------------------------------------------------------");
    console.log("🏷️ Opções da Tabela Stacks:", stackOptions);
    console.log("📦 Total de Linhas em Projetos:", data.results.length);
    console.log("📋 Propriedades da Primeira Linha:\n", JSON.stringify(data.results[0]?.properties, null, 2));
    console.log("=======================================================\n");

    const projects = await Promise.all(
      data.results.map(async (page) => {
        const props = page.properties;

        const title =
          extractText(props.Nome || props.Title || props.Name || props.Projeto) || "Sem Título";

        const customSlug = extractText(props.Slug || props.slug);
        const slug = customSlug ? slugify(customSlug) : slugify(title);

        const description =
          extractText(
            props["Descrição Simples"] ||
              props.DescricaoSimples ||
              props["Descricao Simples"] ||
              props.Description ||
              props.Descricao ||
              props.Resumo
          ) || "Sem descrição simples disponível.";

        const relationId = props.Stack?.relation?.[0]?.id;
        const resolvedStack =
          (relationId && stackPageMap.get(relationId)) ||
          extractSelect(props.Category || props.Categoria, "Full-stack");

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

        const tags = extractMultiSelect(
          props.Tags || props.Stacks || props.Stack || props.Tecnologias
        );

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

        const status =
          extractSelect(props.Status, "Concluído");

        const blocks = await getPageBlocks(page.id);
        const fullDescription = blocksToMarkdown(blocks) || description;

        const orderNum =
          props.Ordem?.number ??
          props.Order?.number ??
          props.Posicao?.number ??
          props["Posição"]?.number;
        const order = typeof orderNum === "number" ? orderNum : undefined;

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
          order,
        };
      })
    );

    // Se houver propriedade de ordenação, aplica a ordenação numérica final
    if (orderPropName) {
      projects.sort((a, b) => {
        if (a.order !== undefined && b.order !== undefined) return a.order - b.order;
        if (a.order !== undefined) return -1;
        if (b.order !== undefined) return 1;
        return 0;
      });
    }

    const dataDir = path.resolve(__dirname, "../src/data");
    if (!fs.existsSync(dataDir)) {
      fs.mkdirSync(dataDir, { recursive: true });
    }

    const outputPath = path.resolve(__dirname, "../src/data/projects.json");
    fs.writeFileSync(outputPath, JSON.stringify(projects, null, 2), "utf-8");

    // Sincroniza também a Tabela Dados (se configurada)
    const dadosDbId =
      process.env.NOTION_DADOS_DATABASE_ID || "41542128-8869-8062-a768-c65389acd289";
    try {
      const dadosRes = await fetch(
        `https://api.notion.com/v1/databases/${dadosDbId}/query`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${apiKey}`,
            "Notion-Version": "2022-06-28",
            "Content-Type": "application/json",
          },
        }
      );
      if (dadosRes.ok) {
        const dadosData = await dadosRes.json();
        const siteContent = {
          heroText: "",
          aboutParagraphs: [],
          principles: [],
        };
        for (const dPage of dadosData.results || []) {
          const dTitle =
            extractText(
              dPage.properties["Nome do Texto"] ||
                dPage.properties.Nome ||
                dPage.properties.Title
            ) || "";
          const dBlocks = await getPageBlocks(dPage.id);
          const dTitleNorm = dTitle.toLowerCase();

          if (dTitleNorm.includes("inicial") || dTitleNorm.includes("hero")) {
            const p = dBlocks
              .filter((b) => b.type === "paragraph")
              .map((b) => richTextToMarkdown(b.paragraph.rich_text))
              .filter((t) => t.trim().length > 0);
            if (p.length > 0) siteContent.heroText = p.join("\n\n");
          } else if (dTitleNorm.includes("sobre") || dTitleNorm.includes("about")) {
            const p = dBlocks
              .filter((b) => b.type === "paragraph")
              .map((b) => richTextToMarkdown(b.paragraph.rich_text))
              .filter((t) => t.trim().length > 0);
            if (p.length > 0) siteContent.aboutParagraphs = p;
          } else if (
            dTitleNorm.includes("princípio") ||
            dTitleNorm.includes("principio")
          ) {
            const items = dBlocks
              .filter(
                (b) => b.type === "bulleted_list_item" || b.type === "paragraph"
              )
              .map((b) => richTextToMarkdown(b[b.type].rich_text))
              .filter((t) => t.trim().length > 0);
            if (items.length > 0) siteContent.principles = items;
          }
        }
        const siteContentPath = path.resolve(
          __dirname,
          "../src/data/site-content.json"
        );
        fs.writeFileSync(
          siteContentPath,
          JSON.stringify(siteContent, null, 2),
          "utf-8"
        );
        console.log(`📂 Textos do site salvos em: ${siteContentPath}`);
      }
    } catch (e) {
      console.warn("⚠️ Aviso ao sincronizar Tabela Dados:", e.message);
    }

    // Sincroniza também a Tabela Contato (se configurada)
    const contatoDbId =
      process.env.NOTION_CONTATO_DATABASE_ID || "41542128-8869-808e-a4d3-f2e7911b3663";
    try {
      const contatoRes = await fetch(
        `https://api.notion.com/v1/databases/${contatoDbId}/query`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${apiKey}`,
            "Notion-Version": "2022-06-28",
            "Content-Type": "application/json",
          },
        }
      );
      if (contatoRes.ok) {
        const contatoData = await contatoRes.json();
        const contactResult = {
          title: "VAMOS TRABALHAR JUNTOS?",
          description:
            "Estou sempre aberto a novos projetos desafiadores, parcerias técnicas ou oportunidades full-time. Fale comigo diretamente por qualquer um dos canais abaixo.",
          email: "ericksgbarros@gmail.com",
          links: [],
        };
        for (const cPage of contatoData.results || []) {
          const cProps = cPage.properties;
          const cNome =
            extractText(
              cProps.Contato || cProps.Nome || cProps.Title
            ) || "";
          const cTipo =
            cProps.Tipo?.multi_select?.[0]?.name ||
            cProps.Tipo?.select?.name ||
            "";
          const cValor = extractText(cProps.Valor);

          const cTipoNorm = cTipo.toLowerCase();
          const cNomeNorm = cNome.toLowerCase();

          if (cTipoNorm === "texto" || cNomeNorm.includes("texto")) {
            const cBlocks = await getPageBlocks(cPage.id);
            for (const b of cBlocks || []) {
              if (b.type.startsWith("heading_")) {
                const h = richTextToMarkdown(b[b.type]?.rich_text);
                if (h.trim()) contactResult.title = h.trim();
              } else if (b.type === "paragraph") {
                const p = richTextToMarkdown(b.paragraph?.rich_text);
                if (p.trim()) contactResult.description = p.trim();
              }
            }
          } else if (cTipoNorm === "card primario" || cNomeNorm.includes("email")) {
            if (cValor) contactResult.email = cValor;
          } else if (cTipoNorm === "card" || cValor) {
            contactResult.links.push({
              id: cPage.id,
              name: cNome ? cNome.charAt(0).toUpperCase() + cNome.slice(1) : "Link",
              url: cValor,
              type: "card",
            });
          }
        }
        // Garante que o GitHub venha antes do LinkedIn seguindo a ordem desejada
        contactResult.links.sort((a, b) => {
          const aIsGithub = a.name.toLowerCase().includes("github");
          const bIsGithub = b.name.toLowerCase().includes("github");
          if (aIsGithub && !bIsGithub) return -1;
          if (!aIsGithub && bIsGithub) return 1;
          return 0;
        });

        const contactPath = path.resolve(
          __dirname,
          "../src/data/contact.json"
        );
        fs.writeFileSync(
          contactPath,
          JSON.stringify(contactResult, null, 2),
          "utf-8"
        );
        console.log(`📂 Dados de contato salvos em: ${contactPath}`);
      }
    } catch (e) {
      console.warn("⚠️ Aviso ao sincronizar Tabela Contato:", e.message);
    }

    // 4. Sincroniza a Tabela Experiências se o ID estiver definido
    const expDbId = process.env.NOTION_EXPERIENCIAS_DATABASE_ID || "41542128886980708950d06c67d4f979";
    if (expDbId) {
      try {
        console.log(`\n⏳ Sincronizando Tabela Experiências (ID: ${expDbId})...`);
        const formattedExpId = expDbId.replace(/-/g, "");
        const expRes = await fetch(
          `https://api.notion.com/v1/databases/${formattedExpId}/query`,
          {
            method: "POST",
            headers: {
              Authorization: `Bearer ${apiKey}`,
              "Notion-Version": "2022-06-28",
              "Content-Type": "application/json",
            },
          }
        );
        if (expRes.ok) {
          const expData = await expRes.json();
          const experiences = [];
          for (const page of expData.results || []) {
            const props = page.properties;
            const role = extractText(props.Cargo || props.Role || props.Nome || props.Title) || "Cargo";
            const company = extractText(props.Local || props.Empresa || props.Company) || "";
            const period = extractText(props.Tempo || props.Periodo || props.Period) || "";
            const blocks = await getPageBlocks(page.id);
            let description = "";
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
          experiences.sort((a, b) => {
            const getLatestYear = (str) => {
              const matches = str.match(/\d{4}/g);
              if (!matches) return 0;
              return Math.max(...matches.map(Number));
            };
            return getLatestYear(b.period) - getLatestYear(a.period);
          });

          const expPath = path.resolve(__dirname, "../src/data/experiences.json");
          fs.writeFileSync(expPath, JSON.stringify(experiences, null, 2), "utf-8");
          console.log(`📂 Experiências salvas em: ${expPath} (${experiences.length} itens)`);
        }
      } catch (e) {
        console.warn("⚠️ Aviso ao sincronizar Tabela Experiências:", e.message);
      }
    }

    // 5. Sincroniza a Tabela Stacks se o ID estiver definido
    const stacksDbId = process.env.NOTION_STACKS_DATABASE_ID || "41542128886980879d2cf5a3aea21a2b";
    if (stacksDbId) {
      try {
        console.log(`\n⏳ Sincronizando Tabela Stacks (ID: ${stacksDbId})...`);
        const formattedStacksId = stacksDbId.replace(/-/g, "");
        const sRes = await fetch(
          `https://api.notion.com/v1/databases/${formattedStacksId}/query`,
          {
            method: "POST",
            headers: {
              Authorization: `Bearer ${apiKey}`,
              "Notion-Version": "2022-06-28",
              "Content-Type": "application/json",
            },
          }
        );
        if (sRes.ok) {
          const sData = await sRes.json();
          const categories = [];
          for (const page of sData.results || []) {
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

          const orderPriority = ["FRONTEND", "BACKEND", "DEVOPS", "DESIGN"];
          categories.sort((a, b) => {
            const getPriority = (name) => {
              const idx = orderPriority.findIndex((p) =>
                name.toUpperCase().includes(p)
              );
              return idx !== -1 ? idx : 999;
            };
            return getPriority(a.title) - getPriority(b.title);
          });

          const stackPath = path.resolve(__dirname, "../src/data/tech-stacks.json");
          fs.writeFileSync(stackPath, JSON.stringify(categories, null, 2), "utf-8");
          console.log(`📂 Stacks salvas em: ${stackPath} (${categories.length} grupos)`);
        }
      } catch (e) {
        console.warn("⚠️ Aviso ao sincronizar Tabela Stacks:", e.message);
      }
    }

    // 6. Sincroniza a Tabela Educação se o ID estiver definido
    const eduDbId = process.env.NOTION_EDUCACAO_DATABASE_ID || "41542128886980fb8862fe17397db7a5";
    if (eduDbId) {
      try {
        console.log(`\n⏳ Sincronizando Tabela Educação (ID: ${eduDbId})...`);
        const formattedEduId = eduDbId.replace(/-/g, "");
        const eduRes = await fetch(
          `https://api.notion.com/v1/databases/${formattedEduId}/query`,
          {
            method: "POST",
            headers: {
              Authorization: `Bearer ${apiKey}`,
              "Notion-Version": "2022-06-28",
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              sorts: [{ timestamp: "created_time", direction: "ascending" }],
            }),
          }
        );
        if (eduRes.ok) {
          const eduData = await eduRes.json();
          const educationList = [];
          for (const page of eduData.results || []) {
            const props = page.properties;
            const course =
              extractText(props.Curso || props.Nome || props.Title) || "Curso";
            const institution =
              extractText(props["Instituição"] || props.Instituicao || props.Escola) || "";
            const type =
              extractText(props.Tipo) ||
              props.Tipo?.select?.name ||
              props.Tipo?.multi_select?.[0]?.name ||
              "";
            
            let period = "";
            if (props["Período"]?.type === "date" && props["Período"].date) {
              const startYear = props["Período"].date.start ? props["Período"].date.start.slice(0, 4) : "";
              const endYear = props["Período"].date.end ? props["Período"].date.end.slice(0, 4) : "";
              period = startYear && endYear ? `${startYear} — ${endYear}` : startYear;
            } else {
              period = extractText(props["Período"] || props.Periodo || props.Data);
            }

            let description = extractText(props["Descrição"] || props.Descricao || props.Description);
            if (!description) {
              const blocks = await getPageBlocks(page.id);
              for (const b of blocks || []) {
                if (b.type === "paragraph") {
                  const p = richTextToMarkdown(b.paragraph?.rich_text);
                  if (p.trim()) {
                    description = p.trim();
                    break;
                  }
                }
              }
            }

            educationList.push({
              id: page.id,
              course,
              institution,
              period,
              type,
              description,
            });
          }

          const eduPath = path.resolve(__dirname, "../src/data/education.json");
          fs.writeFileSync(eduPath, JSON.stringify(educationList, null, 2), "utf-8");
          console.log(`📂 Educação salva em: ${eduPath} (${educationList.length} itens)`);
        }
      } catch (e) {
        console.warn("⚠️ Aviso ao sincronizar Tabela Educação:", e.message);
      }
    }

    console.log(`\n🎉 Sincronização concluída com sucesso!`);
    console.log(`📂 Arquivo salvo em: ${outputPath}`);
    projects.forEach((p) => {
      console.log(` • [${p.slug}] ${p.title} -> Categoria/Stack: ${p.category} | ${p.tags.length} tags`);
    });
  } catch (err) {
    console.error("❌ Erro ao sincronizar:", err.message);
    process.exit(1);
  }
}

run();
