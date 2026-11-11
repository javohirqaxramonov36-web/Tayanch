// Tayanch: matn kontrasti tekshiruvi (brauzerda). axe-core gradient ustidagi matnni "incomplete"
// qoldiradi, shuning uchun o'z tekshiruvimiz:
//  - har ko'rinadigan matn elementi uchun shaffof bo'lmagan eng yaqin fon topiladi;
//  - fon body gradientigacha yetsa, --color-bg va --color-bg-deep ikkalasiga nisbatan hisoblanadi;
//  - shaffof qatlamlar (rgba, color-mix) eng yomon holatda qo'shib hisoblanadi; ostida ixtiyoriy
//    kontent bo'lishi mumkin bo'lgan qatlam (fixed/sticky shisha) uchun oq va qora ham sinanadi;
//  - chegara: oddiy matn 4.5:1, katta matn (>= 24px yoki >= 18.66px qalin) 3:1.
//  - aria-hidden, ko'rinmas va disabled elementlar o'tkazib yuboriladi.
// Ishlatish: `npm run build`, `astro preview`, bu faylni dist/ ga nusxalab sahifaga yuklang, so'ng
//   await kontrastTekshir(['/Tayanch/uz/', ...], ['yorug', 'qorongi'])
(function () {
  const parse = (s) => {
    if (!s || s === 'transparent') return [0, 0, 0, 0];
    let m = s.match(/^rgba?\(([^)]+)\)/);
    if (m) {
      const p = m[1].split(/[\s,\/]+/).filter(Boolean).map(Number);
      return [p[0], p[1], p[2], p.length > 3 ? p[3] : 1];
    }
    m = s.match(/^color\(srgb ([^)]+)\)/);
    if (m) {
      const p = m[1].split(/[\s\/]+/).filter(Boolean).map(Number);
      return [p[0] * 255, p[1] * 255, p[2] * 255, p.length > 3 ? p[3] : 1];
    }
    return null;
  };
  const ustiga = (top, bot) => {
    const a = top[3];
    return [top[0] * a + bot[0] * (1 - a), top[1] * a + bot[1] * (1 - a), top[2] * a + bot[2] * (1 - a), 1];
  };
  const lum = (c) => {
    const f = (v) => { v /= 255; return v <= 0.03928 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4; };
    return 0.2126 * f(c[0]) + 0.7152 * f(c[1]) + 0.0722 * f(c[2]);
  };
  const nisbat = (a, b) => { const x = lum(a), y = lum(b); return (Math.max(x, y) + 0.05) / (Math.min(x, y) + 0.05); };

  function sahifaniTekshir(doc) {
    const win = doc.defaultView;
    const rootCs = win.getComputedStyle(doc.documentElement);
    const tokenRang = (n) => {
      const el = doc.createElement('span');
      el.style.color = `var(${n})`; doc.body.appendChild(el);
      const c = parse(win.getComputedStyle(el).color); el.remove(); return c;
    };
    const asos = [tokenRang('--color-bg'), tokenRang('--color-bg-deep')];
    const OQ = [255, 255, 255, 1], QORA = [0, 0, 0, 1];
    const xatolar = [];
    let soni = 0;
    const els = doc.body.querySelectorAll('*');
    for (const el of els) {
      if (!el.checkVisibility || !el.checkVisibility({ visibilityProperty: true, opacityProperty: true })) continue;
      if (el.closest('[aria-hidden="true"], svg, .ekranda-yoq, .sr, .otish, [disabled], [inert]')) continue;
      const matnBor = [...el.childNodes].some((n) => n.nodeType === 3 && n.textContent.trim());
      if (!matnBor) continue;
      const r = el.getBoundingClientRect();
      if (r.width < 2 || r.height < 2) continue;
      const cs = win.getComputedStyle(el);
      const fg = parse(cs.color);
      if (!fg) continue;
      // Fon qatlamlari
      const qatlamlar = [];
      let ixtiyoriy = false, zich = null;
      for (let e = el; e && e !== doc.documentElement; e = e.parentElement) {
        const ecs = win.getComputedStyle(e);
        const bg = parse(ecs.backgroundColor);
        if (bg && bg[3] > 0) {
          if (bg[3] >= 1) { zich = bg; break; }
          qatlamlar.push(bg);
          if (ecs.position === 'fixed' || ecs.position === 'sticky' || ecs.backdropFilter !== 'none') ixtiyoriy = true;
        }
      }
      const tagi = zich ? [zich] : (ixtiyoriy ? [...asos, OQ, QORA] : asos);
      let eng = Infinity, engFon = null;
      for (const b of tagi) {
        let c = b;
        for (let i = qatlamlar.length - 1; i >= 0; i--) c = ustiga(qatlamlar[i], c);
        const f = fg[3] < 1 ? ustiga(fg, c) : fg;
        const k = nisbat(f, c);
        if (k < eng) { eng = k; engFon = c; }
      }
      const px = parseFloat(cs.fontSize), w = parseInt(cs.fontWeight, 10);
      const katta = px >= 24 || (px >= 18.66 && w >= 700);
      const chegara = katta ? 3 : 4.5;
      soni++;
      if (eng < chegara - 0.005) {
        xatolar.push({
          matn: el.textContent.trim().slice(0, 50),
          teg: el.tagName.toLowerCase() + (el.className && typeof el.className === 'string' ? '.' + el.className.trim().split(/\s+/).join('.') : ''),
          nisbat: Math.round(eng * 100) / 100, chegara,
          rang: cs.color, fon: engFon.slice(0, 3).map(Math.round).join(','),
        });
      }
    }
    return { soni, xatolar };
  }

  window.kontrastTekshir = async function (urls, mavzular = ['yorug', 'qorongi'], kenglik = 1280) {
    const natija = [];
    for (const mavzu of mavzular) {
      for (const url of urls) {
        const f = document.createElement('iframe');
        f.style.cssText = `position:fixed;left:-10000px;top:0;width:${kenglik}px;height:900px;border:0`;
        document.body.appendChild(f);
        try { localStorage.setItem('tayanch:mavzu', mavzu); } catch {}
        await new Promise((ok) => { f.onload = ok; f.src = url; });
        await f.contentDocument.fonts.ready;
        f.contentDocument.documentElement.setAttribute('data-mavzu', mavzu);
        await new Promise((ok) => setTimeout(ok, 50));
        const r = sahifaniTekshir(f.contentDocument);
        natija.push({ url, mavzu, ...r });
        f.remove();
      }
    }
    return natija;
  };
})();
