// holat.ts (saqlash adapteri) sinovi soxta server va soxta localStorage bilan.
// Ishga tushirish: node scripts/sinxron-test.ts
// Ma'lumotlar sun'iy (namuna), haqiqiy foydalanuvchi ma'lumoti emas.
import assert from 'node:assert/strict';

// ---------- brauzer o'rnini bosuvchilar ----------
class Xotira {
  m = new Map<string, string>();
  getItem(k: string) { return this.m.has(k) ? this.m.get(k)! : null; }
  setItem(k: string, v: string) { this.m.set(k, String(v)); }
  removeItem(k: string) { this.m.delete(k); }
  clear() { this.m.clear(); }
}
const g = globalThis as Record<string, unknown>;
g.localStorage = new Xotira();
g.sessionStorage = new Xotira();
g.window = new EventTarget();
let onlayn = true;
Object.defineProperty(globalThis, 'navigator', { value: { get onLine() { return onlayn; } }, configurable: true });

const H = await import('../src/lib/holat.ts');
const ls = g.localStorage as Xotira;

class SoxtaServer {
  qatorlar = new Map<string, string>();
  oqishlar = 0;
  yozishlar = 0;
  yozilganKalitlar: string[] = [];
  async oqi(kalitlar: string[]) {
    if (!onlayn) throw new TypeError('Failed to fetch');
    this.oqishlar++;
    const r: Record<string, unknown> = {};
    for (const k of kalitlar) if (this.qatorlar.has(k)) r[k] = JSON.parse(this.qatorlar.get(k)!);
    return r;
  }
  async yoz(y: { kalit: string; qiymat: unknown }[]) {
    if (!onlayn) throw new TypeError('Failed to fetch');
    this.yozishlar++;
    for (const x of y) { this.qatorlar.set(x.kalit, JSON.stringify(x.qiymat)); this.yozilganKalitlar.push(x.kalit); }
  }
  q(k: string) { return this.qatorlar.has(k) ? JSON.parse(this.qatorlar.get(k)!) : undefined; }
}

let vaqt = 1_000_000;
H.soatniAlmashtir(() => vaqt);
const kut = () => new Promise((r) => setTimeout(r, 0));
const oqi = (k: string) => JSON.parse(ls.getItem(k) ?? 'null');
let n = 0;
const sinov = async (nomi: string, f: () => Promise<void> | void) => {
  await f();
  n++;
  console.log(`  ✓ ${nomi}`);
};

// ---------- sun'iy eski (legacy) ma'lumot: vaqt belgisi yo'q ----------
const eskiJavoblar = [
  { id: 'q2-1700000000002', mavzu: 'Linear equations', bolim: 'Math', sana: 'November 3', javob: 'B', togriJavob: 'B', togri: true },
  { id: 'q1-1700000000001', mavzu: 'Punctuation', bolim: 'Reading & Writing', sana: 'November 2', javob: 'A', togriJavob: 'C', togri: false },
];
const eskiProgress = { 'math-chiziqli': { m1: 'togri', m2: 'xato' }, 'rw-xato': { r1: 'xato' } };
const eskiDaftar = [
  { id: 'm2', modul: 'math-chiziqli', tanlangan: '3', sana: '2026-11-05' },
  { id: 'r1', modul: 'rw-xato', tanlangan: 'its', sana: '2026-11-04' },
];
const eskiTakror = { versiya: 1, savollar: {
  m2: { quti: 3, keyingi: '2026-11-20', xatoSana: '2026-11-01' },
  r1: { quti: 1, keyingi: '2026-11-05', xatoSana: '2026-11-04' },
} };
const eskiReja = { sana: '2026-11-01', hozirgi: null, maqsad: 1400, kunlar: 4, fokus: 'teng', belgilar: { 'h1-0': true } };
// Lug'at (P15) endi o'z jadvallarida: P04 uni sinxronlamaydi, faqat tegmasligi tekshiriladi.
const eskiLugat = { ambiguous: 'bilaman', candid: 'organ' };
/** Takrorlash kartasi (Leitner): yozuv darajasidagi ziddiyat sinovlari uchun */
const karta = (quti: number, keyingi: string) => ({ quti, keyingi, xatoSana: '2026-11-01' });
const takror = (savollar: Record<string, unknown>) => ({ versiya: 1, savollar });
const seed = () => {
  ls.clear();
  ls.setItem('tayanch:sat-javoblar', JSON.stringify(eskiJavoblar));
  ls.setItem('tayanch:sat-dars-progress', JSON.stringify(eskiProgress));
  ls.setItem('tayanch:sat-xato-daftari', JSON.stringify(eskiDaftar));
  ls.setItem('tayanch:sat-takrorlash', JSON.stringify(eskiTakror));
  ls.setItem('tayanch:sat-reja', JSON.stringify(eskiReja));
  ls.setItem('tayanch:sat-lugat', JSON.stringify(eskiLugat));
  ls.setItem('tayanch:ielts-xato-daftari', JSON.stringify([{ id: 'x', modul: 'y', tanlangan: 'z', sana: '2026-11-01' }]));
};

