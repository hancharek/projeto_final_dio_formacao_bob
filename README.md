# 🎓 DIO Explorer

> Projeto final da Formação **IBM Bob** na [DIO — Digital Innovation One](https://www.dio.me/).
> Construído inteiramente com IA assistida, demonstra como o IBM Bob pode ser usado para criar, testar e documentar uma solução completa de ponta a ponta.

---

## O que é o DIO Explorer

O **DIO Explorer** simula funcionalidades da plataforma DIO. A pessoa usuária pode:

- **Consultar uma trilha** de aprendizado por tecnologia e receber um plano de estudos detalhado
- **Receber um desafio de código** personalizado pela tecnologia e nível desejado
- **Gerar um certificado fictício** em Markdown ao concluir uma trilha

- **Explorar uma carreira** por cargo ou área e receber roteiro com faixa salarial, roadmap e stack essencial

O projeto conta com uma base de **75 trilhas fictícias** — 65 formações (Python, Java, React, DevOps, Cloud, Machine Learning, Blockchain, Game Dev e muito mais) e 10 trilhas de carreira com cargo-alvo e faixa salarial. Inclui um **MCP Server** TypeScript para acesso via HTTP/API com **dashboard web** integrado, e uma suíte de **65 testes unitários** com 100% de cobertura.

---

## Como Executar o Projeto

### Pré-requisitos

- [Node.js](https://nodejs.org/) v18 ou superior
- npm v9 ou superior

### 1. Clonar o repositório

```bash
git clone <url-do-repositorio>
cd projeto_final_dio_formacao_bob
```

### 2. Instalar dependências dos testes

```bash
cd dio_explorer
npm install
```

### 3. (Opcional) Instalar e compilar o MCP Server

```bash
cd dio_explorer/mcp
npm install
npm run build
```

---

## Como Usar os Comandos

Os quatro comandos principais são **slash commands do IBM Bob**, armazenados localmente em `.bob/commands/`. Eles só aparecem quando o projeto está aberto no Bob.

### `/trilha <tecnologia>`

Busca a trilha mais relevante no JSON e retorna um plano de estudos completo.

```
/trilha Java
/trilha Python
/trilha React
/trilha Machine Learning
/trilha DevOps
```

**O que retorna:**
- Nível da trilha · Total de módulos · XP total · Vitalício ou não
- Lista de tecnologias abordadas
- Módulos do percurso numerados
- Badges disponíveis
- Promoção ativa com cupom de desconto
- Próximas lives ao vivo com data e instrutor
- 3 dicas práticas para começar agora

---

### `/desafio <tecnologia> <nivel>`

Gera um desafio de código aleatório calibrado pelo nível escolhido.

```
/desafio Java basico
/desafio Python intermediario
/desafio React avancado
/desafio Go intermediario
```

Níveis aceitos: `basico` · `intermediario` · `avancado`

**O que retorna:**
- Enunciado do problema
- Critérios de aceitação
- Exemplo de entrada e saída esperada
- Dicas sem entregar a solução
- 3 casos de teste
- XP conquistável e tempo estimado

---

### `/certificado <nome> <trilha>`

Gera um certificado fictício em Markdown com código único.

```
/certificado "João Silva" "Java Developer"
/certificado "Ana Costa" React
/certificado "Maria Clara" Python
```

**O que retorna:**
- Header estilizado em ASCII
- Tabela com: aluno, trilha, nível, módulos, XP, data de emissão e código `DIO-AAAA-XXXXXX`
- Competências técnicas certificadas
- Badges conquistadas
- URL de verificação fictícia
- O certificado é salvo em `docs/certificados-emitidos/`

---

### `/carreira <cargo-ou-area>`

Gera um roteiro de carreira tech a partir das trilhas de carreira do JSON.

```
/carreira Back-end
/carreira DevOps
/carreira "AI Engineer"
/carreira Mobile
```

**O que retorna:**
- Descrição da carreira e seu impacto no mercado
- Faixa salarial estimada (júnior · pleno · sênior)
- Trilha de carreira recomendada com cargo-alvo
- Formações pré-requisito em ordem de progressão
- Roadmap em 6 etapas do iniciante ao sênior
- Stack técnica essencial agrupada por categoria
- Lives relacionadas e dicas de mercado

---

## Como Executar os Testes

```bash
cd dio_explorer
npm test
```

A suíte executa **65 testes unitários** com relatório de cobertura completo.

### Resultado esperado

```
Tests:       65 passed, 65 total
Snapshots:   0 total
Time:        ~0.5 s

----------|---------|----------|---------|---------|
File      | % Stmts | % Branch | % Funcs | % Lines |
----------|---------|----------|---------|---------|
trilhas.js|    100  |    100   |   100   |   100   |
----------|---------|----------|---------|---------|
```

### Grupos de testes

| Grupo | Testes | O que cobre |
|---|---|---|
| `carregarTrilhas()` | 3 | Parse JSON, campo total, erro de arquivo inexistente |
| `buscarTrilhasPorTecnologia()` | 8 | Busca exata, case-insensitive, parcial, null/undefined, JSON real |
| `formatarPlanoDeEstudos()` | 12 | Todos os campos, promoção, vitalício, lives |
| `gerarDesafio()` | 10 | Normalização de acentos, nível inválido, campos obrigatórios |
| `formatarDesafio()` | 8 | Título, tecnologia, rótulos de nível |
| `gerarCodigoCertificado()` | 3 | Padrão regex, unicidade, ano atual |
| `dataHoje()` | 2 | Formato e valor correto |
| `gerarCertificado()` | 13 | Nome, trilha, badges, competências, URL, código |
| **Fluxo Completo** (integração) | 6 | `/trilha → /desafio → /certificado` com JSON real |

---

## MCP Server — Acesso via API

O projeto inclui um **MCP Server** em TypeScript que expõe os comandos como tools acessíveis por qualquer cliente MCP (IBM Bob, Claude Desktop) ou via HTTP/API.

### Iniciar em modo local (stdio)

O servidor já está registrado em `.bob/mcp.json`. O Bob o carrega automaticamente ao abrir o projeto.

### Iniciar em modo HTTP (acesso remoto)

```bash
cd dio_explorer/mcp
MCP_TRANSPORT=http MCP_PORT=3333 node build/index.js
```

Depois de subir em modo HTTP, abra o **dashboard web** em `http://localhost:3333/ui`.

#### Endpoints

| Método | Rota | Descrição |
|---|---|---|
| `GET` | `/` | Health check |
| `POST` | `/mcp` | Endpoint MCP principal |
| `GET` | `/mcp` | Endpoint via SSE |
| `GET` | `/ui` | Dashboard web (interface) |
| `GET` | `/data` | Arquivos estáticos do dataset |

O servidor expõe **5 tools**: `listar_trilhas`, `trilha`, `desafio`, `certificado` e `carreira`.

#### Exemplo de chamada

```bash
curl -X POST http://localhost:3333/mcp \
  -H "Content-Type: application/json" \
  -d '{
    "jsonrpc": "2.0", "id": 1,
    "method": "tools/call",
    "params": { "name": "trilha", "arguments": { "tecnologia": "Java" } }
  }'
```

#### Com autenticação Bearer token

```bash
MCP_TRANSPORT=http MCP_PORT=3333 MCP_API_KEY=minha-chave node build/index.js
# Todas as requisições devem incluir: Authorization: Bearer minha-chave
```

---

## Melhorias Realizadas

Em relação ao projeto base descrito no desafio, foram adicionadas:

| Melhoria | Descrição |
|---|---|
| **75 trilhas** | Base muito além do mínimo — 65 formações + 10 trilhas de carreira, cobrindo front-end, back-end, cloud, IA, segurança, games e mais |
| **Evolução temática (carreira)** | Slash command `/carreira` + tool MCP `carreira` + trilhas com `cargo_alvo` e `salario_medio_brl` |
| **Interface web** | Dashboard HTML/CSS/JS servido em `/ui` que consome o MCP Server HTTP |
| **MCP Server dual transport** | Suporte a stdio (local) e HTTP/SSE (remoto) com autenticação opcional |
| **5 tools no MCP** | `listar_trilhas`, `trilha`, `desafio`, `certificado`, `carreira` |
| **100% de cobertura de testes** | Superou o threshold de 90% exigido, atingindo cobertura total |
| **Fluxo de integração** | Teste E2E que valida o fluxo completo `/trilha → /desafio → /certificado` |
| **Relatório de testes em TXT** | Resultado completo gravado em `docs/resultado-testes.txt` |
| **Documentação completa** | `docs/DOCUMENTACAO.md` com todos os prompts, insights e próximos passos |
| **TypeScript tipado** | MCP Server com interfaces completas (`Trilha`, `Database`, `Desafio`, `Nivel`) |
| **Normalização de acentos** | `/desafio Java avançado` funciona igual a `avancado` |

---

## O Que Aprendi Durante o Desafio

### Sobre IBM Bob como agente de desenvolvimento

- O Bob **lê arquivos antes de responder** — nunca alucina sobre código que não viu. Isso garante que cada mudança é baseada no estado real do projeto.
- Prompts em português funcionam perfeitamente; a qualidade da saída depende da **especificidade**, não do idioma.
- O ciclo "executar → falhar → corrigir" é natural. A falha no teste de aleatoriedade foi identificada e corrigida iterativamente em duas mensagens.

### Sobre slash commands

- Um slash command não é apenas um atalho — é uma **especificação de comportamento**. Ao detalhar a estrutura de output no `.md`, você garante consistência entre execuções.
- Arquivos em `.bob/commands/` têm **escopo local** — aparecem só neste projeto. Arquivos em `~/.bob/commands/` são globais.

### Sobre testes com funções aleatórias

- Ao testar funções com `Math.random()`, use objetos fixos nas assertions (`DESAFIOS.intermediario[0]`) em vez de capturar o resultado aleatório em nível de `describe`.

### Sobre MCP Servers

- Servidores stdio **nunca devem usar `console.log`** — o stdout é o canal do protocolo MCP. Use sempre `console.error` para logs.
- O suporte dual (stdio + HTTP) é valioso: desenvolvimento local sem overhead, produção com API.

### Sobre arquitetura de projetos com IA

- **Separar lógica de prompts** é fundamental: `src/trilhas.js` tem lógica pura testável; os slash commands têm as instruções de comportamento. Misturar os dois torna o projeto intestável.

---

## Estrutura do Projeto

```
projeto_final_dio_formacao_bob/
├── README.md                     ← você está aqui
├── .bobignore                    ← ignora node_modules, .env, cache, *.tmp
├── .bob/
│   ├── mcp.json                  ← registro do MCP Server
│   └── commands/
│       ├── trilha.md             ← /trilha
│       ├── desafio.md            ← /desafio
│       ├── certificado.md        ← /certificado
│       └── carreira.md           ← /carreira
└── dio_explorer/
    ├── data/
    │   └── trilhas_dio.json      ← 75 trilhas (65 formações + 10 carreira)
    ├── interface/
    │   └── index.html            ← dashboard web (/ui)
    ├── src/
    │   ├── trilhas.js            ← lógica de negócio
    │   └── trilhas.test.js       ← 65 testes unitários
    ├── docs/
    │   ├── DOCUMENTACAO.md       ← documentação completa
    │   ├── resultado-testes.txt  ← relatório de execução
    │   └── certificados-emitidos/← certificados gerados pelo /certificado
    └── mcp/
        ├── src/
        │   ├── index.ts          ← entrypoint MCP Server
        │   └── trilhas-service.ts← lógica TypeScript tipada
        └── build/                ← compilado pelo tsc
```

---

*Projeto desenvolvido com [IBM Bob](https://www.ibm.com/products/bob) · DIO — Digital Innovation One*
