import { hopeTheme } from "vuepress-theme-hope";
import { enNavbar, zhNavbar } from "./navbar/index";
import { enSidebar, zhSidebar } from "./sidebar/index";

export default hopeTheme({
  author: {
    name: 'Soul',
    email: 'hanzhuosoul@gmail.com',
  },
  repo: "hanzhuo-github/hanzhuo-github.github.io",

  navbarLayout: {
    start: ["Brand"],
    center: ["Links"],
    end: ["Language", "Repo", "Outlook", "Search"],
  },

  blog: {
    name: '小太阳好晒',
    avatar: 'images/avatar.svg',
    description: '',
    intro: '',
    medias: {
      GitHub: "https://github.com/hanzhuo-github",
      Email: "mailto:hanzhuosoul@gmail.top",
    },
    articlePerPage: 10,
  },

  plugins: {
    blog: true,
    mdEnhance: {
      card: true,
      figure: true,
      imgSize: true,
      katex: true,
      mathjax: true,
      codetabs: true,
      footnote: true,
      // 启用下角标功能
      sub: true,
      // 启用上角标
      sup: true,
      // 启用标记功能
      mark: true,
    },
    comment: {
      provider: "Waline",
      serverURL: "comments.richzone.ink/", // your serverURL
    },
    components: {
      components: [
        "Badge",
        "Share",
      ],
    },
  },

  // 关键词: "iconfont", "iconify", "fontawesome", "fontawesome-with-brands"
  iconAssets: "fontawesome",

  // 支持全屏模式
  fullscreen: true,

  print: false,

  locales: {
    '/': {
      navbar: zhNavbar,
      sidebar: zhSidebar,
      headerDepth: 3,
    },
    '/en/': {
      navbar: enNavbar,
      sidebar: enSidebar,
      headerDepth: 3,
    },
  },

  encrypt: {
    config: {
      "/english-study/": "7834",
    }
  }
})