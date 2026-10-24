-- Mini CRM: um registro por contato (clique no WhatsApp ou formulario)
create table if not exists public.leads (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  name text not null,
  email text,
  phone text,
  niche text,
  ramo text,
  model text,
  message text,
  channel text default 'whatsapp',
  source text default 'direto',
  campaign text,
  status text not null default 'novo'
    check (status in ('novo','conversando','proposta','fechado','perdido')),
  notes text
);
-- Se a tabela ja existia antes, estas linhas adicionam o que falta:
alter table public.leads add column if not exists email text;
alter table public.leads add column if not exists ramo text;
alter table public.leads add column if not exists message text;
alter table public.leads add column if not exists channel text default 'whatsapp';
-- RLS ligado e sem policies: so a service role (a rota /api/leads) escreve e le.
alter table public.leads enable row level security;
