import { Client } from "@notionhq/client";
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
  console.log("👉 Crie um arquivo .env.local com:");
  console.log("NOTION_API_KEY=ntn_sua_chave_aqui");
  console.log("NOTION_DATABASE_ID=seu_id_do_banco_aqui\n");
  process.exit(1);
}

// Helpers de extração
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

async function run() {
  try {
    console.log("⏳ Conectando ao Notion e buscando projetos...");
    const notion = new Client({ auth: apiKey });

    const response = await notion.request({
      path: `databases/${databaseId}/query`,
      method: "post",
    });

    console.log(`✅ ${response.results.length} projetos encontrados no Notion!`);

    const projects = response.results.map((page) => {
      const props = page.properties;

      const title =
        extractText(props.Title || props.Nome || props.Name || props.Projeto) || "Sem Título";

      const description =
        extractText(props.Description || props.Descricao || props.Resumo) ||
        "Sem descrição disponível.";

      const category =
        extractSelect(props.Category || props.Categoria, "Full-Stack");

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

      const status =
        extractSelect(props.Status, "Concluído");

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

    const outputPath = path.resolve(__dirname, "../src/data/projects.json");
    fs.writeFileSync(outputPath, JSON.stringify(projects, null, 2), "utf-8");

    console.log(`\n🎉 Arquivo atualizado com sucesso em:\n   ${outputPath}`);
    console.log("\nAgora você pode rodar 'npm run build' ou commitar os dados para o GitHub Pages!");
  } catch (err) {
    console.error("❌ Erro ao consultar o Notion:", err.message);
    process.exit(1);
  }
}

run();
