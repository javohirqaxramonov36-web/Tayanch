-- 0011. To'lov auditi va muvofiqlashtirish (P21). Faqat service_role chaqiradi.
--
-- 1. payment_events.payload: faqat ruxsat etilgan maydonlar saqlanadi (trigger). inPAY hodisasida yoki
--    GET /payments/{id} javobida mijoz ma'lumoti (telefon, karta, ism va h.k.) bo'lsa ham bazaga tushmaydi.
--    Qaysi maydonlar kelishi IP03 da to'liq sanab o'tilmagan, shuning uchun ro'yxat "ruxsat etilgan" tartibida:
--    noma'lum maydon yozilmaydi, faqat uning NOMI "dropped" ichida qoladi (nima kelganini ko'rish uchun).
--    payment_apply_event o'zgarmaydi: u to'liq hodisa bilan ishlaydi, jurnalga esa tozalangan nusxa yoziladi.
-- 2. payment_pending_stale: webhook kelmay qolgan to'lovlar ro'yxati (inpay-muvofiqlash Edge Function'i uchun).

------------------------------------------------------------------------------
-- 1. payment_events.payload tozalash
------------------------------------------------------------------------------
-- Faqat oddiy qiymat (matn, son, boolean); obyekt yoki massiv bo'lsa null (ichida nima borligi noma'lum).
create or replace function private.jsonb_skalyar(p jsonb)
returns jsonb
language sql
immutable
set search_path = ''
as $$
  select case when jsonb_typeof(p) in ('string', 'number', 'boolean') then p end
$$;

create or replace function private.payment_event_tozala(p_event jsonb)
returns jsonb
language plpgsql
immutable
set search_path = ''
as $$
declare
  v_ust   constant text[] := array['id', 'object', 'type', 'created', 'livemode', 'source', 'data'];
  v_obj_k constant text[] := array['id', 'object', 'status', 'amount', 'currency', 'livemode', 'created', 'metadata'];
  v_obj   jsonb;
  v_meta  jsonb;
  v_toza  jsonb;
  v_dropped jsonb;
begin
  if jsonb_typeof(p_event) is distinct from 'object' then
    return jsonb_build_object('dropped', jsonb_build_array('<' || coalesce(jsonb_typeof(p_event), 'null') || '>'));
  end if;

  v_obj := case when jsonb_typeof(p_event -> 'data' -> 'object') = 'object' then p_event -> 'data' -> 'object' end;
  v_meta := case when jsonb_typeof(v_obj -> 'metadata') = 'object' then v_obj -> 'metadata' end;

  v_toza := jsonb_strip_nulls(jsonb_build_object(
    'id',       private.jsonb_skalyar(p_event -> 'id'),
    'object',   private.jsonb_skalyar(p_event -> 'object'),
    'type',     private.jsonb_skalyar(p_event -> 'type'),
    'created',  private.jsonb_skalyar(p_event -> 'created'),
    'livemode', private.jsonb_skalyar(p_event -> 'livemode'),
    'source',   private.jsonb_skalyar(p_event -> 'source'),
    'data', case when v_obj is not null then jsonb_build_object('object', jsonb_build_object(
      'id',       private.jsonb_skalyar(v_obj -> 'id'),
      'object',   private.jsonb_skalyar(v_obj -> 'object'),
      'status',   private.jsonb_skalyar(v_obj -> 'status'),
      'amount',   private.jsonb_skalyar(v_obj -> 'amount'),
      'currency', private.jsonb_skalyar(v_obj -> 'currency'),
      'livemode', private.jsonb_skalyar(v_obj -> 'livemode'),
      'created',  private.jsonb_skalyar(v_obj -> 'created'),
      'metadata', case when v_meta is not null then jsonb_build_object(
        'payment_id', private.jsonb_skalyar(v_meta -> 'payment_id'),
        'plan_code',  private.jsonb_skalyar(v_meta -> 'plan_code')) end)) end
  ));

  -- Olib tashlangan maydon NOMLARI (qiymatsiz), ko'pi bilan 50 ta, har biri 64 belgigacha.
  select jsonb_agg(k order by k) into v_dropped
    from (
      select left(k, 64) as k from jsonb_object_keys(p_event) k where k <> all (v_ust)
      union all
      select 'data.' || left(k, 59) from jsonb_object_keys(
        case when jsonb_typeof(p_event -> 'data') = 'object' then p_event -> 'data' else '{}'::jsonb end) k
       where k <> 'object'
      union all
      select 'data.object.' || left(k, 52) from jsonb_object_keys(coalesce(v_obj, '{}'::jsonb)) k where k <> all (v_obj_k)
      union all
      select 'data.object.metadata.' || left(k, 43) from jsonb_object_keys(coalesce(v_meta, '{}'::jsonb)) k
       where k not in ('payment_id', 'plan_code')
      limit 50
    ) t;

  return case when v_dropped is null then v_toza else v_toza || jsonb_build_object('dropped', v_dropped) end;
end
$$;

create or replace function private.payment_events_tozala()
returns trigger
language plpgsql
set search_path = ''
as $$
begin
  new.payload := private.payment_event_tozala(new.payload);
  return new;
end
$$;

drop trigger if exists payment_events_tozala on public.payment_events;
create trigger payment_events_tozala before insert or update of payload on public.payment_events
  for each row execute function private.payment_events_tozala();

------------------------------------------------------------------------------
-- 2. Webhook kelmay qolgan to'lovlar
------------------------------------------------------------------------------
-- pending (inPAY to'lovi yaratilgan) va p_min_minutes daqiqadan eski, p_max_hours soatdan yangi.
-- Yuqori chegara Tayanch tanlovi: hech qachon yakunlanmagan to'lov har ishga tushishda abadiy so'ralmasligi uchun.
-- Eng eskisi birinchi; bir chaqiruvda ko'pi bilan p_limit ta (inPAY'ga so'rovlar ketma-ket ketadi).
create or replace function public.payment_pending_stale(
  p_min_minutes integer default 15,
  p_max_hours   integer default 48,
  p_limit       integer default 50
)
returns table (id uuid, provider_order_id text)
language sql
stable
security definer
set search_path = ''
as $$
  select pm.id, pm.provider_order_id
    from public.payments pm
   where pm.provider = 'inpay'
     and pm.status = 'pending'
     and pm.created_at < now() - make_interval(mins => greatest(coalesce(p_min_minutes, 15), 1))
     and pm.created_at > now() - make_interval(hours => least(greatest(coalesce(p_max_hours, 48), 1), 720))
   order by pm.created_at
   limit least(greatest(coalesce(p_limit, 50), 1), 200)
$$;

revoke all on function public.payment_pending_stale(integer, integer, integer) from public, anon, authenticated;
grant execute on function public.payment_pending_stale(integer, integer, integer) to service_role;
revoke all on function private.payment_event_tozala(jsonb) from public, anon, authenticated;
revoke all on function private.jsonb_skalyar(jsonb) from public, anon, authenticated;
