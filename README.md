# 📊 Painel Financeiro Inteligente

> Aplicação web para controle financeiro compartilhado de uma empresa, com indicadores, gráficos interativos e gestão de receitas e despesas em uma interface moderna e responsiva.

![Status](https://img.shields.io/badge/Status-Em%20Desenvolvimento-green)
![Next.js](https://img.shields.io/badge/Next.js-16-black?logo=next.js)
![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?logo=typescript&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-06B6D4?logo=tailwindcss&logoColor=white)
![Supabase](https://img.shields.io/badge/Supabase-3ECF8E?logo=supabase&logoColor=white)
![Vercel](https://img.shields.io/badge/Vercel-000000?logo=vercel&logoColor=white)

## 📖 Sobre o projeto

O **Painel Financeiro Inteligente** foi desenvolvido para facilitar a visualização e o gerenciamento do fluxo de caixa de uma empresa. A proposta é concentrar movimentações, indicadores e relatórios em um único ambiente, reduzindo a dependência de planilhas.

O dashboard apresenta uma identidade visual **tech**, com tema escuro, navegação lateral, gráficos modernos e adaptação a diferentes tamanhos de tela. O front-end utiliza **Next.js (App Router)** e **TypeScript**, com **Supabase** para autenticação e armazenamento em PostgreSQL.

O financeiro é **compartilhado entre os sócios autorizados de uma mesma empresa**, sem carteiras individuais por usuário.

## ✨ Funcionalidades

- Autenticação com Supabase Auth e acesso controlado por contas autorizadas.
- Indicadores de **entradas, saídas e saldo**.
- **Gráfico de rosca** para distribuição de despesas por categoria.
- **Gráfico de barras** para comparação entre entradas e saídas.
- Cadastro, edição e exclusão de transações financeiras.
- Organização de movimentações por categorias e formas de pagamento.
- Filtros por mês e ano.
- Exportação de relatórios em **CSV**.
- Layout responsivo com CSS separado dos componentes.

### 🔐 Perfis e permissões

As contas são criadas pelo administrador do projeto no Supabase. As operações financeiras são protegidas por políticas de **Row Level Security (RLS)** no PostgreSQL.

| Perfil | Consultar transações | Criar, editar e excluir |
| --- | :---: | :---: |
| `editor` — sócio autorizado | ✅ | ✅ |
| `viewer` — demonstração | ✅ | ❌ |
| Conta não autorizada | ❌ | ❌ |

As permissões ficam registradas na tabela `private.finance_members`. O perfil de demonstração tem acesso somente à leitura das transações.

## 🛠️ Tecnologias

| Camada | Tecnologias |
| --- | --- |
| Interface | [Next.js](https://nextjs.org/), [React](https://react.dev/), [TypeScript](https://www.typescriptlang.org/) |
| Estilização | [Tailwind CSS](https://tailwindcss.com/) e CSS convencional |
| Gráficos e ícones | [Recharts](https://recharts.org/) e [Lucide React](https://lucide.dev/) |
| Autenticação e dados | [Supabase](https://supabase.com/), Supabase Auth, PostgreSQL e RLS |
| Hospedagem | [Vercel](https://vercel.com/) e Supabase Cloud |

## 🌐 Demonstração

**[Acessar o Painel Financeiro](https://projeto-painel-financeiro.vercel.app/)**

O acesso à demonstração depende de uma conta habilitada no ambiente publicado. Credenciais de usuários não são disponibilizadas no repositório.

## 🚀 Executando localmente

### Pré-requisitos

- Node.js e npm;
- Git;
- Uma conta no [Supabase](https://supabase.com/).

O banco é hospedado no Supabase; não é necessário instalar PostgreSQL localmente para executar a aplicação.

### 1. Clonar o repositório

```bash
git clone https://github.com/diweiskt/Projeto-Painel-Financeiro.git
cd Projeto-Painel-Financeiro
npm install
```

### 2. Configurar o banco no Supabase

1. Crie um projeto no [Supabase Dashboard](https://supabase.com/dashboard).
2. Abra **SQL Editor → New query**.
3. Copie o conteúdo de [`supabase/schema.sql`](supabase/schema.sql) e execute no **projeto recém-criado**.
4. Verifique as tabelas `public.categories`, `public.transactions` e `private.finance_members`, a função `private.finance_role()` e as políticas RLS.
5. Em **Authentication → Users**, crie ou convide as contas que terão acesso. Para manter o cadastro exclusivo do administrador, desative o cadastro público nas configurações de autenticação.

O `schema.sql` contém a estrutura das tabelas e as políticas, **não** os usuários, as transações ou as categorias iniciais. Destina-se a um projeto Supabase novo, não a substituir a configuração de um banco já existente.

### 3. Autorizar os usuários

Após criar as contas no Supabase Auth, registre os sócios como `editor` no **SQL Editor**:

```sql
INSERT INTO private.finance_members (user_id, role)
SELECT id, 'editor'
FROM auth.users
WHERE email = 'socio@exemplo.com'
ON CONFLICT (user_id)
DO UPDATE SET role = EXCLUDED.role;
```

Substitua o e-mail pelo de uma conta existente. Para uma conta de demonstração, use o mesmo comando com o papel `'viewer'`.

Confira os perfis cadastrados:

```sql
SELECT u.email, m.role
FROM private.finance_members AS m
JOIN auth.users AS u ON u.id = m.user_id
ORDER BY u.email;
```

### 4. Configurar as variáveis de ambiente

Crie um arquivo **`.env.local`** na raiz do projeto:

```env
NEXT_PUBLIC_SUPABASE_URL=https://SEU_PROJECT_REF.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=SUA_CHAVE_PUBLICAVEL_OU_ANON
```

Obtenha os valores nas configurações do seu projeto Supabase, em **API Keys**. A variável `NEXT_PUBLIC_SUPABASE_ANON_KEY` pode receber a chave pública **publishable** (`sb_publishable_...`) utilizada pelo cliente, conforme a configuração da sua aplicação.

**Não publique** o `.env.local`, senhas, tokens privados, `service_role` ou chaves `sb_secret_...`. A chave pública não substitui as políticas de segurança RLS.

### 5. Cadastrar categorias iniciais

O SQL cria a tabela `categories`, mas não insere categorias. Cadastre as opções desejadas pelo **Table Editor** ou **SQL Editor** antes de utilizar os recursos que dependem delas.

### 6. Iniciar a aplicação

```bash
npm run dev
```

Acesse [http://localhost:3000](http://localhost:3000).

Teste o acesso de uma conta `editor`, as restrições de uma conta `viewer` e a exibição dos dados e gráficos.

## 📱 Responsividade

O painel foi projetado para **desktop, tablet e celular**, com reorganização de cards e gráficos, adaptação dos controles e rolagem horizontal para tabelas quando necessário.

## 🧭 Melhorias futuras

- Metas financeiras e orçamentos por categoria.
- Controle de despesas recorrentes.
- Comparações entre períodos e relatórios avançados.
- Indicadores de evolução financeira.
- Aprimoramentos de acessibilidade e personalização.

## 👨‍💻 Desenvolvimento

Desenvolvido por **Diwei**, estudante de Ciência da Computação, com foco em aplicações web modernas, funcionais e intuitivas.

**Contato:** [oi@diwei.pro](mailto:oi@diwei.pro)

---

**Painel Financeiro Inteligente** — Tecnologia e organização para simplificar a gestão financeira.
