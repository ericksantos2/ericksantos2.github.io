# ⚡ Erick Santos // Portfólio Neobrutalista

Portfólio profissional de desenvolvimento de software com estética **Neobrutalista monocromática**, suporte a **modo claro/escuro**, páginas dedicadas para projetos com renderização Markdown e arquitetura desacoplada gerenciada via **Notion como Headless CMS** com deploy estático automatizado no **GitHub Pages**.

---

## 🛠️ Tecnologias & Arquitetura

- **Framework Web:** Next.js 16 (App Router com Turbopack)
- **Linguagem:** TypeScript (tipagem estrita)
- **Estilização:** Tailwind CSS v4 (design Neobrutalista monocromático de alto contraste)
- **CMS Headless:** Notion API (gerenciamento de projetos, bio, stacks, contatos e formação)
- **Hospedagem & CI/CD:** GitHub Pages com GitHub Actions agendadas (Cron) para compilação estática (`output: 'export'`)
- **Containerização:** Docker e Docker Compose prontos para execução de ambientes isolados

---

## ✨ Funcionalidades Principais

1. **Gestão 100% via Notion (Sem tocar no código para atualizar conteúdo):**
   - **Tabela Projetos:** Catálogo de projetos com links de repositório, showcase, status e tags.
   - **Páginas Detalhadas (`/projetos/[slug]`):** Corpo do Notion convertido diretamente em Markdown com suporte a embeds de vídeo.
   - **Tabela Stacks:** Categorias técnicas dinâmicas (Frontend, Backend, DevOps, etc.).
   - **Tabela Educação:** Formação acadêmica e cursos complementares.
   - **Tabela Contato:** Links sociais e canal principal de e-mail.
   - **Tabela Dados:** Bio da página inicial, manifesto e princípios fundamentais.

2. **Resiliência e Fallback Local-First:**
   - Se a API do Notion estiver inacessível ou sem credenciais no momento da build, o site utiliza automaticamente cópias locais em cache JSON (`src/data/*.json`), garantindo que a aplicação nunca quebre em produção.

3. **Automação de Deploy (GitHub Actions):**
   - O workflow `.github/workflows/deploy.yml` compila e publica o site automaticamente a cada `git push` e também de forma agendada via Cron (duas vezes ao dia) para buscar novos dados do Notion.

---

## 🚀 Como Executar Localmente

### 1. Clonar o repositório e instalar dependências
```bash
git clone https://github.com/ericksantos2/seu-repositorio.git
cd seu-repositorio
npm install
```

### 2. Configurar as variáveis de ambiente
Crie um arquivo `.env.local` baseado no `.env.example`:
```bash
cp .env.example .env.local
```
Preencha suas chaves e IDs das tabelas do Notion:
```env
NOTION_API_KEY=ntn_seu_token_aqui
NOTION_DATABASE_ID=id_da_tabela_projetos
NOTION_DADOS_DATABASE_ID=id_da_tabela_dados
NOTION_CONTATO_DATABASE_ID=id_da_tabela_contato
NOTION_STACKS_DATABASE_ID=id_da_tabela_stacks
NOTION_EDUCACAO_DATABASE_ID=id_da_tabela_educacao
NOTION_EXPERIENCIAS_DATABASE_ID=id_da_tabela_experiencias
```

### 3. Sincronizar dados do Notion para os JSONs locais (Opcional)
```bash
npm run sync:notion
```

### 4. Iniciar o servidor de desenvolvimento
```bash
npm run dev
```
Acesse [http://localhost:3000](http://localhost:3000).

### 5. Compilar para produção (Static Export)
```bash
npm run build
```
Os arquivos estáticos finais serão gerados na pasta `out/`.

---

## 🐳 Executando com Docker

Se preferir rodar a aplicação em um container Docker:

```bash
docker compose up --build
```
A aplicação estará disponível em [http://localhost:3000](http://localhost:3000).

---

## 📄 Licença

Este projeto está sob a licença [MIT](LICENSE).