console.log('Sinxron adapter sinovi');

await sinov('Hisobsiz: holatYoz avvalgidek localStorage ga yozadi, serverga hech narsa ketmaydi', () => {
  seed();
  const yangi = [{ id: 'q3-1', mavzu: 'x', bolim: 'Math', sana: 'November 4', javob: 'A', togriJavob: 'A', togri: true }, ...eskiJavoblar];
  assert.equal(H.holatYoz('tayanch:sat-javoblar', yangi), true);
  assert.equal(ls.getItem('tayanch:sat-javoblar'), JSON.stringify(yangi));
  assert.equal(H.holatYoz('tayanch:ielts-reja', { a: 1 }), true);
  assert.equal(ls.getItem('tayanch:ielts-reja'), '{"a":1}');
  assert.equal(H._ichki.sinxronFaolmi(), false);
  assert.deepEqual(H._ichki.navbat(), []);
});

const A = new SoxtaServer();
await sinov('Kirish: brauzerda ma\'lumot bor → dialog so\'raladi, rozilikgacha hech narsa yuborilmaydi', async () => {
  seed();
  let sorov: unknown = null;
  H.sinxronSoroviniKut((s) => { sorov = s; });
  assert.equal(H.ulash(A, 'u1'), 'sorov');
  await kut();
  assert.deepEqual(sorov, {
    'tayanch:sat-javoblar': 2, 'tayanch:sat-dars-progress': 3, 'tayanch:sat-xato-daftari': 2,
    'tayanch:sat-takrorlash': 2, 'tayanch:sat-reja': 1,
  });
  assert.equal(A.oqishlar + A.yozishlar, 0);
  // Rozilikdan oldingi yozish ham yuborilmaydi
  H.holatYoz('tayanch:sat-takrorlash', takror({ ...eskiTakror.savollar, q9: karta(1, '2026-11-06') }));
  ls.setItem('tayanch:sat-takrorlash', JSON.stringify(eskiTakror));
  await new Promise((r) => setTimeout(r, 50));
  assert.equal(A.oqishlar + A.yozishlar, 0);
});

await sinov('"Not now" shu sessiyada qayta so\'ramaydi, "Don\'t ask again" shu qurilmada so\'ramaydi', () => {
  H.keyinroq();
  assert.equal(H.ulash(A, 'u1'), 'keyin');
  (g.sessionStorage as Xotira).clear();
  H.soramaslik();
  assert.equal(H.ulash(A, 'u1'), 'mahalliy');
  assert.equal(A.oqishlar + A.yozishlar, 0);
  assert.equal(H.importniQaytaTaklif(), 'sorov');
});

await sinov('Import: hamma kalit serverga, bayroq profilda, Leitner qutilari va sanalari o\'zgarmaydi', async () => {
  vaqt = 2_000_000;
  await H.importQil();
  await kut();
  for (const k of ['tayanch:sat-javoblar', 'tayanch:sat-dars-progress', 'tayanch:sat-xato-daftari', 'tayanch:sat-takrorlash', 'tayanch:sat-reja']) {
    assert.ok(A.q(k), `${k} serverda yo'q`);
  }
  assert.equal(A.q('tayanch:sat-lugat'), undefined, "Lug'at (P15) user_state ga yozilmasin");
  assert.deepEqual(oqi('tayanch:sat-lugat'), eskiLugat, "Lug'at kaliti o'zgarmasin");
  assert.deepEqual(A.q('tayanch:sat-takrorlash').qiymat, eskiTakror);
  assert.deepEqual(A.q('tayanch:sat-dars-progress').qiymat, eskiProgress);
  assert.deepEqual(A.q('tayanch:sat-javoblar').qiymat, eskiJavoblar);
  assert.equal(A.q('tayanch:sat-import').migrated, true);
  assert.equal(A.q('tayanch:ielts-xato-daftari'), undefined, 'IELTS kalitiga tegilmasin');
  // Mahalliy nusxa (zaxira) qoladi
  assert.deepEqual(oqi('tayanch:sat-takrorlash'), eskiTakror);
  assert.deepEqual(oqi('tayanch:sat-javoblar'), eskiJavoblar);
});

