// Belgilanadigan bo'laklar guruhi (so'zlar yoki gaplar): har bo'lak <button aria-pressed>.
// Klaviatura: guruhga bitta Tab to'xtashi (roving tabindex), strelkalar bilan o'tish, Home/End chetga,
// Enter yoki Space bilan belgilash (button o'zi click beradi). Bittagina bo'lak belgilanadi; qayta bosilsa bekor bo'ladi.

export interface Guruh {
  /** Belgilangan bo'lak indeksi yoki -1 */
  tanlangan: () => number;
  /** Tanlovni o'rnatadi (-1: bekor) */
  tanla: (i: number) => void;
  /** Hamma bo'lakni o'chiradi yoki yoqadi */
  faol: (on: boolean) => void;
  tugmalar: HTMLButtonElement[];
}

export function belgilashGuruhi(
  quti: HTMLElement,
  ozgardi: (i: number) => void = () => {},
): Guruh {
  const tugmalar = [...quti.querySelectorAll<HTMLButtonElement>('[data-bolak]')];
  let tanlangan = -1;
  let fokusda = 0;

  const fokusla = (i: number, fokus: boolean) => {
    fokusda = i;
    tugmalar.forEach((t, j) => { t.tabIndex = j === i ? 0 : -1; });
    if (fokus) tugmalar[i]?.focus();
  };

  const tanla = (i: number) => {
    tanlangan = i;
    tugmalar.forEach((t, j) => t.setAttribute('aria-pressed', String(j === i)));
    if (i >= 0) fokusla(i, false);
  };

  tugmalar.forEach((t, i) => {
    t.addEventListener('click', () => {
      if (t.disabled) return;
      tanla(tanlangan === i ? -1 : i);
      fokusla(i, false);
      ozgardi(tanlangan);
    });
    t.addEventListener('keydown', (e) => {
      let j = -1;
      if (e.key === 'ArrowRight' || e.key === 'ArrowDown') j = Math.min(i + 1, tugmalar.length - 1);
      else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') j = Math.max(i - 1, 0);
      else if (e.key === 'Home') j = 0;
      else if (e.key === 'End') j = tugmalar.length - 1;
      if (j >= 0) { e.preventDefault(); fokusla(j, true); }
    });
  });
  fokusla(0, false);

  return {
    tanlangan: () => tanlangan,
    tanla,
    faol: (on) => {
      tugmalar.forEach((t) => { t.disabled = !on; });
      if (on) fokusla(tanlangan >= 0 ? tanlangan : fokusda, false);
    },
    tugmalar,
  };
}

/** Tinish belgisi oldidan bo'shliq qo'yilmaydi */
export const tinishmi = (b: string) => /^[,.;:!?)]$/.test(b);
