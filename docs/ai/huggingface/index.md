---
lang: zh-CN
title: 介绍
description:
article: false
---

本模块用于记录 [Hugging Face NLP Course](https://huggingface.co/learn/nlp-course) 的学习过程。

主要围绕以下四部分展开：
1. :hugs: Transformers
2. :hugs: DataSets
3. :hugs: Tokenizers
4. :hugs: Accelerate

<div class="menu">
    <MyCard title="Introduction" :subTitles="introduction" />
    <MyCard title="Diving in" :subTitles="divingIn" />
    <MyCard title="Advanced" :subTitles="advanced" />
</div>

<script setup lang="ts">
import MyCard from "@MyCard";

const introduction = [
    'Transformer models',
    'Using 🤗 Transformers',
    'Fine-tuning a pretrained model',
    'Sharing models and tokenizers',
]

const divingIn = [
    'The 🤗 Datasets library',
    'The 🤗 Tokenizers library',
    'Main NLP tasks',
    'How to ask for help',
    'Sharing models and tokenizers',
]

const advanced = [
    'Building and sharing demos',
    'Transformers can hear',
    'Transformers can see',
    'Optimizing form production',
]
</script>

<style lang="scss" scoped>
.menu {
    display: flex;
    gap: 16px;
}
</style>