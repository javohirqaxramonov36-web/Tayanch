// Random test selection: never repeat the last finished test unless it is the only one.

export function tanlaTest(testIdlar: string[], oxirgiTestId: string | null, tasodif: () => number = Math.random): string | null {
  if (testIdlar.length === 0) return null;
  const nomzodlar = testIdlar.filter((id) => id !== oxirgiTestId);
  const royxat = nomzodlar.length > 0 ? nomzodlar : testIdlar;
  return royxat[Math.min(royxat.length - 1, Math.floor(tasodif() * royxat.length))];
}
