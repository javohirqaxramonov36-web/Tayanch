// AI provayderi: Anthropic Claude (Messages API, rasmiy SDK). Faqat Edge Function ichida; kalit AI_API_KEY secret'da.
// Handler bu modulni bevosita emas, AiChaqiruv turi orqali oladi: sinovlar soxta provayder bilan ishlaydi.
import Anthropic from 'npm:@anthropic-ai/sdk@1.3.0';

export interface AiXabar {
  role: 'user' | 'assistant';
  content: string;
}

export interface AiSorov {
  model: string;
  maxTokens: number;
  system: string;
  messages: AiXabar[];
  /** Berilsa javob shu JSON sxemaga mos bo'ladi (output_config.format). */
  jsonSxema?: Record<string, unknown>;
}

export type AiNatija =
  | { ok: true; matn: string; inputTokens: number; outputTokens: number; stopReason: string | null }
  | { ok: false; xato: string; inputTokens: number; outputTokens: number };

export type AiChaqiruv = (s: AiSorov) => Promise<AiNatija>;

export function claudeChaqiruv(apiKey: string): AiChaqiruv {
  const client = new Anthropic({ apiKey, maxRetries: 1, timeout: 30_000 });
  return async (s) => {
    try {
      const res = await client.messages.create({
        model: s.model,
        max_tokens: s.maxTokens,
        system: s.system,
        messages: s.messages,
        // Fikrlash o'chiq: chiqish tokenlari (va xarajat) oldindan cheklangan bo'lsin.
        thinking: { type: 'disabled' },
        ...(s.jsonSxema ? { output_config: { format: { type: 'json_schema', schema: s.jsonSxema } } } : {}),
      });
      let matn = '';
      for (const b of res.content) if (b.type === 'text') matn += b.text;
      const u = res.usage;
      return {
        ok: true,
        matn,
        inputTokens: u.input_tokens + (u.cache_creation_input_tokens ?? 0) + (u.cache_read_input_tokens ?? 0),
        outputTokens: u.output_tokens,
        stopReason: res.stop_reason ?? null,
      };
    } catch (e) {
      // Xato matni (so'rov tanasi bo'lishi mumkin) logga yozilmaydi: faqat holat kodi.
      const xato = e instanceof Anthropic.APIError ? `api_${e.status ?? 'nomalum'}` : 'tarmoq';
      return { ok: false, xato, inputTokens: 0, outputTokens: 0 };
    }
  };
}
