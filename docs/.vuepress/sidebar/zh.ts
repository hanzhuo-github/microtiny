import { sidebar } from 'vuepress-theme-hope';

export const zhSidebar = sidebar({
  '/ai/': [
    {
      text: "Hugging Face",
      collapsible: true,
      link: "/ai/huggingface/",
      prefix: "huggingface/",
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
    // {
    //   text: "数组",
    //   collapsible: true,
    //   link: "/code/data-structure-and-algorithm/array",
    //   prefix: "array/",
    //   children: "structure",
    // }
  ],
})