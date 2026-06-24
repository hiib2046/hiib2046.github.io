// 카테고리 폴더 slug → 화면 표시명. URL·active 매칭은 slug 그대로 쓰고, 화면에만 이 이름을 보여준다.
// 매핑에 없는 카테고리는 폴더명을 그대로 보여준다(정렬용 zz- 접두어만 제거).
export const CATEGORY_NAMES: Record<string, string> = {
  youtube: 'YouTube',
  검수대기: '검수 대기',
  python: 'Python',
  'llm-wiki-세컨드브레인': 'LLM Wiki & 세컨드브레인',
  ai: 'AI',
  'llm-wiki': 'LLM Wiki',
  '하네스-엔지니어링': '하네스 엔지니어링',
  '랄프톤-1위-개발자가-알려주는-실전-하네스-엔지니어링-a-to-z':
    '랄프톤 1위 개발자가 알려주는 실전 하네스 엔지니어링 A to Z (with. Claude Code, Codex)',
  'part-1-하네스의-지도-어디에-무엇을-심을-것인가': 'Part 1. 하네스의 지도: 어디에 무엇을 심을 것인가',
  'part-2-잘-묻는-하네스-좋은-질문이-좋은-하네스를-만든다':
    'Part 2. 잘 묻는 하네스: 좋은 질문이 좋은 하네스를 만든다',
  'part-3-문서형-하네스-프로젝트-md만으로-어디까지-할-수-있나':
    'Part 3. 문서형 하네스 프로젝트 : md만으로 어디까지 할 수 있나',
  'part-4-분업형-하네스-프로젝트-메인-세션을-괴롭히지-않는-법':
    'Part 4. 분업형 하네스 프로젝트: 메인 세션을 괴롭히지 않는 법',
  '실리콘밸리-바이브코딩-상위-1-개발자의-10가지-바이브코딩-스킬-with-claude-code-codex':
    '실리콘밸리 바이브코딩: 상위 1% 개발자의 10가지 바이브코딩 스킬 (with. Claude Code & Codex)',
  'part-1-claude-code-마스터하기': 'Part 1. Claude code 마스터하기',
};

export function categoryDisplayName(seg: string): string {
  const clean = seg.replace(/^zz-/, '');
  return CATEGORY_NAMES[clean] || clean;
}
