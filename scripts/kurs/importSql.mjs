import { writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { mavzuYoli } from './nashr.mjs';
import { kursPapkasi } from './xususiy.mjs';

const sqlMatn = (s) => "'" + s.replaceAll("'", "''") + "'";

export function importSql(mavzu, reja, { yagonaMavzu = false, postgresRoli = false } = {}) {
  if (reja.length !== mavzu.total || reja.some(({ qator, rasm }) => qator.status !== 'verified' || rasm)) {
    throw new Error('SQL importi uchun tasdiqlangan to‘liq mavzu kerak. Savol rasmlari alohida yuklashni talab qiladi.');
  }
  const qatorlar = reja.map(({ qator }) => qator);
  const ustunlar = Object.keys(qatorlar[0]);
  const ustunSql = ustunlar.join(', ');
  const yangilash = ustunlar.filter((nom) => nom !== 'external_id').map((nom) => `${nom} = excluded.${nom}`).join(',\n  ');
  const json = sqlMatn(JSON.stringify(qatorlar));
  const prefiks = sqlMatn(`sat-kurs:v1:${mavzu.topicSlug}:%`);
  return `begin;${postgresRoli ? '\nset local role postgres;' : ''}
set local standard_conforming_strings = on;
lock table public.questions in share row exclusive mode;
create temp table kurs_import on commit drop as
select ${ustunSql} from jsonb_populate_recordset(null::public.questions, ${json}::jsonb);

do $kurs_conflict$
begin
  if exists (
    select 1 from public.questions q join kurs_import k using (external_id)
    where q.status = 'hidden'
       or (q.content_hash is distinct from k.content_hash and q.version >= k.version)
       or q.version > k.version
       or not exists (select 1 from unnest(q.tags) teg where teg like ${prefiks})
  ) or exists (
    select 1 from public.questions q where q.status = 'verified'
      and exists (select 1 from unnest(q.tags) teg where teg like ${prefiks})
      and not exists (select 1 from kurs_import k where k.external_id = q.external_id)
  ) then
    raise exception 'course_import_conflict';
  end if;
end
$kurs_conflict$;

insert into public.questions as eski (${ustunSql})
select ${ustunSql} from kurs_import
on conflict (external_id) do update set
  ${yangilash}
where to_jsonb(eski) - array['id', 'created_at', 'updated_at']
  is distinct from to_jsonb(excluded) - array['id', 'created_at', 'updated_at'];

do $kurs_count$
begin
  if (select count(*) from public.questions q join kurs_import k using (external_id)
      where q.status = 'verified' and q.content_hash = k.content_hash and q.tags = k.tags) <> ${mavzu.total}
    or (select count(*) from public.questions q
        where exists (select 1 from unnest(q.tags) teg where teg like ${prefiks})) <> ${mavzu.total}${yagonaMavzu ? `
    or exists (select 1 from public.questions q cross join lateral unnest(q.tags) as t(teg)
        where teg like 'sat-kurs:%' and teg not like ${prefiks})` : ''}
  then
    raise exception 'course_import_count_mismatch';
  end if;
end
$kurs_count$;

-- The receipt is generated only from rows verified in this transaction.
select jsonb_build_object(
  'topic', ${sqlMatn(mavzu.id)},
  'hash', encode(sha256(convert_to(string_agg(q.external_id || ':' || q.content_hash, E'\\n' order by q.external_id collate "C"), 'UTF8')), 'hex'),
  'savollar', count(*),
  'miniTest', count(*) filter (where q.tags[1] like '%:mini_test')
)::text
from public.questions q join kurs_import k using (external_id)
where q.status = 'verified' and q.content_hash = k.content_hash and q.tags = k.tags;
commit;
`;
}

export function importSqlYoz(papka, mavzu, reja, { staging, birinchiNashr } = {}) {
  const ildiz = mavzuYoli(kursPapkasi(papka, staging ? 'staging' : 'content'), mavzu);
  const sql = importSql(mavzu, reja, { yagonaMavzu: birinchiNashr, postgresRoli: birinchiNashr });
  writeFileSync(join(ildiz, 'import.sql'), sql, { flag: 'wx', mode: 0o600 });
}
