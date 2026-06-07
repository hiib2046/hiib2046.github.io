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

// 최상위 분류들(사이드바용)
export async function topCategories(): Promise<CatNode[]> {
  const root = await buildTree();
  return [...root.children.values()];
}
