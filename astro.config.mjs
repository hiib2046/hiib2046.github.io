import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

// user site(hiib2046.github.io)라 base는 불필요. site만 지정하면 sitemap·RSS가 절대 URL을 만든다.
export default defineConfig({
  site: 'https://hiib2046.github.io',
  integrations: [sitemap()],
  // 코드블록은 다크 테마(남색) 한 벌로 칠한다. 종이톤 본문과 대비돼 코드 영역이 또렷하다.
  markdown: {
    shikiConfig: {
      theme: 'github-dark',
    },
  },
});
