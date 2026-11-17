import { funksiya } from './funksiya';
import { hisobMijoz } from './hisob';
import { wavBase64, YOZUV_MS } from './suhbatdoshOvoz';

type Matn = Record<'tayyor' | 'sozlama' | 'boshlash' | 'tugatish' | 'mikKut' | 'tingla' | 'kut' |
  'gapir' | 'ovozXato' | 'mikXato' | 'eshitilmadi' | 'xato' | 'sahnaXato', string>;
type Javob = { savol: string; javob: string; audio: string | null };
type Holat = 'tinch' | 'ruxsat' | 'yozuv' | 'yuborish' | 'gapirish';

function bandniUla(band: HTMLElement) {
  const och = band.querySelector<HTMLButtonElement>('[data-ochish]')!;
  const oyna = band.querySelector<HTMLDialogElement>('dialog')!;
  const yop = oyna.querySelector<HTMLButtonElement>('[data-yop]')!;
  const mikrofon = oyna.querySelector<HTMLButtonElement>('[data-mikrofon]')!;
  const ijro = oyna.querySelector<HTMLButtonElement>('[data-ijro]')!;
  const forma = oyna.querySelector<HTMLFormElement>('form')!;
  const savol = forma.querySelector<HTMLInputElement>('input')!;
  const yubor = forma.querySelector<HTMLButtonElement>('[type=submit]')!;
  const holat = oyna.querySelector<HTMLElement>('[data-holat]')!;
  const sahna = oyna.querySelector<HTMLElement>('[data-sahna]')!;
  const javob = oyna.querySelector<HTMLElement>('[data-javob]')!;
  const savolMatn = javob.querySelector<HTMLElement>('[data-savol-matn]')!;
  const javobMatn = javob.querySelector<HTMLElement>('[data-javob-matn]')!;
  const matn: Matn = JSON.parse(oyna.dataset.matn!);
  let tayyor = false;
  let sessiya: AbortController | undefined;
  let audio: AudioContext | undefined;
  let ozgarish: Holat;
  let taymer: number | undefined;
  let yozyapti: MediaRecorder | undefined;
  let oqim: MediaStream | undefined;
  let eskiSavol = '';
  let javobAudio: AudioBuffer | undefined;
  let tovush: AudioBufferSourceNode | undefined;
  let analiz: AnalyserNode | undefined;
  let signal: Float32Array<ArrayBuffer> | undefined;
  let sahnaYop: (() => void) | undefined;

  const faol = (s: AbortController) => !s.signal.aborted && oyna.open && sessiya === s;
  function holatQoy(yangi: Holat, xabar: string) {
    ozgarish = yangi;
    holat.textContent = xabar;
    mikrofon.disabled = !tayyor || ['ruxsat', 'yuborish', 'gapirish'].includes(yangi);
    mikrofon.textContent = yangi === 'yozuv' ? matn.tugatish : matn.boshlash;
    yubor.disabled = !tayyor || yangi !== 'tinch';
    savol.disabled = !tayyor;
    ijro.hidden = !javobAudio;
    ijro.disabled = yangi !== 'tinch';
  }

  function mikrofonniYop() {
    window.clearTimeout(taymer);
    if (yozyapti?.state === 'recording') yozyapti.stop();
    yozyapti = undefined;
    oqim?.getTracks().forEach((t) => t.stop());
    oqim = undefined;
  }

  async function audioOch() {
    audio ??= new AudioContext();
    if (audio.state === 'suspended') await audio.resume();
    return audio;
  }

  function ovozHajmi() {
    if (!analiz || !signal) return 0;
    analiz.getFloatTimeDomainData(signal);
    let kvadrat = 0;
    for (const n of signal) kvadrat += n * n;
    return Math.min(1, Math.sqrt(kvadrat / signal.length) * 7);
  }

  function ijroEt(context: AudioContext, bufer: AudioBuffer, joriy: AbortController) {
    const manba = context.createBufferSource();
    const kanal = context.createAnalyser();
    kanal.fftSize = 256;
    signal = new Float32Array(kanal.fftSize);
    analiz = kanal;
    tovush = manba;
    manba.buffer = bufer;
    manba.connect(kanal).connect(context.destination);
    manba.onended = () => {
      manba.disconnect();
      kanal.disconnect();
      if (!faol(joriy)) return;
      tovush = undefined;
      analiz = undefined;
      holatQoy('tinch', matn.tayyor);
    };
    manba.start();
    holatQoy('gapirish', matn.gapir);
  }

  async function sorov(tana: { audio: string } | { matn: string }, context: AudioContext, joriy: AbortController) {
    try {
      const r = await funksiya<Javob>('suhbatdosh', {
        amal: 'suhbat', qavat: Number(oyna.dataset.qavat), oldingi: eskiSavol, ...tana,
      }, joriy.signal);
      if (!faol(joriy)) return;
      if (!r.ok) {
        holatQoy('tinch', r.kod === 'no_speech' ? matn.eshitilmadi : matn.xato);
        return;
      }
      const data = r.data;
      eskiSavol = data.savol;
      savolMatn.textContent = data.savol;
      javobMatn.textContent = data.javob;
      javob.hidden = false;
      savol.value = '';
      if (!data.audio) { holatQoy('tinch', matn.ovozXato); return; }
      const bytes = Uint8Array.from(atob(data.audio), (c) => c.charCodeAt(0));
      javobAudio = await context.decodeAudioData(bytes.buffer);
      if (!faol(joriy)) return;
      if (context.state !== 'running') { holatQoy('tinch', matn.ovozXato); return; }
      ijroEt(context, javobAudio, joriy);
    } catch {
      if (faol(joriy)) holatQoy('tinch', matn.ovozXato);
    }
  }

  och.addEventListener('click', async () => {
    if (oyna.open) return;
    const joriy = new AbortController();
    sessiya = joriy;
    holatQoy('tinch', tayyor ? matn.tayyor : matn.sozlama);
    oyna.showModal();
    try {
      const { suhbatdoshSahna } = await import('./suhbatdoshSahna');
      if (faol(joriy)) sahnaYop = suhbatdoshSahna(sahna, ovozHajmi);
    } catch {
      if (faol(joriy)) sahna.textContent = matn.sahnaXato;
    }
  });

  yop.addEventListener('click', () => oyna.close());
  oyna.addEventListener('close', () => {
    sessiya?.abort();
    sessiya = undefined;
    mikrofonniYop();
    tovush?.stop();
    tovush = undefined;
    analiz = undefined;
    signal = undefined;
    if (audio) void audio.close().catch(() => undefined);
    audio = undefined;
    sahnaYop?.();
    sahnaYop = undefined;
    sahna.replaceChildren();
    eskiSavol = '';
    javobAudio = undefined;
    javob.hidden = true;
    savolMatn.textContent = javobMatn.textContent = savol.value = '';
    if (!band.hidden) och.focus();
  });

  mikrofon.addEventListener('click', async () => {
    const joriy = sessiya;
    if (!joriy || !tayyor) return;
    if (ozgarish === 'yozuv') { mikrofonniYop(); holatQoy('yuborish', matn.kut); return; }
    if (ozgarish !== 'tinch') return;
    holatQoy('ruxsat', matn.mikKut);
    try {
      const context = await audioOch();
      if (!faol(joriy)) return;
      const stream = await navigator.mediaDevices.getUserMedia({ audio: { channelCount: 1, echoCancellation: true } });
      if (!faol(joriy)) { stream.getTracks().forEach((t) => t.stop()); return; }
      oqim = stream;
      const yozuv = new MediaRecorder(stream);
      yozyapti = yozuv;
      const qismlar: Blob[] = [];
      yozuv.ondataavailable = (e) => { if (e.data.size > 0) qismlar.push(e.data); };
      yozuv.onerror = () => {
        if (!faol(joriy)) return;
        yozuv.onstop = null;
        mikrofonniYop();
        holatQoy('tinch', matn.mikXato);
      };
      yozuv.onstop = async () => {
        if (!faol(joriy)) return;
        // Qurilma o'zi yozishni tugatsa ham mikrofon izi yopiladi.
        mikrofonniYop();
        holatQoy('yuborish', matn.kut);
        javobAudio = undefined;
        try {
          const audio = await wavBase64(context, new Blob(qismlar, { type: yozuv.mimeType }));
          if (faol(joriy)) await sorov({ audio }, context, joriy);
        } catch {
          if (faol(joriy)) holatQoy('tinch', matn.eshitilmadi);
        }
      };
      yozuv.start();
      holatQoy('yozuv', matn.tingla);
      taymer = window.setTimeout(() => {
        if (!faol(joriy) || ozgarish !== 'yozuv') return;
        mikrofonniYop();
        holatQoy('yuborish', matn.kut);
      }, YOZUV_MS);
    } catch {
      if (!faol(joriy)) return;
      mikrofonniYop();
      holatQoy('tinch', matn.mikXato);
    }
  });

  forma.addEventListener('submit', async (e) => {
    e.preventDefault();
    const joriy = sessiya;
    const matnSavol = savol.value.trim();
    if (!joriy || !tayyor || !matnSavol || ozgarish !== 'tinch') return;
    javobAudio = undefined;
    holatQoy('yuborish', matn.kut);
    try {
      const context = await audioOch();
      if (faol(joriy)) await sorov({ matn: matnSavol }, context, joriy);
    } catch {
      if (faol(joriy)) holatQoy('tinch', matn.ovozXato);
    }
  });

  ijro.addEventListener('click', async () => {
    const joriy = sessiya;
    const bufer = javobAudio;
    if (!joriy || !bufer || ozgarish !== 'tinch') return;
    holatQoy('yuborish', matn.kut);
    try {
      const context = await audioOch();
      if (faol(joriy)) ijroEt(context, bufer, joriy);
    } catch {
      if (faol(joriy)) holatQoy('tinch', matn.ovozXato);
    }
  });

  return (ruxsat: boolean, sozlangan: boolean) => {
    tayyor = sozlangan;
    band.hidden = !ruxsat;
    if (!ruxsat && oyna.open) oyna.close();
    if (oyna.open && ozgarish === 'tinch') holatQoy('tinch', tayyor ? matn.tayyor : matn.sozlama);
  };
}

export function suhbatdoshniUla() {
  const hisob = hisobMijoz();
  if (!hisob) return;
  const bandlar = Array.from(document.querySelectorAll<HTMLElement>('[data-suhbatdosh]'), bandniUla);
  if (!bandlar.length) return;
  let navbat = 0;
  async function tekshir() {
    const joriy = ++navbat;
    const r = await funksiya<{ tayyor: boolean }>('suhbatdosh', { amal: 'holat' });
    if (joriy === navbat) bandlar.forEach((band) => band(r.ok, r.ok && r.data.tayyor === true));
  }
  hisob.auth.onAuthStateChange((hodisa) => {
    if (hodisa === 'SIGNED_OUT') {
      navbat++;
      bandlar.forEach((band) => band(false, false));
    } else if (hodisa === 'SIGNED_IN' || hodisa === 'INITIAL_SESSION') {
      setTimeout(() => { void tekshir(); }, 0);
    }
  });
}
