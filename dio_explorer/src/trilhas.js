'use strict';

const fs   = require('fs');
const path = require('path');

// ─── helpers ──────────────────────────────────────────────────────────────────

/**
 * Carrega e faz o parse do arquivo JSON de trilhas.
 * @param {string} [filePath] – caminho opcional (útil para testes)
 * @returns {{ trilhas: Array }}
 */
function carregarTrilhas(filePath) {
  const target = filePath || path.resolve(__dirname, '../data/trilhas_dio.json');
  const raw    = fs.readFileSync(target, 'utf8');
  return JSON.parse(raw);
}

// ─── /trilha ──────────────────────────────────────────────────────────────────

/**
 * Busca trilhas cujas tecnologias contenham a string procurada (case-insensitive).
 * @param {string}    tecnologia
 * @param {object[]}  trilhas
 * @returns {object[]}
 */
function buscarTrilhasPorTecnologia(tecnologia, trilhas) {
  if (!tecnologia || typeof tecnologia !== 'string') return [];
  const termo = tecnologia.trim().toLowerCase();
  return trilhas.filter(t =>
    t.tecnologias.some(tech => tech.toLowerCase().includes(termo)) ||
    t.nome.toLowerCase().includes(termo)
  );
}

/**
 * Formata o plano de estudos de uma trilha em Markdown.
 * @param {object} trilha
 * @returns {string}
 */
function formatarPlanoDeEstudos(trilha) {
  if (!trilha) return '❌ Trilha não encontrada.';

  const vitalicio  = trilha.vitalicio ? '✅ Sim' : '❌ Não';
  const techs      = trilha.tecnologias.map(t => `- ${t}`).join('\n');
  const badges     = trilha.badges_disponiveis.map(b => `🥇 **${b}**`).join('\n');
  const promo      = trilha.promocoes.desconto_percentual > 0
    ? `- Desconto: **${trilha.promocoes.desconto_percentual}% OFF**\n- Cupom: \`${trilha.promocoes.cupom}\`\n- Válido até: ${trilha.promocoes.validade}`
    : '_Sem promoção ativa no momento._';

  const lives = trilha.lives_ao_vivo.map(l =>
    `| ${l.data} | ${l.titulo} | ${l.instrutor} |`
  ).join('\n');

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

const DESAFIOS = {
  basico: [
    {
      titulo: 'Calculadora de IMC',
      descricao: 'Crie um programa que receba peso (kg) e altura (m) e calcule o Índice de Massa Corporal (IMC), retornando a classificação (abaixo do peso, normal, sobrepeso, obeso).',
      entrada: 'Dois números: peso=70.5 altura=1.75',
      saida: 'IMC: 23.02 — Peso normal',
      dicas: ['Use a fórmula IMC = peso / (altura * altura)', 'Utilize if/else ou switch para classificar'],
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
      descricao: 'Implemente um método que receba uma String e retorne true se ela for um palíndromo (lida da mesma forma de trás para frente), ignorando espaços e capitalização.',
      entrada: '"A man a plan a canal Panama"',
      saida: 'true',
      dicas: ['Remova espaços e converta para minúsculas antes de comparar', 'Use StringBuilder.reverse() ou compare char a char'],
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
      descricao: 'Construa uma API REST com Spring Boot que gerencie uma lista de tarefas (TODO list). Implemente os endpoints CRUD completos, validação de campos obrigatórios e filtro de tarefas por status (pendente/concluída).',
      entrada: 'POST /tasks { "title": "Estudar Java", "status": "pending" }',
      saida: '{ "id": 1, "title": "Estudar Java", "status": "pending", "createdAt": "2025-07-14" }',
      dicas: ['Use @RestController, @RequestBody e @PathVariable', 'Armazene em um Map<Long, Task> em memória ou use H2 em memória', 'Implemente @Valid com @NotBlank para validação'],
      casos: [
        { entrada: 'GET /tasks', esperado: 'Lista com todas as tarefas' },
        { entrada: 'PUT /tasks/1 { "status": "done" }', esperado: 'Tarefa atualizada com status "done"' },
        { entrada: 'DELETE /tasks/99', esperado: '404 Not Found com mensagem de erro' },
      ],
      xp: 900,
      tempo: '2 horas',
    },
    {
      titulo: 'Sistema de Estoque com Collections',
      descricao: 'Crie um sistema de controle de estoque usando Java Collections. Implemente operações de adicionar produto, remover, atualizar quantidade e listar ordenado por nome ou preço usando Comparator e Stream API.',
      entrada: 'Produto("Notebook", 3500.0, 5)',
      saida: 'Produtos ordenados por preço: [Mouse R$50, Teclado R$150, Notebook R$3500]',
      dicas: ['Use ArrayList<Produto> com Comparator.comparing()', 'Filtre com stream().filter() e colete com Collectors.toList()', 'Implemente equals() e hashCode() na classe Produto'],
      casos: [
        { entrada: 'addProduct("Monitor", 800.0, 2)', esperado: 'Produto adicionado com sucesso' },
        { entrada: 'removeProduct("Monitor")', esperado: 'Produto removido' },
        { entrada: 'listByPrice()', esperado: 'Lista ordenada do mais barato ao mais caro' },
      ],
      xp: 750,
      tempo: '1h30',
    },
  ],
  avancado: [
    {
      titulo: 'Microsserviço de Autenticação com JWT e Spring Security',
      descricao: 'Desenvolva um microsserviço de autenticação completo com Spring Boot 3 e Spring Security 6. Implemente registro de usuários, login, geração de JWT com claims customizados, refresh token com rotação e blacklist de tokens revogados persistida em Redis.',
      entrada: 'POST /auth/login { "email": "dev@dio.me", "password": "Secure@123" }',
      saida: '{ "accessToken": "eyJ...", "refreshToken": "eyJ...", "expiresIn": 900 }',
      dicas: ['Use JJWT (io.jsonwebtoken) para gerar e validar tokens', 'Armazene refresh tokens em Redis com TTL e invalidação via blacklist', 'Implemente SecurityFilterChain com OncePerRequestFilter para validar o JWT em cada requisição'],
      casos: [
        { entrada: 'Login com credenciais inválidas', esperado: '401 Unauthorized com mensagem genérica' },
        { entrada: 'POST /auth/refresh com refreshToken válido', esperado: 'Novo accessToken + refreshToken rotacionado' },
        { entrada: 'POST /auth/logout', esperado: 'Token adicionado à blacklist no Redis' },
      ],
      xp: 2500,
      tempo: '5 a 8 horas',
    },
    {
      titulo: 'Pipeline de Processamento Assíncrono com Kafka',
      descricao: 'Implemente um sistema de processamento de pedidos assíncrono usando Apache Kafka e Spring Boot. Crie um producer que publica eventos de pedido em um tópico, um consumer que processa e persiste no banco, e um dead-letter topic para falhas. Implemente retentativas com backoff exponencial.',
      entrada: 'Evento: { "orderId": "ORD-001", "items": [...], "totalValue": 450.00 }',
      saida: 'Pedido processado e salvo. Tópico DLT para erros após 3 tentativas.',
      dicas: ['Use @KafkaListener com ConcurrentKafkaListenerContainerFactory', 'Configure RetryableTopic com backoff exponencial e DLT', 'Implemente idempotência usando orderId como chave de deduplicação'],
      casos: [
        { entrada: 'Evento válido publicado no tópico', esperado: 'Consumido, processado e salvo em < 500ms' },
        { entrada: 'Evento com totalValue negativo', esperado: 'Publicado no DLT após 3 tentativas' },
        { entrada: 'Mesmo orderId enviado duas vezes', esperado: 'Segundo evento ignorado (idempotência)' },
      ],
      xp: 2800,
      tempo: '6 a 10 horas',
    },
  ],
};

/**
 * Gera um desafio aleatório para a tecnologia e nível informados.
 * @param {string} tecnologia
 * @param {string} nivel  – "basico" | "intermediario" | "avancado"
 * @returns {{ tecnologia: string, nivel: string, desafio: object }}
 */
function gerarDesafio(tecnologia, nivel) {
  const nivelNorm = (nivel || 'intermediario')
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '');

  const nivelValido = ['basico', 'intermediario', 'avancado'].includes(nivelNorm)
    ? nivelNorm
    : 'intermediario';

  const pool    = DESAFIOS[nivelValido];
  const desafio = pool[Math.floor(Math.random() * pool.length)];

  return { tecnologia, nivel: nivelValido, desafio };
}

