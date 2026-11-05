# ⚡ Portfólio Neobrutalista Monocromático (Notion CMS + GitHub Pages)

Um site inicial de portfólio moderno com **design neobrutalista**, paleta estritamente **monocromática** (tons de preto, branco e cinza), **modo escuro/claro** e suporte para usar o **Notion como backend (Headless CMS)**.

Construído com **Next.js 16 (App Router)** e **Tailwind CSS**, gerando uma exportação 100% estática (`output: 'export'`) pronta para o **GitHub Pages** sem nenhum custo de servidor.

---

## 🎨 Características do Design

- **Neobrutalismo puro**: Bordas pretas/brancas espessas (2px a 3px), sombras duras e deslocadas (`box-shadow` sem desfoque), botões táteis com efeito de clique físico.
- **Paleta 100% Monocromática**: Zero cores saturadas. Uso exclusivo de pretos (`#000000`, `#0a0a0a`), brancos (`#ffffff`) e cinzas equilibrados (`#f5f5f5`, `#e5e5e5`, `#262626`).
- **Alternador de Modo Claro e Escuro**: Botão tátil no topo com persistência no `localStorage` e suporte à preferência do sistema operacional.
- **Catálogo Interativo de Projetos**: Filtros dinâmicos por categoria (Full-Stack, Frontend, Backend, Mobile, Ferramentas) e busca instantânea por texto/tags.
- **Notion CMS ou Mock Local**: Se você ainda não configurou as chaves do Notion, o portfólio exibe automaticamente os dados de mock (`src/data/projects.json`). Quando conectar o Notion, ele consome diretamente a sua base!

---

## 🚀 Como Executar Localmente

### 1. Instalar as dependências
```bash
npm install
```

