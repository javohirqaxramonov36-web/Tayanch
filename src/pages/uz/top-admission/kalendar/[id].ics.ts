// "Kalendarga qo'shish": har muddat chiptasi uchun statik .ics fayl (build vaqtida, JS'siz).
// Butun kunlik tadbir oxirgi kun sanasida (vaqt mintaqasi muammosi yo'q), 1 kun oldin eslatma.
// Matn faqat sahifadagi ma'lumotdan (taChiptalar.ts): yangi fakt yo'q.
import type { APIRoute, GetStaticPaths } from 'astro';
import { taChiptalar, type TaChipta } from '../../../../data/taChiptalar';

export const getStaticPaths: GetStaticPaths = () => taChiptalar.map((c) => ({ params: { id: c.id }, props: { c } }));

// RFC 5545: matnda \ ; , va yangi qator qochiriladi; qator 75 baytdan uzun bo'lsa bo'linadi (UTF-8 belgisi o'rtadan bo'linmaydi).
const qochir = (s: string) => s.replace(/\\/g, '\\\\').replace(/;/g, '\\;').replace(/,/g, '\\,').replace(/\n/g, '\\n');
const bukla = (qator: string) => {
  const qismlar: string[] = [];
  let joriy = '';
  let bayt = 0;
  for (const belgi of qator) {
    const b = Buffer.byteLength(belgi);
    if (bayt + b > (qismlar.length ? 74 : 75)) { qismlar.push(joriy); joriy = ''; bayt = 0; }
    joriy += belgi; bayt += b;
  }
  qismlar.push(joriy);
  return qismlar.join('\r\n ');
};
const kun = (iso: string) => iso.replace(/-/g, '');
const ertasi = (iso: string) => {
  const s = new Date(`${iso}T00:00:00Z`);
  s.setUTCDate(s.getUTCDate() + 1);
  return s.toISOString().slice(0, 10).replace(/-/g, '');
};

const ics = (c: TaChipta) => {
  const tavsif = [
    c.izoh,
    `Manba: ${c.manba.tashkilot}, ${c.manba.havola}`,
    `Tekshirilgan: ${c.manba.tekshirilganSana}.`,
    'Muddatni rasmiy manbada qayta tekshiring. Natija kafolatlanmaydi.',
  ].filter(Boolean).join('\n');
  const qatorlar = [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//Tayanch//Top Admission//UZ',
    'CALSCALE:GREGORIAN',
    'METHOD:PUBLISH',
    'BEGIN:VEVENT',
    `UID:${c.id}@tayanch`,
    `DTSTAMP:${kun(c.manba.tekshirilganSana)}T000000Z`,
    `DTSTART;VALUE=DATE:${kun(c.yopilish)}`,
    `DTEND;VALUE=DATE:${ertasi(c.yopilish)}`,
    `SUMMARY:${qochir(`${c.ustki}: ${c.matn} (oxirgi kun)`)}`,
    `DESCRIPTION:${qochir(tavsif)}`,
    `URL:${c.manba.havola}`,
    'TRANSP:TRANSPARENT',
    'BEGIN:VALARM',
    'ACTION:DISPLAY',
    `DESCRIPTION:${qochir(`Ertaga oxirgi kun: ${c.ustki}`)}`,
    'TRIGGER:-P1D',
    'END:VALARM',
    'END:VEVENT',
    'END:VCALENDAR',
  ];
  return qatorlar.map(bukla).join('\r\n') + '\r\n';
};

export const GET: APIRoute = ({ props }) =>
  new Response(ics((props as { c: TaChipta }).c), { headers: { 'Content-Type': 'text/calendar; charset=utf-8' } });
