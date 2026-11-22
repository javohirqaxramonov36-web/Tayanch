-- ADR 006: bitta hisobning qavat obunalari va qat'iy live-only to'lov tarixi.
create or replace function public.account_subscriptions()
returns jsonb
language sql stable security definer set search_path = ''
as $$
  select jsonb_build_object(
    'plans', coalesce((select jsonb_agg(jsonb_build_object('code', p.code, 'name', p.name, 'bolim', p.bolim, 'sort', p.sort))
      from public.plans p where p.is_active), '[]'::jsonb),
    'subscriptions', coalesce((select jsonb_agg(jsonb_build_object('bolim', s.bolim, 'name', p.name, 'status', s.status,
        'starts_at', s.starts_at, 'ends_at', s.ends_at, 'sort', p.sort))
      from public.subscriptions s join public.plans p on p.code = s.plan_code where s.user_id = (select auth.uid())), '[]'::jsonb),
    'payments', coalesce((select jsonb_agg(to_jsonb(h) order by h.created_at desc) from (
      select pm.id, pm.bolim, p.name, pm.amount_uzs, pm.status, pm.created_at
      from public.payments pm join public.plans p on p.code = pm.plan_code
      where pm.user_id = (select auth.uid()) and pm.raw -> 'inpay' -> 'livemode' = 'true'::jsonb
      order by pm.created_at desc, pm.id limit 50
    ) h), '[]'::jsonb)
  ) where (select auth.uid()) is not null
$$;
revoke all on function public.account_subscriptions() from public, anon;
grant execute on function public.account_subscriptions() to authenticated;
