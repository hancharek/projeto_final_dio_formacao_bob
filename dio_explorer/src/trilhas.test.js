'use strict';

const fs   = require('fs');
const path = require('path');

const {
  carregarTrilhas,
  buscarTrilhasPorTecnologia,
  formatarPlanoDeEstudos,
  gerarDesafio,
  formatarDesafio,
  gerarCodigoCertificado,
  dataHoje,
  gerarCertificado,
  DESAFIOS,
} = require('./trilhas');

// ─── fixture ──────────────────────────────────────────────────────────────────

const TRILHA_JAVA = {
  id: 2,
  nome: 'Formação Java Developer',
  tecnologias: ['Java', 'Spring Boot', 'Hibernate', 'Maven', 'JUnit'],
  nivel: 'Intermediário ao Avançado',
  numero_de_modulos: 14,
  xp_total: 21000,
  badges_disponiveis: ['Java Starter', 'Spring Hero', 'Java Champion'],
  promocoes: { desconto_percentual: 25, validade: '2025-09-15', cupom: 'JAVA25OFF' },
  vitalicio: true,
  lives_ao_vivo: [
    { titulo: 'Microsserviços com Spring Cloud', data: '2025-07-20', instrutor: 'Roberto Silva' },
    { titulo: 'Java Reativo com WebFlux',         data: '2025-08-05', instrutor: 'Patrícia Oliveira' },
  ],
};

const TRILHA_SEM_PROMO = {
  ...TRILHA_JAVA,
  nome: 'Formação Java Fundamentos',
  promocoes: { desconto_percentual: 0, validade: null, cupom: null },
  vitalicio: false,
};

const DB_MOCK = { trilhas: [TRILHA_JAVA, TRILHA_SEM_PROMO] };

// ─── carregarTrilhas ──────────────────────────────────────────────────────────

describe('carregarTrilhas()', () => {
  const dataPath = path.resolve(__dirname, '../data/trilhas_dio.json');

  test('deve carregar e parsear o JSON corretamente', () => {
    const db = carregarTrilhas(dataPath);
    expect(db).toHaveProperty('trilhas');
    expect(Array.isArray(db.trilhas)).toBe(true);
    expect(db.trilhas.length).toBeGreaterThan(0);
  });

  test('deve conter o campo total_trilhas', () => {
    const db = carregarTrilhas(dataPath);
    expect(db.total_trilhas).toBeGreaterThan(0);
  });

  test('deve lançar erro para arquivo inexistente', () => {
    expect(() => carregarTrilhas('/nao/existe.json')).toThrow();
  });
});

// ─── buscarTrilhasPorTecnologia ───────────────────────────────────────────────

describe('buscarTrilhasPorTecnologia()', () => {
  const { trilhas } = DB_MOCK;

  test('deve encontrar trilha de Java por termo exato', () => {
    const res = buscarTrilhasPorTecnologia('Java', trilhas);
    expect(res.length).toBeGreaterThanOrEqual(1);
    expect(res[0].nome).toMatch(/Java/);
  });

  test('deve encontrar trilha com busca case-insensitive (java minúsculo)', () => {
    const res = buscarTrilhasPorTecnologia('java', trilhas);
    expect(res.length).toBeGreaterThanOrEqual(1);
  });

  test('deve encontrar trilha por tecnologia parcial (spring)', () => {
    const res = buscarTrilhasPorTecnologia('spring', trilhas);
    expect(res.length).toBeGreaterThanOrEqual(1);
  });

  test('deve retornar array vazio para tecnologia inexistente', () => {
    const res = buscarTrilhasPorTecnologia('COBOL_INEXISTENTE_XYZ', trilhas);
    expect(res).toEqual([]);
  });

  test('deve retornar array vazio para string vazia', () => {
    const res = buscarTrilhasPorTecnologia('', trilhas);
    expect(res).toEqual([]);
  });

  test('deve retornar array vazio para entrada null', () => {
    const res = buscarTrilhasPorTecnologia(null, trilhas);
    expect(res).toEqual([]);
  });

  test('deve retornar array vazio para entrada undefined', () => {
    const res = buscarTrilhasPorTecnologia(undefined, trilhas);
    expect(res).toEqual([]);
  });

  test('deve buscar contra trilhas reais do JSON', () => {
    const db  = carregarTrilhas();
    const res = buscarTrilhasPorTecnologia('Java', db.trilhas);
    expect(res.length).toBeGreaterThanOrEqual(2); // Node.js Developer e Java Developer
  });
});

