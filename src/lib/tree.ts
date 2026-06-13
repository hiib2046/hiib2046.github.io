import { getCollection } from 'astro:content';
import type { CollectionEntry } from 'astro:content';

export type Post = CollectionEntry<'blog'>;

// 분류 트리의 한 노드. children = 하위 분류, posts = 이 분류에 직접 속한 글
export interface CatNode {
  name: string; // 마지막 경로 조각(= 분류 이름)
  path: string[]; // 루트부터의 경로 조각들
  children: Map<string, CatNode>;
  posts: Post[];
}

function emptyNode(name: string, path: string[]): CatNode {
  return { name, path, children: new Map(), posts: [] };
}

// 글이 아직 없어도 존재해야 하는 카테고리(선언형). 트리에 빈 노드로 자리만 만들어,
// 글 0개여도 카드가 뜨고 들어가면 "비었음"을 보여준다.
const DECLARED_CATEGORIES: string[][] = [
  ['ai', 'llm-wiki'],
  ['강의', '랄프톤-1위-개발자가-알려주는-실전-하네스-엔지니어링-A-to-Z'],
];

// 경로 조각들을 따라 내려가며 없는 노드를 만든다(있으면 그대로 둠).
function ensurePath(root: CatNode, segs: string[]): void {
  let node = root;
  const acc: string[] = [];
  for (const seg of segs) {
    acc.push(seg);
    if (!node.children.has(seg)) node.children.set(seg, emptyNode(seg, [...acc]));
    node = node.children.get(seg)!;
  }
}

// 글 id(= 폴더 경로, 예 "zz-AI/에이전트/agent-loop")에서 분류 경로를 떼어 트리를 쌓는다.
// 마지막 조각은 글 자신의 slug이므로 분류 경로는 그 앞까지.
export async function buildTree(): Promise<CatNode> {
  const posts = await getCollection('blog');
  const root = emptyNode('', []);
  for (const post of posts) {
    const segs = post.id.split('/');
    const catSegs = segs.slice(0, -1);
    if (catSegs.length === 0) continue; // 평면(분류 없는) 글은 트리에서 제외
    let node = root;
    const acc: string[] = [];
    for (const seg of catSegs) {
      acc.push(seg);
      if (!node.children.has(seg)) node.children.set(seg, emptyNode(seg, [...acc]));
      node = node.children.get(seg)!;
    }
    node.posts.push(post);
  }
  // 선언형 카테고리를 빈 노드로 보장(글이 그 안에 생기면 위 루프가 이미 채웠으니 무해)
  for (const segs of DECLARED_CATEGORIES) ensurePath(root, segs);
  return root;
}

// 경로 조각 배열로 노드를 찾는다(없으면 null)
export function findNode(root: CatNode, path: string[]): CatNode | null {
  let node = root;
  for (const seg of path) {
    const next = node.children.get(seg);
    if (!next) return null;
    node = next;
  }
  return node;
}

// 이 분류와 하위 분류 전체의 글 수(카드의 "N편" 표시용)
export function countPosts(node: CatNode): number {
  let n = node.posts.length;
  for (const c of node.children.values()) n += countPosts(c);
  return n;
}

// 루트 카테고리 표시 순서(명시적). 여기 있는 건 이 순서대로 앞에,
// 없는 카테고리는 뒤에 이름 알파벳순으로 붙는다 — 글 유무·선언형 여부와 무관하게 고정.
const CATEGORY_ORDER: string[] = ['ai', 'youtube', '강의'];

// 최상위 분류들(홈·사이드바용). CATEGORY_ORDER로 정렬.
export async function topCategories(): Promise<CatNode[]> {
  const root = await buildTree();
  const cats = [...root.children.values()];
  return cats.sort((a, b) => {
    const ia = CATEGORY_ORDER.indexOf(a.name);
    const ib = CATEGORY_ORDER.indexOf(b.name);
    // 둘 다 미지정이면 이름순, 한쪽만 지정이면 지정된 쪽이 앞, 둘 다 지정이면 배열 순서.
    if (ia === -1 && ib === -1) return a.name.localeCompare(b.name);
    if (ia === -1) return 1;
    if (ib === -1) return -1;
    return ia - ib;
  });
}
