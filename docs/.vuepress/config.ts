import { defineUserConfig } from 'vuepress';
import { getDirname, path } from "@vuepress/utils";
import theme from './theme';
import { searchProPlugin } from 'vuepress-plugin-search-pro';
import { registerComponentsPlugin } from '@vuepress/plugin-register-components';


const __dirname = getDirname(import.meta.url);

export default defineUserConfig({
  markdown: {
    headers: {
      level: [2, 3, 4],
    },
  },
  locales: {
    '/': {
      lang: 'zh-CN',
      title: 'MicroTiny',
      description: '记录日常工作学习生活的笔记',
    },
    '/en/': {
      lang: 'en-US',
      title: 'MicroTiny',
      description: 'Record notes for daily work, study and life',
    },
  },
  theme,
  plugins: [
    searchProPlugin({
      // 索引全部内容
      indexContent: true,
    }),
    registerComponentsPlugin({
      componentsDir: path.resolve(__dirname, "./components"),
    }),
  ],
  alias: {
    '@MyCard': path.resolve(__dirname, './components/Card.vue'),
    '@post': path.resolve(__dirname, '../post'),
  },
  pagePatterns: ['**/*.md', '!**/README.md', '!.vuepress', '!node_modules'],
})