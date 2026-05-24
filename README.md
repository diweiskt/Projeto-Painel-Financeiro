# 📊 Painel Financeiro Inteligente

> Um sistema web completo para controle financeiro, desenhado para ser rápido, visual e intuitivo. Substitua planilhas complexas por métricas claras e relatórios automatizados.

![Status do Projeto](https://img.shields.io/badge/Status-Em%20Desenvolvimento-green)
![Next.js](https://img.shields.io/badge/Next.js-Black?logo=next.js)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-38B2AC?logo=tailwind-css&logoColor=white)
![Supabase](https://img.shields.io/badge/Supabase-3ECF8E?logo=supabase&logoColor=white)

---

## 📖 Sobre a Criação do Projeto

Este projeto nasceu da necessidade de ter uma visão financeira clara e imediata do fluxo de caixa empresarial/pessoal. A ideia central foi criar uma aplicação que fugisse da complexidade dos ERPs tradicionais, focando na **experiência do usuário (UX)** e em **dados visuais**. 

O desenvolvimento uniu o que há de mais moderno no ecossistema React (Next.js App Router) com um backend como serviço (Supabase), permitindo escalabilidade, segurança e sincronização em tempo real sem a necessidade de gerenciar servidores complexos.

## ✨ Principais Funcionalidades

* **Autenticação Segura:** Login de usuários integrado ao Supabase Auth, garantindo que os dados sejam privados e seguros.
* **Modo Visitante (Demonstração):** Acesso em modo "somente leitura" (controlado via Row Level Security do banco) para apresentar o sistema a clientes sem comprometer os dados.
* **Dashboard Visual:**
  * Resumo rápido de Entradas, Saídas e Saldo.
  * Gráfico de Rosca interativo para distribuição de despesas por categoria.
  * Gráfico de Barras comparativo (Entradas vs Saídas) mensal.
* **Gestão de Lançamentos:** Cadastro, edição e exclusão de receitas e despesas com categorização inteligente e formas de pagamento.
* **Filtros Dinâmicos:** Filtragem instantânea de todo o dashboard por mês/ano.
* **Exportação de Relatórios:** Geração automática de planilhas `.csv` (mensais ou completas) prontas para o Excel.
* **Suporte a Dark Mode:** Interface adaptável ao tema claro e escuro nativamente pelo Tailwind.

---

## 🛠️ Tecnologias Utilizadas

O projeto foi construído utilizando as seguintes ferramentas:

### Front-end
* **[Next.js](https://nextjs.org/)** (App Router) - Framework React para renderização e estruturação.
* **[TypeScript](https://www.typescriptlang.org/)** - Tipagem estática para um código mais seguro.
* **[Tailwind CSS](https://tailwindcss.com/)** - Estilização utilitária rápida e responsiva.
* **[Recharts](https://recharts.org/)** - Biblioteca para construção dos gráficos financeiros.
* **[Lucide React](https://lucide.dev/)** - Ícones limpos e padronizados.

### Back-end & Banco de Dados
* **[Supabase](https://supabase.com/)** - Backend as a Service (BaaS) Open Source.
* **PostgreSQL** - Banco de dados relacional (gerenciado pelo Supabase).
* **Supabase Auth** - Autenticação e gestão de sessões.

---

## 🚀 Links Úteis & Demonstração

* **Acesse o Painel Homologado:** [https://diwei.pro](https://diwei.pro)
* **Ambiente de Banco de Dados:** Gerenciado via Supabase Cloud.

---

## 👨‍💻 Contato & Suporte

Desenvolvido por **Diwei** 📧 **E-mail:** oi@diwei.pro