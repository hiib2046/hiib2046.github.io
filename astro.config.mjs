import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

// user site(hiib2046.github.io)라 base는 불필요. site만 지정하면 sitemap·RSS가 절대 URL을 만든다.
export default defineConfig({
  site: 'https://hiib2046.github.io',
  integrations: [sitemap()],
});
