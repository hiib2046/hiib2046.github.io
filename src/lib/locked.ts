/*
 * 통째로 잠그는 카테고리 정의.
 * 여기에 적은 카테고리(폴더 경로)와 그 하위의 모든 글·목록이 공용 비번으로 잠긴다.
 * 잠금 추가/해제는 이 배열만 고치면 된다. 경로는 글 폴더명 규칙(소문자)과 같게 적는다.
 */
export const LOCKED_CATEGORIES: string[] = ['youtube', '강의'];

// 경로(조각 배열)가 잠긴 카테고리이거나 그 하위인가
export function isCategoryLocked(segs: string[]): boolean {
  return LOCKED_CATEGORIES.some((lc) => {
    const lcSegs = lc.split('/');
    return lcSegs.every((s, i) => segs[i] === s);
  });
}

// 글(id = "youtube/slug" 또는 "youtube/sub/slug")이 잠긴 카테고리에 속하는가
export function isPostLocked(postId: string): boolean {
  const catSegs = postId.split('/').slice(0, -1);
  return isCategoryLocked(catSegs);
}
