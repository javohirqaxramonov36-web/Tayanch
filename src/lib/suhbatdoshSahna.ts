import {
  CanvasTexture, DoubleSide, Euler, Matrix4, Mesh, MeshBasicMaterial, Object3D, PerspectiveCamera, Scene, SRGBColorSpace,
  Texture, TextureLoader, WebGLRenderer,
} from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { DRACOLoader } from 'three/addons/loaders/DRACOLoader.js';

// Suhbatdosh 3D modeli: rasm proyeksiyasi (2.5D). Yuz FaceBuilder mesh'i (ARKit morph'lar),
// soch/bo'yin/futbolka rasm rel'efi, yopiq ko'z alohida qatlam. Barcha materiallar yoritilmagan.
// Manba va qayta yasash tartibi repodan tashqarida: 04-dizayn/ai-suhbatdosh/HOLAT.md.
const PAPKA = `${import.meta.env.BASE_URL.replace(/\/?$/, '/')}suhbatdosh/`;
const ASPEKT = 928 / 1152;
const FON = 0xd3d3d4;

function tishTeksturasi() {
  const c = document.createElement('canvas');
  c.width = 256;
  c.height = 64;
  const g = c.getContext('2d')!;
  const gr = g.createLinearGradient(0, 0, 0, 64);
  gr.addColorStop(0, '#d8d2c8');
  gr.addColorStop(0.7, '#a79f94');
  gr.addColorStop(1, '#4a4440');
  g.fillStyle = gr;
  g.fillRect(0, 0, 256, 64);
  g.globalAlpha = 0.25;
  g.fillStyle = '#3a332e';
  for (let i = 0; i <= 10; i++) g.fillRect(i * 25.6 - 1, 0, 2, 64);
  g.globalAlpha = 1;
  const eg = g.createLinearGradient(0, 0, 256, 0);
  eg.addColorStop(0, 'rgba(20,10,10,.85)');
  eg.addColorStop(0.22, 'rgba(20,10,10,0)');
  eg.addColorStop(0.78, 'rgba(20,10,10,0)');
  eg.addColorStop(1, 'rgba(20,10,10,.85)');
  g.fillStyle = eg;
  g.fillRect(0, 0, 256, 64);
  const t = new CanvasTexture(c);
  t.flipY = false;
  t.colorSpace = SRGBColorSpace;
  return t;
}

