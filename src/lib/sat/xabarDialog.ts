// P24 "Report a problem" dialogini boshqarish (markup: src/components/sat/XabarDialog.astro).
// Holatlar: forma → yuborilmoqda → tayyor ("Thanks…") | takror (tayyor paneli) | xato (forma saqlanadi, xabar ko'rinadi).
// Klaviatura: Esc va Cancel yopadi, fokus ochgan tugmaga qaytadi. Yopish mantig'i yop() da: ilova brauzerida
// skriptli close() "close" hodisasini bermasligi mumkin. localStorage ishlatilmaydi (xabar faqat hisob bilan).
import { XABAR_MATN, izohTayyorla, sababTogrimi, xatoTuri, IZOH_MAX, type XabarApi } from './xabar';

export interface XabarOchish {
  qid: string;
  sessiya: string | null;
  /** "Question 3" kabi; dialogda kontekst uchun */
  nomi?: string;
  /** Foydalanuvchida bu savolga ochiq xabar bor */
  yuborilgan?: boolean;
  ochuvchi?: HTMLElement | null;
  /** Xabar qabul qilindi (yoki avval yuborilgan ekan): ota sahifa tugmani "Reported" qiladi */
  onYuborildi?: (qid: string) => void;
}

export function xabarDialogUlash(api: XabarApi) {
  const d = document.getElementById('xabar-dialog') as HTMLDialogElement;
  const $ = <T extends HTMLElement = HTMLElement>(i: string) => document.getElementById(i) as T;
  const forma = $<HTMLFormElement>('xd-forma');
  const izoh = $<HTMLTextAreaElement>('xd-izoh');
  const sanoq = $('xd-sanoq');
  const sababXato = $('xd-sabab-xato');
  const holat = $('xd-holat');
  const yuborTugma = $<HTMLButtonElement>('xd-yubor');
  const tayyor = $('xd-tayyor');
  const tayyorMatn = $('xd-tayyor-matn');
  const sarlavha = $('xd-h');
  const radiolar = () => [...forma.querySelectorAll<HTMLInputElement>('input[name="xd-sabab"]')];
  let joriy: XabarOchish | null = null;
  let band = false;

  function sanoqYangila() {
    sanoq.textContent = `${izoh.value.length} / ${IZOH_MAX}`;
  }

  function tayyorKorsat(matn: string, nom: string) {
    forma.hidden = true;
    tayyor.hidden = false;
    sarlavha.textContent = nom;
    tayyorMatn.textContent = matn;
    $('xd-tayyor-yop').focus();
  }

  function och(o: XabarOchish) {
    joriy = o;
    band = false;
    forma.reset();
    sanoqYangila();
    sababXato.hidden = true;
    holat.hidden = true;
    radiolar().forEach((r) => r.removeAttribute('aria-invalid'));
    yuborTugma.removeAttribute('aria-busy');
    yuborTugma.textContent = 'Send report';
    $('xd-savol').textContent = o.nomi ?? '';
    forma.hidden = false;
    tayyor.hidden = true;
    sarlavha.textContent = 'Report a problem';
    d.showModal();
    if (o.yuborilgan) tayyorKorsat(XABAR_MATN.takror, 'Already reported');
    else radiolar()[0]?.focus();
  }

  function yop() {
    if (d.open) d.close();
    const qayt = joriy?.ochuvchi;
    if (qayt && qayt.isConnected) qayt.focus();
    joriy = null;
  }

  d.addEventListener('cancel', (e) => { e.preventDefault(); yop(); });
  d.addEventListener('click', (e) => { if (e.target === d) yop(); });
  d.querySelectorAll('[data-xd-yop]').forEach((t) => t.addEventListener('click', yop));
  izoh.addEventListener('input', sanoqYangila);
  forma.addEventListener('change', () => {
    if (!sababXato.hidden && radiolar().some((r) => r.checked)) {
      sababXato.hidden = true;
      radiolar().forEach((r) => r.removeAttribute('aria-invalid'));
    }
  });

  forma.addEventListener('submit', async (e) => {
    e.preventDefault();
    if (band || !joriy) return;
    const sabab = radiolar().find((r) => r.checked)?.value;
    if (!sababTogrimi(sabab)) {
      sababXato.textContent = XABAR_MATN.sababYoq;
      sababXato.hidden = false;
      radiolar().forEach((r) => r.setAttribute('aria-invalid', 'true'));
      radiolar()[0]?.focus();
      return;
    }
    band = true;
    holat.hidden = true;
    yuborTugma.setAttribute('aria-busy', 'true');
    yuborTugma.textContent = 'Sending…';
    const o = joriy;
    try {
      await api.yubor({ qid: o.qid, sessiya: o.sessiya, sabab, izoh: izohTayyorla(izoh.value) });
      o.onYuborildi?.(o.qid);
      if (joriy === o) tayyorKorsat(XABAR_MATN.ok, 'Report sent');
    } catch (err) {
      const tur = xatoTuri(err);
      if (tur === 'takror') {
        o.onYuborildi?.(o.qid);
        if (joriy === o) tayyorKorsat(XABAR_MATN.takror, 'Already reported');
      } else if (joriy === o) {
        holat.textContent = XABAR_MATN[tur];
        holat.hidden = false;
      }
    } finally {
      band = false;
      yuborTugma.removeAttribute('aria-busy');
      yuborTugma.textContent = 'Send report';
    }
  });

  return { och, yop };
}

/** Haqiqiy API: supabase-js mijozi bilan (RLS: faqat o'z xabarlari). */
export function supabaseXabarApi(c: {
  from: (t: string) => any; // eslint-disable-line @typescript-eslint/no-explicit-any
}): XabarApi {
  return {
    async ochiqlar(qidlar) {
      if (!qidlar.length) return new Set();
      const { data, error } = await c.from('reports').select('question_id').in('question_id', qidlar).in('status', ['open', 'reviewed']);
      if (error) throw error;
      return new Set((data as { question_id: string }[]).map((r) => r.question_id));
    },
    async yubor({ qid, sessiya, sabab, izoh }) {
      const { error } = await c.from('reports').insert({ question_id: qid, session_id: sessiya, reason: sabab, message: izoh || null });
      if (error) throw error;
    },
  };
}
