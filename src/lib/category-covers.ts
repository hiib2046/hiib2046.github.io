// 카테고리 폴더 slug → 표지 이미지 경로(public 기준). 매핑된 카테고리만 카드에 전용 표지가 깔리고,
// 없는 카테고리는 기본 표지(default-cover-*)를 쓴다.
export const CATEGORY_COVERS: Record<string, string> = {
  youtube: '/covers/youtube.png',
  ai: '/covers/ai.png',
  'llm-wiki-세컨드브레인': '/covers/llm-wiki.png',
  'llm-wiki': '/covers/llm-wiki.png',
};

export function categoryCover(seg: string): string | undefined {
  const clean = seg.replace(/^zz-/, '');
  return CATEGORY_COVERS[clean];
}
