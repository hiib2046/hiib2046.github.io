import { getCollection } from 'astro:content';
import type { CollectionEntry } from 'astro:content';

export type Post = CollectionEntry<'blog'>;

// 최신순(date 내림차순) 전체 글
export async function getSortedPosts(): Promise<Post[]> {
  const posts = await getCollection('blog');
  return posts.sort((a, b) => b.data.date.valueOf() - a.data.date.valueOf());
}

// 글들의 category를 중복 없이, 첫 등장 순서 유지
export async function getCategories(): Promise<string[]> {
  const posts = await getCollection('blog');
  return [...new Set(posts.map((p) => p.data.category))];
}
