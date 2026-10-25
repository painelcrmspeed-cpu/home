-- Permite que o administrador veja e atualize os contatos (tabela leads) dentro do painel.
-- Rode DEPOIS do leads.sql e do SQL dos tickets.
create policy "leads: admin le" on public.leads for select using (public.is_admin());
create policy "leads: admin altera" on public.leads for update using (public.is_admin()) with check (public.is_admin());
grant select, update on public.leads to authenticated;
