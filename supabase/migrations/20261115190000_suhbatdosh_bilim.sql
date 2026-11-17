-- Faqat server service role bilan o'qiydigan umumiy bilim. Brauzerga bucket huquqi berilmaydi.
insert into storage.buckets (id, name, public)
values ('suhbatdosh-bilim', 'suhbatdosh-bilim', false)
on conflict (id) do update set public = false;
