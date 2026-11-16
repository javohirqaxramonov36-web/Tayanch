// My SAT profile uchun sun'iy holatlar. FAQAT dev rejimida: sahifa `import.meta.env.DEV` ichida dinamik import qiladi,
// production build'ga kirmaydi. Ochish: /uz/sat/hisob/profil/?sinov=toliq|bosh|xato
// Hamma qiymat shu yerda to'qilgan namuna; haqiqiy hisob yoki bazadan emas.
import type { ProfilQator } from './profilXulosa';
import type { BankQator } from './xatoDaftari';
import type { ObunaYozuv } from './obunaHolat';

export type ProfilSinovTur = 'toliq' | 'bosh' | 'xato';
export const profilSinovmi = (s: string | null): s is ProfilSinovTur => s === 'toliq' || s === 'bosh' || s === 'xato';

export interface ProfilSinov {
  profil: ProfilQator | Error;
  tarif: { plan: { code: string; name: string }; obunalar: ObunaYozuv[] } | Error;
  daftar: { today: string; items: BankQator[] } | Error;
  lugat: { qoshilgan: number; yulduzli: number } | Error;
}

export function profilSinov(tur: ProfilSinovTur, hozir: Date): ProfilSinov {
  const kun = (n: number) => new Date(hozir.getTime() + n * 86_400_000).toISOString();
  const sana = (n: number) => kun(n).slice(0, 10);
  if (tur === 'xato') {
    const e = new Error('sinov');
    return { profil: e, tarif: e, daftar: e, lugat: e };
  }
  if (tur === 'bosh') {
    return {
      profil: { display_name: null, nickname: null, target_score: null, current_score: null, exam_date: null },
      tarif: { plan: { code: 'free', name: 'Free' }, obunalar: [] },
      daftar: { today: sana(0), items: [] },
      lugat: { qoshilgan: 0, yulduzli: 0 },
    };
  }
  const q = (id: string, box: number | null, due: number | null, bookmarked = false): BankQator => ({
    question_id: id, section: 'rw', domain: 'Sample domain', skill: 'Sample skill', difficulty: 2, format: 'mcq', preview: 'Sample (test data)',
    in_queue: box !== null, box, next_due: due === null ? null : sana(due), reason_tag: null, note: null, bookmarked,
  });
  return {
    profil: { display_name: 'Test User', nickname: 'test_user', target_score: 1450, current_score: 1280, exam_date: sana(40) },
    tarif: { plan: { code: 'pro', name: 'Pro' }, obunalar: [{ plan_code: 'pro', status: 'active', starts_at: kun(-10), ends_at: kun(20) }] },
    daftar: { today: sana(0), items: [q('1', 1, -1), q('2', 2, 0), q('3', 3, 4), q('4', null, null, true)] },
    lugat: { qoshilgan: 12, yulduzli: 5 },
  };
}
