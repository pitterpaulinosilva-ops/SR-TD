# PRD - Product Requirements Document

## SESI SENAI Health Report

**Versão:** 1.0.0  
**Data:** 09/02/2026  
**Autor:** Equipe de Desenvolvimento SESI SENAI  
**Status:** Em Produção

---

## 1. VISÃO GERAL

### 1.1 Objetivo do Produto

O **SESI SENAI Health Report** é uma plataforma web para gestão de Status Reports de projetos corporativos do Sistema SESI/SENAI. A aplicação permite criar, visualizar e gerenciar relatórios de acompanhamento de projetos, incluindo fases, atividades, indicadores de progresso, riscos e lições aprendidas.

### 1.2 Problema a Resolver

- Substituir relatórios estáticos em PDF por uma solução dinâmica e interativa
- Centralizar informações de múltiplos projetos em uma única plataforma
- Facilitar o acompanhamento do progresso e status de projetos estratégicos
- Preparar a base para integração futura com Azure DevOps

### 1.3 Público-Alvo

- **Gestores de Projetos:** Responsáveis pela atualização e acompanhamento dos relatórios
- **Diretoria Executiva:** Visualização consolidada do status de projetos
- **Stakeholders:** Acompanhamento do progresso de iniciativas específicas

---

## 2. FUNCIONALIDADES

### 2.1 Gestão de Status Reports

| Funcionalidade | Descrição | Status |
|----------------|-----------|--------|
| **Criar Report** | Permite criar novos status reports com dados pré-populados | ✅ Implementado |
| **Listar Reports** | Dashboard com cards de todos os reports criados | ✅ Implementado |
| **Visualizar Report** | Página detalhada com todas as informações do projeto | ✅ Implementado |
| **Editar Report** | Edição inline de todos os campos do relatório | ✅ Implementado |
| **Excluir Report** | Remoção de relatórios com confirmação | ✅ Implementado |

### 2.2 Dados do Projeto

#### 2.2.1 Informações Básicas
- **Nome do Projeto** (editável)
- **Objetivo** (editável, textarea)
- **Diretoria** (editável)
- **Data de Criação** (automático)

#### 2.2.2 Cadeia de Processos (Integração Azure DevOps)
- **Macroprocesso** (editável) — Ex: Gestão de Saúde
- **Processo** (editável) — Ex: Saúde Ocupacional
- **Subprocesso** (editável) — Ex: Sistema Integrado

> 💡 Esses campos foram projetados para futura integração com Azure DevOps, permitindo linkagem de work items.

### 2.3 Timeline de Fases e Atividades

#### 2.3.1 Fases do Projeto
- **Fase 1 — Prospecção e Planejamento**
- **Fase 2 — Execução**
- **Fase 3 — Encerramento**

> As fases podem ser expandidas/colapsadas para melhor visualização.

#### 2.3.2 Gestão de Atividades

| Funcionalidade | Descrição | Status |
|----------------|-----------|--------|
| **Adicionar Atividade** | Botão para adicionar nova atividade em qualquer fase | ✅ Implementado |
| **Editar Atividade** | Edição inline do nome e status | ✅ Implementado |
| **Alterar Status** | Status: "Entregue", "Em andamento", "Não iniciado" | ✅ Implementado |
| **Definir Data** | Data de conclusão opcional para atividades | ✅ Implementado |
| **Excluir Atividade** | Remoção de atividades com confirmação | ✅ Implementado |

#### 2.3.3 Status das Atividades

| Status | Cor | Descrição |
|--------|-----|-----------|
| 🟢 **Entregue** | Verde | Atividade concluída |
| 🟡 **Em andamento** | Âmbar | Atividade em execução |
| ⚪ **Não iniciado** | Cinza | Atividade pendente |

### 2.4 Indicadores (KPIs)

| Indicador | Cálculo | Visualização |
|-----------|---------|--------------|
| **Progresso Total** | % de atividades entregues | Percentual + Barra de progresso |
| **Atividades Concluídas** | Contagem de status "Entregue" | Número absoluto |
| **Total de Atividades** | Soma de todas as atividades | Número absoluto |

### 2.5 Riscos e Lições Aprendidas

