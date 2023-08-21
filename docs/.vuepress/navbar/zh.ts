import { navbar } from "vuepress-theme-hope";

export const zhNavbar = navbar([
  {
    text: '首页',
    link: '/',
    icon: 'home',
  }, {
    text: '博客',
    link: '/blog/',
    icon: 'blog'
  }, {
    text: '计算机基础',
    link: '/basic/',
    icon: 'computer',
    children: [
      {
        text: '字符编码',
        link: '/basic/character-encoding/',
      },
      {
        text: '计算机网络',
        link: '/basic/network/',
      }
    ],
  }, {
    text: '代码',
    link: '/code/',
    icon: 'code',
    children: [
      {
        text: '前端',
        link: '/code/front-end/',
      },
      {
        text: '数据结构与算法',
        link: '/code/data-structure-and-algorithm/',
      }
    ]
  }
])