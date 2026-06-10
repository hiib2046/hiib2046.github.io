/*
 * 글 목록 정렬 토글 — 서버는 최신순으로 렌더하고, '오래된순'을 누르면 목록을 역순으로 재배치한다.
 * 잠기지 않은 카테고리는 페이지 로드 시, 잠긴 카테고리는 잠금 통과 후(주입된 DOM에 대해) 호출된다.
 * 선택값은 localStorage에 저장해 다른 분류로 옮겨도 유지한다. data-ready로 중복 초기화를 막는다.
 */
const STORE_KEY = 'post_sort';

export function initSortToggles(): void {
  document.querySelectorAll<HTMLElement>('.sort-toggle').forEach(setup);
}

function setup(toggle: HTMLElement): void {
  if (toggle.dataset.ready) return;
  const list = toggle.parentElement?.querySelector<HTMLElement>('.post-list');
  if (!list) return;
  toggle.dataset.ready = '1';

  const buttons = [...toggle.querySelectorAll<HTMLButtonElement>('.sort-btn')];
  // 서버 렌더 순서(최신순)를 원본으로 기억 — '오래된순'은 이 배열을 뒤집어 다시 붙인다.
  const original = [...list.children];

  const apply = (sort: string) => {
    const order = sort === 'oldest' ? [...original].reverse() : original;
    // appendChild는 기존 노드를 이동시키므로 순서만 재배치된다(복제 아님).
    order.forEach((el) => list.appendChild(el));
    buttons.forEach((b) => b.classList.toggle('is-active', b.dataset.sort === sort));
  };

  buttons.forEach((b) =>
    b.addEventListener('click', () => {
      const sort = b.dataset.sort || 'newest';
      localStorage.setItem(STORE_KEY, sort);
      apply(sort);
    }),
  );

  apply(localStorage.getItem(STORE_KEY) || 'newest');
}
