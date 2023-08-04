---
lang: zh-CN
title: 1. Transformer Models
description:
article: false
---

## 1. NLP 介绍

NLP 的任务不仅仅是理解单个字词的含义，而是要理解上下文的含义。

NLP 任务有很多，比如：

- **对整个句子进行分类**：获取评论的情绪，检测电子邮件是否为垃圾邮件，确定句子在语法上是否正确或两个句子在逻辑上是否相关
- **对句子中的每个词语进行分类**：识别句子的语法成分（名词、动词、形容词）或命名实体（人、地点、组织）
- **生成上下文**：用自动生成的文本完成提示，用屏蔽词填充文本中的空白
- **从文本中提取答案**：给定问题和上下文，根据上下文中提供的信息提取问题的答案
- **根据输入文本生成新的句子**：将文本翻译成另一种语言，总结文本

### 1.1 术语：Architectures vs. checkpoints

在接下来的学习中，你将会看到 architectures、checkpoints，还有 models 这些术语。

- Architecture: 模型框架。每一层的定义、模型中发生的每个操作的定义。
- Checkpoints: 对于一个给定 architecture 的权重。
- Model: 范语，可能是指 architecture，也可能是指 checkpoints。

如：BERT 是一个 architecture。bert-base-cased 是由 Google 团队为 BERT 训练的初始权重，它是 checkpoints。我们可以说 BERT model，也可以说 bert-base-cased model.

## 2. Transformers 能做什么

