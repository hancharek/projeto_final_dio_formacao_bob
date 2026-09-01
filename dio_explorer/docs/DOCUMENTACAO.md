# DIO Explorer — Documentação Completa do Projeto

> Projeto construído inteiramente com **IBM Bob** simulando funcionalidades da plataforma [DIO — Digital Innovation One](https://www.dio.me/).

---

## Índice

1. [Visão Geral](#1-visão-geral)
2. [Estrutura de Arquivos](#2-estrutura-de-arquivos)
3. [Prompts Utilizados — Histórico Completo](#3-prompts-utilizados--histórico-completo)
4. [Slash Commands](#4-slash-commands)
5. [Módulos de Código](#5-módulos-de-código)
6. [Testes Unitários](#6-testes-unitários)
7. [MCP Server](#7-mcp-server)
8. [Modos de Uso](#8-modos-de-uso)
9. [Insights para Profissionais](#9-insights-para-profissionais)
10. [Próximos Passos](#10-próximos-passos)

---

## 1. Visão Geral

O **DIO Explorer** é um projeto educacional construído com IA assistida (**IBM Bob**) que demonstra como ferramentas de agente modernas aceleram o desenvolvimento de sistemas completos — desde geração de dados até testes, MCP Server e documentação.

| Componente | Detalhes |
|---|---|
| Dataset | 75 trilhas fictícias em JSON (65 formações + 10 trilhas de carreira) |
| Slash Commands | `/trilha`, `/desafio`, `/certificado`, `/carreira` |
| Módulo JS | `src/trilhas.js` — lógica pura testável |
| Testes | Jest — 65 testes, 100% de cobertura |
| MCP Server | TypeScript — stdio + HTTP/SSE — 5 tools |
| Interface Web | Dashboard HTML/CSS/JS servido em `/ui` (modo HTTP) |
| Stack | JavaScript · TypeScript · Node.js · Jest · Express · MCP SDK |

---

## 2. Estrutura de Arquivos

```
projeto_final_dio_formacao_bob/
├── .bobignore                    # node_modules, .env, cache, certificados, *.tmp
├── .bob/
│   ├── mcp.json                  # registro do MCP Server (stdio + http)
│   └── commands/                 # slash commands locais do projeto
│       ├── trilha.md             → /trilha <tecnologia>
│       ├── desafio.md            → /desafio <tecnologia> <nivel>
│       ├── certificado.md        → /certificado <nome> <trilha>
│       └── carreira.md           → /carreira <cargo-ou-area>
│
└── dio_explorer/
    ├── package.json              # Jest + threshold 90%
    ├── data/
    │   └── trilhas_dio.json      # 75 trilhas (65 formações + 10 carreira)
    ├── src/
    │   ├── trilhas.js            # lógica de negócio (busca, desafio, certificado)
    │   └── trilhas.test.js       # 65 testes unitários
    ├── interface/
    │   └── index.html            # dashboard web servido em /ui (modo HTTP)
    ├── docs/
    │   ├── resultado-testes.txt  # relatório de execução
    │   └── certificados-emitidos/# certificados gerados pelo /certificado
    └── mcp/                      # MCP Server TypeScript
        ├── package.json
        ├── tsconfig.json
        ├── README.md
        ├── src/
        │   ├── index.ts          # entrypoint, transportes stdio/http + /ui
        │   └── trilhas-service.ts
        └── build/                # saída compilada
```

---

## 3. Prompts Utilizados — Histórico Completo

### Prompt 1 — Geração do dataset de trilhas

> *"Dentro do arquivo trilhas_dio.json crie uma lista extensa e detalhada com pelo menos 60 trilhas fictícias da DIO contendo nome, tecnologias, nível, número de módulos, XP total, badges disponíveis, promoções, vitalício e lives ao vivo."*

**Resultado:** `dio_explorer/trilhas_dio.json` com 65 trilhas de formação, cada uma com 9 campos estruturados. O Bob gerou dados coerentes por domínio (front-end, back-end, cloud, data, segurança, games...). _Posteriormente (Prompt 10) o dataset foi expandido para 75 trilhas com a adição de 10 trilhas de carreira._

---

### Prompt 2 — Mover arquivo para o local correto

> *"Move o arquivo que você criou no lugar errado, tem que ser dentro do projeto_final_dio_formacao_bob / dio_explorer / data / trilhas_dio.json."*

**Resultado:** Bob inspecionou a estrutura, detectou que o destino já existia vazio (`{}`), copiou o conteúdo para o local correto e removeu o arquivo criado no lugar errado.

---

### Prompt 3 — Criar .bobignore

> *"Crie um arquivo .bobignore que ignore node_modules, .env, data/cache-progresso, docs/certificados-emitidos e arquivos .tmp."*

**Resultado:** `.bobignore` criado na raiz do projeto com 5 regras de exclusão. Bob usou `execute_command` (PowerShell) por limitação de acesso a arquivos com padrão de ignore.

---

### Prompt 4 — Criar os 3 slash commands

> *"Crie uma slash command /trilha que recebe o nome de uma tecnologia e retorna um plano de estudos. Depois /desafio que gere um desafio de código aleatório. E por fim /certificado que gera um certificado fictício em markdown."*

**Resultado:** 3 arquivos em `.bob/commands/` com frontmatter YAML (`description` + `argument-hint`) e instruções detalhadas. Cada command usa `$1` / `$2` para argumentos.

---

### Prompt 5 — Confirmar e visualizar os slash commands

> *"Crie os slash commands para serem invocados localmente apenas neste projeto. Mas deixa eu visualizá-los aqui no chat do Bob."*

**Resultado:** Bob exibiu o conteúdo dos três `.md` no chat, confirmando localização e escopo local.

---

### Prompt 6 — Executar /trilha node

> *"/trilha node"*

**Resultado:** Bob executou o slash command, leu o JSON, encontrou a *Formação Node.js Developer* e retornou plano de estudos com 13 módulos numerados, 4 badges, promoção 35% OFF (cupom `NODE35`) e 2 lives ao vivo.

---

### Prompt 7 — Criar testes unitários com 90% de cobertura

> *"Crie arquivos de testes unitários para atingir uma cobertura de 90%. Teste o comando /trilha para trilhas de JAVA, gere um desafio para o aluno e um certificado. Grave os resultados em um arquivo de txt."*

**Resultado:** Criados `src/trilhas.js`, `src/trilhas.test.js` (65 testes), `package.json` com Jest e threshold 90%. Executados os testes (1 falha corrigida), atingiu **100% de cobertura**. Relatório gravado em `docs/resultado-testes.txt`.

---

### Prompt 8 — Criar MCP Server

> *"Crie um MCP Server para que pessoas possam acessar via HTTPS, SSO ou API. Usa a pasta MCP para isso."*

**Resultado:** MCP Server completo em TypeScript com 4 tools, transporte dual (stdio + HTTP/SSE), autenticação Bearer token opcional, health check, build limpo, registro em `.bob/mcp.json` e README com exemplos Nginx/Caddy.

---

### Prompt 9 — Esta documentação

> *"Crie a documentação de todo o projeto com todos os prompts usados, modos de uso, dicas e insights para futuros profissionais."*

**Resultado:** Este arquivo + one-pager HTML gerado pelo Bob.

---

### Prompt 10 — Evoluções: interface web + tema de carreira

> *"Implementa a interface para o projeto e adapta para outro tema."*

**Resultado:** Duas evoluções concretas:
1. **Interface Web** — dashboard em HTML/CSS/JS puro (`interface/index.html`) servido em `/ui` no modo HTTP, consumindo o MCP Server.
2. **Tema de carreira** — 10 trilhas com `"categoria": "carreira"` adicionadas ao JSON (com `cargo_alvo` e `salario_medio_brl`), o slash command `/carreira` e a tool MCP `carreira`. O dataset passou de 65 para **75 trilhas**.

---

## 4. Slash Commands

Ficam em `.bob/commands/` — **escopo local do projeto**.

### /trilha \<tecnologia\>

```
/trilha Java
/trilha React
/trilha Machine Learning
```

Retorna: Nível · Módulos · XP · Vitalício · Tecnologias · Badges · Promoção + Cupom · Lives ao vivo · 3 dicas para começar.

### /desafio \<tecnologia\> \<nivel\>

```
/desafio Java intermediario
/desafio Python avancado
/desafio React basico
```

Retorna: Enunciado · Critérios de aceitação · Entrada/Saída · Dicas · 3 casos de teste · XP · Tempo estimado.

### /certificado \<nome\> \<trilha\>

```
/certificado "João Silva" "Java Developer"
/certificado "Ana Costa" React
```

Retorna: Header ASCII · Tabela (aluno, trilha, nível, módulos, XP, data, código `DIO-AAAA-XXXXXX`) · Competências · Badges · URL de verificação fictícia.

### /carreira \<cargo-ou-area\>

```
/carreira Back-end
/carreira DevOps
/carreira "AI Engineer"
```

Retorna: Descrição da carreira · Faixa salarial (júnior/pleno/sênior) · Trilha de carreira recomendada · Formações pré-requisito · Roadmap em 6 etapas · Stack técnica essencial · Lives relacionadas · Dicas de mercado. Usa as 10 trilhas com `"categoria": "carreira"` do JSON (campos `cargo_alvo` e `salario_medio_brl`).

> 💡 Os slash commands são **prompts inteligentes** — instruem o Bob a ler o JSON, processar os dados e formatar a resposta. Não são scripts executáveis.

---

## 5. Módulos de Código

### src/trilhas.js (CommonJS)

| Função | Descrição |
|---|---|
| `carregarTrilhas(filePath?)` | Lê e parseia o JSON de trilhas |
| `buscarTrilhasPorTecnologia(termo, trilhas)` | Busca case-insensitive em nome e tecnologias |
| `formatarPlanoDeEstudos(trilha)` | Gera Markdown do plano de estudos |
| `gerarDesafio(tecnologia, nivel)` | Sorteia desafio do pool pelo nível |
| `formatarDesafio(resultado)` | Gera Markdown do desafio |
| `gerarCodigoCertificado()` | Gera código único `DIO-AAAA-XXXXXX` |
| `dataHoje()` | Retorna data atual em DD/MM/AAAA |
| `gerarCertificado(nome, trilha)` | Gera Markdown do certificado fictício |

### mcp/src/trilhas-service.ts (TypeScript/ESM)

Reescrita tipada com interfaces `Trilha`, `Database`, `Desafio`, union type `Nivel`. Compilado para ES2022/Node16.

---

## 6. Testes Unitários

### Resultados

| Métrica | Resultado | Threshold |
|---|---|---|
| Tests | **65 / 65** ✅ | — |
| Statements | **100%** | 90% |
| Branches | **100%** | 85% |
| Functions | **100%** | 90% |
| Lines | **100%** | 90% |
| Tempo | ~0.558 s | — |

### Executar

```bash
cd dio_explorer
npm install
npm test
```

---

## 7. MCP Server

### Tools

| Tool | Parâmetros |
|---|---|
| `listar_trilhas` | — |
| `trilha` | `tecnologia: string` |
| `desafio` | `tecnologia: string`, `nivel?: basico\|intermediario\|avancado` |
| `certificado` | `nome_aluno: string`, `tecnologia: string` |
| `carreira` | `area: string` |

### Iniciar

```bash
# Modo stdio (local/Bob)
cd dio_explorer/mcp
npm install && npm run build
node build/index.js

# Modo HTTP (remoto)
MCP_TRANSPORT=http MCP_PORT=3333 MCP_API_KEY=chave node build/index.js
```

### Endpoints HTTP

```
GET  /      → health check
POST /mcp   → endpoint MCP (Streamable HTTP)
GET  /mcp   → endpoint MCP via SSE
GET  /ui    → dashboard web (interface/index.html)
GET  /data  → arquivos estáticos do dataset
```

### Interface Web

Em modo HTTP, o servidor serve um **dashboard** em `http://localhost:PORT/ui` a partir de `dio_explorer/interface/index.html`. É uma SPA em HTML/CSS/JS puro que consome o MCP Server para navegar pelas trilhas, gerar desafios e certificados no navegador.

---

## 8. Modos de Uso

```bash
# Aluno explorando
/trilha Python

# Praticando com desafios
/desafio Java intermediario

# Recebendo certificado
/certificado "Maria Clara" "React Developer"

# Via API HTTP
curl -X POST http://localhost:3333/mcp \
  -H "Content-Type: application/json" \
  -d '{"jsonrpc":"2.0","id":1,"method":"tools/call","params":{"name":"trilha","arguments":{"tecnologia":"Java"}}}'
```

---

## 9. Insights para Profissionais

### Sobre geração de dados com IA
Inclua o schema completo no prompt. Quanto mais específico o campo desejado, mais consistente e reutilizável é o dado gerado.

### Slash commands como especificação de comportamento
Um slash command é uma **especificação de comportamento do agente**. Ao detalhar a estrutura de output esperada no `.md`, você garante consistência entre execuções.

### Separar lógica de prompts
Criar `src/trilhas.js` com lógica pura (sem IA) foi estratégico: permite testes determinísticos. Esta separação é a diferença entre um projeto testável e um que só funciona manualmente.

### Cuidado com aleatoriedade em testes
Ao testar funções com `Math.random()`, use sempre objetos fixos nas assertions. Use `DESAFIOS.intermediario[0]` em vez de `gerarDesafio()` dentro do `describe`.

### Boas práticas observadas
- `.bobignore` criado antes de qualquer geração de artefatos
- Lógica de negócio em JS puro, sem acoplamento com o agente
- TypeScript com tipagem completa para o MCP Server
- `console.error` (não `console.log`) em servidores stdio — stdout é o canal do protocolo
- Threshold de cobertura no `package.json` (não só no CI)
- Servidor HTTP com autenticação **opcional** — funciona sem auth em dev, protegido em produção

### Pontos de atenção
- O JSON de trilhas é estático — em produção, use API ou banco de dados
- MCP Server HTTP sem rate limiting nativo — adicione `express-rate-limit` antes de expor publicamente
- Pool de desafios com apenas 2 por nível — expandir para maior variedade

---

## 10. Próximos Passos

| Evolução | Descrição |
|---|---|
| SSO / OAuth2 | Middleware JWT para Okta, Azure AD |
| Banco de Dados | Migrar JSON estático para PostgreSQL/MongoDB |
| Deploy | Docker + Railway / Fly.io / Azure Container Apps |
| Gamificação | XP persistido por usuário, ranking, progresso |
| IA Generativa | Desafios dinâmicos com LangChain + OpenAI |
| Analytics | Dashboard Power BI / Grafana |

### Arquitetura v2.0 sugerida

```
[Cliente Bob/IDE]
    │
    ▼
[MCP Server HTTP] ←── Bearer / JWT (SSO)
    │
    ├── [API de Trilhas]  ←── PostgreSQL
    ├── [API de Desafios] ←── OpenAI / LangChain
    ├── [API de Certs]    ←── PDF (Puppeteer) + S3
    └── [API de XP]       ←── Redis (rankings real-time)
```

---

*DIO Explorer — Projeto Final DIO × IBM Bob | Documentação atualizada em 01/09/2026*
