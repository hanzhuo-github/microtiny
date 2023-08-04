---
lang: zh-CN
title: 2. 使用 🤗 Transformers
article: false
---

Transformer 模型一般都很大，训练或者部署是一项复杂的任务。🤗 Transformers 库提供了简单的API，使得用户可以通过它来加载、训练、保存所有的 Transformer 模型。

我们将使用 model 和 tokenizer 来实现在上一节中 `pipeline()` 函数完成的任务。然后会介绍 model API，看一看 model 类和 configuration 类，了解如何加载模型、它是怎么处理数字输入并输出预测的。

接下来还有 tokenizer API。tokenizer 负责将文本转成数字表示（以作为神经网络的输入），并负责将数字表示转化成文本。我们还会展示如何批处理多个句子。

## 1. Pipeline 都做了什么

上一节中提到的 `pipeline()` 函数实际上经过了以下几个步骤：预处理、将输入传递给模型、后处理

![](/images/huggingface/section1/full_nlp_pipeline.svg)

### 1.1 使用 tokenizer 进行预处理

Transformer 模型不能直接处理原始文本，于是要先将文本输入转换成数字表示。实际上，Transformer 模型只接收 tensor 作为输入。

tokenizer 的处理步骤：
- 将文本切分成 `tokens` (可能是 words, subwords, 或者 symbols)
- 将每一个 `token` 映射到一个数字上
- 添加可能对模型有用的其他输入

显然，使用模型进行预测时使用的上述操作应该和预训练时的操作一致。我们可以使用 `AutoTokenizer` 类以及它的 `from_pretrained()` 函数来实现这一点。使用模型的 checkpoints 名称，它会下载对应模型的 tokenizer 并缓存下来。


在上一节中，我们使用了 sentiment-analysis
```python
from transformers import pipeline

classifier = pipeline("sentiment-analysis")
classifier(
    [
        "I've been waiting for a HuggingFace course my whole life.",
        "I hate this so much!",
    ]
)
```

上面模型的默认 checkpoints 是 sentiment-analysis pipeline is distilbert-base-uncased-finetuned-sst-2-english，使用 AutoTokenizer 创建 tokenizer 对象

```python
from transformers import AutoTokenizer

checkpoint = "distilbert-base-uncased-finetuned-sst-2-english"
tokenizer = AutoTokenizer.from_pretrained(checkpoint)
```

将文本传递给 tokenizer
```python
raw_inputs = [
    "I've been waiting for a HuggingFace course my whole life.",
    "I hate this so much!",
]

# padding, truncation 会在之后介绍；return_tensors 为 pt, 即 pytorch
inputs = tokenizer(raw_inputs, padding=True, truncation=True, return_tensors="pt")
print(inputs)
```

```:no-line-numbers
{
    'input_ids': tensor([
        [  101,  1045,  1005,  2310,  2042,  3403,  2005,  1037, 17662, 12172, 2607,  2026,  2878,  2166,  1012,   102],
        [  101,  1045,  5223,  2023,  2061,  2172,   999,   102,     0,     0,     0,     0,     0,     0,     0,     0]
    ]), 
    'attention_mask': tensor([
        [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
        [1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0]
    ])
}
```

### 1.2 model

与 `AutoTokenizer` 类似，🤗 Transformers 库还提供了 `AutoModel` class，它也有 `from_pretrained()` 方法。

```python
from transformers import AutoModel

checkpoint = "distilbert-base-uncased-finetuned-sst-2-english"
model = AutoModel.from_pretrained(checkpoint)
```

上面的代码下载了 distilbert-base-uncased-finetuned-sst-2-english 的 checkpoints （如果还在同一环境中，那么它在之前已经被缓存了），并实例化了对应的模型。

这个架构只包括最基本的 Transformer 模块，即下图中 Transformer Network 部分。

![](/images/huggingface/section1/transformer_and_head.svg)

:::info 注意
Transformer Network 即我们在上一节中谈到的 Transformer 架构，这里只是画成 Embedding + Layers
:::

