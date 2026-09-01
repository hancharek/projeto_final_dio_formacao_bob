import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, resolve } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname  = dirname(__filename);

// ─── tipos ────────────────────────────────────────────────────────────────────

export interface Live {
  titulo: string;
  data: string;
  instrutor: string;
}

export interface Promocao {
  desconto_percentual: number;
  validade: string | null;
  cupom: string | null;
}

export interface Trilha {
  id: number;
  nome: string;
  tecnologias: string[];
  nivel: string;
  numero_de_modulos: number;
  xp_total: number;
  badges_disponiveis: string[];
  promocoes: Promocao;
  vitalicio: boolean;
  lives_ao_vivo: Live[];
}

export interface Database {
  plataforma: string;
  url: string;
  trilhas: Trilha[];
  total_trilhas: number;
  gerado_em: string;
}

export interface Caso {
  entrada: string;
  esperado: string;
}

export interface Desafio {
  titulo: string;
  descricao: string;
  entrada: string;
  saida: string;
  dicas: string[];
  casos: Caso[];
  xp: number;
  tempo: string;
}

// ─── carrega o JSON de trilhas ─────────────────────────────────────────────────

const DATA_PATH = resolve(__dirname, '../../data/trilhas_dio.json');

export function carregarTrilhas(filePath: string = DATA_PATH): Database {
  const raw = readFileSync(filePath, 'utf8');
  return JSON.parse(raw) as Database;
}

// ─── /trilha ──────────────────────────────────────────────────────────────────

export function buscarTrilhasPorTecnologia(tecnologia: string, trilhas: Trilha[]): Trilha[] {
  if (!tecnologia || typeof tecnologia !== 'string') return [];
  const termo = tecnologia.trim().toLowerCase();
  return trilhas.filter(t =>
    t.tecnologias.some(tech => tech.toLowerCase().includes(termo)) ||
    t.nome.toLowerCase().includes(termo)
  );
}

export function formatarPlanoDeEstudos(trilha: Trilha | null | undefined): string {
  if (!trilha) return '❌ Trilha não encontrada.';

  const vitalicio = trilha.vitalicio ? '✅ Sim' : '❌ Não';
  const techs     = trilha.tecnologias.map(t => `- ${t}`).join('\n');
  const badges    = trilha.badges_disponiveis.map(b => `🥇 **${b}**`).join('\n');
  const promo     = trilha.promocoes.desconto_percentual > 0
    ? `- Desconto: **${trilha.promocoes.desconto_percentual}% OFF**\n- Cupom: \`${trilha.promocoes.cupom}\`\n- Válido até: ${trilha.promocoes.validade}`
    : '_Sem promoção ativa no momento._';
  const lives = trilha.lives_ao_vivo
    .map(l => `| ${l.data} | ${l.titulo} | ${l.instrutor} |`)
    .join('\n');

  return `## 🎓 Plano de Estudos — ${trilha.nome}

**Plataforma:** DIO — Digital Innovation One
**Nível:** ${trilha.nivel}
**Total de Módulos:** ${trilha.numero_de_modulos}
**XP Total:** ${trilha.xp_total.toLocaleString('pt-BR')} XP
**Vitalício:** ${vitalicio}

---

### 🛠️ Tecnologias Abordadas
${techs}

---

### 🏅 Badges Disponíveis
${badges}

---

### 🎁 Promoção Ativa
${promo}

---

### 📡 Próximas Lives ao Vivo
| 📅 Data | 🎙️ Título | 👨‍🏫 Instrutor |
|---------|-----------|--------------|
${lives}
`;
}

// ─── /desafio ─────────────────────────────────────────────────────────────────

