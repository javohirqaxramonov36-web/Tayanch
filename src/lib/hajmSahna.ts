// Hajm laboratoriyasi: Three.js sahnasi. Faqat hajm sahifasida, sahna ekranga yaqinlashganda dinamik import qilinadi.
// Optimallashtirish (docs/prototip/tayanch-3d-laboratoriya.html dan):
//  - sahna faqat o'zgarganda chiziladi (doimiy rAF sikli yo'q);
//  - sahna ko'rinmasa yoki tab yashirin bo'lsa chizilmaydi;
//  - yozuv teksturalari keshlanadi; shakl almashganda geometriya va materiallar dispose qilinadi;
//  - pixel ratio 1,5 dan oshmaydi; prefers-reduced-motion'da disklar animatsiyasiz.
// Boshqaruv (OrbitControls o'rniga, sahifa scroll'i sahnada tiqilib qolmasligi uchun):
//  - sichqoncha: sudrash bilan aylantirish (gorizontal va vertikal);
//  - telefon: bir barmoq gorizontal = aylantirish, vertikal = sahifa scroll'i (touch-action: pan-y);
//    ikki barmoq: yaqinlashtirish va qiyalatish;
//  - g'ildirak sahifani aylantiradi (sahna ushlamaydi); yaqinlashtirish tugmalar, + / − yoki ikki barmoq bilan.
import {
  WebGLRenderer, Scene, PerspectiveCamera, HemisphereLight, DirectionalLight, Group, Mesh, MeshStandardMaterial,
  CylinderGeometry, ConeGeometry, SphereGeometry, BoxGeometry, EdgesGeometry, LineSegments, LineBasicMaterial,
  GridHelper, Sprite, SpriteMaterial, CanvasTexture, LinearFilter, BufferGeometry, Line, Vector3, Color,
  type Material, type Object3D,
} from 'three';

export type Shakl = 'silindr' | 'konus' | 'shar' | 'prizma';
export interface HajmHolat {
  shakl: Shakl;
  r: number; h: number; l: number; w: number;
  /** Disk rejimi: silindr qatlamlarining nechtasi ko'rinadi (null = oddiy rejim) */
  disklar: number | null;
}

export interface HajmSahna {
  yangila(h: HajmHolat): void;
  aylantir(dAz: number, dPol?: number): void;
  yaqinlashtir(k: number): void;
  tikla(): void;
  yoq(): void;
}

const css = (nom: string) => getComputedStyle(document.documentElement).getPropertyValue(nom).trim();

