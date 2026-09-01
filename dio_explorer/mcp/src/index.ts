#!/usr/bin/env node
/**
 * DIO Explorer — MCP Server
 *
 * Transportes suportados:
 *   stdio (padrão)  — para uso local via Bob / Claude Desktop
 *   http            — para acesso remoto via HTTPS/SSO/API
 *                     Inicie com: MCP_TRANSPORT=http node build/index.js
 *                     Porta padrão: 3333 (MCP_PORT)
 *                     Auth opcional: MCP_API_KEY (Bearer token)
 *
 * Tools expostas:
 *   trilha          — busca trilhas por tecnologia e retorna plano de estudos
 *   desafio         — gera desafio de código aleatório por tecnologia e nível
 *   certificado     — gera certificado fictício em Markdown
 *   listar_trilhas  — lista todas as trilhas disponíveis no JSON
 *   carreira        — roteiro de carreira tech com salário, stack e roadmap
 *
 * Interface Web:
 *   Em modo HTTP, a interface é servida em http://localhost:PORT/ui
 */

import { McpServer }           from '@modelcontextprotocol/sdk/server/mcp.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import { StreamableHTTPServerTransport } from '@modelcontextprotocol/sdk/server/streamableHttp.js';
import { z }                   from 'zod';
import express, { Request, Response, NextFunction } from 'express';
import { fileURLToPath }       from 'url';
import { dirname, resolve }    from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname  = dirname(__filename);
const UI_DIR     = resolve(__dirname, '../../interface');

import {
  carregarTrilhas,
  buscarTrilhasPorTecnologia,
  formatarPlanoDeEstudos,
  gerarDesafio,
  formatarDesafio,
  gerarCertificado,
} from './trilhas-service.js';

// ─── configuração ─────────────────────────────────────────────────────────────

const TRANSPORT  = process.env['MCP_TRANSPORT'] ?? 'stdio';
const HTTP_PORT  = parseInt(process.env['MCP_PORT'] ?? '3333', 10);
const API_KEY    = process.env['MCP_API_KEY'];           // opcional — Bearer token

// ─── instância do servidor MCP ────────────────────────────────────────────────

const server = new McpServer({
  name   : 'dio-explorer',
  version: '1.0.0',
});

// ─── tool: listar_trilhas ─────────────────────────────────────────────────────

server.registerTool(
  'listar_trilhas',
  {
    description: 'Lista todas as trilhas disponíveis no DIO Explorer com nome, tecnologias e nível.',
    inputSchema: z.object({}),
  },
  async () => {
    try {
      const db = carregarTrilhas();
      const lista = db.trilhas.map(t =>
        `• [#${t.id}] **${t.nome}** — ${t.nivel} | Techs: ${t.tecnologias.join(', ')}`
      ).join('\n');
      return {
        content: [{
          type: 'text' as const,
          text: `# 📚 Trilhas DIO disponíveis (${db.total_trilhas})\n\n${lista}`,
        }],
      };
    } catch (err) {
      return {
        content: [{ type: 'text' as const, text: `Erro ao carregar trilhas: ${String(err)}` }],
        isError: true,
      };
    }
  }
);

// ─── tool: trilha ─────────────────────────────────────────────────────────────

server.registerTool(
  'trilha',
  {
    description: 'Busca trilhas DIO por tecnologia e retorna um plano de estudos completo em Markdown.',
    inputSchema: z.object({
      tecnologia: z.string().describe('Nome da tecnologia a buscar (ex: Java, React, Python)'),
    }),
  },
  async ({ tecnologia }) => {
    try {
      const db      = carregarTrilhas();
      const achadas = buscarTrilhasPorTecnologia(tecnologia, db.trilhas);

      if (achadas.length === 0) {
        const sugestoes = db.trilhas.slice(0, 5).map(t => t.nome).join(', ');
        return {
          content: [{
            type: 'text' as const,
            text: `❌ Nenhuma trilha encontrada para **"${tecnologia}"**.\n\n💡 Sugestões: ${sugestoes}`,
          }],
        };
      }

      // retorna a mais específica (trilha cujo nome contém a tecnologia) ou a primeira
      const trilha = achadas.find(t => t.nome.toLowerCase().includes(tecnologia.toLowerCase()))
        ?? achadas[0];

      const plano = formatarPlanoDeEstudos(trilha);

      const extra = achadas.length > 1
        ? `\n\n---\n> 💡 **${achadas.length - 1} trilha(s) relacionada(s):** ${achadas.slice(1).map(t => t.nome).join(', ')}`
        : '';

      return {
        content: [{ type: 'text' as const, text: plano + extra }],
      };
    } catch (err) {
      return {
        content: [{ type: 'text' as const, text: `Erro: ${String(err)}` }],
        isError: true,
      };
    }
  }
);

// ─── tool: desafio ────────────────────────────────────────────────────────────

