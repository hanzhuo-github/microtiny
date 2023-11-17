import { sidebar } from 'vuepress-theme-hope';

export const zhSidebar = sidebar({
  '/ai/': [
    {
      text: "Hugging Face NLP",
      collapsible: true,
      link: "/ai/huggingface-nlp/",
      prefix: "huggingface-nlp/",
      children: [
        {
          text: "👋	Hugging Face 初步",
          prefix: "section1/",
          link: "",
          collapsible: true,
          children: "structure",
        },
        {
          text: "👌 Hugging Face 深入",
          icon: "",
          prefix: "section2/",
          link: "",
          collapsible: true,
          children: "structure",
        },
        {
          text: "🤟 Hugging Face 高级",
          icon: "",
          prefix: "section3/",
          link: "",
          collapsible: true,
          children: "structure",
        }
      ],
    }, {
      text: "Deep RL",
      collapsible: true,
      link: "/ai/deep-rl/",
      prefix: "deep-rl/",
      children: "structure",
    },
    {
      text: "理论",
      collapsible: true,
      link: "/ai/theory/",
      prefix: "theory/",
      children: [
        {
          text: "评估指标",
          link: "/ai/theory/metrics/",
        }
      ],
    },
    {
      text: "ISL",
      collapsible: true,
      link: "/ai/statisticalLearning/",
      prefix: "statisticalLearning/",
      children: [
        {
          text: "简介",
          link: "/ai/statisticalLearning/introduction/",
        }
      ],
    }
  ],
  '/machine-learning/': [
    {
      text: "特征工程",
      collapsible: true,
      link: "/machine-learning/feature-engineering/",
      prefix: "feature-engineering/",
    },
  ],
  '/basic/character-encoding/': [
    "Chapter1.md",
    "Chapter2.md",
    "Chapter3.md",
  ],
  '/basic/network/': [
    "index.md",
    {
      text: '底层网络知识',
      collapsible: true,
      link: "/basic/network/section1/",
      prefix: "section1/",
      children: "structure",
    }
  ],
  '/basic/os/': [
    "command.md",
  ],
  '/code/front-end/': [{
    text: "JavaScript",
    collapsible: true,
    link: "/code/front-end/javascript/",
    prefix: "javascript/",
    children: "structure",
  }],
  '/code/data-structure-and-algorithm/': [
    "index.md",
    "array.md",
    "linked-list.md",
    "stack.md",
    "queue.md",
    "recursion.md",
    "sort.md",
    "binary-search.md",
    "skip-list.md",
    "hash-table.md",
  ],
  '/code/re/': [{
    text: "正则表达式",
    collapsible: true,
    link: "/code/front-end/javascript/",
    prefix: "re/",
    children: "structure",
  }],
  '/english-study/spoken-english/': [
    "types.md",
    "expression.md",
    "collocation.md",
    "warm-up.md",
  ],
  '/english-study/spoken-english/question-bank': [
    "qa-p1.md",
  ],
  '/english-study/spoken-english/breakout-room': [
    "speed-network.md",
  ],
  '/english-study/spoken-english/topics': [
    "topics.md",
    "p1-sky-and-stars.md",
    "p1-flowers.md",
    "p1-TV-programmes.md",
    "p1-wild-animals.md",
    "p1-history.md",
    "p1-concentration.md",
    "p1-handwriting.md",
    "p1-weather.md",
  ],
  '/other': [
    "QA.md"
  ]
})