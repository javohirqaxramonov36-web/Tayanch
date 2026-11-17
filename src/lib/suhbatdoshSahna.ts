import {
  AmbientLight, BoxGeometry, Color, DirectionalLight, Group, Mesh, MeshStandardMaterial, PerspectiveCamera,
  Scene, SphereGeometry, WebGLRenderer,
} from 'three';

export function suhbatdoshSahna(konteyner: HTMLElement, gap: () => number) {
  const sahna = new Scene();
  const kamera = new PerspectiveCamera(30, 1, 0.1, 30);
  kamera.position.set(0, 1.48, 4.55);
  kamera.lookAt(0, 1.43, 0);
  const renderer = new WebGLRenderer({ alpha: true, antialias: true, powerPreference: 'low-power' });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5));
  const canvas = renderer.domElement;
  canvas.setAttribute('aria-hidden', 'true');
  konteyner.append(canvas);

  // Bitta yengil sfera geometriyasi barcha yumaloq qismlarda qayta ishlatiladi.
  const sfera = new SphereGeometry(1, 32, 24);
  const yuzGeometriya = new SphereGeometry(1, 40, 32);
  const vertices = yuzGeometriya.attributes.position;
  for (let i = 0; i < vertices.count; i++) {
    const jag = Math.max(0, -vertices.getY(i));
    vertices.setX(i, vertices.getX(i) * (1 - jag * 0.23));
  }
  yuzGeometriya.computeVertexNormals();
  const kub = new BoxGeometry(1, 1, 1);
  const material = (rang: number | Color, roughness = 0.76) => new MeshStandardMaterial({ color: rang, roughness });
  const teri = material(0xdca795);
  const teriYorug = material(0xe3b29f);
  const soch = material(0x21181c, 0.62);
  const sochYorug = material(0x35252c, 0.61);
  const lab = material(0x9b4f5a);
  const ogizIch = material(0x371c26);
  const oq = material(0xf4e9df);
  const iris = material(0x422725, 0.45);
  const qora = material(0x171419, 0.38);
  const kiyimRangi = getComputedStyle(konteyner).getPropertyValue('--floor-ui').trim();
  const kiyimTus = new Color(kiyimRangi || 0x536486).lerp(new Color(0x293449), 0.58);
  const kiyim = material(kiyimTus);
  const yoqa = material(0xf2ede4);
  function shakl(ota: Group, mato: MeshStandardMaterial, x: number, y: number, z: number, w: number, h: number, d: number) {
    const m = new Mesh(sfera, mato);
    m.position.set(x, y, z);
    m.scale.set(w, h, d);
    ota.add(m);
    return m;
  }
  const tana = new Group();
  sahna.add(tana);
  shakl(tana, kiyim, 0, 0.47, -0.04, 0.86, 0.48, 0.40);
  // Yelka va ochiq yoqa büstni yuzdan ajratib turadi.
  for (const tomon of [-1, 1]) {
    shakl(tana, kiyim, tomon * 0.54, 0.56, -0.04, 0.34, 0.27, 0.31).rotation.z = tomon * 0.25;
    shakl(tana, yoqa, tomon * 0.145, 0.735, 0.313, 0.185, 0.064, 0.039).rotation.z = tomon * 0.47;
  }
  shakl(tana, teri, 0, 0.92, 0, 0.19, 0.29, 0.185);
  const bosh = new Group();
  bosh.position.y = 1.57;
  tana.add(bosh);
  shakl(bosh, soch, 0, 0.02, -0.23, 0.57, 0.74, 0.39);
  const yuz = new Mesh(yuzGeometriya, teri);
  yuz.position.y = 0.023;
  yuz.scale.set(0.477, 0.615, 0.423);
  bosh.add(yuz);
  const qoshlar: Mesh[] = [];
  const kozlar: Group[] = [];
  for (const tomon of [-1, 1]) {
    shakl(bosh, teri, 0.446 * tomon, -0.057, 0.025, 0.075, 0.128, 0.077);
    shakl(bosh, soch, 0.465 * tomon, -0.238, -0.068, 0.123, 0.646, 0.22).rotation.z = 0.07 * tomon;
    const koz = new Group();
    koz.position.set(0.168 * tomon, 0.031, 0.372);
    bosh.add(koz);
    kozlar.push(koz);
    shakl(koz, qora, 0, 0, 0, 0.121, 0.048, 0.044).rotation.z = 0.06 * tomon;
    shakl(koz, oq, 0, -0.003, 0.016, 0.108, 0.037, 0.035).rotation.z = 0.06 * tomon;
    shakl(koz, iris, 0, 0, 0.044, 0.038, 0.038, 0.015);
    shakl(koz, qora, 0, 0, 0.055, 0.021, 0.024, 0.012);
    shakl(koz, oq, -0.013, 0.014, 0.065, 0.008, 0.009, 0.005);
    const qosh = shakl(bosh, sochYorug, 0.173 * tomon, 0.141, 0.351, 0.119, 0.017, 0.025);
    qosh.rotation.z = 0.10 * tomon;
    qoshlar.push(qosh);
  }
  shakl(bosh, soch, 0, 0.412, -0.039, 0.513, 0.254, 0.386);
  shakl(bosh, sochYorug, -0.176, 0.353, 0.226, 0.329, 0.153, 0.204).rotation.z = 0.47;
  shakl(bosh, soch, 0.247, 0.327, 0.196, 0.249, 0.111, 0.187).rotation.z = -0.43;
  shakl(bosh, teriYorug, 0, -0.072, 0.400, 0.057, 0.156, 0.082);
  shakl(bosh, teriYorug, 0, -0.152, 0.456, 0.082, 0.045, 0.062);
  const ogiz = new Group();
  ogiz.position.set(0, -0.315, 0.345);
  bosh.add(ogiz);
  const ich = shakl(ogiz, ogizIch, 0, 0, 0, 0.105, 0.011, 0.038);
  const yuqori = shakl(ogiz, lab, 0, 0.012, 0.013, 0.113, 0.014, 0.035);
  const past = shakl(ogiz, lab, 0, -0.013, 0.015, 0.101, 0.014, 0.036);
  const tish = new Mesh(kub, oq);
  tish.position.set(0, 0.006, 0.031);
  tish.scale.set(0.14, 0.015, 0.016);
  ogiz.add(tish);
  const asosiyNur = new DirectionalLight(0xffefe6, 2.3);
  asosiyNur.position.set(-2, 4, 4);
  const yonNur = new DirectionalLight(0xdce9ff, 1.25);
  yonNur.position.set(3, 1, 2);
  sahna.add(new AmbientLight(0xffffff, 1.9), asosiyNur, yonNur);

  const kuzatuv = new ResizeObserver(() => {
    const { clientWidth: w, clientHeight: h } = konteyner;
    if (!w || !h) return;
    kamera.aspect = w / h;
    kamera.updateProjectionMatrix();
    renderer.setSize(w, h);
  });
  kuzatuv.observe(konteyner);
  const sokin = matchMedia('(prefers-reduced-motion: reduce)');
  let burilish = 0;
  let egilish = 0;
  let jag = 0;
  const qarash = (e: PointerEvent) => {
    const rect = konteyner.getBoundingClientRect();
    burilish = (e.clientX - rect.left - rect.width / 2) / rect.width;
    egilish = (e.clientY - rect.top - rect.height / 2) / rect.height;
  };
  const tinch = () => { burilish = 0; egilish = 0; };
  konteyner.addEventListener('pointermove', qarash);
  konteyner.addEventListener('pointerleave', tinch);
  renderer.setAnimationLoop((ms) => {
    if (document.hidden) return;
    const t = ms / 1000;
    const hajm = gap();
    jag += (hajm - jag) * 0.32;
    if (!sokin.matches) {
      bosh.rotation.y += (burilish * 0.48 + Math.sin(t * 1.02) * 0.08 - bosh.rotation.y) * 0.1;
      bosh.rotation.x += (egilish * 0.24 + Math.sin(t * 1.7) * (0.018 + jag * 0.055) - bosh.rotation.x) * 0.1;
      tana.position.y = Math.sin(t * 1.4) * 0.012;
    } else {
      bosh.rotation.set(0, 0, 0);
      tana.position.y = 0;
    }
    const blink = sokin.matches ? 1 : 1 - 0.94 * Math.max(0, 1 - Math.abs(t % 4.6 - 4.43) / 0.106);
    kozlar.forEach((koz) => { koz.scale.y = blink; });
    qoshlar.forEach((qosh) => { qosh.position.y = 0.141 + (sokin.matches ? 0 : jag * 0.032); });
    ich.scale.y = 0.009 + jag * 0.070;
    yuqori.position.y = 0.012 + jag * 0.027;
    past.position.y = -0.013 - jag * 0.065;
    tish.visible = jag > 0.24;
    renderer.render(sahna, kamera);
  });
  return () => {
    renderer.setAnimationLoop(null);
    kuzatuv.disconnect();
    konteyner.removeEventListener('pointermove', qarash);
    konteyner.removeEventListener('pointerleave', tinch);
    sahna.traverse((m) => { if (m instanceof Mesh) m.material.dispose(); });
    yuzGeometriya.dispose();
    sfera.dispose();
    kub.dispose();
    renderer.dispose();
    canvas.remove();
  };
}
