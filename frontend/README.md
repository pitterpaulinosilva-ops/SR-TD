# SESI SENAI Health Report

Sistema de Status Report desenvolvido para SESI/SENAI.

## Tecnologias

- React + Vite
- TypeScript
- Tailwind CSS
- Shadcn UI
- Lucide React

## Como rodar localmente

1. Clone o repositório
2. Instale as dependências:
   ```bash
   npm install
   ```
3. Rode o servidor de desenvolvimento:
   ```bash
   npm run dev
   ```

## Deploy no Vercel

Este projeto está pronto para ser implantado no Vercel.

1. Faça o push deste código para um repositório no GitHub.
2. Acesse [Vercel](https://vercel.com) e conecte sua conta do GitHub.
3. Importe o repositório do projeto.
4. O Vercel detectará automaticamente que é um projeto Vite.
   - **Framework Preset**: Vite
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
5. Clique em **Deploy**.

O arquivo `vercel.json` incluso garante que o roteamento (SPA) funcione corretamente.
