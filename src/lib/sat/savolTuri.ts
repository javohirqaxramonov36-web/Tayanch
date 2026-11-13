// Savol ko'rsatkichi (P06) uchun turlar. Asos: P02 `questions` jadvali (supabase-sxema branch),
// mijozga beriladigan ko'rinish: to'g'ri javob va tushuntirish YO'Q (ular faqat javobdan keyin, `natija` da).
// P05 (savol formati, import) shu turga moslanadi (muallif qarori, 2026-11-09).
//
// Matn maydonlari (passage, stem, options[].text, natija.izoh) formati:
//   - ruxsat etilgan teglar: u em strong sup sub br p table thead tbody tr th td (atribut: faqat th[scope]);
//     qolgan teglar ochib tashlanadi (matni qoladi), script/style butunlay o'chiriladi (xavfsizMatn.ts);
//   - formula: $...$ (qator ichida), $$...$$ (alohida qator), KaTeX; oddiy dollar belgisi: \$;
//   - she'r qatorlari: <br> bilan.

export type SavolBolimi = 'math' | 'rw';
export type SavolFormati = 'mcq' | 'spr';

export interface SavolVarianti {
  /** "A", "B", "C", "D" (P02: 2–6 ta variant) */
  key: string;
  text: string;
}

export interface SavolRasmi {
  /** Tayyor URL. Yopiq bucket'dagi rasm uchun imzolangan URL'ni ota sahifa oladi (komponent tarmoqqa chiqmaydi). */
  src: string;
  /** Majburiy: rasm mazmuni so'z bilan. Bo'sh bo'lsa komponent xato beradi. */
  alt: string;
  caption?: string;
}

/** Mijozdagi savol (javobsiz). */
export interface Savol {
  id: string;
  section: SavolBolimi;
  format: SavolFormati;
  passage?: string | null;
  stem: string;
  /** mcq: variantlar; spr: null */
  options?: SavolVarianti[] | null;
  figure?: SavolRasmi | null;
}

/** Javob yuborilgandan keyin serverdan keladigan natija (submit_answer). Faqat taymersiz rejimda ko'rsatiladi. */
export interface SavolNatijasi {
  togrimi: boolean;
  /** mcq: "B"; spr: qabul qilingan javoblardan biri, masalan "3/2" */
  togriJavob: string;
  izoh?: string | null;
}

export interface SavolHolati {
  /** true: javob yuborilgan, tanlov va kiritish qulflanadi */
  javobBerilgan: boolean;
  /** mcq: tanlangan variant kaliti */
  tanlangan: string | null;
  /** spr: kiritilgan qiymat */
  sprQiymat?: string;
  /** "Mark for review" */
  belgilangan: boolean;
  /** Cross out qilingan variant kalitlari */
  ochirilgan: string[];
  natija?: SavolNatijasi | null;
  /** P24: foydalanuvchi bu savol haqida xabar yuborgan (tugma "Reported") */
  xabarlangan?: boolean;
}

/** taymerli: natija ko'rsatilmaydi (imtihon kabi); taymersiz: mashq, javobdan keyin natija */
export type SavolRejimi = 'taymerli' | 'taymersiz';

export interface SavolKorsatkichProps {
  savol: Savol;
  holat: SavolHolati;
  rejim: SavolRejimi;
  /** "Question 3" yorlig'i uchun; berilmasa yorliq chiqmaydi */
  raqam?: number;
  /** Variant tanlandi (null: tanlov olib tashlandi, masalan tanlangan variant cross out qilinganda) */
  onSelect?: (kalit: string | null) => void;
  /** SPR: format tekshiruvidan o'tgan qiymat yuborildi */
  onSubmitSpr?: (qiymat: string) => void;
  onFlag?: (belgilangan: boolean) => void;
  onEliminate?: (kalit: string, ochirilgan: boolean) => void;
  /** P24 "Report": tugma faqat shu berilganda chiqadi; dialog ota sahifada, fokus shu tugmaga qaytadi */
  onReport?: (tugma: HTMLButtonElement) => void;
}

export const BOSH_HOLAT: SavolHolati = {
  javobBerilgan: false,
  tanlangan: null,
  sprQiymat: '',
  belgilangan: false,
  ochirilgan: [],
  natija: null,
};