/**
 * Formata um desafio em Markdown.
 * @param {{ tecnologia: string, nivel: string, desafio: object }} resultado
 * @returns {string}
 */
function formatarDesafio({ tecnologia, nivel, desafio }) {
  const nivelLabel = { basico: 'Básico', intermediario: 'Intermediário', avancado: 'Avançado' }[nivel];
  const casos      = desafio.casos.map(c =>
    `**Entrada:** ${c.entrada}\n**Saída esperada:** ${c.esperado}`
  ).join('\n\n');
  const dicas = desafio.dicas.map(d => `- ${d}`).join('\n');

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

/**
 * Gera um código único de certificado.
 * @returns {string}
 */
function gerarCodigoCertificado() {
  const ano    = new Date().getFullYear();
  const chars  = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  const sufixo = Array.from({ length: 6 }, () =>
    chars[Math.floor(Math.random() * chars.length)]
  ).join('');
  return `DIO-${ano}-${sufixo}`;
}

/**
 * Formata a data atual como DD/MM/AAAA.
 * @returns {string}
 */
function dataHoje() {
  return new Date().toLocaleDateString('pt-BR');
}

/**
 * Gera o Markdown de um certificado fictício.
 * @param {string}  nomeAluno
 * @param {object}  trilha
 * @returns {string}
 */
function gerarCertificado(nomeAluno, trilha) {
  if (!nomeAluno || !trilha) return '❌ Nome do aluno e trilha são obrigatórios.';

  const codigo    = gerarCodigoCertificado();
  const badges    = trilha.badges_disponiveis.map(b => `🥇 ${b}`).join('\n');
  const techs     = trilha.tecnologias.map((t, i) => `${i + 1}. ✅ ${t}`).join('\n');

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

// ─── exports ──────────────────────────────────────────────────────────────────

module.exports = {
  carregarTrilhas,
  buscarTrilhasPorTecnologia,
  formatarPlanoDeEstudos,
  gerarDesafio,
  formatarDesafio,
  gerarCodigoCertificado,
  dataHoje,
  gerarCertificado,
  DESAFIOS,
};