当然 🤗 Transformers 还提供了不同的架构。下面列举了一部分
- *Model (retrieve the hidden states)
- *ForCausalLM
- *ForMaskedLM
- *ForMultipleChoice
- *ForQuestionAnswering
- *ForSequenceClassification
- *ForTokenClassification
- and others 🤗

#### 1.2.1 Model 输出（hidden states 或 features）：高维张量

Transformer 模块输出的张量通常很大，它有以下三个维度：
- Batch size: 每次处理的序列长度（上述例子中为2）
- Sequence length: 序列的数字表示的长度（上述例子中为16）
- Hidden size: 每个模型输入的张量维度。通常很大（小模型可能是768，在大一些的模型中可能是3072甚至更大）

我们将上面使用 tokenizer 得到的输入传递给 model，看看它的输出
```python
outputs = model(**inputs)
print(outputs.last_hidden_state.shape)
```

```:no-line-numbers
torch.Size([2, 16, 768])
```

#### 1.2.2 Model heads

Model heads 通常有一层或多层线性层组成，以 hidden states 作为输入，将这些高维张量映射到不同的维度上。

我们需要一个有序列分类（sequence classification）head 的模型，于是我们不用 `AutoModel` 类，我们使用 `AutoModelForSequenceClassification`。

```python
from transformers import AutoModelForSequenceClassification

checkpoint = "distilbert-base-uncased-finetuned-sst-2-english"
model = AutoModelForSequenceClassification.from_pretrained(checkpoint)
outputs = model(**inputs)

print(outputs.logits.shape)
```

```:no-line-numbers
torch.Size([2, 2])
```

我们分析的是两个句子，判断每个句子是 positive 还是 negative，所以输出维度是 2x2

### 1.3 后处理

```python
print(outputs.logits)
```

```:no-line-numbers
tensor([[-1.5607,  1.6123],
        [ 4.1692, -3.3464]], grad_fn=<AddmmBackward>)
```

对于第一个句子，我们预测的是 [-1.5607,  1.6123]，这是logits（所有的 🤗 Transformers 模型输出的都是 logits）。实际上我们更希望得到类似于概率的结果，于是我们将它输入至 SoftMax 层中。

```python
import torch

predictions = torch.nn.functional.softmax(outputs.logits, dim=-1)
print(predictions)
```

```:no-line-numbers
tensor([[4.0195e-02, 9.5980e-01],
        [9.9946e-01, 5.4418e-04]], grad_fn=<SoftmaxBackward0>)
```

我们可以通过查看 model config 的 id2label 属性来查看对应的 label 

```python
model.config.id2label
```

```:no-line-numbers
{0: 'NEGATIVE', 1: 'POSITIVE'}
```

到此为止，我们通过三个步骤（使用 tokenizer 进行预处理，将输入传递给 model，后处理）得到最终的结论：
- 第一个句子: NEGATIVE: 0.0402, POSITIVE: 0.9598
- 第二个句子: NEGATIVE: 0.9995, POSITIVE: 0.0005


## 2. Models

我们详细介绍下 model。`AutoModel` 类可以根据 checkpoint 来实例化任何模型。它根据 checkpoint 来确定模型结构，并实例化模型。如果你确切知道你想使用什么类型的模型，你可以直接使用对应的 model 类。

下面将使用 BERT model。

### 2.1 创建 Transformer

初始化 BERT 模型的第一步是加载配置对象。

```python
from transformers import BertConfig, BertModel

config = BertConfig()
model = BertModel(config)
```

配置中包含很多建立模型要用到的属性。
:::details 打印 config 的内容
```:no-line-numbers{5,7,9-12}
BertConfig {
  "attention_probs_dropout_prob": 0.1,
  "classifier_dropout": null,
  "hidden_act": "gelu",
  "hidden_dropout_prob": 0.1,
  "hidden_size": 768,
  "initializer_range": 0.02,
  "intermediate_size": 3072,
  "layer_norm_eps": 1e-12,
  "max_position_embeddings": 512,
  "model_type": "bert",
  "num_attention_heads": 12,
  "num_hidden_layers": 12,
  "pad_token_id": 0,
  "position_embedding_type": "absolute",
  "transformers_version": "4.29.1",
  "type_vocab_size": 2,
  "use_cache": true,
  "vocab_size": 30522
}
```
:::