你可以使用[🤗 Transformers 库](https://github.com/huggingface/transformers)来创建并使用公开的模型。你可以在[模型中心](https://huggingface.co/models)中查找预训练模型。你也可以在 Hub 中上传你自己的模型。


### 2.1 快速体验 🤗 Transformers 库

🤗 Transformers 库提供了 `pipeline()` 函数，它聚合了预训练模型和对应的文本预处理。使用该函数可以直接根据输入返回目标输出。

```python
from transformers import pipeline

# 选择任务 sentiment-analysis，创建分类器对象
# 没有指定 model，则会使用默认 model
classifier = pipeline("sentiment-analysis")

# 1 传入一个句子
classifier("I've been waiting for a HuggingFace course my whole life.")
# 结果：[{'label': 'POSITIVE', 'score': 0.9598048329353333}]

# 2 传入多个句子
classifier(
    ["I've been waiting for a HuggingFace course my whole life.", "I hate this so much!"]
)
# 结果
# [{'label': 'POSITIVE', 'score': 0.9598048329353333},
#  {'label': 'NEGATIVE', 'score': 0.9994558691978455}]
```

目前支持的 pipeline 见 [Model 中心](https://huggingface.co/models)。
如果不想使用默认模型，可通过 `model` 参数传递对应的模型名称。

```python
from transformers import pipeline

generator = pipeline("text-generation", model="distilgpt2")
generator(
    "In this course, we will teach you how to",
    max_length=30,
    num_return_sequences=2,
)
```

### 2.2 局限性 & 偏见

为了在大规模数据上进行预训练，研究员们会收集尽可能多的数据，这其中可能会夹杂一些意识形态或者价值观的刻板印象。

```python
from transformers import pipeline

unmasker = pipeline("fill-mask", model="bert-base-uncased")
result = unmasker("This man works as a [MASK].")
print([r["token_str"] for r in result])

result = unmasker("This woman works as a [MASK].")
print([r["token_str"] for r in result])
```

```:no-line-numbers
['lawyer', 'carpenter', 'doctor', 'waiter', 'mechanic']
['nurse', 'waitress', 'teacher', 'maid', 'prostitute']
```

观察结果，有明显的性别相关性，妓女成为了“女性工作”相关的前五名答案之一。

::: warning
原始模型中很容易掺杂性别歧视、种族歧视等问题，在模型上进一步微调并不会消除这种偏差。
:::

## 3. Transformer 背景知识

Transformer 架构于 2017 年 6 月推出。大体上可以将 Transformer 模型分为三类：
- GPT-like (自回归（auto-regressive）Transformer 模型)
- BERT-like (自编码（auto-encoding）Transformer 模型) 
- BART/T5-like (序列到序列（sequence-to-sequence）Transformer 模型) 

### 3.1 Transformer 是语言模型（language model）

包括 GPT、BERT、BART、T5 等 Transformer 模型都是语言模型，即他们已经以自监督学习（self-supervised）的方式在大量文本上进行了训练。

这类模型在其进行训练的语料上进行了理解，但是对于具体问题，它就没那么有针对性了，于是我们需要进行迁移学习（transfer learning）。在迁移学习时，对于具体问题，我们使用人工标注的数据以有监督的方式进行精调（fine-tune）。

### 3.2 Transformer 是大模型

实现更好性能的一般策略是增加模型的大小以及预训练的数据量。

<img src=https://huggingface.co/datasets/huggingface-course/documentation-images/resolve/main/en/chapter1/model_parameters.png width=60% />

### 3.3 迁移学习（Transfer Learning）

预训练（Pretraining）指从头开始训练模型。这往往需要使用大规模语料，花费长达数周的时间。

微调（Fine-tuning）是在预训练好的模型上进行进一步的训练。要进行微调，你需要使用预训练模型以及针对特定任务的数据集再次进行训练。进行微调可以有效降低时间、设备成本，使用更小的数据集完成。

## 4. Transformer 结构

::: info 扩展阅读
推荐 [The Illustrated Transformer](http://jalammar.github.io/illustrated-transformer/) 这篇文章。在该文章中，作者使用动图清晰地描述了 Transformer 的结构和原理。
:::

Transformer 主要由两部分组成：
- Encoders (编码器): 编码器接收输入并构建其表示（即特征）。这意味着对模型进行了优化，以从输入中获得理解。
- Decoders (解码器): 解码器使用编码器的表示（特征）以及其他输入来生成目标序列。这意味着该模型已针对生成输出进行了优化。

这两部分可以单独使用，这取决于你要做什么任务：
- **Encoder-only 模型（auto-encoding models）**：适用于需要理解输入的任务，如句子分类和命名实体识别。
    
    这类模型有 [ALBERT](https://huggingface.co/docs/transformers/model_doc/albert), [BERT](https://huggingface.co/docs/transformers/model_doc/bert), [DistillBERT](https://huggingface.co/docs/transformers/model_doc/distilbert), [ELECTRA](https://huggingface.co/docs/transformers/model_doc/electra), [RoBERTa](https://huggingface.co/docs/transformers/model_doc/roberta)

- **Decoder-only 模型（auto-regressive models）**：适用于生成任务，如文本生成。

    这类模型有 [CTRL](https://huggingface.co/docs/transformers/model_doc/ctrl), [GPT](https://huggingface.co/docs/transformers/model_doc/openai-gpt), [GPT-2](https://huggingface.co/docs/transformers/model_doc/gpt2), [Transformer XL](https://huggingface.co/docs/transformers/model_doc/transfo-xl)

- **Encoder-decoder 模型（sequence-to-sequence models）**：适用于需要根据输入进行生成的任务，如翻译或摘要。预训练这类模型可以使用 encode 或 decoder 的目标。

    这类模型有 [BART](https://huggingface.co/docs/transformers/model_doc/bart), [mBART](https://huggingface.co/docs/transformers/model_doc/mbart), [Marian](https://huggingface.co/docs/transformers/model_doc/marian), [T5](https://huggingface.co/docs/transformers/model_doc/t5)

### 4.1 注意力层（Attention Layers）

注意力层使得模型对不同位置的字词有着不同的关注程度。

比如，在做文本翻译任务时，将 "I like eating apples" 翻译成中文，在翻译 like 时，模型需要关注 I 和 eating 来获得正确的翻译，而对 apples 的关注度可能小一些；翻译 "It feels like a soft blanket" 时，关注 feels 会帮助模型获得正确的翻译。

### 4.2 原始模型

Transformer 最开始是为了翻译任务而设计的。

在训练过程中，encoder 和 decoder 分别接收两种语言的同一个句子。encoder 使用注意力层，可以“看到”该句子中的全部字词。而 decoder 只能看到已经翻译好的字词（即在正在被翻译的字词之前已经生成的部分）。 比如 decoder 已经生成了3个单词，在生成第4个单词时，我们会把前三个单词也作为输入，连同 encoder 输出的部分一起作为 decoder 的输入来生成第4个单词。

为了加快训练，我们会喂给 decoder 完整的目标，但是不允许它使用没有预测的词汇。例如，我们正在预测第4个单词，但是模型看到了目标中的第4个单词，显然这样的模型在实际中不会获得好的效果。

最初的 Transformer 结构如下：

![](/images/huggingface/section1/transformers.svg)

注意，在 decoder 中，第一个注意力层关注所有 decoder 的过去的输入，第二个注意力层，使用了来自 encoder 的输出。因此它能够获得完整的输入句子来对当前词语进行最佳预测。

我们还可以使用注意力遮罩层（attention mask）以使得模型关注某些表示。比如，在批处理句子时，会使用填充的方式使句子长度保持一致，填充的内容无意义，我们不希望模型关注它。



## 5. 小结

本节内容介绍了 NLP 任务以及如何使用 🤗 Transformers 中的 `pipeline()` 函数来执行不同的 NLP 任务。你可以在[模型中心](https://huggingface.co/models)中查找模型，按照 Model Card 中的说明或者使用页面上的 inference API 进行使用。

我们简单介绍了 Transformer 的结构，如果你想做进一步了解，推荐阅读 [The Illustrated Transformer](http://jalammar.github.io/illustrated-transformer/)。