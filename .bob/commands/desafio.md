---
description: Gera um desafio de código aleatório baseado em uma tecnologia e nível escolhido
argument-hint: <tecnologia> <nivel: basico|intermediario|avancado>
---
O usuário quer um desafio de código para a tecnologia **$1** no nível **$2**.

Leia o arquivo `dio_explorer/data/trilhas_dio.json` para verificar se a tecnologia "$1" existe em alguma trilha e qual o contexto dela.

Com base na tecnologia e no nível informado, gere um desafio de código **completamente aleatório** e inédito seguindo esta estrutura em Markdown:

---

## ⚔️ Desafio DIO — {tecnologia} | Nível: {nivel}

> *"Cada linha de código é um passo mais perto do seu próximo nível."*

---

### 📋 Descrição do Desafio
Escreva um enunciado claro e objetivo do problema a ser resolvido (3–5 linhas). O problema deve ser realista e aplicável ao dia a dia de um desenvolvedor.

---

### 🎯 Objetivo
Liste em bullets o que o código final deve ser capaz de fazer (de 3 a 5 critérios de aceitação).

---

### 📥 Entrada Esperada
Descreva o formato da entrada com um exemplo concreto.

---

### 📤 Saída Esperada
Descreva o formato da saída com um exemplo concreto.

---

### 💡 Dicas
Forneça de 2 a 3 dicas que ajudem sem entregar a solução.

---

### 🧪 Casos de Teste
Apresente pelo menos 3 casos de teste no formato:
```
Entrada: ...
Saída esperada: ...
```

---

### 🏆 Pontuação
Atribua uma pontuação fictícia de XP baseada no nível:
- Básico: entre 200 e 500 XP
- Intermediário: entre 600 e 1200 XP
- Avançado: entre 1500 e 3000 XP

Exiba também as badges que podem ser conquistadas ao completar o desafio com sucesso.

---

### ⏱️ Tempo Estimado
Informe um tempo estimado de resolução compatível com o nível escolhido.

---

Se o nível fornecido ($2) não for reconhecido, assuma **intermediário** e avise o usuário.
Se a tecnologia ($1) não for encontrada no JSON, gere o desafio assim mesmo com base no seu conhecimento da tecnologia.
