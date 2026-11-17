import { hisobMijoz } from '../hisob';
import { tavsiyalar, xulosaOqi } from './analitika';
import { asosiyQadam, aniqlikMatn, kunlikMaqsad, rejaBormi, streakMatn, xatoDueSoni, type BugunKirish } from './bugun';
import { holatOqi } from '../holat';
import { AFZALLIK_KALITI, afzallikTozala } from './afzallik';
import { KALIT_REJA } from '../../data/satDarslar/turlar';
import type { MockStatus } from './mock';
import type { BankRoyxat } from './xatoDaftari';

const quti = document.querySelector<HTMLElement>('[data-sat-bugun]');
const q = <T extends HTMLElement>(s: string) => quti!.querySelector<T>(`[${s}]`)!;

function kirishniBekor() {
  document.documentElement.removeAttribute('data-sat-kirgan');
}

function oqiReja(): boolean {
  try { return rejaBormi(localStorage.getItem(KALIT_REJA)); } catch { return false; }
}

/** Kunlik maqsad satri: faqat brauzerdagi afzallikdan (server so'rovi yo'q, skelet paytida ham darhol). */
function maqsadniChiz() {
  const m = kunlikMaqsad(afzallikTozala(holatOqi(AFZALLIK_KALITI, null)).kunlikDaqiqa);
  const matn = q('data-b-maqsad-matn');
  matn.hidden = !m.matn;
  matn.textContent = m.matn ?? '';
  const h = q<HTMLAnchorElement>('data-b-maqsad-havola');
  h.textContent = m.havola;
  h.setAttribute('aria-label', m.havolaNomi);
}

const natija = <T,>(r: PromiseSettledResult<T>): T | null => (r.status === 'fulfilled' ? r.value : null);

function korsat(k: BugunKirish) {
  const a = asosiyQadam(k);
  const asos = quti!.dataset.asos!;
  q('data-b-sarlavha').textContent = a.sarlavha;
  q('data-b-matn').textContent = a.matn;
  const t = q<HTMLAnchorElement>('data-b-tugma');
  t.textContent = a.tugma;
  t.href = asos + a.qism;
  q('data-b-streak').textContent = k.tahlil ? streakMatn(k.tahlil.streak) : '–';
  q('data-b-aniqlik').textContent = (k.tahlil && aniqlikMatn(k.tahlil.urinish, k.tahlil.togri)) ?? 'No answers yet';
  q('data-b-xato').textContent = k.xatoDue == null ? '–' : String(k.xatoDue);
  q('data-b-soz').textContent = k.sozDue == null ? '–' : String(k.sozDue);
  const mq = q('data-b-mock-qator');
  mq.hidden = !k.oxirgiBall;
  if (k.oxirgiBall) q('data-b-mock').textContent = String(k.oxirgiBall.total);
  // Yangi o'quvchi (javob, takrorlash va mock yo'q): bo'sh ko'rsatkichlar shovqin, faqat asosiy qadam qoladi.
  const yangi = !!k.tahlil && k.tahlil.urinish === 0 && !k.xatoDue && !k.sozDue && !k.oxirgiBall;
  q('data-b-panel').hidden = yangi;
  q('data-b-tor').toggleAttribute('data-yakka', yangi);
  const zaif = k.tahlil?.zaif ?? [];
  q('data-b-zaif').hidden = zaif.length === 0;
  q('data-b-zaif-royxat').replaceChildren(...zaif.map((z) => {
    const li = document.createElement('li');
    const nom = document.createElement('span');
    nom.textContent = z.skill;
    const f = document.createElement('span');
    f.className = 'foiz';
    f.textContent = z.foiz == null ? '' : `${z.foiz}%`;
    li.append(nom, f);
    return li;
  }));
}