| Funcionalidade | Descrição | Status |
|----------------|-----------|--------|
| **Adicionar Risco** | Incluir novos riscos identificados | ✅ Implementado |
| **Editar Risco** | Edição inline do texto | ✅ Implementado |
| **Excluir Risco** | Remover risco com confirmação | ✅ Implementado |
| **Adicionar Lição** | Incluir novas lições aprendidas | ✅ Implementado |
| **Editar Lição** | Edição inline do texto | ✅ Implementado |
| **Excluir Lição** | Remover lição com confirmação | ✅ Implementado |

---

## 3. ARQUITETURA TÉCNICA

### 3.1 Stack Tecnológico

| Categoria | Tecnologia | Versão |
|-----------|------------|--------|
| **Framework** | React | 18.3.1 |
| **Build Tool** | Vite | 5.4.19 |
| **Linguagem** | TypeScript | 5.8.3 |
| **Estilização** | Tailwind CSS | 3.4.17 |
| **Componentes UI** | shadcn/ui | - |
| **Ícones** | Lucide React | 0.462.0 |
| **Roteamento** | React Router DOM | 6.30.1 |
| **Notificações** | Sonner | 1.7.4 |
| **Formulários** | React Hook Form + Zod | 7.61.1 / 3.25.76 |

### 3.2 Estrutura de Pastas

```
src/
├── components/
│   ├── dashboard/           # Componentes do dashboard
│   │   ├── DashboardHeader.tsx
│   │   ├── KpiCards.tsx
│   │   ├── PhaseTimeline.tsx
│   │   └── StrategicCards.tsx
│   ├── layout/              # Layout e navegação
│   │   ├── AppSidebar.tsx
│   │   └── Layout.tsx
│   └── ui/                  # Componentes shadcn/ui
├── data/
│   └── initialData.ts       # Dados iniciais das fases
├── hooks/
│   └── use-mobile.tsx       # Hook de responsividade
├── pages/
│   ├── Home.tsx             # Lista de reports
│   ├── ReportView.tsx       # Visualização detalhada
│   └── NotFound.tsx         # Página 404
├── services/
│   └── reportService.ts     # CRUD de relatórios
└── types/
    └── timeline.ts          # Interfaces TypeScript
```

### 3.3 Modelo de Dados

```typescript
interface Report {
    id: string;
    title: string;
    projectName: string;
    objective: string;
    directorate?: string;
    // Campos para Azure DevOps
    macroprocess?: string;
    process?: string;
    subprocess?: string;
    risks: Item[];
    lessons: Item[];
    date: string;
    phases: Phase[];
    createdAt: string;
}

interface Phase {
    id: string;
    name: string;
    progress: number;
    activities: Activity[];
}

interface Activity {
    id: string;
    name: string;
    status: "Entregue" | "Em andamento" | "Não iniciado";
    date?: string;
}

interface Item {
    id: string;
    text: string;
}
```

### 3.4 Persistência de Dados

| Método | Tecnologia | Descrição |
|--------|------------|-----------|
| **Atual** | LocalStorage | Armazenamento no navegador do usuário |
| **Futuro** | API REST | Backend com banco de dados relacional |

> ⚠️ Os dados são persistidos localmente no navegador. Em caso de limpeza de cache, os dados serão perdidos.

---

## 4. INTERFACE DO USUÁRIO

### 4.1 Design System

#### 4.1.1 Paleta de Cores (SESI/SENAI)

| Token | Cor | Uso |
|-------|-----|-----|
| `--primary` | #004C97 (SESI Blue) | Ações principais, links |
| `--accent` | #009CA7 (Teal) | Elementos de destaque |
| `--destructive` | #E4002B (SENAI Red) | Ações destrutivas |
| `--success` | Verde | Status positivo |
| `--warning` | Âmbar | Alertas |

#### 4.1.2 Tipografia

- **Display:** DM Sans (títulos)
- **Body:** Inter (texto corrido)

### 4.2 Responsividade

| Breakpoint | Layout |
|------------|--------|
| Mobile (<768px) | Sidebar colapsada, cards em coluna única |
| Tablet (768-1024px) | Sidebar retrátil, grid 2 colunas |
| Desktop (>1024px) | Sidebar fixa, grid 3 colunas |

### 4.3 Páginas

#### 4.3.1 Home (Lista de Reports)
- Header com título e botão "Novo Report"
- Grid de cards com resumo de cada report
- Estado vazio com CTA para criar primeiro report
- Ações: ver detalhes, excluir