export function suhbatdoshSahna(konteyner: HTMLElement, gap: () => number) {
  const inglizcha = document.documentElement.lang === 'en';
  const xatoMatni = (() => {
    try { return JSON.parse(konteyner.closest('dialog')?.dataset.matn ?? '{}').sahnaXato as string | undefined; } catch { return undefined; }
  })();
  const yuklanmoqda = document.createElement('p');
  yuklanmoqda.className = 'qa-yuklanmoqda';
  yuklanmoqda.textContent = inglizcha ? 'Loading…' : 'Yuklanmoqda…';
  konteyner.append(yuklanmoqda);

  const sahna = new Scene();
  const renderer = new WebGLRenderer({ antialias: true, powerPreference: 'low-power' });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.outputColorSpace = SRGBColorSpace;
  renderer.setClearColor(FON, 1);
  const canvas = renderer.domElement;
  canvas.setAttribute('aria-hidden', 'true');
  canvas.hidden = true;
  konteyner.append(canvas);

  const yuklovchi = new TextureLoader();
  const teksturalar: Texture[] = [];
  const tekstura = (nom: string, rangli = true) => {
    const t = yuklovchi.load(PAPKA + nom);
    t.flipY = false;
    if (rangli) t.colorSpace = SRGBColorSpace;
    t.anisotropy = 4;
    teksturalar.push(t);
    return t;
  };
  // Yuz: alfa > 0.15 joyda to'liq noshaffof (bu halqada yuz va rel'ef bir xil rasm), qolgani tashlanadi.
  const yuzMat = new MeshBasicMaterial({ map: tekstura('yuz.jpg'), alphaMap: tekstura('yuz_alfa.png', false), alphaTest: 0.15 });
  // Yopiq ko'z qatlami: ko'z deyarli yopilganda paydo bo'ladi; chuqurlik testisiz, soch rel'efi undan keyin chiziladi.
  const kozMat = new MeshBasicMaterial({ map: tekstura('koz_yopiq.webp'), transparent: true, depthTest: false, depthWrite: false, opacity: 0 });
  const relyefMat = new MeshBasicMaterial({ map: tekstura('relyef.webp'), transparent: true, depthWrite: false });
  const ichMat = new MeshBasicMaterial({ color: 0x2a0b0d, side: DoubleSide });
  const tishT = tishTeksturasi();
  teksturalar.push(tishT);
  const tishMat = new MeshBasicMaterial({ map: tishT, side: DoubleSide });

  const draco = new DRACOLoader().setDecoderPath(PAPKA + 'draco/');
  const morphlar: Mesh[] = [];
  let kamera: PerspectiveCamera | undefined;
  const asosiy = new Matrix4();
  let yopildi = false;

  function olcham() {
    const { clientWidth: w, clientHeight: h } = konteyner;
    if (!w || !h) return;
    // Portret kadr konteyner balandligiga moslanadi, eni tor bo'lsa enga.
    const ch = Math.min(h, w / ASPEKT);
    renderer.setSize(Math.round(ch * ASPEKT), Math.round(ch));
    if (kamera) {
      kamera.aspect = ASPEKT;
      kamera.updateProjectionMatrix();
    }
  }
  const kuzatuv = new ResizeObserver(olcham);
  kuzatuv.observe(konteyner);

  function xato() {
    if (yopildi) return;
    yuklanmoqda.textContent = xatoMatni ?? (inglizcha ? '3D is unavailable on this device.' : 'Bu qurilmada 3D ko‘rinish ochilmadi.');
  }

  new GLTFLoader().setDRACOLoader(draco).load(PAPKA + 'model.glb', (g: { scene: Object3D; cameras: Object3D[] }) => {
    if (yopildi) return;
    sahna.add(g.scene);
    g.scene.traverse((o: Object3D) => {
      if (!(o instanceof Mesh)) return;
      const nom = (o.material as MeshBasicMaterial | undefined)?.name ?? '';
      if (o.name.startsWith('Relyef')) { o.material = relyefMat; o.renderOrder = 3; }
      else if (o.name.startsWith('Koz_yopiq')) { o.material = kozMat; o.renderOrder = 2; }
      else if (o.name.startsWith('Tishlar')) { o.material = tishMat; o.renderOrder = 0; }
      else if (nom.includes('ichi')) { o.material = ichMat; o.renderOrder = 0; }
      else { o.material = yuzMat; o.renderOrder = 1; }
      if (o.morphTargetDictionary) morphlar.push(o);
    });
    kamera = g.cameras[0] as PerspectiveCamera | undefined;
    if (!kamera) { xato(); return; }
    kamera.parent?.updateMatrixWorld(true);
    asosiy.copy(kamera.matrixWorld);
    kamera.matrixAutoUpdate = false;
    kamera.matrixWorldAutoUpdate = false;
    yuklanmoqda.remove();
    canvas.hidden = false;
    olcham();
    renderer.setAnimationLoop(kadr);
  }, undefined, xato);

  // --- Harakat ---
  const sokin = matchMedia('(prefers-reduced-motion: reduce)');
  const maqsad: Record<string, number> = {};
  const joriy: Record<string, number> = {};
  let burilish = 0;
  let egilish = 0;
  let jag = 0;
  let keyingiBlink = 1.5;
  let blinkBosh = -1;
  const qarash = (e: PointerEvent) => {
    const r = konteyner.getBoundingClientRect();
    burilish = (e.clientX - r.left - r.width / 2) / r.width;
    egilish = (e.clientY - r.top - r.height / 2) / r.height;
  };
  const tinch = () => { burilish = 0; egilish = 0; };
  konteyner.addEventListener('pointermove', qarash);
  konteyner.addEventListener('pointerleave', tinch);

  const pivot = new Matrix4().makeTranslation(0, -0.2, 0);
  const qaytish = new Matrix4().makeTranslation(0, 0.2, 0);
  const aylanish = new Matrix4();
  const m = new Matrix4();
  const burchak = new Euler(0, 0, 0, 'YXZ');
  let oldingi = 0;

  function kadr(ms: number) {
    if (document.hidden || !kamera) return;
    const t = ms / 1000;
    const dt = Math.min(0.05, oldingi ? t - oldingi : 0.016);
    oldingi = t;

    // Lip-sync: javob ovozining balandligi og'izni ochadi; shakl almashinuvi bir xillikni yo'qotadi.
    jag += (gap() - jag) * 0.35;
    const tebranish = 0.5 + 0.5 * Math.sin(t * 9);
    maqsad.jawOpen = jag * 0.48;
    maqsad.mouthLowerDownLeft = maqsad.mouthLowerDownRight = jag * 0.22;
    maqsad.mouthFunnel = jag * 0.35 * tebranish;
    maqsad.mouthStretchLeft = maqsad.mouthStretchRight = jag * 0.25 * (1 - tebranish);

    // Ko'z yumish: 2–6 s da bir, ~0.1 s yopiq.
    if (blinkBosh < 0 && t > keyingiBlink) blinkBosh = t;
    if (blinkBosh >= 0) {
      const e = t - blinkBosh;
      maqsad.eyeBlinkLeft = maqsad.eyeBlinkRight = e < 0.08 ? 1 : 0;
      if (e > 0.18) { blinkBosh = -1; keyingiBlink = t + 2.2 + Math.random() * 3.5; }
    }

    for (const mesh of morphlar) {
      const d = mesh.morphTargetDictionary!;
      for (const k in d) {
        const tezlik = k.startsWith('eyeBlink') ? 40 : 18;
        const v = (joriy[k] ?? 0) + ((maqsad[k] ?? 0) - (joriy[k] ?? 0)) * Math.min(1, dt * tezlik);
        joriy[k] = v;
        mesh.morphTargetInfluences![d[k]] = v;
      }
    }
    kozMat.opacity = Math.min(1, Math.max(0, ((joriy.eyeBlinkLeft ?? 0) - 0.9) / 0.07));
    kozMat.visible = kozMat.opacity > 0.001;

    // Bosh harakati: kamera bosh atrofida kichik orbitada (rasm proyeksiyasi uchun ±3° yetarli).
    let yaw = 0;
    let pitch = 0;
    if (!sokin.matches) {
      yaw = Math.sin(t * 0.37) * 0.03 + Math.sin(t * 0.83) * 0.01 + burilish * 0.05;
      pitch = Math.sin(t * 0.29 + 1) * 0.016 + egilish * 0.03 + jag * 0.01;
    }
    burchak.set(pitch, yaw, 0);
    aylanish.makeRotationFromEuler(burchak);
    m.copy(pivot).multiply(aylanish).multiply(qaytish).multiply(asosiy);
    kamera.matrix.copy(m);
    kamera.matrixWorld.copy(m);
    kamera.matrixWorldInverse.copy(m).invert();
    renderer.render(sahna, kamera);
  }

  return () => {
    yopildi = true;
    renderer.setAnimationLoop(null);
    kuzatuv.disconnect();
    konteyner.removeEventListener('pointermove', qarash);
    konteyner.removeEventListener('pointerleave', tinch);
    sahna.traverse((o: Object3D) => { if (o instanceof Mesh) o.geometry.dispose(); });
    for (const mat of [yuzMat, kozMat, relyefMat, ichMat, tishMat]) mat.dispose();
    teksturalar.forEach((t) => t.dispose());
    draco.dispose();
    renderer.dispose();
    canvas.remove();
    yuklanmoqda.remove();
  };
}
