import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

// 각 글은 폴더 하나(폴더명 = slug). index.md만 글로 수집, 같은 폴더의 이미지는 동행 자산.
const blog = defineCollection({
  loader: glob({ pattern: '**/index.md', base: './src/content/blog' }),
  schema: ({ image }) =>
    z.object({
      title: z.string(),
      date: z.coerce.date(),
      category: z.string().optional(), // 구조 A: 분류는 폴더 경로에서 도출. 평면 글만 이 필드 사용
      cover: image().optional(), // image() helper → 빌드 시 최적화·검증
      protected: z.boolean().optional(), // true면 빌드 시 본문을 공용 비번으로 암호화
      video_id: z.string().optional(),   // yt 소스 글: 본문 위 유튜브 임베드 렌더용
      kind: z.enum(['analytical', 'study-notes']).optional(), // 글 종류(사후수정 rules 선택용)
    }),
});

export const collections = { blog };