async function yukla() {
  const c = hisobMijoz();
  if (!quti || !c) return kirishniBekor();
  let sessiya = false;
  try { sessiya = !!(await c.auth.getSession()).data.session; } catch { /* pastda xato holati */ }
  if (!sessiya) return kirishniBekor();
  quti.setAttribute('aria-busy', 'true');
  q('data-b-xato-blok').hidden = true;
  q('data-b-tor').hidden = false;

  const rpc = async <T,>(nom: string): Promise<T> => {
    const { data, error } = await c.rpc(nom);
    if (error) throw error;
    return data as T;
  };
  const [mock, royxat, xulosa, sonlar] = await Promise.allSettled([
    rpc<MockStatus>('mock_status'),
    rpc<BankRoyxat>('review_overview'),
    rpc<unknown>('analytics_summary'),
    (async () => {
      const { data, error } = await c.rpc('question_counts', { p_filters: {} });
      if (error) throw error;
      return data as { total?: number } | null;
    })(),
  ]);
  const bankJami = natija(sonlar);
  const m = natija(mock);
  const r = natija(royxat);
  const x = xulosaOqi(natija(xulosa));
  const bugun = r?.today ?? x?.today ?? null;

  let sozDue: number | null = null;
  if (bugun) {
    const [p, o] = await Promise.allSettled([
      c.from('vocab_progress').select('next_due', { count: 'exact', head: true }).lte('next_due', bugun),
      c.from('user_vocab_words').select('next_due', { count: 'exact', head: true }).lte('next_due', bugun),
    ]);
    const sanoq = (v: PromiseSettledResult<{ count: number | null; error: unknown }>) =>
      v.status === 'fulfilled' && !v.value.error ? v.value.count ?? 0 : null;
    const a = sanoq(p as PromiseSettledResult<{ count: number | null; error: unknown }>);
    const b = sanoq(o as PromiseSettledResult<{ count: number | null; error: unknown }>);
    sozDue = a == null && b == null ? null : (a ?? 0) + (b ?? 0);
  }

  // Hammasi o'qilmasa: xato holati (blok bo'sh raqamlar bilan qolmaydi).
  if (!m && !r && !x) {
    q('data-b-tor').hidden = true;
    q('data-b-xato-blok').hidden = false;
    quti.setAttribute('aria-busy', 'false');
    return;
  }

  const tugagan = (m?.history ?? []).filter((h) => h.status === 'finished' && h.scores).sort((a, b) => (b.finished_at ?? '').localeCompare(a.finished_at ?? ''));
  korsat({
    mockFaol: m?.active ? { form_no: m.active.form_no, current_module: m.active.current_module, phase: m.active.phase } : null,
    xatoDue: r ? xatoDueSoni(r.items ?? [], r.today) : null,
    sozDue,
    rejaBor: oqiReja(),
    tahlil: x ? {
      urinish: x.totals.attempts,
      togri: x.totals.correct,
      streak: x.totals.streak,
      zaif: tavsiyalar(x.skills).slice(0, 3).map((s) => ({ skill: s.skill, foiz: s.foiz })),
    } : null,
    oxirgiBall: tugagan[0]?.scores ? { total: tugagan[0].scores.total, sana: tugagan[0].finished_at ?? '' } : null,
    bankSavol: bankJami && typeof bankJami.total === 'number' ? bankJami.total : null,
  });
  quti.setAttribute('aria-busy', 'false');
}

async function boshla() {
  if (!quti) return;
  maqsadniChiz();
  window.addEventListener('tayanch:holat-yangilandi', (e) => {
    const k = (e as CustomEvent<{ kalitlar?: string[] }>).detail?.kalitlar;
    if (!k || k.includes(AFZALLIK_KALITI)) maqsadniChiz();
  });
  window.addEventListener('pageshow', (e) => { if (e.persisted) maqsadniChiz(); });
  // Dev mock (dist'da yo'q): ?bugun-mock=yangi|bosh-bank|toliq|mock|takror|xato
  if (import.meta.env.DEV) {
    const tur = new URLSearchParams(location.search).get('bugun-mock');
    const { BUGUN_MOCKLAR, bugunMock } = await import('./bugunMock');
    if (tur && (BUGUN_MOCKLAR as readonly string[]).includes(tur)) {
      document.documentElement.setAttribute('data-sat-kirgan', '');
      const k = bugunMock(tur as (typeof BUGUN_MOCKLAR)[number]);
      if (k === 'xato') { q('data-b-tor').hidden = true; q('data-b-xato-blok').hidden = false; }
      else korsat(k);
      quti.setAttribute('aria-busy', 'false');
      return;
    }
  }
  if (!document.documentElement.hasAttribute('data-sat-kirgan')) return;
  quti.querySelector('[data-b-qayta]')?.addEventListener('click', () => { void yukla(); });
  void yukla();
}
void boshla();
