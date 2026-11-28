import type { APIRoute, GetStaticPaths } from 'astro';
import { readFile } from 'node:fs/promises';
import { join, basename } from 'node:path';
import { saytListeningTestlari } from '../../../../../../lib/ielts/listening/saytTestlari';

export const getStaticPaths: GetStaticPaths = async () =>
  (await saytListeningTestlari()).map((test) => ({
    params: { filename: basename(test.audio.url, '.mp3') },
    props: { file: join(process.env.TAYANCH_IELTS_LISTENING_DIR!, 'audio', basename(test.audio.url)) },
  }));

export const GET: APIRoute = async ({ props }) => new Response(
  new Uint8Array(await readFile((props as { file: string }).file)),
  { headers: { 'content-type': 'audio/mpeg' } },
);
