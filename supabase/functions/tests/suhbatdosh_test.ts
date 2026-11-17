import { deepStrictEqual as assertEquals } from 'node:assert/strict';

import { suhbatdosh } from '../suhbatdosh/handler.ts';

const origin = 'https://tayanch.example';
const soxta = (talab: Record<string, unknown>, token?: string) => new Request(origin, {
  method: 'POST',
  headers: { origin, 'content-type': 'application/json', ...(token ? { authorization: 'Bearer ' + token } : {}) },
  body: JSON.stringify(talab),
});

function bogliqliklar() {
  const iz: string[] = [];
  return {
    iz,
    originlar: [origin],
    egasi: 'ega',
    tayyor: true,
    foydalanuvchi: (jwt: string) => Promise.resolve(jwt === 'buzilgan' ? null : jwt),
    transkript: () => { iz.push('stt'); return Promise.resolve('Bluebook nima?'); },
    javob: (savol: string) => { iz.push(savol); return Promise.resolve('Namuna javobi.'); },
    sintez: () => { iz.push('tts'); return Promise.resolve(new Uint8Array([1, 2])); },
  };
}

Deno.test('So‘rovlar faqat egaga ochiladi', async () => {
  const bog = bogliqliklar();
  const amal = { amal: 'holat' };
  assertEquals((await suhbatdosh(soxta(amal), bog)).status, 401);
  assertEquals((await suhbatdosh(soxta(amal, 'buzilgan'), bog)).status, 401);
  assertEquals((await suhbatdosh(soxta(amal, 'boshqa'), bog)).status, 403);
  assertEquals(await (await suhbatdosh(soxta(amal, 'ega'), bog)).json(), { tayyor: true });
  assertEquals(bog.iz, []);
});

Deno.test('WAV so‘rovi matnga, javobga va audiosintezga ketma-ket o‘tadi', async () => {
  const bog = bogliqliklar();
  const bytes = new Uint8Array(46);
  const wav = new DataView(bytes.buffer);
  for (const [ofset, yozuv] of [[0, 'RIFF'], [8, 'WAVEfmt '], [36, 'data']] as const) {
    bytes.set(new TextEncoder().encode(yozuv), ofset);
  }
  for (const [ofset, son] of [[4, 38], [16, 16], [24, 16000], [28, 32000], [40, 2]]) wav.setUint32(ofset, son, true);
  for (const [ofset, son] of [[20, 1], [22, 1], [32, 2], [34, 16]]) wav.setUint16(ofset, son, true);
  const amal = { amal: 'suhbat', qavat: 3, oldingi: '' };
  assertEquals((await suhbatdosh(soxta({ ...amal, audio: 'aabb' }, 'ega'), bog)).status, 400);
  assertEquals(bog.iz, []);
  const javob = await suhbatdosh(soxta({ ...amal, audio: btoa(String.fromCharCode(...bytes)) }, 'ega'), bog);
  assertEquals(await javob.json(), { savol: 'Bluebook nima?', javob: 'Namuna javobi.', audio: 'AQI=' });
  assertEquals(bog.iz, ['stt', 'Bluebook nima?', 'tts']);
});

Deno.test('Sintez uzilsa savol va yozma javob qaytadi', async () => {
  const bog = { ...bogliqliklar(), sintez: () => Promise.reject(new Error()) };
  const r = await suhbatdosh(soxta({ amal: 'suhbat', qavat: 4, oldingi: '', matn: 'IELTS?' }, 'ega'), bog);
  assertEquals(await r.json(), { savol: 'IELTS?', javob: 'Namuna javobi.', audio: null });
});
