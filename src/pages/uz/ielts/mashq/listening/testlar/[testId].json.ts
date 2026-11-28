import type { APIRoute, GetStaticPaths } from 'astro';
import { saytListeningTestlari } from '../../../../../../lib/ielts/listening/saytTestlari';
import type { ListeningTest } from '../../../../../../lib/ielts/listening/turlar';

export const getStaticPaths: GetStaticPaths = async () =>
  (await saytListeningTestlari()).map((test) => ({ params: { testId: test.testId }, props: { test } }));

export const GET: APIRoute = ({ props }) => new Response(
  JSON.stringify((props as { test: ListeningTest }).test),
  { headers: { 'content-type': 'application/json; charset=utf-8' } },
);
