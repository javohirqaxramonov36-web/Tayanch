-- ADR 006. Qavat qiymatlari src/data/bolimlar.ts dagi BolimSlug bilan bir xil.
-- plans.bolim, payments.bolim va subscriptions.bolim 0006 dan mavjud.
-- payment_create tarif qavatini to'lovga, payment_apply_event to'lov qavatini obunaga yozadi (0010).

begin;

alter table public.plans drop constraint if exists plans_bolim_check;
alter table public.plans add constraint plans_bolim_check
  check (bolim in ('top-admission', 'sat', 'ielts', 'eyuf', 'ai-academy'));

alter table public.payments drop constraint if exists payments_bolim_check;
alter table public.payments add constraint payments_bolim_check
  check (bolim in ('top-admission', 'sat', 'ielts', 'eyuf', 'ai-academy'));

alter table public.subscriptions drop constraint if exists subscriptions_bolim_check;
alter table public.subscriptions add constraint subscriptions_bolim_check
  check (bolim in ('top-admission', 'sat', 'ielts', 'eyuf', 'ai-academy'));

commit;
