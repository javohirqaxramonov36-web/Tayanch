-- 0009. Savol rasmlari uchun Storage bucket.
-- Tanlov: YOPIQ bucket + imzolangan URL (createSignedUrl).
-- Sabab: repo ochiq va fayl yo'llari (external_id asosida) oldindan bilinadi; ochiq bucket pullik savol
-- rasmlarini hisobsiz yuklab olishga imkon berardi. Imzolangan URL faqat shu savol berilgan foydalanuvchiga
-- yaratiladi (storage.objects SELECT policy), muddati mijoz so'rovida beriladi.
-- Rasmni faqat service role yuklaydi (Dashboard yoki skript): authenticated uchun insert/update/delete policy yo'q.

insert into storage.buckets (id, name, public)
values ('question-figures', 'question-figures', false)
on conflict (id) do update set public = false;

drop policy if exists question_figures_served_read on storage.objects;
create policy question_figures_served_read on storage.objects
  for select to authenticated
  using (bucket_id = 'question-figures' and public.can_read_question_figure(name));
