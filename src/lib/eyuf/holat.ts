export function lokalOqi<T>(
  key: string,
  validate: (value: unknown) => value is T,
  fallback: T,
  message?: HTMLElement | null,
): T {
  try {
    const raw = localStorage.getItem(key);
    if (raw === null) return fallback;
    const value: unknown = JSON.parse(raw);
    if (validate(value)) return value;
    throw new Error('Buzilgan yozuv');
  } catch {
    if (message) {
      message.hidden = false;
      message.textContent =
        'Saqlangan holatni o‘qib bo‘lmadi. Shu tabda davom etishingiz mumkin.';
    }
    return fallback;
  }
}
export function lokalYoz(
  key: string,
  value: unknown,
  message?: HTMLElement | null,
): boolean {
  try {
    localStorage.setItem(key, JSON.stringify(value));
    return true;
  } catch {
    if (message) {
      message.hidden = false;
      message.textContent =
        'Bu qurilmada saqlanmadi. Shu tabda davom eting yoki natijani yuklab oling.';
    }
    return false;
  }
}
export function matnYukla(text: string, name: string) {
  const url = URL.createObjectURL(
    new Blob([text], { type: 'text/plain;charset=utf-8' }),
  );
  const link = document.createElement('a');
  link.href = url;
  link.download = name;
  link.click();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}
export function matnElement(tag: string, text: string): HTMLElement {
  const element = document.createElement(tag);
  element.textContent = text;
  return element;
}
