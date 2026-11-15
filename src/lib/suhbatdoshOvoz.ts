export const YOZUV_MS = 15_000;

export async function wavBase64(context: AudioContext, ovoz: Blob): Promise<string> {
  const manba = await context.decodeAudioData(await ovoz.arrayBuffer());
  const uzunlik = Math.min(240_000, Math.floor(manba.duration * 16_000));
  if (!uzunlik) throw new Error('empty_audio');
  const offline = new OfflineAudioContext(1, uzunlik, 16_000);
  const oqim = offline.createBufferSource();
  oqim.buffer = manba;
  oqim.connect(offline.destination);
  oqim.start();
  const namuna = (await offline.startRendering()).getChannelData(0);
  const wav = new ArrayBuffer(44 + namuna.length * 2);
  const d = new DataView(wav);
  d.setUint32(0, 0x52494646); // RIFF
  d.setUint32(4, wav.byteLength - 8, true);
  d.setUint32(8, 0x57415645); // WAVE
  d.setUint32(12, 0x666d7420); // fmt
  d.setUint32(16, 16, true);
  d.setUint16(20, 1, true);
  d.setUint16(22, 1, true);
  d.setUint32(24, 16_000, true);
  d.setUint32(28, 32_000, true);
  d.setUint16(32, 2, true);
  d.setUint16(34, 16, true);
  d.setUint32(36, 0x64617461); // data
  d.setUint32(40, namuna.length * 2, true);
  for (let i = 0; i < namuna.length; i++) {
    const n = Math.max(-1, Math.min(1, namuna[i]));
    d.setInt16(44 + i * 2, n < 0 ? n * 32768 : n * 32767, true);
  }
  const bayt = new Uint8Array(wav);
  let satr = '';
  for (let i = 0; i < bayt.length; i += 8192) satr += String.fromCharCode(...bayt.subarray(i, i + 8192));
  return btoa(satr);
}