#### 2.1.1 不同的加载方法

使用默认的配置来创建 model 时，model 会被随机初始化。

你可以直接使用随机初始化的 model，不过使用效果肯定很差，而重新训练又需要大量的时间和数据。我们不妨加载已经训练好的模型，这要用到 `from_pretrained()` 方法。

```python
from transformers import BertModel

model = BertModel.from_trained("bert-base-cased")
```

当然你也可以将 BertModel 替换为 AutoModel 
```python
from transformers import AutoModel

model = AutoModel.from_trained("bert-base-cased")
```

你可以在这个 [model card](https://huggingface.co/bert-base-cased) 中查看 BERT 模型的更多细节。

:::tip
缓存路径为 ~/.cache/huggingface/modules 你可以通过设置 `HF_HOME` 环境变量来自定义缓存路径。
:::

#### 2.1.2 保存方法

使用 `save_pretrained()` 方法来保存模型
```python
model.save_pretrained("directory_on_my_computer")
```

这会保存两个文件
```
ls directory_on_my_computer
config.json pytorch_model.bin
```

你可以在 config.json 中看到建立模型所需的属性。该文件中也有一些 metadata，比如 checkpoint 的来源或路径、你最后一次保存 checkpoint 时使用的 🤗 Transformers 版本

python_model.bin 被称为状态字典（state dictionary）。其中记录了模型的权重。

这两个文件相辅相成，config.json 提供了模型的架构信息，python_model.bin 提供了模型权重。


### 2.2 使用 Transformer 进行推理（inference）

在 2.1 中你已经看到了如何加载以及保存使用模型，下面我们来使用模型进行预测。

在 1.1 中，我们已经过如何使用 tokenizer 将文本转化为张量，它将输入的文本转化为数字：

:::details 获得 input IDs: model_input
给定文本：
```python:no-line-numbers
sequences = ["Hello!", "Cool.", "Nice!"]
```

经 tokenizer 获得 input IDs:
```python:no-line-numbers
encoded_sequences = [
    [101, 7592, 999, 102],
    [101, 4658, 1012, 102],
    [101, 3835, 999, 102],
]
```

Transformer 只接收 tensor，将上面的 list 转化成 tensor：
```python
import torch

model_inputs = torch.tensor(encoded_sequences)
```
:::

现在可以将 model_input 传递给 model 了

```python
output = model(model_inputs)
```

model 可以接收很多参数，其中 input IDs 只必传的。我们将在未来在讨论其他参数。


## 3. Tokenizers

模型只能处理数字，tokenizer 的作用是将文本转化为模型可以处理的数字。它的目标是找到最有意义的表示，并尽可能小。

下面介绍几种 tokenization 算法。

### 3.1 tokenization 算法

#### 3.1.1 Word-based

可以使用空格来将句子切分为字词：
```python
tokenized_text = "Jim Henson was a puppeteer".split()
print(tokenized_text)
# res
# ['Jim', 'Henson', 'was', 'a', 'puppeteer']
```

也有针对标点符号增加了额外规则的 tokenizer。

使用 word-based tokenizer，我们最终会得到一个非常大的词汇表，此表的大小由语料中的独立 token 数决定。每个字词都被分配了一个 ID，从 0 到整个词表大小。模型使用这些 ID 来表示每个字词。

如果我们想使用这种 tokenizer 来覆盖某门语言，那将会生成大量 token。例如，英语中有 500,000 个单词，于是构建每个单词到 input_id 的映射要有 500,000 个。除此之外，'dog' 和 'dogs', 'run' 和 'running' 会被分别构建不同的 input_id, 没有体现出它们之间的相似与联系。

另外，我们还需要自定义一个 token 来表示不在词表中的字词，也就是 'unknown' token。一般用 '[UNK]' 或 '' 表示。如果某个 tokenizer 产生了大量 unknown token，这意味着它无法检索到一个词的合理表示，且你在这个过程中丢失了信息。我们希望 tokenizer 会将尽量少的字词标记为 unknown token。

下面介绍 character-based tokenizer，它可以减少 unknown token 的产生。

#### 3.1.2 Character-based

Character-based tokenizer 将文本切分成 characters，而不是 words。这样做有两点好处：
- 词表将有效地减小
- unknown tokens 也会减少（因为每个字词都是通过 character 构建的）

当然，这也会产生一些问题。首先，character 可能本身没有含义（相对于 word 来说。但也因语言而异，比如中文字符会比拉丁系语言的字符携带更多信息）。另外，模型需要处理大量 token（对于 word-based 来说的一个 word 只需要 1 个 token，而使用 character-based，可能有十几个 tokens 要处理）、

考虑到上面两种技术，又提出了第三种方式：subword tokenization

#### 3.1.3 Subword tokenization

subword tokenization 的原则是：经常使用的词不应该再被切分为更小的子词，比较少用的词可以分解为有意义的子词。

比如：annoyingly 可能被切分成 annoy、ing、ly

以下 tokenization 是 subword tokenization：
- Byte-level BPE, GPT-2 使用这种方式
- WordPiece, BERT 使用这种方式
- SentencePiece or Unigram, 在一些多语言模型中使用
- ...

### 3.2 加载 & 保存

加载和保存 tokenizer 分别使用方法 `from_pretrained()` 和 `save_pretrained()`. 使用该方法会加载或保存 tokenizer 使用的算法（类似于 model 的 architecture），还会加载或保存对应的词表（类似于 model 的 weight）

加载 BERT 的 tokenizer
```python
from transformers import BertTokenizer

tokenizer = BertTokenizer.from_pretrained("bert-base-cased")
```

也可以使用 `AutoTokenizer`
```python
from transformers import AutoTokenizer

tokenizer = AutoTokenizer.from_pretrained("bert-base-cased")
```

然后我们就可以使用 tokenizer 将文本转化成 input_ids
```python
tokenizer("Using a Transformer network is simple")
# result:
# {'input_ids': [101, 7993, 170, 11303, 1200, 2443, 1110, 3014, 102],
#  'token_type_ids': [0, 0, 0, 0, 0, 0, 0, 0, 0],
#  'attention_mask': [1, 1, 1, 1, 1, 1, 1, 1, 1]}
```

保存 tokenizer
```python
tokenizer.save_pretrained("directory_on_my_computer")
```

我们将在 [Chapter 3](./Chapter3.md) 中来讨论 token_type_ids。并在 [4.3](#_4-3-attention-masks) 中讨论 attention_mask。下面我们先介绍下 input_ids 如何生成，为此我们要查看 tokenizer 的中间方法。

### 3.3 编码（Encoding）

将文本转换成数字的过程叫做编码（Encoding）。Encoding 的分为两步：tokenization，然后转化为 input IDs.

第一步是将文本切分为 tokens。实现这一步有不同的规则（见 3.1），所以我们需要用我们所选的模型的名称来实例化 tokenizer，以确保使用和预训练时相同的规则。

第二步是将 tokens 转化为数字表示，所以我们可以用它们构建张量并把张量提供给模型。为了实现这一步骤，tokenizer 需要一个词表（vocabulary），我们在使用 `from_pretrained()` 来实例化 tokenizer 的时候已经下载好了。同样地，这个词表和预训练时的词表是相同的。

下面分别介绍这两步。注意，在使用过程中直接调用 tokenizer 就可以，下面的分步调用只是为了让大家更清楚 encoding 的两个步骤分别做了什么。

#### 3.3.1 Tokenization

Tokenization 过程可以使用 tokenizer 的 `tokenize()` 方法实现：

```python
from transformers import AutoTokenizer

tokenizer = AutoTokenizer.from_pretrained("bert-based-cased")

sequence = "Using a Transformer network is simple"
tokens = tokenizer.tokenize(sequence)
print(tokens)
# result:
# ['Using', 'a', 'transform', '##er', 'network', 'is', 'simple']
```

#### 3.3.2 将 tokens 转换为 input IDs

该过程通过 `convert_tokens_to_ids()` 实现。

```python
ids = tokenizer.convert_tokens_to_ids(tokens)
print(ids)
# result:
# [7993, 170, 11303, 1200, 2443, 1110, 3014]
```

### 3.4 解码（Decoding）

解码（decoding）和编码（encoding）的该过程相反，将词表索引转化成字符串，可以使用 `decode()` 方法来实现

```python
decoded_string = tokenizer.decode([7993, 170, 11303, 1200, 2443, 1110, 3014])
print(decoded_string)
# result:
# 'Using a Transformer network is simple'
```

注意，`decode()` 方不仅将索引转化为了 tokens，还将同一个词中的 tokens 组合在一起了。

### 3.5 小结

通过本章的学习，你应该了解 tokenizer 的原子操作：tokenization、将 tokens 转化成 input_ids、将 ids 转化为字符串。

## 4. 处理多个序列

在之前的例子中，我们对小长度的序列进行了处理。我们需要思考以下问题：
- 如何处理多个序列
- 如何处理*不同长度*的多个序列
- 词汇表索引是唯一能够使模型正常工作的输入吗
- 是否存在序列过长的问题

### 4.1 批处理

```python
import torch
from transformers import AutoTokenizer, AutoModelForSequenceClassification

checkpoint = "distilbert-base-uncased-finetuned-sst-2-english"
tokenizer = AutoTokenizer.from_pretrained(checkpoint)
model = AutoModelForSequenceClassification.from_pretrained(checkpoint)

sequence = "I've been waiting for a HuggingFace course my whole life."

tokens = tokenizer.tokenize(sequence)
ids = tokenizer.convert_tokens_to_ids(tokens)
input_ids = torch.tensor(ids)
# This line will fail.
model(input_ids)
# IndexError: Dimension out of range (expected to be in range of [-1, 0], but got 1)
```

为什么会出错呢？🤗 Transformers 模型默认接收多个句子作为输入，但我们只传递来一个序列。

在此之前我们直接调用 tokenizer 时，在顶部加了一个维度：
```python
tokenized_input = tokenizer(sequence, return_tensors="pt")
print(tokenized_inputs["input_ids"])
# result:
# tensor([[  101,  1045,  1005,  2310,  2042,  3403,  2005,  1037, 17662, 12172,
#           2607,  2026,  2878,  2166,  1012,   102]])
```

:::details tokenizer 可以将序列转化成特定结构的 tensor，通过 return_tensors 参数设置
```python
sequences = ["I've been waiting for a HuggingFace course my whole life.", "So have I!"]

# Returns PyTorch tensors
model_inputs = tokenizer(sequences, padding=True, return_tensors="pt")

# Returns TensorFlow tensors
model_inputs = tokenizer(sequences, padding=True, return_tensors="tf")

# Returns NumPy arrays
model_inputs = tokenizer(sequences, padding=True, return_tensors="np")
```
:::

我们对起初的代码进行修改：
```python{13}
import torch
from transformers import AutoTokenizer, AutoModelForSequenceClassification

checkpoint = "distilbert-base-uncased-finetuned-sst-2-english"
tokenizer = AutoTokenizer.from_pretrained(checkpoint)
model = AutoModelForSequenceClassification.from_pretrained(checkpoint)

sequence = "I've been waiting for a HuggingFace course my whole life."

tokens = tokenizer.tokenize(sequence)
ids = tokenizer.convert_tokens_to_ids(tokens)
input_ids = torch.tensor([ids])
print(input_ids)
# tensor([[ 1045,  1005,  2310,  2042,  3403,  2005,  1037, 17662, 12172,  2607, 2026,  2878,  2166,  1012]])

output = model(input_ids)
print(output.logits)
# tensor([[-2.7276,  2.8789]], grad_fn=<AddmmBackward0>)
```

`Batching` 是指一次向模型传递多个句子

```python
batched_ids = [ids, ids]
```

## 4.2 填充（Padding）

当进行批处理时，如果两个序列的长度不一样怎么办（对于 tensor 来说，它必须是矩阵，即每个序列的表示应该是一样长的），为了解决这个问题，我们将填充（pad）输入。

对于短的序列，我们使用 padding token 来填充，使其和最长的序列一样长。

```python
# 我们无法将这个 batch 转化成 tensor
bached_id_origin = [
    [200, 200, 200],
    [200, 200]
]

padding_id = 100

# 使用 padding 
batched_ids = [
    [200, 200, 200],
    [200, 200, padding_id]
]
```

可以在 `tokenizer.pad_token_id` 中获取 padding token id。

```python
model = AutoModelForSequenceClassification.from_pretrained(checkpoint)

sequence1_ids = [[200, 200, 200]]
sequence2_ids = [[200, 200]]
batched_ids = [
    [200, 200, 200],
    [200, 200, tokenizer.pad_token_id],
]

print(model(torch.tensor(sequence1_ids)).logits)
print(model(torch.tensor(sequence2_ids)).logits)
print(model(torch.tensor(batched_ids)).logits)
```
```:no-line-numbers
tensor([[ 1.5694, -1.3895]], grad_fn=<AddmmBackward0>)
tensor([[ 0.5803, -0.4125]], grad_fn=<AddmmBackward0>)
tensor([[ 1.5694, -1.3895],
        [ 1.3374, -1.2163]], grad_fn=<AddmmBackward0>)
```

观察上面的结果，batched_ids 的结果的第二行与 sequence2_ids 的结果不一样，这显然是不应该的。

造成不一致是因为，Transformer 中的 attention layers 将每个 token 都作为上下文考虑进去了。那么 padding tokens 也会被考虑进去。如果想让两次的结果相同，需要告诉 attention layer 忽略 padding tokens。这要通过 attention mask 来实现。

### 4.3 Attention Masks

attention mask 也是 tensor，它和 input IDs tensor 结构相同，元素只有 0 和 1：0 表示该位置是 padding tokens，attention layers 应该忽略它。

我们将 attention_mask 作为参数传递给 model，再观察结果，和 sequence2_ids 的结果一致了：
```python
batched_ids = [
    [200, 200, 200],
    [200, 200, tokenizer.pad_token_id],
]
attention_mask = [
    [1, 1, 1],
    [1, 1, 0]
]
print(model(torch.tensor(batched_ids), attention_mask=torch.tensor(attention_mask)).logits)
# tensor([[ 1.5694, -1.3895],
#         [ 0.5803, -0.4125]], grad_fn=<AddmmBackward0>)
```

```python
sequences = ["I've been waiting for a HuggingFace course my whole life.", "So have I!"]

model_inputs = tokenizer(sequences)
print(model_inputs)

# Will pad the sequences up to the maximum sequence length
model_inputs = tokenizer(sequences, padding="longest")
print(model_inputs)

# Will pad the sequences up to the model max length
# (512 for BERT or DistilBERT)
model_inputs = tokenizer(sequences, padding="max_length")
print(model_inputs)

# Will pad the sequences up to the specified max length
model_inputs = tokenizer(sequences, padding="max_length", max_length=8)
print(model_inputs)
```

:::details 输出
```python:no-line-numbers
{'input_ids': [[101, 1045, 1005, 2310, 2042, 3403, 2005, 1037, 17662, 12172, 2607, 2026, 2878, 2166, 1012, 102], [101, 2061, 2031, 1045, 999, 102]], 'attention_mask': [[1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1], [1, 1, 1, 1, 1, 1]]}

{'input_ids': [[101, 1045, 1005, 2310, 2042, 3403, 2005, 1037, 17662, 12172, 2607, 2026, 2878, 2166, 1012, 102], [101, 2061, 2031, 1045, 999, 102, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]], 'attention_mask': [[1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1], [1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]]}

{'input_ids': [[101, 1045, 1005, 2310, 2042, 3403, 2005, 1037, 17662, 12172, 2607, 2026, 2878, 2166, 1012, 102, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0], [101, 2061, 2031, 1045, 999, 102, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]], 'attention_mask': [[1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0], [1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]]}

{'input_ids': [[101, 1045, 1005, 2310, 2042, 3403, 2005, 1037, 17662, 12172, 2607, 2026, 2878, 2166, 1012, 102], [101, 2061, 2031, 1045, 999, 102, 0, 0]], 'attention_mask': [[1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1], [1, 1, 1, 1, 1, 1, 0, 0]]}
```
:::
### 4.4 长序列

Transformer 模型能处理的序列长度是有限的，大都在 512 至 1024 个 tokens 之间。如果传入了大于最大限度的序列会崩溃，有两种方式来解决这个问题：
- 换用支持更长序列的模型。像 [Longformer](https://huggingface.co/docs/transformers/model_doc/longformer) 和 [LED](https://huggingface.co/docs/transformers/model_doc/led) 就能处理比较长的序列。
- 截断序列。
```python
sequence = sequence[:max_sequence_length]
```

可以使用 tokenizer 进行截断
```python
sequences = ["I've been waiting for a HuggingFace course my whole life.", "So have I!"]

# Will truncate the sequences that are longer than the model max length
# (512 for BERT or DistilBERT)
model_inputs = tokenizer(sequences, truncation=True)
print(model_inputs)

# Will truncate the sequences that are longer than the specified max length
model_inputs = tokenizer(sequences, max_length=8, truncation=True)
print(model_inputs)
```
```python:no-line-numbers
{'input_ids': [[101, 1045, 1005, 2310, 2042, 3403, 2005, 1037, 17662, 12172, 2607, 2026, 2878, 2166, 1012, 102], [101, 2061, 2031, 1045, 999, 102]], 'attention_mask': [[1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1], [1, 1, 1, 1, 1, 1]]}
{'input_ids': [[101, 1045, 1005, 2310, 2042, 3403, 2005, 102], [101, 2061, 2031, 1045, 999, 102]], 'attention_mask': [[1, 1, 1, 1, 1, 1, 1, 1], [1, 1, 1, 1, 1, 1]]}
```

## 5. Tokenizer API

我们可以使用 tokenizer 来 padding、truncate 序列，也可以指定 return_tensors 的类型（4 中已有对应示例）。

### 5.1 特殊 token

```python
sequence = "I've been waiting for a HuggingFace course my whole life."

model_inputs = tokenizer(sequence)
print(model_inputs["input_ids"])

tokens = tokenizer.tokenize(sequence)
ids = tokenizer.convert_tokens_to_ids(tokens)
print(ids)
```
```python:no-line-numbers
[101, 1045, 1005, 2310, 2042, 3403, 2005, 1037, 17662, 12172, 2607, 2026, 2878, 2166, 1012, 102]
[1045, 1005, 2310, 2042, 3403, 2005, 1037, 17662, 12172, 2607, 2026, 2878, 2166, 1012]
```

首位各添加了一个 token ID，我们将其进行 decode：
```python
print(tokenizer.decode(model_inputs["input_ids"]))
print(tokenizer.decode(ids))
```
```python:no-line-numbers
"[CLS] i've been waiting for a huggingface course my whole life. [SEP]"
"i've been waiting for a huggingface course my whole life."
```

tokenizer 添加了两个特殊词 “[CLS]” 和 “[SEP]”。这是在预训练时使用的，所以我们在使用该模型做推理的时候也应该在首尾加上它们。不同的模型会使用不同的特殊词，有些模型不用特殊词，有些模型只在句首加特殊词，有些模型只在句尾加特殊词。不论如何，tokenizer 总是知道应该是怎样的，并会为你处理好它。

### 5.2 小结

最后让我们看一看如何使用 tokenizer 和 model 来进行 inference，我们使用了 padding（为了批处理），使用了 truncate（为了处理长序列）。

```python
import torch
from transformers import AutoTokenizer, AutoModelForSequenceClassification

checkpoint = "distilbert-base-uncased-finetuned-sst-2-english"
tokenizer = AutoTokenizer.from_pretrained(checkpoint)
model = AutoModelForSequenceClassification.from_pretrained(checkpoint)
sequences = ["I've been waiting for a HuggingFace course my whole life.", "So have I!"]

tokens = tokenizer(sequences, padding=True, truncation=True, return_tensors="pt")
output = model(**tokens)
```

## 总结
- Transformer 的基本结构
- tokenization pipeline 的组成
- 如何使用 Transformer model
- 如何利用 tokenizer 将文本转化为 tensor
- 使用 tokenizer 和 model 来进行推理
- input IDs 的限制，了解 attention masks
- 尝试了多种可配置的 tokenizer 方法