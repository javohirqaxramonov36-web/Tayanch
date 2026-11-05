// Topshirish yo'li: javoblarga qarab yo'llar ro'yxati.
// Prototipdagi yollarniTanla() bilan aynan bir xil (branch prototip-topshirish-yoli).
export interface Javoblar { davlat?: string; daraja?: string; grant?: string }

export function yollarniTanla(j: Javoblar): string[] {
  const r: string[] = [];
  const bak = j.daraja === 'bak';
  if (j.davlat === 'aqsh') { if (bak) r.push('commonapp', 'coalition'); r.push('portal'); }
  if (j.davlat === 'uk') { r.push(bak ? 'ucas' : 'portal'); }
  if (j.davlat === 'turkiya') { r.push('turkiye'); if (j.grant === 'yoq') r.push('portal'); }
  if (j.davlat === 'vengriya') { r.push('hungary'); if (j.grant === 'yoq') r.push('portal'); }
  if (j.davlat === 'boshqa') { r.push('portal'); if (bak) r.push('pathway'); }
  if (j.grant && j.grant !== 'yoq') r.push('eyuf');
  return r;
}
