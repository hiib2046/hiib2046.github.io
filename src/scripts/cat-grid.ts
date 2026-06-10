/*
 * 카테고리 카드장(.cat-grid) 가로 넘김 — 좌우 화살표(넘칠 때만 표시) + 마우스 끌어서 스크롤.
 * 잠기지 않은 카테고리는 페이지 로드 시, 잠긴 카테고리는 잠금 통과 후(주입된 DOM에 대해) 호출된다.
 * 같은 wrap을 두 번 초기화하지 않도록 data-ready 플래그로 가드한다(이벤트 리스너 중복 방지).
 * 터치 스와이프는 overflow-x:auto 기본 동작으로 처리되므로 별도 코드가 없다.
 */
export function initCatGrids(): void {
  document.querySelectorAll<HTMLElement>('.cat-grid-wrap').forEach(setup);
}

function setup(wrap: HTMLElement): void {
  if (wrap.dataset.ready) return;
  const grid = wrap.querySelector<HTMLElement>('.cat-grid');
  const prev = wrap.querySelector<HTMLButtonElement>('.cat-nav-prev');
  const next = wrap.querySelector<HTMLButtonElement>('.cat-nav-next');
  if (!grid || !prev || !next) return;
  wrap.dataset.ready = '1';

  // 넘침 여부·현재 스크롤 위치에 따라 좌우 화살표를 켜고 끈다(끝에 닿으면 그쪽 숨김).
  const update = () => {
    const overflow = grid.scrollWidth - grid.clientWidth > 1;
    prev.hidden = !overflow || grid.scrollLeft <= 1;
    next.hidden = !overflow || grid.scrollLeft >= grid.scrollWidth - grid.clientWidth - 1;
  };

  const step = () => grid.clientWidth * 0.85;
  next.addEventListener('click', () => grid.scrollBy({ left: step(), behavior: 'smooth' }));
  prev.addEventListener('click', () => grid.scrollBy({ left: -step(), behavior: 'smooth' }));
  grid.addEventListener('scroll', update, { passive: true });
  window.addEventListener('resize', update);

  // 마우스로 끌어서 스크롤. 일정 거리 이상 끌면 직후의 카드 클릭(링크 이동)을 한 번 취소한다.
  let down = false;
  let startX = 0;
  let startScroll = 0;
  let moved = 0;
  grid.addEventListener('mousedown', (e) => {
    down = true;
    moved = 0;
    startX = e.pageX;
    startScroll = grid.scrollLeft;
    grid.classList.add('dragging');
  });
  window.addEventListener('mousemove', (e) => {
    if (!down) return;
    const dx = e.pageX - startX;
    moved = Math.max(moved, Math.abs(dx));
    grid.scrollLeft = startScroll - dx;
  });
  window.addEventListener('mouseup', () => {
    if (!down) return;
    down = false;
    grid.classList.remove('dragging');
    if (moved > 5) {
      const block = (e: Event) => {
        e.preventDefault();
        e.stopPropagation();
      };
      grid.addEventListener('click', block, { capture: true, once: true });
    }
  });

  update();
}
