-- Mini CRM: um lead por clique no funil
create table if not exists public.leads (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  name text not null,
  phone text,
  niche text,
  ramo text,
  model text,
  source text default 'direto',
  campaign text,
  status text not null default 'novo'
    check (status in ('novo','conversando','proposta','fechado','perdido')),
  notes text
);
-- RLS ligado e sem policies: so a service role (rota /api/leads) escreve e le.
alter table public.leads enable row level security;

-- se a tabela ja existia antes desta versao:
alter table public.leads add column if not exists ramo text;
