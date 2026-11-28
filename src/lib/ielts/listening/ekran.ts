import { brauzerOmbori } from '../../navigator/ombor';
import { yol } from '../../yol';
import { baholash } from '../reading/ball';
import { urinishOmbori } from '../reading/ombor';
import { qulfEgasi } from '../reading/qulf';
import { tekshirTest, savolKaliti } from '../reading/sxema';
import { vaqtMatn } from '../reading/taymer';
import { savolTuri } from '../reading/turlar/registr';
import { qoch } from '../reading/turlar/tur';
import { yangiId, yangiUrinish, type FaolUrinish, type Urinish } from '../reading/urinish';
import { LISTENING_KALITLAR, LISTENING_QULF, type ListeningTest } from './turlar';

export function ishgaTushirListening(): void {
  const root = document.getElementById('ls');
  if (!root) return;
  const element = <T extends HTMLElement = HTMLElement>(id: string) => document.getElementById(id) as T;
  const catalogue = element('ls-katalog');
  const select = element<HTMLSelectElement>('ls-tanlov');
  const start = element<HTMLButtonElement>('ls-boshla');
  const work = element('ls-ish');
  const questions = element('ls-savollar');
  const parts = element('ls-qismlar');
  const result = element('ls-natija');
  const status = element('ls-holat');
  const storageStatus = element('ls-xotira');
  const audio = element<HTMLAudioElement>('ls-audio');
  const audioStatus = element('ls-audio-holat');
  const retry = element<HTMLButtonElement>('ls-audio-qayta');
  const finishButton = element<HTMLButtonElement>('ls-yakunla');
  const dialog = element<HTMLDialogElement>('ls-yakun');
  const takeover = element<HTMLButtonElement>('ls-davom');
  const store = brauzerOmbori();
  const repository = urinishOmbori(store, LISTENING_KALITLAR);
  const tabId = yangiId();
  let active: FaolUrinish | null = null;
  let test: ListeningTest;
  let part = 0;
  let passive = false;
  let finished = false;
  let loading = false;
  let lastAudioSave = -1;
  let restoringAudio = true;
  let lastHeartbeat = 0;
  const allowed = new Set(Array.from(select.options, (option) => option.value));

  function persist(): void {
    if (active && !repository.saqlaFaol(active)) {
      storageStatus.textContent = 'Your browser could not save answers. You can continue while this page is open.';
    }
  }

  function claim(): void {
    if (repository.doimiy) store.yoz(LISTENING_QULF, JSON.stringify({ tab: tabId, vaqt: Date.now() }));
  }

  function release(): void {
    if (qulfEgasi(store.oqi(LISTENING_QULF), tabId, Date.now()) === 'meniki') store.ochir(LISTENING_QULF);
  }

  function writable(): boolean {
    if (!active || finished || passive) return false;
    if (repository.doimiy && qulfEgasi(store.oqi(LISTENING_QULF), tabId, Date.now()) === 'boshqa') {
      passive = true;
      audio.pause();
      audio.controls = false;
      questions.querySelectorAll<HTMLFieldSetElement>('fieldset').forEach((field) => { field.disabled = true; });
      finishButton.disabled = true;
      retry.disabled = true;
      status.textContent = 'This test is open in another tab.';
      takeover.hidden = false;
      return false;
    }
    return true;
  }

  function history(): void {
    const attempts = repository.urinishlar().slice(-10).reverse();
    element('ls-tarix-oram').hidden = attempts.length === 0;
    element('ls-tarix').innerHTML = attempts.map((attempt) =>
      `<li><button type="button" data-attempt="${qoch(attempt.id)}">${qoch(attempt.testId.replace('telegram-listening-', 'Mock '))} · ${attempt.raw}/40</button></li>`,
    ).join('');
  }

  async function load(id: string): Promise<ListeningTest> {
    if (!allowed.has(id)) throw new Error('Mock not found.');
    const response = await fetch(yol(`/uz/ielts/mashq/listening/testlar/${encodeURIComponent(id)}.json`));
    if (!response.ok) throw new Error('Could not load the mock. Try again.');
    const loaded = await response.json() as ListeningTest;
    if (loaded.testId !== id || tekshirTest(loaded).length || loaded.passages.length !== 4) throw new Error('The mock data is invalid.');
    return loaded;
  }

  function renderPart(focus = false): void {
    if (!active) return;
    const passage = test.passages[part];
    parts.innerHTML = test.passages.map((_, index) =>
      `<button type="button" data-part="${index}" aria-pressed="${index === part}">Part ${index + 1}</button>`,
    ).join('');
    questions.innerHTML = passage.groups.map((group) => {
      const image = group.illustration
        ? `<img class="ls-xarita" src="${qoch(group.illustration.src)}" alt="${qoch(group.illustration.alt)}" />` : '';
      return `<section class="ls-guruh"><p class="ls-korsatma" lang="en">${qoch(group.instructions)}</p>${image}${group.questions.map((question) => {
        const key = savolKaliti(question);
        const textId = `ls-question-${key}`;
        const number = question.numbers?.join('–') ?? question.number;
        return `<fieldset class="ls-savol"${passive ? ' disabled' : ''}><legend id="${textId}" lang="en">${qoch(String(number))}. ${qoch(question.prompt)}</legend>${savolTuri(group.type).render({ savol: question, guruh: group, javob: active!.answers[key], matnId: textId })}</fieldset>`;
      }).join('')}</section>`;
    }).join('');
    if (focus) questions.focus();
  }

  function answer(target: HTMLInputElement): void {
    if (!writable() || !active) return;
    if (Date.now() >= active.deadline) { finish(true); return; }
    const key = target.dataset.savol;
    if (!key) return;
    const group = test.passages[part].groups.find((item) => item.questions.some((q) => savolKaliti(q) === key));
    const question = group?.questions.find((q) => savolKaliti(q) === key);
    if (!group || !question) return;
    let value: unknown = target.value;
    if (target.type === 'checkbox') {
      const chosen = Array.from(target.closest('fieldset')!.querySelectorAll<HTMLInputElement>('input:checked'));
      if (chosen.length > 2) { target.checked = false; status.textContent = 'Choose up to two answers.'; return; }
      value = chosen.map((input) => input.value);
    }
    const normalized = savolTuri(group.type).normalize(value, question, group);
    if (normalized === undefined) delete active.answers[key];
    else active.answers[key] = normalized;
    persist();
    element('ls-javob-son').textContent = `${baholash(test, active.answers).qatorlar.filter((q) => q.berilgan).length}/40`;
  }

  function playbackSave(): void {
    if (restoringAudio || audio.readyState < 1 || !writable() || !active || !Number.isFinite(audio.currentTime)) return;
    active.audioPosition = audio.currentTime;
    persist();
  }

  function renderResult(attempt: Urinish, automatic = false): void {
    const score = baholash(test, attempt.answers);
    result.innerHTML = `<h2 tabindex="-1">${automatic ? 'Time is up · ' : ''}${attempt.raw}/40</h2><ol class="ls-javoblar">${score.qatorlar.map((q) =>
      `<li><details><summary>${q.number}. ${q.togri ? 'Correct' : q.berilgan ? 'Incorrect' : 'Unanswered'}</summary><p lang="en">${qoch(q.prompt)}</p><p>Your answer <span lang="en">${qoch(q.sizning || '—')}</span></p><p>Answer key <span lang="en">${qoch(q.togriJavob)}</span></p><p lang="en">${qoch(q.explanation)}</p></details></li>`,
    ).join('')}</ol><details class="ls-transkript"><summary>Transcript</summary><div lang="en">${test.passages[0].paragraphs.map((p) => `<p>${qoch(p.text)}</p>`).join('')}</div></details>`;
    work.hidden = true;
    catalogue.hidden = false;
    result.hidden = false;
    start.textContent = 'Start a new test';
    result.querySelector<HTMLElement>('h2')?.focus();
    history();
  }

  function finish(automatic = false): void {
    if (!writable() || !active) return;
    finished = true;
    audio.pause();
    if (dialog.open) dialog.close();
    const score = baholash(test, active.answers);
    const attempt: Urinish = {
      id: active.id, testId: active.testId, schemaVersion: active.schemaVersion,
      startedAt: active.startedAt, finishedAt: new Date(Math.min(Date.now(), active.deadline)).toISOString(),
      answers: active.answers, raw: score.raw, band: null, perTypeStats: score.perTypeStats, syncedAt: null,
    };
    if (repository.qoshUrinish(attempt)) repository.tozalaFaol();
    else storageStatus.textContent = 'Your result could not be saved. You can view it on this page.';
    release();
    active = null;
    select.disabled = false;
    takeover.hidden = true;
    status.textContent = '';
    renderResult(attempt, automatic);
  }

  function clock(): void {
    if (!active || finished) return;
    if (!writable()) return;
    const now = Date.now();
    if (now - lastHeartbeat > 2000) { claim(); lastHeartbeat = now; }
    const remaining = Math.max(0, active.deadline - now);
    element('ls-vaqt').textContent = vaqtMatn(remaining);
    if (!remaining) finish(true);
  }

  async function begin(force = false): Promise<void> {
    if (loading) return;
    loading = true;
    start.disabled = true;
    try {
      const saved = repository.faol();
      test = await load(saved?.testId ?? select.value);
      active = repository.faol() ?? yangiUrinish(test, Date.now());
      select.value = active.testId;
      select.disabled = true;
      part = 0;
      finished = false;
      passive = false;
      lastAudioSave = -1;
      if (force || !repository.doimiy || qulfEgasi(store.oqi(LISTENING_QULF), tabId, Date.now()) !== 'boshqa') claim();
      persist();
      catalogue.hidden = true;
      result.hidden = true;
      work.hidden = false;
      audio.controls = true;
      finishButton.disabled = false;
      retry.disabled = false;
      takeover.hidden = true;
      status.textContent = '';
      element('ls-nomi').textContent = test.title;
      element('ls-javob-son').textContent = `${baholash(test, active.answers).qatorlar.filter((q) => q.berilgan).length}/40`;
      renderPart();
      if (!writable()) return;
      if (Date.now() >= active.deadline) { finish(true); return; }
      restoringAudio = true;
      audio.src = yol(test.audio.url);
      audio.load();
      void audio.play().catch(() => { audioStatus.textContent = 'Press Play to start the audio.'; });
      clock();
    } catch (error) {
      status.textContent = error instanceof Error ? error.message : 'Could not load the mock.';
      catalogue.hidden = false;
    } finally {
      loading = false;
      start.disabled = false;
    }
  }

  start.addEventListener('click', () => { void begin(); });
  takeover.addEventListener('click', () => { void begin(true); });
  parts.addEventListener('click', (event) => {
    const button = (event.target as HTMLElement).closest<HTMLButtonElement>('[data-part]');
    if (!button) return;
    part = Number(button.dataset.part);
    renderPart(true);
  });
  questions.addEventListener('input', (event) => {
    if (event.target instanceof HTMLInputElement && event.target.type === 'text') answer(event.target);
  });
  questions.addEventListener('change', (event) => {
    if (event.target instanceof HTMLInputElement && event.target.type !== 'text') answer(event.target);
  });
  finishButton.addEventListener('click', () => {
    if (!writable() || !active) return;
    if (Date.now() >= active.deadline) { finish(true); return; }
    element('ls-javobsiz').textContent = `${baholash(test, active.answers).javobsiz} questions unanswered.`;
    dialog.showModal();
  });
  element('ls-yakun-ha').addEventListener('click', () => finish());
  element('ls-yakun-yoq').addEventListener('click', () => { dialog.close(); finishButton.focus(); });
  element('ls-chiqish').addEventListener('click', () => {
    playbackSave(); audio.pause(); release(); work.hidden = true; catalogue.hidden = false;
    start.textContent = active ? 'Continue' : 'Start';
  });
  audio.addEventListener('loadedmetadata', () => {
    const position = active?.audioPosition;
    if (typeof position === 'number' && Number.isFinite(position) && Number.isFinite(audio.duration)) audio.currentTime = Math.max(0, Math.min(position, audio.duration));
    restoringAudio = false;
    audioStatus.textContent = '';
    retry.hidden = true;
  });
  audio.addEventListener('timeupdate', () => {
    const second = Math.floor(audio.currentTime);
    if (second !== lastAudioSave) { lastAudioSave = second; playbackSave(); }
  });
  audio.addEventListener('pause', playbackSave);
  audio.addEventListener('seeked', playbackSave);
  audio.addEventListener('error', () => { audioStatus.textContent = 'Could not load audio. Your answers are saved.'; retry.hidden = false; });
  retry.addEventListener('click', () => { playbackSave(); restoringAudio = true; audio.load(); void audio.play().catch(() => {}); });
  window.addEventListener('pagehide', () => { playbackSave(); release(); });
  document.addEventListener('visibilitychange', () => { if (document.visibilityState === 'visible') clock(); else playbackSave(); });
  window.addEventListener('storage', () => {
    if (!active || finished) return;
    if (!repository.faol()) {
      audio.pause(); active = null; select.disabled = false; work.hidden = true; catalogue.hidden = false; history();
      status.textContent = 'This test was finished in another tab.';
    } else writable();
  });
  element('ls-tarix').addEventListener('click', async (event) => {
    const button = (event.target as HTMLElement).closest<HTMLButtonElement>('[data-attempt]');
    if (!button || active) return;
    const attempt = repository.topUrinish(button.dataset.attempt!);
    if (!attempt) return;
    try { test = await load(attempt.testId); renderResult(attempt); }
    catch { status.textContent = 'Could not load the mock for this result.'; }
  });
  window.setInterval(clock, 1000);
  history();
  if (repository.faol()) void begin();
}
