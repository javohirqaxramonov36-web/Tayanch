// Joriy mini-test uchun ko'rsatkich. To'g'ri javoblar va jami 1b sessiyasidan keladi.
export function miniTestOtdimi(togri: number, jami: number): boolean {
  return jami > 0 && togri >= Math.ceil((jami * 7) / 10);
}
