// 카테고리 폴더 slug → 표지 이미지 경로(public 기준). 매핑된 카테고리만 카드에 전용 표지가 깔리고,
// 없는 카테고리는 기본 표지(default-cover-*)를 쓴다.
export const CATEGORY_COVERS: Record<string, string> = {
  youtube: '/covers/youtube.png',
  ai: '/covers/ai.png',
  'llm-wiki-세컨드브레인': '/covers/llm-wiki.png',
  'llm-wiki': '/covers/llm-wiki.png',
  '강의': '/covers/lecture.png',
  '랄프톤-1위-개발자가-알려주는-실전-하네스-엔지니어링-a-to-z': '/covers/harness-engineering.png',
  'part-1-하네스의-지도-어디에-무엇을-심을-것인가': '/covers/harness-engineering.png',
};

export function categoryCover(seg: string): string | undefined {
  const clean = seg.replace(/^zz-/, '');
  return CATEGORY_COVERS[clean];
}

// 카드(세로 0.83:1)보다 세로로 긴 표지는 cover 크롭 시 위·아래가 잘린다. 기본은 가운데(center)지만,
// 중요한 내용이 위쪽에 몰린 표지는 'top'으로 잡아 윗부분이 보이게 한다. 매핑 없으면 center(CSS 기본).
export const CATEGORY_COVER_POSITIONS: Record<string, string> = {
  '랄프톤-1위-개발자가-알려주는-실전-하네스-엔지니어링-a-to-z': 'top',
  'part-1-하네스의-지도-어디에-무엇을-심을-것인가': 'top',
};

export function categoryCoverPosition(seg: string): string | undefined {
  const clean = seg.replace(/^zz-/, '');
  return CATEGORY_COVER_POSITIONS[clean];
}

// 카드 제목·메타 글자색. 기본은 'light'(흰 글자, 어두운 표지용). 밝은 표지는 'dark'로 잡아
// 검정 글자 + 흰 글로우로 읽히게 한다. 매핑 없으면 light(CSS 기본).
export const CATEGORY_COVER_TEXT: Record<string, 'light' | 'dark'> = {};

export function categoryCoverText(seg: string): 'light' | 'dark' | undefined {
  const clean = seg.replace(/^zz-/, '');
  return CATEGORY_COVER_TEXT[clean];
}

// 다크 막(scrim) on/off. 컬러풀·복잡해서 흰 글자가 묻히는 표지는 true로 잡아 어둠막을 깐다.
// 막 위 글자는 흰색 단일(has-cover 기본). 매핑 없으면 막 없음.
export const CATEGORY_COVER_SCRIM: Record<string, boolean> = {
  '랄프톤-1위-개발자가-알려주는-실전-하네스-엔지니어링-a-to-z': true,
  'part-1-하네스의-지도-어디에-무엇을-심을-것인가': true,
};

export function categoryCoverScrim(seg: string): boolean {
  const clean = seg.replace(/^zz-/, '');
  return CATEGORY_COVER_SCRIM[clean] ?? false;
}