### 2. Rodar o servidor de desenvolvimento
```bash
npm run dev
```
Abra seu navegador em [http://localhost:3000](http://localhost:3000).

### 3. Gerar a build estática para o GitHub Pages
```bash
npm run build
```
O Next.js exportará os arquivos HTML, CSS e JS puros na pasta `out/`.

---

## 📦 Como Funciona com o GitHub Pages

O GitHub Pages requer arquivos HTML estáticos (não roda um servidor Node.js). O Next.js já está configurado com `output: "export"` no `next.config.ts`.

### Deploy Automático com GitHub Actions (Já configurado!):
1. Suba o projeto para um repositório no seu GitHub.
2. No seu repositório no GitHub, vá em **Settings** > **Pages**.
3. Em **Build and deployment** > **Source**, escolha: **GitHub Actions**.
4. Sempre que você fizer um `git push` para a branch `main`, o GitHub Actions compilará e publicará seu site automaticamente através do arquivo `.github/workflows/deploy.yml`!

> **Dica**: Se o seu repositório não for a página raiz (`usuario.github.io`) e sim um subdiretório (como `usuario.github.io/portfolio`), adicione `NEXT_PUBLIC_BASE_PATH=/portfolio` no arquivo `.env.local` ou nas variáveis do GitHub Actions.

---

## 📑 Como Integrar com o Notion (Passo a Passo)

Você pode gerenciar todos os projetos da sua carreira em uma planilha visual no Notion e sincronizá-los com o portfólio.

### Passo 1: Criar a Integração no Notion
1. Acesse o portal de integrações do Notion: [https://www.notion.so/my-integrations](https://www.notion.so/my-integrations).
2. Clique no botão **+ New integration** (Nova integração).
3. Dê um nome para a integração (ex: `Portfolio CMS`) e selecione o seu Workspace.
4. Em **Capabilities**, certifique-se de que a opção de **Read content** (Leitura) está habilitada.
5. Clique em salvar e copie o **Internal Integration Secret** (começa com `ntn_...` ou `secret_...`).

---

### Passo 2: Criar a Tabela (Database) no Notion
No seu Notion, crie uma nova página e adicione uma base de dados no formato de **Tabela (Table view)**.

Adicione as seguintes colunas com os respectivos tipos:

| Nome da Coluna | Tipo no Notion | Exemplo de Valor |
| :--- | :--- | :--- |
| **Title** (ou Nome) | `Title` | `Minimalist Task OS` |
| **Description** (ou Descricao) | `Text` (Rich text) | `Sistema de gestão de tarefas minimalista...` |
| **Category** (ou Categoria) | `Select` | `Full-Stack`, `Frontend`, `Backend`, `Mobile`, `Ferramenta` |
| **Tags** | `Multi-select` | `Next.js`, `TypeScript`, `TailwindCSS` |
| **Featured** | `Checkbox` | `[✓]` (Marcado para destaque) |
| **Year** (ou Ano) | `Text` ou `Number` | `2026` |
| **Role** (ou Funcao) | `Text` | `Lead Developer & UI Designer` |
| **GitHub** | `URL` | `https://github.com/usuario/repo` |
| **LiveUrl** | `URL` | `https://demo-projeto.vercel.app` |
| **Status** | `Select` | `Concluído`, `Em Progresso` |

---

### Passo 3: Conectar a Integração à Base de Dados
1. Abra a tabela que você acabou de criar no Notion.
2. No canto superior direito da página, clique nos três pontinhos **(...)**.
3. Desça até a opção **Conexões** (ou **Connect to**).
4. Procure o nome da integração que você criou no Passo 1 (ex: `Portfolio CMS`) e confirme.
5. Agora copie o link da sua tabela no Notion. A URL tem o seguinte formato:
   ```text
   https://www.notion.so/seu-workspace/a8aec43384f447ed84390e8e42c2e089?v=...
   ```
   A sequência alfanumérica de 32 caracteres entre a barra `/` e a interrogação `?` é o seu **DATABASE_ID**:
   `a8aec43384f447ed84390e8e42c2e089`

---

### Passo 4: Configurar o arquivo `.env.local`
Na raiz do projeto, crie um arquivo chamado `.env.local` (ou copie de `.env.example`):

```env
NOTION_API_KEY=ntn_sua_chave_secreta_aqui
NOTION_DATABASE_ID=seu_database_id_aqui
```

---

### Passo 5: Sincronizar os Projetos!
Você tem duas opções simples para sincronizar:

#### Opção A (Recomendada para GitHub Pages): Sincronizar via CLI
Rode no terminal:
```bash
npm run sync:notion
```
O script se conectará ao seu Notion, baixará todas as linhas da sua tabela e atualizará automaticamente o arquivo `src/data/projects.json`. Em seguida, basta rodar `npm run build` ou commitar para o GitHub!

#### Opção B: Build com Secrets no GitHub Actions
Se preferir que o próprio GitHub Actions busque os dados do Notion na hora da build:
1. Vá no seu repositório no GitHub: **Settings** > **Secrets and variables** > **Actions**.
2. Adicione dois Secrets:
   - `NOTION_API_KEY`
   - `NOTION_DATABASE_ID`
3. O workflow `.github/workflows/deploy.yml` já está configurado para ler esses Secrets e injetá-los no `next build` automaticamente!

---

## 📁 Estrutura do Projeto

```text
├── .github/
│   └── workflows/
│       └── deploy.yml          # Automação de deploy para GitHub Pages
├── scripts/
│   └── sync-notion.mjs         # Script CLI para sincronizar Notion -> JSON local
├── src/
│   ├── app/
│   │   ├── globals.css         # Estilização neobrutalista e variáveis de cor
│   │   ├── layout.tsx          # Shell raiz e metatags
│   │   └── page.tsx            # Página inicial (Server Component com fetch)
│   ├── components/
│   │   ├── About.tsx           # Seção sobre mim e trajetória
│   │   ├── ContactSection.tsx  # Seção de contato com botão de copiar email
│   │   ├── Footer.tsx          # Rodapé monocromático
│   │   ├── Hero.tsx            # Hero neobrutalista com badges e marquee
│   │   ├── Icons.tsx           # Ícones SVG leves (GitHub, LinkedIn)
│   │   ├── Navbar.tsx          # Barra de navegação com alternador de tema
│   │   ├── NotionModalGuide.tsx# Modal interativo de instruções do Notion
│   │   ├── PortfolioApp.tsx    # Orquestrador de estado do portfólio
│   │   ├── ProjectCard.tsx     # Card de projeto neobrutalista
│   │   ├── ProjectList.tsx     # Lista filtrável de projetos
│   │   ├── TechStack.tsx       # Grade de tecnologias e ferramentas
│   │   └── ThemeProvider.tsx   # Contexto do modo claro/escuro
│   ├── data/
│   │   └── projects.json       # Mock JSON inicial e cache local
│   ├── lib/
│   │   └── notion.ts           # Cliente e parser resiliente do Notion
│   └── types/
│       └── project.ts          # Definições TypeScript
├── .env.example                # Exemplo de variáveis de ambiente
├── next.config.ts              # Configuração estática (output: 'export')
└── package.json
```

---

## 📄 Licença

Distribuído sob a licença MIT. Sinta-se à vontade para customizar e usar em seu portfólio pessoal!
