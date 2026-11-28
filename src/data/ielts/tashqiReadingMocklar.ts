// Public labels for optional mock files supplied outside the repository.
export const tashqiReadingMocklar = Array.from({ length: 7 }, (_, i) => {
  const raqam = String(i + 1).padStart(2, '0');
  return { id: `telegram-reading-${raqam}`, nomi: `Reading Mock ${raqam}` };
});