await sinov('Takror import: dublikat yo\'q, ma\'lumot bir xil', async () => {
  const oldin = new Map(A.qatorlar);
  await H.importQil();
  await H.sinxronlaHozir();
  for (const [k, v] of oldin) if (k !== 'tayanch:sat-import') assert.equal(A.qatorlar.get(k), v, `${k} o'zgardi`);
  assert.equal(A.q('tayanch:sat-javoblar').qiymat.length, 2);
  assert.equal(A.q('tayanch:sat-xato-daftari').qiymat.length, 2);
  const b = A.q('tayanch:sat-import');
  assert.equal(b.birinchi, new Date(2_000_000).toISOString());
});

await sinov('Sinxron: yangi yozish debounce bilan serverga ketadi', async () => {
  vaqt = 3_000_000;
  const yozishlar = A.yozishlar;
  H.holatYoz('tayanch:sat-takrorlash', takror({ ...eskiTakror.savollar, q9: karta(1, '2026-11-06') }));
  assert.deepEqual(H._ichki.navbat(), ['tayanch:sat-takrorlash']);
  await H.sinxronlaHozir();
  assert.equal(A.yozishlar, yozishlar + 1);
  assert.deepEqual(A.q('tayanch:sat-takrorlash').qiymat.savollar.q9, karta(1, '2026-11-06'));
  assert.equal(A.q('tayanch:sat-takrorlash').t.q9, 3_000_000);
  assert.deepEqual(H._ichki.navbat(), []);
  // Lug'at yozuvi navbatga tushmaydi (P15 o'zi saqlaydi)
  H.holatYoz('tayanch:sat-lugat', { ...eskiLugat, lucid: 'organ' });
  assert.deepEqual(H._ichki.navbat(), []);
  assert.equal(oqi('tayanch:sat-lugat').lucid, 'organ');
});

await sinov('Ziddiyat: yangiroq updatedAt yutadi (ikki qurilma)', async () => {
  // 2-qurilma: serverdagi takrorlashni 4_000_000 da o'zgartirgan
  const s = A.q('tayanch:sat-takrorlash');
  s.qiymat.savollar.r1 = karta(2, '2026-11-09'); s.t.r1 = 4_000_000;
  s.qiymat.savollar.q9 = karta(4, '2026-11-30'); s.t.q9 = 2_500_000; // eskiroq: shu qurilmaning 3_000_000 dagi qiymati yutishi kerak
  A.qatorlar.set('tayanch:sat-takrorlash', JSON.stringify(s));
  vaqt = 3_500_000;
  const joriy = oqi('tayanch:sat-takrorlash');
  H.holatYoz('tayanch:sat-takrorlash', takror({ ...joriy.savollar, m2: karta(4, '2026-12-01') })); // 3_500_000
  await H.sinxronlaHozir();
  const l = oqi('tayanch:sat-takrorlash');
  assert.deepEqual(l.savollar.r1, karta(2, '2026-11-09'), 'server (yangiroq) yutishi kerak');
  assert.deepEqual(l.savollar.q9, karta(1, '2026-11-06'), 'brauzer (yangiroq) yutishi kerak');
  assert.deepEqual(l.savollar.m2, karta(4, '2026-12-01'));
  assert.deepEqual(A.q('tayanch:sat-takrorlash').qiymat, l);
});

await sinov('Ziddiyat: vaqt teng bo\'lsa server yutadi', async () => {
  const s = A.q('tayanch:sat-takrorlash');
  s.qiymat.savollar.m2 = karta(5, '2026-12-15'); // brauzerdagi bilan bir xil vaqt (3_500_000)
  A.qatorlar.set('tayanch:sat-takrorlash', JSON.stringify(s));
  H.holatYoz('tayanch:sat-reja', { ...eskiReja, maqsad: 1450 }); // navbatga boshqa kalit
  // takrorlashni ham navbatga qo'yish uchun (o'zgarishsiz yozish vaqtni o'zgartirmaydi)
  H.holatYoz('tayanch:sat-takrorlash', oqi('tayanch:sat-takrorlash'));
  await H.sinxronlaHozir();
  assert.deepEqual(oqi('tayanch:sat-takrorlash').savollar.m2, karta(5, '2026-12-15'));
});