server.registerTool(
  'desafio',
  {
    description: 'Gera um desafio de código aleatório para uma tecnologia e nível escolhidos.',
    inputSchema: z.object({
      tecnologia: z.string().describe('Tecnologia do desafio (ex: Java, Python, React)'),
      nivel     : z.enum(['basico', 'intermediario', 'avancado'])
                   .optional()
                   .describe('Nível de dificuldade: basico | intermediario (padrão) | avancado'),
    }),
  },
  async ({ tecnologia, nivel }) => {
    try {
      const resultado = gerarDesafio(tecnologia, nivel);
      const md        = formatarDesafio(resultado);
      return { content: [{ type: 'text' as const, text: md }] };
    } catch (err) {
      return {
        content: [{ type: 'text' as const, text: `Erro: ${String(err)}` }],
        isError: true,
      };
    }
  }
);

// ─── tool: certificado ────────────────────────────────────────────────────────

server.registerTool(
  'certificado',
  {
    description: 'Gera um certificado fictício em Markdown com nome do aluno e trilha concluída.',
    inputSchema: z.object({
      nome_aluno: z.string().describe('Nome completo do aluno'),
      tecnologia : z.string().describe('Tecnologia ou nome da trilha concluída (ex: Java, React)'),
    }),
  },
  async ({ nome_aluno, tecnologia }) => {
    try {
      const db      = carregarTrilhas();
      const achadas = buscarTrilhasPorTecnologia(tecnologia, db.trilhas);
      const trilha  = achadas.find(t => t.nome.toLowerCase().includes(tecnologia.toLowerCase()))
        ?? achadas[0]
        ?? null;

      if (!trilha) {
        return {
          content: [{
            type: 'text' as const,
            text: `❌ Nenhuma trilha encontrada para **"${tecnologia}"**. Verifique o nome e tente novamente.`,
          }],
        };
      }

      const md = gerarCertificado(nome_aluno, trilha);
      return { content: [{ type: 'text' as const, text: md }] };
    } catch (err) {
      return {
        content: [{ type: 'text' as const, text: `Erro: ${String(err)}` }],
        isError: true,
      };
    }
  }
);

// ─── tool: carreira ───────────────────────────────────────────────────────────

server.registerTool(
  'carreira',
  {
    description: 'Exibe um roteiro de carreira tech com trilhas recomendadas, faixa salarial e roadmap.',
    inputSchema: z.object({
      area: z.string().describe('Cargo ou área de interesse (ex: Back-end, DevOps, AI Engineer, Mobile)'),
    }),
  },
  async ({ area }) => {
    try {
      const db = carregarTrilhas();

      // Trilhas de carreira (campo categoria = 'carreira')
      type AnyTrail = Record<string, unknown>;
      const allAsAny = db.trilhas as unknown as AnyTrail[];
      const careerTrails = allAsAny
        .filter(t => (t['categoria'] as string) === 'carreira')
        .filter(t => {
          const haystack = [t['nome'], t['cargo_alvo'], ...(t['tecnologias'] as string[])]
            .join(' ').toLowerCase();
          return area.toLowerCase().split(' ').some(w => haystack.includes(w));
        });

      // Trilhas de formação relacionadas
      const formTrails = buscarTrilhasPorTecnologia(area, db.trilhas)
        .filter(t => !(t as unknown as AnyTrail)['categoria']);

      if (careerTrails.length === 0 && formTrails.length === 0) {
        const sugestoes = allAsAny
          .filter(t => (t['categoria'] as string) === 'carreira')
          .slice(0, 3)
          .map(t => `• ${t['nome'] as string} (${t['cargo_alvo'] as string})`)
          .join('\n');
        return {
          content: [{
            type: 'text' as const,
            text: `❌ Nenhuma trilha de carreira encontrada para **"${area}"**.\n\n💡 **Carreiras disponíveis:**\n${sugestoes}`,
          }],
        };
      }

      const careerBlock = careerTrails.map(t => {
        const tr = t as Record<string, unknown>;
        const promo = (tr['promocoes'] as Record<string, unknown>);
        const promoTxt = (promo?.['desconto_percentual'] as number) > 0
          ? `🔥 **${promo['desconto_percentual']}% OFF** · Cupom: \`${promo['cupom']}\` · Válido: ${promo['validade']}`
          : '_Sem promoção ativa._';
        const lives = ((tr['lives_ao_vivo'] as Array<Record<string, unknown>>) ?? [])
          .map(l => `| ${l['data']} | ${l['titulo']} | ${l['instrutor']} |`).join('\n');
        return `### 🎯 ${tr['nome'] as string}
**Cargo-alvo:** ${tr['cargo_alvo'] as string}
**Nível:** ${tr['nivel'] as string} · **Módulos:** ${tr['numero_de_modulos'] as number} · **XP:** ${(tr['xp_total'] as number).toLocaleString('pt-BR')} XP
**Salário médio (BR):** ${tr['salario_medio_brl'] as string}
**Badges:** ${(tr['badges_disponiveis'] as string[]).map(b => `🥇 ${b}`).join(' · ')}
**Promoção:** ${promoTxt}

#### 📡 Lives relacionadas
| Data | Título | Instrutor |
|------|--------|-----------|
${lives}`;
      }).join('\n\n---\n\n');

      const formBlock = formTrails.slice(0, 4).map(t => {
        const tecnologias = (t.tecnologias ?? []).slice(0, 4).join(', ');
        return `- **${t.nome}** (${t.nivel}) — ${tecnologias}`;
      }).join('\n');

      const text = `## 🚀 Roteiro de Carreira — ${area}

> *"A carreira em tech não é uma corrida — é uma jornada de aprendizado contínuo."*

---

${careerBlock}

---

### 📚 Formações Pré-requisito recomendadas
${formBlock || '_Nenhuma formação de base localizada para esta área._'}

---

### 🧭 Próximos passos
1. Comece pelas formações de base listadas acima
2. Avance para a trilha de carreira ao dominar os fundamentos
3. Participe das lives ao vivo para networking e aprendizado real
4. Monte seu portfólio com os projetos dos desafios
5. Use o comando \`/certificado\` ao concluir cada trilha
`;

      return { content: [{ type: 'text' as const, text }] };
    } catch (err) {
      return {
        content: [{ type: 'text' as const, text: `Erro: ${String(err)}` }],
        isError: true,
      };
    }
  }
);