export const DESAFIOS: Record<string, Desafio[]> = {
  basico: [
    {
      titulo: 'Calculadora de IMC',
      descricao: 'Crie um programa que receba peso (kg) e altura (m) e calcule o IMC, retornando a classificação correta.',
      entrada: 'peso=70.5 altura=1.75',
      saida: 'IMC: 23.02 — Peso normal',
      dicas: ['IMC = peso / (altura * altura)', 'Use if/else para classificar'],
      casos: [
        { entrada: 'peso=50, altura=1.70', esperado: 'IMC: 17.30 — Abaixo do peso' },
        { entrada: 'peso=85, altura=1.70', esperado: 'IMC: 29.41 — Sobrepeso' },
        { entrada: 'peso=110, altura=1.70', esperado: 'IMC: 38.06 — Obesidade grau II' },
      ],
      xp: 350,
      tempo: '45 minutos',
    },
    {
      titulo: 'Verificador de Palíndromo',
      descricao: 'Implemente um método que retorne true se a string for palíndromo, ignorando espaços e capitalização.',
      entrada: '"racecar"',
      saida: 'true',
      dicas: ['Remova espaços e converta para minúsculas', 'Compare a string com sua reversa'],
      casos: [
        { entrada: '"racecar"', esperado: 'true' },
        { entrada: '"hello"', esperado: 'false' },
        { entrada: '"Ame a ema"', esperado: 'true' },
      ],
      xp: 300,
      tempo: '30 minutos',
    },
  ],
  intermediario: [
    {
      titulo: 'API de Gerenciamento de Tarefas',
      descricao: 'Construa uma API REST com Spring Boot que gerencie uma lista de tarefas (TODO list) com endpoints CRUD e filtro por status.',
      entrada: 'POST /tasks { "title": "Estudar Java", "status": "pending" }',
      saida: '{ "id": 1, "title": "Estudar Java", "status": "pending" }',
      dicas: ['Use @RestController e @RequestBody', 'Armazene em Map<Long, Task> ou H2', 'Implemente @Valid com @NotBlank'],
      casos: [
        { entrada: 'GET /tasks', esperado: 'Lista com todas as tarefas' },
        { entrada: 'PUT /tasks/1 { "status": "done" }', esperado: 'Tarefa atualizada' },
        { entrada: 'DELETE /tasks/99', esperado: '404 Not Found' },
      ],
      xp: 900,
      tempo: '2 horas',
    },
    {
      titulo: 'Sistema de Estoque com Collections',
      descricao: 'Sistema de controle de estoque usando Java Collections com ordenação por Comparator e Stream API.',
      entrada: 'Produto("Notebook", 3500.0, 5)',
      saida: 'Produtos ordenados por preço: [Mouse R$50, Teclado R$150, Notebook R$3500]',
      dicas: ['Use ArrayList<Produto> com Comparator.comparing()', 'Filtre com stream().filter()', 'Implemente equals() e hashCode()'],
      casos: [
        { entrada: 'addProduct("Monitor", 800.0, 2)', esperado: 'Produto adicionado' },
        { entrada: 'removeProduct("Monitor")', esperado: 'Produto removido' },
        { entrada: 'listByPrice()', esperado: 'Lista ordenada do mais barato' },
      ],
      xp: 750,
      tempo: '1h30',
    },
  ],
  avancado: [
    {
      titulo: 'Microsserviço de Autenticação com JWT',
      descricao: 'Microsserviço completo com Spring Boot 3, Spring Security 6, JWT com claims customizados, refresh token com rotação e blacklist em Redis.',
      entrada: 'POST /auth/login { "email": "dev@dio.me", "password": "Secure@123" }',
      saida: '{ "accessToken": "eyJ...", "refreshToken": "eyJ...", "expiresIn": 900 }',
      dicas: ['Use JJWT para gerar e validar tokens', 'Armazene refresh tokens no Redis com TTL', 'Implemente OncePerRequestFilter'],
      casos: [
        { entrada: 'Credenciais inválidas', esperado: '401 Unauthorized' },
        { entrada: 'POST /auth/refresh com token válido', esperado: 'Novo accessToken + refreshToken rotacionado' },
        { entrada: 'POST /auth/logout', esperado: 'Token adicionado à blacklist' },
      ],
      xp: 2500,
      tempo: '5 a 8 horas',
    },
    {
      titulo: 'Pipeline Assíncrono com Kafka',
      descricao: 'Sistema de processamento de pedidos com Apache Kafka, dead-letter topic e retentativas com backoff exponencial.',
      entrada: '{ "orderId": "ORD-001", "items": [...], "totalValue": 450.00 }',
      saida: 'Pedido processado. DLT para erros após 3 tentativas.',
      dicas: ['Use @KafkaListener com ConcurrentKafkaListenerContainerFactory', 'Configure RetryableTopic com DLT', 'Implemente idempotência por orderId'],
      casos: [
        { entrada: 'Evento válido', esperado: 'Consumido em < 500ms' },
        { entrada: 'Evento com totalValue negativo', esperado: 'Publicado no DLT após 3 tentativas' },
        { entrada: 'Mesmo orderId duas vezes', esperado: 'Segundo evento ignorado' },
      ],
      xp: 2800,
      tempo: '6 a 10 horas',
    },
  ],
};

