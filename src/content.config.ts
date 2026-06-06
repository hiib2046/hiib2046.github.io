import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

// 각 글은 폴더 하나(폴더명 = slug). index.md만 글로 수집, 같은 폴더의 이미지는 동행 자산.
const blog = defineCollection({
  loader: glob({ pattern: '*/index.md', base: './src/content/blog' }),
  schema: ({ image }) =>
    z.object({
      title: z.string(),
      date: z.coerce.date(),
      category: z.string(),
      cover: image().optional(), // image() helper → 빌드 시 최적화·검증
    }),
});

export const collections = { blog };
