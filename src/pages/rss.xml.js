import rss from '@astrojs/rss';
import { getCollection } from 'astro:content';

export async function GET(context) {
  const posts = await getCollection('blog');
  return rss({
    title: 'ATELIER',
    description: 'AI가 실행을 가져간 자리에',
    site: context.site,
    items: posts
      .sort((a, b) => b.data.date.valueOf() - a.data.date.valueOf())
      .map((post) => ({
        title: post.data.title,
        pubDate: post.data.date,
        ...(post.data.category ? { categories: [post.data.category] } : {}),
        link: `/blog/${post.id}/`,
      })),
  });
}