await sinov("Xato daftari: to'g'ri javob yozuvni olib tashlasa boshqa qurilmada ham o'chadi (tombstone)", async () => {
  vaqt = 5_000_000;
  H.holatYoz('tayanch:sat-xato-daftari', oqi('tayanch:sat-xato-daftari').filter((x: { id: string }) => x.id !== 'r1'));
  await H.sinxronlaHozir();
  const s = A.q('tayanch:sat-xato-daftari');
  assert.deepEqual(s.qiymat.map((x: { id: string }) => x.id), ['m2']);
  assert.equal(s.o.r1, 5_000_000);
});

await sinov('Oflayn: navbat saqlanadi, qayta urinadi, "online" bo\'lganda yuboradi', async () => {
  onlayn = false;
  vaqt = 6_000_000;
  const yangi = { ...oqi('tayanch:sat-dars-progress'), 'rw-xato': { r1: 'togri' } };
  H.holatYoz('tayanch:sat-dars-progress', yangi);
  await H.sinxronlaHozir();
  assert.deepEqual(H._ichki.navbat(), ['tayanch:sat-dars-progress']);
  assert.equal(ls.getItem('tayanch:sat-sinxron-navbat'), '["tayanch:sat-dars-progress"]', 'navbat localStorage da');
  assert.equal(A.q('tayanch:sat-dars-progress').qiymat['rw-xato'].r1, 'xato');
  onlayn = true;
  (g.window as EventTarget).dispatchEvent(new Event('online'));
  await kut(); await kut();
  await H.sinxronlaHozir();
  assert.equal(A.q('tayanch:sat-dars-progress').qiymat['rw-xato'].r1, 'togri');
  assert.deepEqual(H._ichki.navbat(), []);
});

await sinov('Server xatosi (import): brauzerdagi ma\'lumot o\'zgarmaydi', async () => {
  H.uzish();
  seed();
  const B = new SoxtaServer();
  B.qatorlar = new Map(A.qatorlar);
  assert.equal(H.ulash(B, 'u2'), 'sorov');
  const oldin = new Map(ls.m);
  onlayn = false;
  await assert.rejects(H.importQil());
  onlayn = true;
  assert.deepEqual(new Map(ls.m), oldin);
});

await sinov('2-qurilma importi: serverdagi tombstone eski yozuvni o\'chirmaydi (import hech narsani o\'chirmaydi), id bo\'yicha birlashadi', async () => {
  const B = new SoxtaServer();
  B.qatorlar = new Map(A.qatorlar);
  H.uzish();
  assert.equal(H.ulash(B, 'u1'), 'sorov'); // bu qurilmada u1 rozilik bermagan
  vaqt = 7_000_000;
  await H.importQil();
  const d = B.q('tayanch:sat-xato-daftari');
  assert.deepEqual(d.qiymat.map((x: { id: string }) => x.id).sort(), ['m2', 'r1']);
  assert.ok(d.t.r1 > d.o.r1 || d.o.r1 === undefined);
  assert.equal(B.q('tayanch:sat-javoblar').qiymat.length, 2, 'bir xil id dublikat bo\'lmasin');
});

await sinov('Clear local copy: brauzer nusxasi o\'chadi, hisobdagi nusxa qoladi', async () => {
  const B = new SoxtaServer();
  B.qatorlar = new Map(A.qatorlar);
  H.uzish();
  H.ulash(B, 'u1');
  await H.sinxronlaHozir();
  const serverOldin = new Map(B.qatorlar);
  assert.equal(await H.mahalliyNusxaniTozala(), true);
  for (const k of ['tayanch:sat-javoblar', 'tayanch:sat-takrorlash', 'tayanch:sat-sinxron-vaqt']) assert.equal(ls.getItem(k), null);
  assert.ok(ls.getItem('tayanch:ielts-xato-daftari'), 'IELTS kaliti qoladi');
  assert.ok(ls.getItem('tayanch:sat-lugat'), "Lug'at kaliti (P15) qoladi");
  assert.deepEqual(new Map(B.qatorlar), serverOldin);
});

console.log(`${n} ta sinov o'tdi`);
