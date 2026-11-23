/** Kelajakdagi server orqali ulanadigan suhbat mexanizmi chegarasi. */
export interface InterviewEngine {
  start(options: {
    level: 'bachelor' | 'master';
    track: string | null;
    signal: AbortSignal;
  }): Promise<{ sessionId: string }>;
  next(
    sessionId: string,
    signal: AbortSignal,
  ): Promise<{ id: string; text: string; room: number | null } | null>;
  answer(
    sessionId: string,
    questionId: string,
    answer: Blob | string,
    signal: AbortSignal,
  ): Promise<void>;
  feedback(
    sessionId: string,
    signal: AbortSignal,
  ): Promise<{
    criteria: { name: string; score: number; max: number; evidence: string }[];
  }>;
  finish(sessionId: string, signal: AbortSignal): Promise<void>;
  cancel(sessionId: string): void;
}
