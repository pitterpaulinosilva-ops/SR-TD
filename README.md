# SESI/SENAI Health Report (Monorepo)

Este é o repositório oficial do projeto **SESI/SENAI Health Report**, um sistema corporativo de gestão de portfólio de projetos estratégicos. O sistema centraliza o acompanhamento de status, riscos, cronogramas e entregas em uma interface moderna e intuitiva.

## 🚀 Tech Stack

O projeto utiliza tecnologias modernas de desenvolvimento web:

- **Frontend Framework:** React 18 + Vite (Performance First)
- **Linguagem:** TypeScript (Tipagem estática robusta)
- **Estilização:** Tailwind CSS v4 (Utility-first CSS)
- **UI Components:** Shadcn UI (Componentes acessíveis e customizáveis)
- **Ícones:** Lucide React
- **Gerenciamento de Estado:** React Hooks (useState, useEffect, useContext - Simples e eficaz)

## 📂 Estrutura do Projeto

O repositório está organizado como um Monorepo simplificado:

- **`/frontend`**: Aplicação Web Principal. Contém todo o código fonte da interface, componentes, serviços (mockados) e páginas.
- **`/docs`**: Documentação técnica e de negócio.

*(Nota: A pasta `/backend` está reservada para futuras implementações de API real).*

## 🛠️ Como Executar Localmente

Siga estes passos para configurar o ambiente de desenvolvimento:

### Pré-requisitos
- Node.js (v18 ou superior recomendado)
- npm ou yarn

### Instalação e Execução

1. **Clone o repositório:**
   ```bash
   git clone https://github.com/seu-usuario/sesi-senai-health-report.git
   cd sesi-senai-health-report
   ```

2. **Acesse a pasta do frontend:**
   ```bash
   cd frontend
   ```

3. **Instale as dependências:**
   ```bash
   npm install
   ```

4. **Inicie o servidor de desenvolvimento:**
   ```bash
   npm run dev
   ```

   O aplicativo estará disponível em: `http://localhost:5173`

## ✨ Funcionalidades Principais

- **Dashboard Executivo:** Visão geral com KPIs de investimento, progresso físico e status de sprints.
- **Gestão de Portfólio:** Listagem unificada de Projetos e Programas com filtros avançados.
- **Timeline Interativa:** Visualização vertical do cronograma com fases e atividades.
- **Status Reporting:** Edição e visualização detalhada de riscos, lições aprendidas e metadados do projeto.
- **Design Corporativo:** Interface alinhada à identidade visual do SESI/SENAI, focada em clareza e profissionalismo.

## 🤝 Contribuição

1. Faça um Fork do projeto
2. Crie uma Branch para sua Feature (`git checkout -b feature/MinhaFeature`)
3. Faça o Commit das alterações (`git commit -m 'Adiciona MinhaFeature'`)
4. Faça o Push para a Branch (`git push origin feature/MinhaFeature`)
5. Abra um Pull Request

---

© 2024 SESI/SENAI - Todos os direitos reservados.
