---
description: Gera um certificado fictício em Markdown com o nome do usuário e a trilha concluída
argument-hint: <seu-nome> <nome-da-trilha>
---
O usuário quer gerar um certificado de conclusão fictício da DIO.

Nome do concluinte: **$1**  
Trilha concluída: **$2**

Leia o arquivo `dio_explorer/data/trilhas_dio.json` e localize a trilha mais próxima de "$2" (busca case-insensitive pelo campo `nome` ou `tecnologias`).

Com os dados encontrados, gere o certificado abaixo em Markdown. Se a trilha não for encontrada, use os dados fornecidos pelo usuário diretamente.

---

```
╔══════════════════════════════════════════════════════════════╗
║                                                              ║
║          🎓  CERTIFICADO DE CONCLUSÃO  🎓                    ║
║                  Digital Innovation One                      ║
║                    dio.me                                    ║
║                                                              ║
╚══════════════════════════════════════════════════════════════╝
```

---

# 📜 Certificado de Conclusão

**A DIO — Digital Innovation One certifica que:**

## 🏅 {$1}

**concluiu com êxito a formação:**

# 🚀 {nome completo da trilha encontrada no JSON}

---

| Campo                  | Informação                                      |
|------------------------|-------------------------------------------------|
| 👤 **Aluno**           | {$1}                                            |
| 🎯 **Trilha**          | {nome da trilha}                                |
| 📊 **Nível**           | {nivel}                                         |
| 📦 **Módulos Concluídos** | {numero_de_modulos} módulos               |
| ⭐ **XP Conquistado**  | {xp_total} XP                                   |
| 📅 **Data de Emissão** | {data atual no formato DD/MM/AAAA}              |
| 🔑 **Código do Certificado** | Gere um código único no formato DIO-{ANO}-{6 caracteres alfanuméricos maiúsculos aleatórios} |

---

### 🛠️ Competências Certificadas

Liste de 5 a 8 competências técnicas adquiridas, baseadas nas tecnologias da trilha. Use bullet points com um emoji relevante para cada uma.

---

### 🏆 Badges Conquistadas

Liste todas as badges do campo `badges_disponiveis` da trilha com o emoji 🥇 antes de cada uma.

---

### 🌐 Verificação

> Este certificado pode ser verificado em: **https://www.dio.me/certificate/{código-do-certificado}**

---

*"O aprendizado contínuo é o caminho para a inovação."*  
**— DIO, Digital Innovation One**

---

```
Assinado digitalmente pela DIO Platform  
dio.me | educação para o futuro
```

---

Por fim, adicione uma mensagem de parabéns personalizada e motivadora para **$1**, mencionando a trilha concluída e incentivando os próximos passos na carreira.

Salve também uma cópia do certificado gerado no caminho `docs/certificados-emitidos/{$1}-{nome-simplificado-da-trilha}.md` dentro do projeto, usando o tool de escrita de arquivos.
