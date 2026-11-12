// One static JSON file per Reading test: /uz/ielts/mashq/reading/testlar/<testId>.json.
// The test screen fetches only the test it needs. Invalid tests fail the build here.
import type { APIRoute, GetStaticPaths } from 'astro';
import { saytTestlari } from '../../../../../../lib/ielts/reading/saytTestlari.ts';
import type { ReadingTest } from '../../../../../../lib/ielts/reading/sxema.ts';

export const getStaticPaths: GetStaticPaths = async () =>
  (await saytTestlari()).map((test) => ({ params: { testId: test.testId }, props: { test } }));

export const GET: APIRoute = ({ props }) =>
  new Response(JSON.stringify((props as { test: ReadingTest }).test), {
    headers: { 'content-type': 'application/json; charset=utf-8' },
  });
