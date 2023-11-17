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
    text: '机器学习',
    icon: 'sun',
    children: [{
      text: 'Hugging Face NLP',
      link: '/ai/huggingface-nlp',
    }, {
      text: 'Deep RL',
      link: '/ai/deep-rl',
    }, {
      text: '特征工程',
      link: '/machine-learning/feature-engineering',
    } 
    ],
  }, {
    text: '计算机基础',
    icon: 'computer',
    children: [
      {
        text: '字符编码',
        link: '/basic/character-encoding/',
      },
      {
        text: '计算机网络',
        link: '/basic/network/',
      },
      {
        text: '操作系统',
        link: '/basic/os/',
      }
    ],
  }, {
    text: '代码',
    icon: 'code',
    children: [
      {
        text: '前端',
        link: '/code/front-end/',
      },
      {
        text: '数据结构与算法',
        link: '/code/data-structure-and-algorithm/',
      },
      {
        text: '正则表达式',
        link: '/code/re/',
      }
    ]
  }, {
    text: '英语',
    icon: 'english',
    children: [
      {
        text: '口语',
        link: '/english-study/spoken-english/',
        children: [{
          text: '题库',
          link: '/english-study/spoken-english/question-bank'
        }, {
          text: 'topics',
          link: '/english-study/spoken-english/topics'
        }, {
          text: 'Breakout Room',
          link: '/english-study/spoken-english/breakout-room'
        }]
      },
      
    ]
  }, {
    text: '其他',
    link: '/other',
  }
])