// ─── formatarPlanoDeEstudos ───────────────────────────────────────────────────

describe('formatarPlanoDeEstudos()', () => {
  test('deve retornar mensagem de erro para trilha nula', () => {
    const res = formatarPlanoDeEstudos(null);
    expect(res).toContain('não encontrada');
  });

  test('deve retornar mensagem de erro para trilha undefined', () => {
    const res = formatarPlanoDeEstudos(undefined);
    expect(res).toContain('não encontrada');
  });

  test('deve conter o nome da trilha no resultado', () => {
    const res = formatarPlanoDeEstudos(TRILHA_JAVA);
    expect(res).toContain('Formação Java Developer');
  });

  test('deve conter o nível da trilha', () => {
    const res = formatarPlanoDeEstudos(TRILHA_JAVA);
    expect(res).toContain('Intermediário ao Avançado');
  });

  test('deve listar todas as tecnologias', () => {
    const res = formatarPlanoDeEstudos(TRILHA_JAVA);
    TRILHA_JAVA.tecnologias.forEach(tech => expect(res).toContain(tech));
  });

  test('deve listar todas as badges', () => {
    const res = formatarPlanoDeEstudos(TRILHA_JAVA);
    TRILHA_JAVA.badges_disponiveis.forEach(b => expect(res).toContain(b));
  });

  test('deve exibir promoção quando desconto > 0', () => {
    const res = formatarPlanoDeEstudos(TRILHA_JAVA);
    expect(res).toContain('JAVA25OFF');
    expect(res).toContain('25%');
  });

  test('deve exibir mensagem sem promoção quando desconto = 0', () => {
    const res = formatarPlanoDeEstudos(TRILHA_SEM_PROMO);
    expect(res).toContain('Sem promoção ativa');
  });

  test('deve exibir todas as lives ao vivo', () => {
    const res = formatarPlanoDeEstudos(TRILHA_JAVA);
    expect(res).toContain('Microsserviços com Spring Cloud');
    expect(res).toContain('Roberto Silva');
  });

  test('deve indicar vitalício = Sim para trilha vitalícia', () => {
    const res = formatarPlanoDeEstudos(TRILHA_JAVA);
    expect(res).toContain('✅ Sim');
  });

  test('deve indicar vitalício = Não para trilha não vitalícia', () => {
    const res = formatarPlanoDeEstudos(TRILHA_SEM_PROMO);
    expect(res).toContain('❌ Não');
  });

  test('deve conter o XP total formatado', () => {
    const res = formatarPlanoDeEstudos(TRILHA_JAVA);
    expect(res).toContain('21');   // 21.000 XP
  });
});

// ─── gerarDesafio ─────────────────────────────────────────────────────────────

