export interface KursTavsiyaMavzu {
  id: string;
  domain: string;
  skill: string | null;
  prerequisites: string[];
  href: string;
  domainHref: string;
}

export function tavsiyaKursYoli(
  mavzular: KursTavsiyaMavzu[],
  qism: { section: string; domain: string; skill: string },
  otilgan: Set<string>,
): string | undefined {
  if (qism.section !== 'math') return;
  const domen = mavzular.filter((m) => m.domain === qism.domain);
  return domen.find((m) => m.skill === qism.skill && m.prerequisites.every((id) => otilgan.has(id)))?.href
    ?? domen[0]?.domainHref;
}

export type KursBogliqlar = { passed: string[]; questions: Record<string, string> };

export async function kursBogliqlar(
  mijoz: NonNullable<ReturnType<typeof import('../hisob').hisobMijoz>>,
  mavzular: KursTavsiyaMavzu[],
  ids: string[] = [],
): Promise<KursBogliqlar> {
  if (mavzular.length) {
    try {
      const { data, error } = await mijoz.rpc('course_links', { p_questions: ids });
      if (!error && Array.isArray(data?.passed) && data.questions && typeof data.questions === 'object') return data;
    } catch { /* Tavsiyalar olinmasa, amaldagi mashq va redo oqimi davom etadi. */ }
  }
  return { passed: [], questions: {} };
}