type Nivel = 'basico' | 'intermediario' | 'avancado';

export function normalizarNivel(nivel: string | undefined): Nivel {
  const norm = (nivel ?? 'intermediario')
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '');
  return (['basico', 'intermediario', 'avancado'] as Nivel[]).includes(norm as Nivel)
    ? (norm as Nivel)
    : 'intermediario';
}

export function gerarDesafio(tecnologia: string, nivel: string | undefined): { tecnologia: string; nivel: Nivel; desafio: Desafio } {
  const nivelValido = normalizarNivel(nivel);
  const pool        = DESAFIOS[nivelValido];
  const desafio     = pool[Math.floor(Math.random() * pool.length)];
  return { tecnologia, nivel: nivelValido, desafio };
}

export function formatarDesafio({ tecnologia, nivel, desafio }: { tecnologia: string; nivel: string; desafio: Desafio }): string {
  const labels: Record<string, string> = { basico: 'Básico', intermediario: 'Intermediário', avancado: 'Avançado' };
  const nivelLabel = labels[nivel] ?? nivel;
  const casos  = desafio.casos.map(c => `**Entrada:** ${c.entrada}\n**Saída esperada:** ${c.esperado}`).join('\n\n');
  const dicas  = desafio.dicas.map(d => `- ${d}`).join('\n');

  return `## ⚔️ Desafio DIO — ${tecnologia} | Nível: ${nivelLabel}

> *"Cada linha de código é um passo mais perto do seu próximo nível."*

---

### 📋 ${desafio.titulo}
${desafio.descricao}

---

### 📥 Entrada Esperada
\`${desafio.entrada}\`

### 📤 Saída Esperada
\`${desafio.saida}\`

---

### 💡 Dicas
${dicas}

---

### 🧪 Casos de Teste
${casos}

---

### 🏆 Pontuação
- **XP:** ${desafio.xp} XP
- **Tempo estimado:** ${desafio.tempo}
`;
}

// ─── /certificado ─────────────────────────────────────────────────────────────

export function gerarCodigoCertificado(): string {
  const ano   = new Date().getFullYear();
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  const sufixo = Array.from({ length: 6 }, () => chars[Math.floor(Math.random() * chars.length)]).join('');
  return `DIO-${ano}-${sufixo}`;
}

export function dataHoje(): string {
  return new Date().toLocaleDateString('pt-BR');
}

export function gerarCertificado(nomeAluno: string, trilha: Trilha | null | undefined): string {
  if (!nomeAluno || !trilha) return '❌ Nome do aluno e trilha são obrigatórios.';

  const codigo = gerarCodigoCertificado();
  const badges = trilha.badges_disponiveis.map(b => `🥇 ${b}`).join('\n');
  const techs  = trilha.tecnologias.map((t, i) => `${i + 1}. ✅ ${t}`).join('\n');

  return `\`\`\`
╔══════════════════════════════════════════════════════════════╗
║                                                              ║
║          🎓  CERTIFICADO DE CONCLUSÃO  🎓                    ║
║                  Digital Innovation One                      ║
║                       dio.me                                 ║
║                                                              ║
╚══════════════════════════════════════════════════════════════╝
\`\`\`

---

# 📜 Certificado de Conclusão

**A DIO — Digital Innovation One certifica que:**

## 🏅 ${nomeAluno}

**concluiu com êxito a formação:**

# 🚀 ${trilha.nome}

---

| Campo | Informação |
|-------|------------|
| 👤 **Aluno** | ${nomeAluno} |
| 🎯 **Trilha** | ${trilha.nome} |
| 📊 **Nível** | ${trilha.nivel} |
| 📦 **Módulos Concluídos** | ${trilha.numero_de_modulos} módulos |
| ⭐ **XP Conquistado** | ${trilha.xp_total.toLocaleString('pt-BR')} XP |
| 📅 **Data de Emissão** | ${dataHoje()} |
| 🔑 **Código** | \`${codigo}\` |

---

### 🛠️ Competências Certificadas
${techs}

---

### 🏆 Badges Conquistadas
${badges}

---

### 🌐 Verificação
> **https://www.dio.me/certificate/${codigo}**

---

*"O aprendizado contínuo é o caminho para a inovação."*
**— DIO, Digital Innovation One**

---

\`\`\`
Assinado digitalmente pela DIO Platform
dio.me | educação para o futuro
\`\`\`
`;
}
