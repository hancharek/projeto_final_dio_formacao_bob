---
description: Mostra um roteiro de carreira tech com trilhas recomendadas, salário médio e próximos passos
argument-hint: <cargo-ou-area>
---
O usuário quer explorar uma carreira em tecnologia relacionada a: **$1**

Leia o arquivo `dio_explorer/data/trilhas_dio.json` e identifique:
1. Trilhas com `"categoria": "carreira"` cujo `cargo_alvo`, `nome` ou `tecnologias` sejam relevantes para "$1"
2. Trilhas de formação (sem `categoria`) cujas `tecnologias` sejam pré-requisitos para essa carreira

Com os dados encontrados, gere a resposta em Markdown seguindo exatamente esta estrutura:

---

## 🚀 Roteiro de Carreira — {cargo ou área relacionada a $1}

> *"A carreira em tech não é uma corrida — é uma jornada de aprendizado contínuo."*

---

### 🎯 Sobre a Carreira
Escreva 3–4 linhas descrevendo o papel, responsabilidades típicas e impacto desta carreira no mercado brasileiro de tecnologia.

---

### 💰 Faixa Salarial (Brasil, 2025)
Se encontrar trilha de carreira com `salario_medio_brl`, exiba:
- **Júnior:** R$ X.XXX – R$ X.XXX / mês
- **Pleno:** R$ X.XXX – R$ X.XXX / mês
- **Sênior:** R$ X.XXX – R$ X.XXX / mês
Baseie os valores nos dados do JSON. Se não tiver dados, use estimativas realistas para o Brasil.

---

### 🗺️ Trilha Recomendada de Carreira
Liste a trilha de carreira encontrada no JSON (ou a mais próxima) com:
- Nome da trilha
- Nível
- Módulos e XP total
- Badges disponíveis
- Promoção e cupom (se houver)

---

### 📚 Formações Pré-requisito
Liste de 3 a 5 trilhas de formação do JSON que cobrem as tecnologias necessárias para esta carreira, em ordem de progressão (do mais básico ao mais avançado).

Para cada trilha liste: nome, nível e tecnologias principais.

---

### 🧭 Roadmap em 6 etapas
Crie um plano de 6 etapas concretas e numeradas para quem quer entrar ou progredir nesta carreira, do nível iniciante ao sênior. Cada etapa deve ter: título, ação concreta e tempo estimado.

---

### 🛠️ Stack Técnica Essencial
Liste as 8–12 tecnologias mais importantes para esta carreira, agrupadas por categoria (Ex: Linguagens, Frameworks, Ferramentas, Cloud).

---

### 📡 Próximas Lives Relacionadas
Se as trilhas encontradas tiverem `lives_ao_vivo`, liste as mais relevantes com título, data e instrutor.

---

### 💡 Dicas de Mercado
Escreva 3 dicas práticas e diretas para quem está buscando uma vaga nesta área em 2025.

---

Se nenhuma trilha de carreira for encontrada para "$1", sugira as 3 trilhas de carreira mais próximas do JSON e informe de forma amigável.
