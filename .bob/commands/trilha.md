---
description: Busca uma trilha DIO por tecnologia e exibe um plano de estudos formatado
argument-hint: <tecnologia>
---
O usuário quer ver o plano de estudos da trilha DIO relacionada à tecnologia: **$1**

Leia o arquivo `dio_explorer/data/trilhas_dio.json` e localize a trilha cujo campo `tecnologias` contenha (ou seja mais próximo de) "$1". A busca deve ser case-insensitive.

Com os dados encontrados, gere uma resposta formatada em Markdown seguindo exatamente esta estrutura:

---

## 🎓 Plano de Estudos — {nome da trilha}

**Plataforma:** DIO — Digital Innovation One  
**Nível:** {nivel}  
**Total de Módulos:** {numero_de_modulos}  
**XP Total:** {xp_total} XP  
**Vitalício:** {Sim ou Não}

---

### 🛠️ Tecnologias Abordadas
Liste cada tecnologia em bullet points.

---

### 📚 Módulos do Percurso
Gere uma lista numerada com {numero_de_modulos} módulos fictícios e coerentes com as tecnologias da trilha. Cada item deve ter um título realista e uma breve descrição de uma linha do que será aprendido.

---

### 🏅 Badges Disponíveis
Liste cada badge do array `badges_disponiveis` com um emoji de medalha.

---

### 🎁 Promoção Ativa
Se `promocoes.desconto_percentual` for maior que 0, exiba:
- Desconto: {desconto_percentual}%
- Cupom: `{cupom}`
- Válido até: {validade}

Caso contrário, escreva: *Sem promoção ativa no momento.*

---

### 📡 Próximas Lives ao Vivo
Para cada item em `lives_ao_vivo`, liste: título, data e instrutor.

---

### 🚀 Como Começar
Escreva 3 dicas práticas e motivadoras para iniciar essa trilha agora.

---

Se nenhuma trilha for encontrada para "$1", informe de forma amigável que a tecnologia não foi localizada e sugira 3 trilhas relacionadas do mesmo arquivo JSON.
