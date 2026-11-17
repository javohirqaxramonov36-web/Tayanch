// Yosh guruhi va ota-ona roziligi bloki mantiqi (komponent: src/components/hisob/YoshRozilik.astro).
// 12–17 tanlansa ota-ona bloki ochiladi (ism kamida 3 belgi va rozilik belgisi majburiy), "18+" ga qaytilsa yopiladi va tozalanadi.
import { maydonXatosi } from './hisob';
import { hisobSozlama } from '../data/hisobSozlama';

export interface YoshBloki {
  /** Bor bo'lsa: xatolarni ko'rsatadi va birinchi xatoli elementni qaytaradi (bo'lmasa null). */
  tekshir(): HTMLInputElement | null;
  /** user_metadata uchun qiymatlar. */
  metadata(): Record<string, unknown>;
}

export function yoshBloki(prefiks: string): YoshBloki {
  const el = <T extends HTMLElement>(id: string) => document.getElementById(`${prefiks}-${id}`) as T | null;
  const guruh = el<HTMLFieldSetElement>('yosh');
  const katta = el<HTMLInputElement>('yosh-katta');
  const kichik = el<HTMLInputElement>('yosh-kichik');
  const blok = el<HTMLFieldSetElement>('ota-ona');
  const ism = el<HTMLInputElement>('ota-ona-ism');
  const rozilik = el<HTMLInputElement>('ota-ona-rozilik');

  function guruhXatosi(matn: string | null) {
    if (!guruh || !katta || !kichik) return;
    const p = document.getElementById(`${guruh.id}-xato`);
    [katta, kichik].forEach((r) => (matn ? r.setAttribute('aria-invalid', 'true') : r.removeAttribute('aria-invalid')));
    if (p) { p.textContent = matn ?? ''; p.hidden = !matn; }
  }

  function yangila() {
    if (!blok) return;
    const kerak = Boolean(kichik?.checked);
    blok.hidden = !kerak;
    if (ism) ism.required = kerak;
    if (rozilik) rozilik.required = kerak;
    if (!kerak) {
      if (ism) { ism.value = ''; maydonXatosi(ism, null); }
      if (rozilik) { rozilik.checked = false; maydonXatosi(rozilik, null); }
    }
  }

  [katta, kichik].forEach((r) => r?.addEventListener('change', () => { guruhXatosi(null); yangila(); }));
  rozilik?.addEventListener('change', () => rozilik.checked && maydonXatosi(rozilik, null));
  ism?.addEventListener('input', () => maydonXatosi(ism, null));
  yangila();

  return {
    tekshir() {
      if (!katta || !kichik) return null;
      const tanlangan = katta.checked || kichik.checked;
      guruhXatosi(tanlangan ? null : 'Yoshingizni tanlang.');
      if (!tanlangan) return katta;
      if (kichik.checked && ism && rozilik) {
        const iXato = ism.value.trim().length >= 3 ? null : 'Ota-ona yoki vasiyning ismi va familiyasini kiriting.';
        const rXato = rozilik.checked ? null : "Ota-ona yoki vasiy rozilik belgisini qo'yishi kerak.";
        maydonXatosi(ism, iXato);
        maydonXatosi(rozilik, rXato);
        if (iXato) return ism;
        if (rXato) return rozilik;
      }
      return null;
    },
    metadata() {
      const asos = { min_age_confirmed: hisobSozlama.minYosh };
      if (kichik?.checked && ism) {
        return { ...asos, age_group: 'minor', guardian_name: ism.value.trim(), guardian_consent_at: new Date().toISOString() };
      }
      return { ...asos, age_group: 'adult' };
    },
  };
}