describe('gerarDesafio()', () => {
  test('deve retornar objeto com tecnologia, nivel e desafio', () => {
    const res = gerarDesafio('Java', 'intermediario');
    expect(res).toHaveProperty('tecnologia', 'Java');
    expect(res).toHaveProperty('nivel', 'intermediario');
    expect(res).toHaveProperty('desafio');
  });

  test('deve normalizar nível com acento (avançado → avancado)', () => {
    const res = gerarDesafio('Java', 'avançado');
    expect(res.nivel).toBe('avancado');
  });

  test('deve normalizar nível com acento (básico → basico)', () => {
    const res = gerarDesafio('Java', 'básico');
    expect(res.nivel).toBe('basico');
  });

  test('deve assumir intermediário para nível inválido', () => {
    const res = gerarDesafio('Java', 'super-hard');
    expect(res.nivel).toBe('intermediario');
  });

  test('deve assumir intermediário para nível undefined', () => {
    const res = gerarDesafio('Java', undefined);
    expect(res.nivel).toBe('intermediario');
  });

  test('deve retornar desafio básico para nível basico', () => {
    const res = gerarDesafio('Java', 'basico');
    expect(DESAFIOS.basico).toContainEqual(res.desafio);
  });

  test('deve retornar desafio avançado para nível avancado', () => {
    const res = gerarDesafio('Java', 'avancado');
    expect(DESAFIOS.avancado).toContainEqual(res.desafio);
  });

  test('desafio deve ter campos obrigatórios', () => {
    const { desafio } = gerarDesafio('Java', 'intermediario');
    expect(desafio).toHaveProperty('titulo');
    expect(desafio).toHaveProperty('descricao');
    expect(desafio).toHaveProperty('entrada');
    expect(desafio).toHaveProperty('saida');
    expect(desafio).toHaveProperty('dicas');
    expect(desafio).toHaveProperty('casos');
    expect(desafio).toHaveProperty('xp');
    expect(desafio).toHaveProperty('tempo');
  });

  test('XP deve ser número positivo', () => {
    const { desafio } = gerarDesafio('Java', 'basico');
    expect(desafio.xp).toBeGreaterThan(0);
  });

  test('casos de teste devem ter entrada e esperado', () => {
    const { desafio } = gerarDesafio('Java', 'avancado');
    desafio.casos.forEach(c => {
      expect(c).toHaveProperty('entrada');
      expect(c).toHaveProperty('esperado');
    });
  });
});

// ─── formatarDesafio ──────────────────────────────────────────────────────────

describe('formatarDesafio()', () => {
  // usa desafio fixo (índice 0) para resultado determinístico
  const desafioFixo = { tecnologia: 'Java', nivel: 'intermediario', desafio: DESAFIOS.intermediario[0] };

  test('deve conter o título do desafio', () => {
    const md = formatarDesafio(desafioFixo);
    expect(md).toContain(desafioFixo.desafio.titulo);
  });

  test('deve conter o nome da tecnologia', () => {
    const md = formatarDesafio(desafioFixo);
    expect(md).toContain('Java');
  });

  test('deve conter o rótulo de nível', () => {
    const md = formatarDesafio(desafioFixo);
    expect(md).toContain('Intermediário');
  });

  test('deve conter o XP do desafio', () => {
    const md = formatarDesafio(desafioFixo);
    expect(md).toContain(String(desafioFixo.desafio.xp));
  });

  test('deve conter o tempo estimado', () => {
    const md = formatarDesafio(desafioFixo);
    expect(md).toContain(desafioFixo.desafio.tempo);
  });

  test('deve conter as dicas', () => {
    const md = formatarDesafio(desafioFixo);
    desafioFixo.desafio.dicas.forEach(d => expect(md).toContain(d));
  });

  test('deve exibir rótulo Básico para nível basico', () => {
    const md = formatarDesafio(gerarDesafio('Java', 'basico'));
    expect(md).toContain('Básico');
  });

  test('deve exibir rótulo Avançado para nível avancado', () => {
    const md = formatarDesafio(gerarDesafio('Java', 'avancado'));
    expect(md).toContain('Avançado');
  });
});

// ─── gerarCodigoCertificado ───────────────────────────────────────────────────

describe('gerarCodigoCertificado()', () => {
  test('deve seguir o padrão DIO-AAAA-XXXXXX', () => {
    const codigo = gerarCodigoCertificado();
    expect(codigo).toMatch(/^DIO-\d{4}-[A-Z0-9]{6}$/);
  });

  test('deve gerar códigos únicos em chamadas consecutivas', () => {
    const codigos = new Set(Array.from({ length: 100 }, gerarCodigoCertificado));
    expect(codigos.size).toBeGreaterThan(90);
  });

  test('deve conter o ano atual', () => {
    const codigo = gerarCodigoCertificado();
    expect(codigo).toContain(String(new Date().getFullYear()));
  });
});

// ─── dataHoje ─────────────────────────────────────────────────────────────────

describe('dataHoje()', () => {
  test('deve retornar string no formato DD/MM/AAAA', () => {
    expect(dataHoje()).toMatch(/^\d{2}\/\d{2}\/\d{4}$/);
  });

  test('deve retornar a data de hoje', () => {
    const hoje = new Date().toLocaleDateString('pt-BR');
    expect(dataHoje()).toBe(hoje);
  });
});

// ─── gerarCertificado ─────────────────────────────────────────────────────────