export function sahnaYarat(quti: HTMLElement, canvas: HTMLCanvasElement): HajmSahna {
  const renderer = new WebGLRenderer({ canvas, antialias: true, alpha: true, powerPreference: 'low-power' });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.5));
  renderer.setClearColor(0x000000, 0);

  const scene = new Scene();
  const camera = new PerspectiveCamera(42, 1, 0.1, 200);
  const hemi = new HemisphereLight(0xffffff, 0x888888, 1.0);
  const dir = new DirectionalLight(0xffffff, 0.8);
  dir.position.set(6, 12, 8);
  scene.add(hemi, dir);

  const ranglar = { asosiy: new Color(), chuqur: new Color(), matn: new Color(), fon: '', matnCss: '', chiziq: new Color() };
  const ranglarniOl = () => {
    ranglar.asosiy.set(css('--rang-asosiy'));
    ranglar.chuqur.set(css('--rang-asosiy-chuqur'));
    ranglar.matn.set(css('--matn'));
    ranglar.chiziq.set(css('--matn-sust'));
    ranglar.fon = css('--fon');
    ranglar.matnCss = css('--matn');
  };
  ranglarniOl();

  let grid = new GridHelper(20, 20, ranglar.chiziq, ranglar.chiziq);
  const gridniYasa = () => {
    scene.remove(grid); grid.geometry.dispose(); (grid.material as Material).dispose();
    grid = new GridHelper(20, 20, ranglar.chiziq, ranglar.chiziq);
    (grid.material as Material).transparent = true; (grid.material as Material).opacity = 0.35;
    scene.add(grid);
  };
  gridniYasa();

  const guruh = new Group();
  scene.add(guruh);

  // ---------- Yozuvlar: kesh ----------
  const kesh = new Map<string, { tex: CanvasTexture; nisbat: number }>();
  function yozuv(matn: string, olcham = 0.55): Sprite {
    const kalit = `${matn}|${ranglar.fon}|${ranglar.matnCss}`;
    let k = kesh.get(kalit);
    if (!k) {
      const fs = 56, pad = 22, c = document.createElement('canvas'), ctx = c.getContext('2d')!;
      const font = `700 ${fs}px "Figtree Variable", system-ui, sans-serif`;
      ctx.font = font;
      const w = Math.ceil(ctx.measureText(matn).width + pad * 2), hgt = Math.ceil(fs + pad * 1.2);
      c.width = w; c.height = hgt; ctx.font = font;
      ctx.fillStyle = ranglar.fon; ctx.strokeStyle = ranglar.matnCss; ctx.lineWidth = 4;
      const r = hgt / 2.2;
      ctx.beginPath(); ctx.roundRect(2, 2, w - 4, hgt - 4, r); ctx.fill(); ctx.stroke();
      ctx.fillStyle = ranglar.matnCss; ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
      ctx.fillText(matn, w / 2, hgt / 2 + 2);
      const tex = new CanvasTexture(c);
      tex.minFilter = LinearFilter; tex.generateMipmaps = false;
      k = { tex, nisbat: w / hgt };
      kesh.set(kalit, k);
    }
    const sp = new Sprite(new SpriteMaterial({ map: k.tex, depthTest: false, transparent: true }));
    sp.scale.set(olcham * k.nisbat, olcham, 1);
    sp.renderOrder = 5;
    sp.userData.keshda = true;
    return sp;
  }
  const keshniTozala = () => { kesh.forEach((k) => k.tex.dispose()); kesh.clear(); };

  function chiziq(nuqtalar: [number, number, number][]): Line {
    const g = new BufferGeometry().setFromPoints(nuqtalar.map((p) => new Vector3(...p)));
    const l = new Line(g, new LineBasicMaterial({ color: ranglar.matn, depthTest: false }));
    l.renderOrder = 4;
    return l;
  }

  function tozala(obj: Object3D) {
    obj.traverse((o) => {
      const m = o as Mesh;
      if (m.geometry) m.geometry.dispose();
      const mat = m.material as Material | Material[] | undefined;
      if (mat) (Array.isArray(mat) ? mat : [mat]).forEach((x) => { if (!(o.userData.keshda) && (x as SpriteMaterial).map) (x as SpriteMaterial).map!.dispose(); x.dispose(); });
    });
    obj.clear();
  }

  // ---------- Kamera ----------
  const BOSH = { az: 0.75, pol: 1.05, masofa: 17 };
  const kam = { ...BOSH };
  const nishon = new Vector3(0, 2.6, 0);
  const kameraniQoy = () => {
    kam.pol = Math.min(Math.PI * 0.49, Math.max(0.2, kam.pol));
    kam.masofa = Math.min(34, Math.max(7, kam.masofa));
    const s = Math.sin(kam.pol);
    camera.position.set(nishon.x + kam.masofa * s * Math.sin(kam.az), nishon.y + kam.masofa * Math.cos(kam.pol), nishon.z + kam.masofa * s * Math.cos(kam.az));
    camera.lookAt(nishon);
    chiz();
  };

  // ---------- Chizish: faqat kerak bo'lganda ----------
  let kutilmoqda = false, korinadi = true, eskirgan = true;
  function chiz() {
    eskirgan = true;
    if (kutilmoqda || !korinadi || document.hidden) return;
    kutilmoqda = true;
    requestAnimationFrame(() => {
      kutilmoqda = false;
      if (!korinadi || document.hidden) return;
      renderer.render(scene, camera);
      eskirgan = false;
    });
  }
  const olchamla = () => {
    const w = quti.clientWidth, h = quti.clientHeight;
    if (!w || !h) return;
    renderer.setSize(w, h, false);
    camera.aspect = w / h; camera.updateProjectionMatrix();
    chiz();
  };
  const ro = new ResizeObserver(olchamla); ro.observe(quti);
  const io = new IntersectionObserver((e) => { korinadi = e[0].isIntersecting; if (korinadi && eskirgan) chiz(); });
  io.observe(quti);
  const korinish = () => { if (!document.hidden && eskirgan) chiz(); };
  document.addEventListener('visibilitychange', korinish);

  // ---------- Shakl ----------
  let oxirgi: HajmHolat | null = null;
  function qur(hl: HajmHolat) {
    tozala(guruh);
    const { shakl, r, h, l, w } = hl;
    const yuza = () => new MeshStandardMaterial({ color: ranglar.asosiy, transparent: true, opacity: 0.72, roughness: 0.45 });
    const qirra = (g: BufferGeometry, y: number) => { const e = new LineSegments(new EdgesGeometry(g, 20), new LineBasicMaterial({ color: ranglar.chuqur })); e.position.y = y; guruh.add(e); };
    const belgi = (t: string, p: [number, number, number]) => { const s = yozuv(t); s.position.set(...p); guruh.add(s); };

    if (shakl === 'silindr' && hl.disklar !== null) {
      // Disk rejimi: qalinligi 1 bo'lgan disklar, oralarida kichik bo'shliq
      const n = Math.min(hl.disklar, h);
      for (let k = 0; k < n; k++) {
        const g = new CylinderGeometry(r, r, 0.9, 48);
        const m = new Mesh(g, yuza()); m.position.y = k + 0.45; guruh.add(m);
        qirra(g, k + 0.45);
      }
      // Hali yig'ilmagan qism: shaffof kontur
      const kontur = new CylinderGeometry(r, r, h, 48);
      const kq = new LineSegments(new EdgesGeometry(kontur, 20), new LineBasicMaterial({ color: ranglar.chiziq, transparent: true, opacity: 0.6 }));
      kq.position.y = h / 2; guruh.add(kq); kontur.dispose();
      guruh.add(chiziq([[0, 0.02, 0], [r, 0.02, 0]])); belgi(`r = ${r}`, [r / 2, 0.55, 0]);
      guruh.add(chiziq([[r + 0.7, 0, 0], [r + 0.7, n, 0]])); belgi(`${n} ${n === 1 ? 'layer' : 'layers'}`, [r + 1.9, Math.max(0.6, n / 2), 0]);
      chiz();
      return;
    }

    let g: BufferGeometry, y = 0;
    if (shakl === 'silindr') { g = new CylinderGeometry(r, r, h, 64); y = h / 2; }
    else if (shakl === 'konus') { g = new ConeGeometry(r, h, 64); y = h / 2; }
    else if (shakl === 'shar') { g = new SphereGeometry(r, 48, 32); y = r; }
    else { g = new BoxGeometry(l, h, w); y = h / 2; }
    const mesh = new Mesh(g, yuza()); mesh.position.y = y; guruh.add(mesh);
    if (shakl !== 'shar') qirra(g, y);

    if (shakl === 'silindr' || shakl === 'konus') {
      const ry = shakl === 'silindr' ? h + 0.02 : 0.03;
      guruh.add(chiziq([[0, ry, 0], [r, ry, 0]])); belgi(`r = ${r}`, [r / 2, ry + 0.5, 0]);
      guruh.add(chiziq([[r + 0.7, 0, 0], [r + 0.7, h, 0]])); belgi(`h = ${h}`, [r + 1.7, h / 2, 0]);
      if (shakl === 'konus') guruh.add(chiziq([[0, 0.03, 0], [0, h, 0]]));
    } else if (shakl === 'shar') {
      guruh.add(chiziq([[0, r, 0], [r, r, 0]])); belgi(`r = ${r}`, [r / 2, r + 0.5, 0]);
    } else {
      guruh.add(chiziq([[-l / 2, 0.03, w / 2 + 0.6], [l / 2, 0.03, w / 2 + 0.6]])); belgi(`l = ${l}`, [0, 0.55, w / 2 + 1]);
      guruh.add(chiziq([[l / 2 + 0.6, 0.03, -w / 2], [l / 2 + 0.6, 0.03, w / 2]])); belgi(`w = ${w}`, [l / 2 + 1.4, 0.55, 0]);
      guruh.add(chiziq([[l / 2 + 0.6, 0, -w / 2 - 0.6], [l / 2 + 0.6, h, -w / 2 - 0.6]])); belgi(`h = ${h}`, [l / 2 + 1.5, h / 2, -w / 2 - 0.6]);
    }
    chiz();
  }

  // ---------- Mavzu almashsa ranglarni qayta olish ----------
  const mo = new MutationObserver(() => { ranglarniOl(); keshniTozala(); gridniYasa(); if (oxirgi) qur(oxirgi); });
  mo.observe(document.documentElement, { attributes: true, attributeFilter: ['data-mavzu'] });

  // ---------- Ko'rsatkich boshqaruvi ----------
  const barmoqlar = new Map<number, { x: number; y: number }>();
  let pinchBosh = 0, ortaYBosh = 0;
  const masofa = () => { const [a, b] = [...barmoqlar.values()]; return Math.hypot(a.x - b.x, a.y - b.y); };
  const ortaY = () => { const [a, b] = [...barmoqlar.values()]; return (a.y + b.y) / 2; };

  canvas.addEventListener('pointerdown', (e) => {
    barmoqlar.set(e.pointerId, { x: e.clientX, y: e.clientY });
    canvas.setPointerCapture(e.pointerId);
    if (barmoqlar.size === 2) { pinchBosh = masofa(); ortaYBosh = ortaY(); }
    quti.classList.add('ushlangan');
  });
  canvas.addEventListener('pointermove', (e) => {
    const old = barmoqlar.get(e.pointerId);
    if (!old) return;
    const dx = e.clientX - old.x, dy = e.clientY - old.y;
    barmoqlar.set(e.pointerId, { x: e.clientX, y: e.clientY });
    if (barmoqlar.size === 1) {
      kam.az -= dx * 0.008;
      if (e.pointerType === 'mouse' || e.pointerType === 'pen') kam.pol -= dy * 0.006;
      kameraniQoy();
    } else if (barmoqlar.size === 2) {
      const d = masofa(), oy = ortaY();
      if (pinchBosh > 0) kam.masofa *= pinchBosh / d;
      kam.pol -= (oy - ortaYBosh) * 0.006;
      pinchBosh = d; ortaYBosh = oy;
      kameraniQoy();
    }
  });
  const qoyibYubor = (e: PointerEvent) => { barmoqlar.delete(e.pointerId); if (barmoqlar.size < 2) pinchBosh = 0; if (!barmoqlar.size) quti.classList.remove('ushlangan'); };
  canvas.addEventListener('pointerup', qoyibYubor);
  canvas.addEventListener('pointercancel', qoyibYubor);

  olchamla();
  kameraniQoy();

  return {
    yangila(hl) { oxirgi = hl; qur(hl); },
    aylantir(dAz, dPol = 0) { kam.az += dAz; kam.pol += dPol; kameraniQoy(); },
    yaqinlashtir(k) { kam.masofa *= k; kameraniQoy(); },
    tikla() { Object.assign(kam, BOSH); kameraniQoy(); },
    yoq() {
      ro.disconnect(); io.disconnect(); mo.disconnect();
      document.removeEventListener('visibilitychange', korinish);
      tozala(guruh); keshniTozala();
      grid.geometry.dispose(); (grid.material as Material).dispose();
      renderer.dispose();
    },
  };
}
