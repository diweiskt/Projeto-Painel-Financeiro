-- Painel Financeiro Inteligente — estrutura para novo projeto Supabase
-- Exportação adaptada do schema enviado; não contém usuários ou transações.
-- Execute somente em um projeto Supabase NOVO, pelo SQL Editor.
-- Antes de executar em um projeto existente, revise objetos conflitantes.

BEGIN;

CREATE SCHEMA IF NOT EXISTS private;
CREATE SCHEMA IF NOT EXISTS public;

-- Categorias financeiras
CREATE TABLE public.categories (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    name text NOT NULL,
    type text NOT NULL,
    CONSTRAINT categories_type_check CHECK (type = ANY (ARRAY['INCOME'::text, 'EXPENSE'::text])),
    CONSTRAINT categories_pkey PRIMARY KEY (id)
);

-- Transações compartilhadas pela empresa
CREATE TABLE public.transactions (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    category_id uuid,
    type text NOT NULL,
    amount numeric NOT NULL,
    date date DEFAULT CURRENT_DATE,
    status text NOT NULL,
    description text,
    created_at timestamp with time zone DEFAULT timezone('utc'::text, now()),
    transaction_date date DEFAULT now(),
    user_id uuid,
    registered_by text,
    payment_method text,
    category text,
    CONSTRAINT transactions_status_check CHECK (status = ANY (ARRAY['PENDING'::text, 'COMPLETED'::text])),
    CONSTRAINT transactions_type_check CHECK (type = ANY (ARRAY['INCOME'::text, 'EXPENSE'::text])),
    CONSTRAINT transactions_pkey PRIMARY KEY (id),
    CONSTRAINT transactions_category_id_fkey FOREIGN KEY (category_id) REFERENCES public.categories(id),
    CONSTRAINT transactions_user_id_fkey FOREIGN KEY (user_id) REFERENCES auth.users(id)
);

-- Lista privada de contas autorizadas pelo administrador da empresa
CREATE TABLE private.finance_members (
    user_id uuid NOT NULL,
    role text NOT NULL,
    CONSTRAINT finance_members_role_check CHECK (role = ANY (ARRAY['editor'::text, 'viewer'::text])),
    CONSTRAINT finance_members_pkey PRIMARY KEY (user_id),
    CONSTRAINT finance_members_user_id_fkey FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE
);

ALTER TABLE private.finance_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.transactions ENABLE ROW LEVEL SECURITY;

-- Consulta de papel; tabela privada não é exposta ao cliente.
CREATE FUNCTION private.finance_role() RETURNS text
    LANGUAGE sql STABLE SECURITY DEFINER
    SET search_path TO ''
    AS $$
      SELECT role FROM private.finance_members
      WHERE user_id = (SELECT auth.uid());
    $$;

-- Impedir execução pública implícita de função SECURITY DEFINER
REVOKE ALL ON SCHEMA private FROM PUBLIC, anon;
REVOKE ALL ON TABLE private.finance_members FROM PUBLIC, anon, authenticated;
REVOKE ALL ON FUNCTION private.finance_role() FROM PUBLIC, anon;
GRANT USAGE ON SCHEMA private TO authenticated;
GRANT EXECUTE ON FUNCTION private.finance_role() TO authenticated;

-- Categorias: mantida a leitura pública presente no projeto original.
CREATE POLICY "Categories are publicly readable"
    ON public.categories FOR SELECT TO authenticated, anon USING (true);

-- Finanças: somente contas explicitamente autorizadas
CREATE POLICY finance_select ON public.transactions FOR SELECT TO authenticated
    USING ((SELECT private.finance_role()) IN ('editor', 'viewer'));

CREATE POLICY finance_insert ON public.transactions FOR INSERT TO authenticated
    WITH CHECK ((SELECT private.finance_role()) = 'editor');

CREATE POLICY finance_update ON public.transactions FOR UPDATE TO authenticated
    USING ((SELECT private.finance_role()) = 'editor')
    WITH CHECK ((SELECT private.finance_role()) = 'editor');

CREATE POLICY finance_delete ON public.transactions FOR DELETE TO authenticated
    USING ((SELECT private.finance_role()) = 'editor');

-- Grants para acesso via API Supabase.
-- RLS continua sendo aplicada a todas as operações nos dados.
GRANT USAGE ON SCHEMA public TO anon, authenticated;
GRANT SELECT ON TABLE public.categories TO anon, authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON TABLE public.transactions TO authenticated;

COMMIT;

-- APÓS EXECUTAR:
-- 1) Crie ou convide as contas em Authentication > Users.
-- 2) Registre cada conta na tabela private.finance_members pelo SQL Editor:
--    INSERT INTO private.finance_members (user_id, role)
--    SELECT id, 'editor' FROM auth.users WHERE email = 'email-do-socio@exemplo.com'
--    ON CONFLICT (user_id) DO UPDATE SET role = EXCLUDED.role;
--    Para a conta de demonstração, use 'viewer' em vez de 'editor'.
-- 3) Desative cadastros públicos em Authentication se o acesso for somente por convite.
-- 4) Configure suas variáveis de ambiente do projeto Next.js e teste login/RLS.
-- NOTA: Este arquivo não inclui dados iniciais de categories, usuários do Auth
-- nem outras configurações do painel Supabase (provedores, URLs etc.).
