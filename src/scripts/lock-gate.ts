/*
 * 잠금 게이트(브라우저) — 페이지 안의 .locked(암호문 data 속성)를 공용 비번으로 풀어 본문을 그린다.
 * 잠긴 글 페이지와 잠긴 카테고리 페이지가 공유한다. 한 번 통과한 비번은 localStorage 에 저장돼
 * 다른 잠긴 글·분류도 자동으로 열린다. 빌드 측 PBKDF2/AES-GCM 파라미터와 정확히 일치해야 한다.
 */
const ITERATIONS = 600_000; // 빌드 측 encrypt.ts 와 동일
const STORE_KEY = 'blog_pw';

export function initLockGate(): void {
  const root = document.querySelector<HTMLElement>('.locked');
  if (!root) return;

  const b64 = (s: string) => Uint8Array.from(atob(s), (c) => c.charCodeAt(0));
  const salt = b64(root.dataset.salt!);
  const iv = b64(root.dataset.iv!);
  const payload = b64(root.dataset.payload!);

  const gate = root.querySelector<HTMLElement>('.lock-gate')!;
  const form = root.querySelector<HTMLFormElement>('.lock-form')!;
  const input = root.querySelector<HTMLInputElement>('.lock-input')!;
  const errEl = root.querySelector<HTMLElement>('.lock-error')!;
  const contentEl = root.querySelector<HTMLElement>('.lock-content')!;

  async function decryptWith(pw: string): Promise<string> {
    const km = await crypto.subtle.importKey(
      'raw',
      new TextEncoder().encode(pw),
      'PBKDF2',
      false,
      ['deriveKey'],
    );
    const key = await crypto.subtle.deriveKey(
      { name: 'PBKDF2', salt, iterations: ITERATIONS, hash: 'SHA-256' },
      km,
      { name: 'AES-GCM', length: 256 },
      false,
      ['decrypt'],
    );
    const pt = await crypto.subtle.decrypt({ name: 'AES-GCM', iv }, key, payload);
    return new TextDecoder().decode(pt);
  }

  async function attempt(pw: string, fromSaved: boolean): Promise<void> {
    try {
      const html = await decryptWith(pw);
      contentEl.innerHTML = html;
      gate.hidden = true;
      localStorage.setItem(STORE_KEY, pw); // 다른 잠긴 글·분류 자동 통과용
    } catch {
      // 저장된 비번으로 자동 시도하다 실패한 경우엔 조용히 입력창만 남긴다.
      if (!fromSaved) errEl.hidden = false;
    }
  }

  const saved = localStorage.getItem(STORE_KEY);
  if (saved) attempt(saved, true);

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    errEl.hidden = true;
    attempt(input.value, false);
  });
}
