// Xato xabari yonidagi qisqa kod (P23, 2026-11-13): foydalanuvchi xatoni muallifga yozganda aniq sabab ko'rinsin.
// Kod faqat texnik nom (masalan invalid_credentials, network_error, http_404): email, token yoki server matni emas.

const XAVFSIZ = /^[a-z0-9_:-]{1,40}$/;

/** Kodni tozalaydi: faqat kichik lotin harfi, raqam, `_ : -`, 40 belgigacha; boshqasi `nomalum`. */
export function xatoKodi(kod: unknown): string {
  const k = typeof kod === 'string' ? kod.trim().toLowerCase() : '';
  return XAVFSIZ.test(k) ? k : 'nomalum';
}

/** Supabase Auth xatosidan kod: `code`, tarmoq xatosi bo'lsa `network_error`, aks holda `http_<status>`. */
export function authXatoKodi(e: { name?: unknown; code?: unknown; status?: unknown } | null | undefined): string {
  if (!e) return 'nomalum';
  if (e.name === 'AuthRetryableFetchError' || e instanceof TypeError) return 'network_error';
  if (typeof e.code === 'string' && e.code) return xatoKodi(e.code);
  if (typeof e.status === 'number' && e.status > 0) return `http_${e.status}`;
  return 'nomalum';
}

/** "Matn. (kod: x)" */
export function kodBilan(matn: string, kod: unknown): string {
  return `${matn} (kod: ${xatoKodi(kod)})`;
}