// ─── transporte: stdio ────────────────────────────────────────────────────────

async function runStdio(): Promise<void> {
  const transport = new StdioServerTransport();
  await server.connect(transport);
  console.error('[dio-explorer-mcp] Rodando em modo stdio');
}

// ─── transporte: HTTP (Streamable HTTP / SSE) ─────────────────────────────────

async function runHttp(): Promise<void> {
  const app = express();
  app.use(express.json());

  // Middleware de autenticação opcional via Bearer token
  app.use((req: Request, res: Response, next: NextFunction) => {
    if (!API_KEY) return next();
    const auth = req.headers['authorization'] ?? '';
    if (auth !== `Bearer ${API_KEY}`) {
      res.status(401).json({ error: 'Unauthorized — forneça um Bearer token válido em Authorization' });
      return;
    }
    next();
  });

  // Servir interface web em /ui
  app.use('/ui', express.static(UI_DIR));
  app.use('/data', express.static(resolve(UI_DIR, '../data')));

  // Endpoint de health / info
  app.get('/', (_req: Request, res: Response) => {
    res.json({
      name     : 'dio-explorer-mcp',
      version  : '1.0.0',
      status   : 'running',
      transport: 'http',
      tools    : ['listar_trilhas', 'trilha', 'desafio', 'certificado', 'carreira'],
      interface: `http://localhost:${HTTP_PORT}/ui`,
      auth     : API_KEY ? 'Bearer token required' : 'none',
      docs     : 'https://github.com/sua-org/dio-explorer',
    });
  });

  // Endpoint MCP — Streamable HTTP
  app.post('/mcp', async (req: Request, res: Response) => {
    const transport = new StreamableHTTPServerTransport({
      sessionIdGenerator: undefined,  // stateless — uma sessão por request
    });
    res.on('close', () => transport.close());
    await server.connect(transport);
    await transport.handleRequest(req, res, req.body);
  });

  // GET /mcp — SSE para clientes que suportam server-sent events
  app.get('/mcp', async (req: Request, res: Response) => {
    const transport = new StreamableHTTPServerTransport({
      sessionIdGenerator: undefined,
    });
    res.on('close', () => transport.close());
    await server.connect(transport);
    await transport.handleRequest(req, res);
  });

  app.listen(HTTP_PORT, () => {
    console.error(`[dio-explorer-mcp] HTTP server ouvindo na porta ${HTTP_PORT}`);
    console.error(`[dio-explorer-mcp] Endpoint MCP: http://localhost:${HTTP_PORT}/mcp`);
    console.error(`[dio-explorer-mcp] Health check: http://localhost:${HTTP_PORT}/`);
    if (API_KEY) {
      console.error('[dio-explorer-mcp] Autenticação ativa — Bearer token obrigatório');
    } else {
      console.error('[dio-explorer-mcp] ⚠️  Sem autenticação — defina MCP_API_KEY para proteger o endpoint');
    }
  });
}

// ─── entrypoint ───────────────────────────────────────────────────────────────

async function main(): Promise<void> {
  if (TRANSPORT === 'http') {
    await runHttp();
  } else {
    await runStdio();
  }
}

main().catch((err) => {
  console.error('[dio-explorer-mcp] Erro fatal:', err);
  process.exit(1);
});
