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
  ]
})