describe('gerarCertificado()', () => {
  test('deve retornar erro quando nome é nulo', () => {
    const res = gerarCertificado(null, TRILHA_JAVA);
    expect(res).toContain('obrigatórios');
  });

  test('deve retornar erro quando trilha é nula', () => {
    const res = gerarCertificado('João Silva', null);
    expect(res).toContain('obrigatórios');
  });

  test('deve conter o nome do aluno', () => {
    const res = gerarCertificado('João Silva', TRILHA_JAVA);
    expect(res).toContain('João Silva');
  });

  test('deve conter o nome da trilha', () => {
    const res = gerarCertificado('João Silva', TRILHA_JAVA);
    expect(res).toContain('Formação Java Developer');
  });

  test('deve conter o nível da trilha', () => {
    const res = gerarCertificado('João Silva', TRILHA_JAVA);
    expect(res).toContain('Intermediário ao Avançado');
  });

  test('deve conter número de módulos', () => {
    const res = gerarCertificado('João Silva', TRILHA_JAVA);
    expect(res).toContain('14');
  });

  test('deve conter o XP total', () => {
    const res = gerarCertificado('João Silva', TRILHA_JAVA);
    expect(res).toContain('21');
  });

  test('deve conter código de certificado no formato correto', () => {
    const res = gerarCertificado('João Silva', TRILHA_JAVA);
    expect(res).toMatch(/DIO-\d{4}-[A-Z0-9]{6}/);
  });

  test('deve conter URL de verificação', () => {
    const res = gerarCertificado('João Silva', TRILHA_JAVA);
    expect(res).toContain('https://www.dio.me/certificate/');
  });

  test('deve listar todas as badges', () => {
    const res = gerarCertificado('João Silva', TRILHA_JAVA);
    TRILHA_JAVA.badges_disponiveis.forEach(b => expect(res).toContain(b));
  });

  test('deve listar todas as tecnologias como competências', () => {
    const res = gerarCertificado('João Silva', TRILHA_JAVA);
    TRILHA_JAVA.tecnologias.forEach(t => expect(res).toContain(t));
  });

  test('deve conter a data de hoje', () => {
    const res = gerarCertificado('João Silva', TRILHA_JAVA);
    expect(res).toContain(dataHoje());
  });

  test('deve conter assinatura da DIO', () => {
    const res = gerarCertificado('João Silva', TRILHA_JAVA);
    expect(res).toContain('Digital Innovation One');
  });
});

// ─── integração: fluxo completo /trilha → /desafio → /certificado ─────────────

describe('Fluxo Completo — /trilha Java → /desafio → /certificado', () => {
  const ALUNO = 'Ana Carolina Souza';
  let trilhaJava, plano, desafioResult, mdDesafio, mdCertificado;

  beforeAll(() => {
    const db    = carregarTrilhas();
    const found = buscarTrilhasPorTecnologia('Java', db.trilhas);
    trilhaJava  = found.find(t => t.nome.includes('Java Developer')) || found[0];
    plano       = formatarPlanoDeEstudos(trilhaJava);
    const res   = gerarDesafio('Java', 'intermediario');
    mdDesafio   = formatarDesafio(res);
    mdCertificado = gerarCertificado(ALUNO, trilhaJava);
  });

  test('deve encontrar a trilha Java no JSON real', () => {
    expect(trilhaJava).toBeDefined();
    expect(trilhaJava.nome).toContain('Java');
  });

  test('plano de estudos deve ser string não vazia', () => {
    expect(typeof plano).toBe('string');
    expect(plano.length).toBeGreaterThan(100);
  });

  test('desafio formatado deve ser string não vazia', () => {
    expect(typeof mdDesafio).toBe('string');
    expect(mdDesafio.length).toBeGreaterThan(100);
  });

  test('certificado deve conter nome do aluno', () => {
    expect(mdCertificado).toContain(ALUNO);
  });

  test('certificado deve conter nome da trilha Java', () => {
    expect(mdCertificado).toContain(trilhaJava.nome);
  });

  test('certificado deve ter código DIO válido', () => {
    expect(mdCertificado).toMatch(/DIO-\d{4}-[A-Z0-9]{6}/);
  });
});