#### 4.3.2 ReportView (Detalhe do Report)
- Breadcrumb de navegação
- Header editável (projeto, objetivo, diretoria, processos)
- Cards de KPIs
- Timeline de fases colapsáveis
- Cards de Riscos e Lições Aprendidas

---

## 5. INTEGRAÇÕES FUTURAS

### 5.1 Azure DevOps

| Funcionalidade | Descrição | Status |
|----------------|-----------|--------|
| **Vincular Work Items** | Associar atividades a work items | 🔜 Planejado |
| **Sincronização de Status** | Atualização automática de status | 🔜 Planejado |
| **Importar Projetos** | Criar reports a partir de projetos no DevOps | 🔜 Planejado |

> Os campos `macroprocess`, `process` e `subprocess` já estão preparados para receber IDs de entidades do Azure DevOps.

### 5.2 Exportação PDF

| Funcionalidade | Descrição | Status |
|----------------|-----------|--------|
| **Gerar PDF** | Exportar relatório formatado em PDF | 🔜 Planejado |
| **Template Corporativo** | Layout seguindo identidade visual SESI/SENAI | 🔜 Planejado |

### 5.3 Backend API

| Funcionalidade | Descrição | Status |
|----------------|-----------|--------|
| **Autenticação** | Login via SSO corporativo | 🔜 Planejado |
| **Banco de Dados** | Persistência centralizada | 🔜 Planejado |
| **Multi-usuário** | Colaboração em tempo real | 🔜 Planejado |

---

## 6. DEPLOY E INFRAESTRUTURA

### 6.1 Ambiente de Produção

| Item | Configuração |
|------|--------------|
| **Plataforma** | Vercel |
| **Framework** | Vite (SPA) |
| **Build Command** | `npm run build` |
| **Output Directory** | `dist` |
| **Node Version** | 18.x |

### 6.2 Configuração Vercel

O arquivo `vercel.json` já está configurado para SPA routing:

```json
{
  "rewrites": [
    { "source": "/(.*)", "destination": "/index.html" }
  ]
}
```

### 6.3 Repositório

- **GitHub:** https://github.com/pitterpaulinosilva-ops/sesi-senai-health-report
- **Branch Principal:** main

---

## 7. QUALIDADE E TESTES

### 7.1 Ferramentas de Qualidade

| Ferramenta | Propósito |
|------------|-----------|
| **ESLint** | Linting de código |
| **TypeScript** | Tipagem estática |
| **Vitest** | Testes unitários |
| **Testing Library** | Testes de componentes |

### 7.2 Scripts Disponíveis

```bash
npm run dev        # Servidor de desenvolvimento
npm run build      # Build de produção
npm run preview    # Preview do build
npm run lint       # Verificação de linting
npm run test       # Executar testes
npm run test:watch # Testes em modo watch
```

---

## 8. ROADMAP

### Versão 1.1 (Próxima)
- [ ] Exportação para PDF
- [ ] Filtros na lista de reports
- [ ] Busca por nome de projeto

### Versão 1.2
- [ ] Integração com Azure DevOps
- [ ] Sincronização de work items
- [ ] Dashboard consolidado multi-projeto

### Versão 2.0
- [ ] Backend API com autenticação
- [ ] Banco de dados centralizado
- [ ] Colaboração multi-usuário
- [ ] Histórico de alterações

---

## 9. GLOSSÁRIO

| Termo | Definição |
|-------|-----------|
| **Status Report** | Relatório de acompanhamento do projeto |
| **Fase** | Etapa macro do projeto (ex: Planejamento, Execução) |
| **Atividade** | Tarefa específica dentro de uma fase |
| **Macroprocesso** | Categoria de alto nível para organização (Azure DevOps) |
| **Processo** | Subcategoria dentro do macroprocesso |
| **Subprocesso** | Nível mais granular de categorização |
| **KPI** | Key Performance Indicator (Indicador de Desempenho) |

---

## 10. CONTATO

Para dúvidas ou sugestões sobre este projeto:

- **Equipe:** SESI SENAI Alagoas
- **Repositório:** [GitHub](https://github.com/pitterpaulinosilva-ops/sesi-senai-health-report)

---

*Este documento é atualizado conforme novas funcionalidades são implementadas.*
