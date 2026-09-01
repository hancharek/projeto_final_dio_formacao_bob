# DIO Explorer — MCP Server

Servidor MCP que expõe as funcionalidades do **DIO Explorer** (trilhas, desafios e certificados fictícios da [DIO](https://www.dio.me/)) para qualquer cliente compatível com o protocolo MCP — incluindo o **IBM Bob**, Claude Desktop e qualquer integração HTTP/API.

---

## 📦 Estrutura

```
mcp/
├── src/
│   ├── index.ts            # entrypoint — transportes stdio e HTTP
│   └── trilhas-service.ts  # lógica de negócio (busca, desafio, certificado)
├── build/                  # saída compilada (gerada pelo tsc)
├── package.json
├── tsconfig.json
└── README.md
```

---

## 🛠️ Tools disponíveis

| Tool | Descrição | Parâmetros |
|------|-----------|------------|
| `listar_trilhas` | Lista todas as 75 trilhas disponíveis | — |
| `trilha` | Busca por tecnologia e retorna plano de estudos em Markdown | `tecnologia: string` |
| `desafio` | Gera desafio de código aleatório | `tecnologia: string`, `nivel?: basico \| intermediario \| avancado` |
| `certificado` | Gera certificado fictício em Markdown | `nome_aluno: string`, `tecnologia: string` |
| `carreira` | Roteiro de carreira com salário, roadmap e stack | `area: string` |

---

## 🚀 Início rápido

### 1. Instalar e compilar

```bash
cd dio_explorer/mcp
npm install
npm run build
```

### 2. Modo stdio (local — IBM Bob / Claude Desktop)

O servidor já está registrado em `.bob/mcp.json`. Basta abrir o projeto no Bob e o servidor será iniciado automaticamente.

Para testar manualmente:

```bash
node build/index.js
```

### 3. Modo HTTP (acesso remoto / API)

```bash
MCP_TRANSPORT=http MCP_PORT=3333 node build/index.js
```

O servidor sobe em `http://localhost:3333`.

Para proteger com autenticação Bearer token:

```bash
MCP_TRANSPORT=http MCP_PORT=3333 MCP_API_KEY=minha-chave-secreta node build/index.js
```

Toda requisição deve incluir o header:
```
Authorization: Bearer minha-chave-secreta
```

---

## 🔌 Endpoints HTTP

| Método | Rota | Descrição |
|--------|------|-----------|
| `GET`  | `/`  | Health check — retorna info do servidor em JSON |
| `POST` | `/mcp` | Endpoint principal MCP (Streamable HTTP) |
| `GET`  | `/mcp` | Endpoint MCP via SSE (Server-Sent Events) |
| `GET`  | `/ui` | Dashboard web (interface/index.html) |
| `GET`  | `/data` | Arquivos estáticos do dataset |

> 💡 Em modo HTTP, abra `http://localhost:3333/ui` no navegador para usar o **dashboard web** que consome este servidor.

### Exemplo com curl

```bash
# Health check
curl http://localhost:3333/

# Chamada de tool via MCP HTTP (sem auth)
curl -X POST http://localhost:3333/mcp \
  -H "Content-Type: application/json" \
  -d '{
    "jsonrpc": "2.0",
    "id": 1,
    "method": "tools/call",
    "params": {
      "name": "trilha",
      "arguments": { "tecnologia": "Java" }
    }
  }'
```

### Exemplo com auth

```bash
curl -X POST http://localhost:3333/mcp \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer minha-chave-secreta" \
  -d '{ ... }'
```

---

## 🌐 Acesso remoto via HTTPS

Para expor o servidor publicamente com HTTPS, use um proxy reverso como **Nginx** ou **Caddy** na frente:

### Exemplo Caddy (Caddyfile)

```
dio.meudominio.com {
    reverse_proxy localhost:3333
}
```

### Exemplo Nginx

```nginx
server {
    listen 443 ssl;
    server_name dio.meudominio.com;

    ssl_certificate     /etc/letsencrypt/live/dio.meudominio.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/dio.meudominio.com/privkey.pem;

    location / {
        proxy_pass http://localhost:3333;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        # necessário para SSE:
        proxy_buffering off;
        proxy_cache off;
        proxy_read_timeout 3600s;
    }
}
```

---

## 🔧 Variáveis de Ambiente

| Variável | Padrão | Descrição |
|----------|--------|-----------|
| `MCP_TRANSPORT` | `stdio` | Transporte: `stdio` ou `http` |
| `MCP_PORT` | `3333` | Porta do servidor HTTP |
| `MCP_API_KEY` | _(vazio)_ | Chave Bearer para autenticação (opcional) |

---

## 📋 Registro no Bob (mcp.json)

O arquivo `.bob/mcp.json` já contém duas entradas:

- **`dio-explorer`** — modo stdio (ativo por padrão)
- **`dio-explorer-http`** — modo HTTP (desativado por padrão, `"disabled": true`)

Para ativar o modo HTTP, edite `.bob/mcp.json`:

```json
"dio-explorer-http": {
  "command": "node",
  "args": ["<caminho>/build/index.js"],
  "env": {
    "MCP_TRANSPORT": "http",
    "MCP_PORT": "3333",
    "MCP_API_KEY": "sua-chave-aqui"
  },
  "disabled": false
}
```

---

## 🔒 SSO / OAuth (futuro)

Para integração com SSO corporativo (Okta, Azure AD, etc.), o fluxo recomendado é:

1. Adicionar um middleware de validação de JWT no `app.use()` em `src/index.ts`
2. Verificar o token contra o JWKS endpoint do seu provedor de identidade
3. Extrair claims (email, roles) e usar para autorização por ferramenta

Exemplo de middleware JWT:
```typescript
import jwt from 'jsonwebtoken';
// Verificar token do SSO antes de rotear para /mcp
```

---

*DIO Explorer MCP Server — parte do projeto final DIO × Bob*
