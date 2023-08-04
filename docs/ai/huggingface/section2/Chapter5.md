---
lang: zh-CN
title: 5. 🤗 Datasets 库
description:
article: false
---

在[第三章](../section1/Chapter3.md)中我们初步体验了 🤗 Datasets 库，了解 fine-tune 的基本步骤：
1. 从 Hugging Face Hub 上加载数据集
2. 使用 `Dataset.map()` 预处理数据
3. 加载并计算 metrics

在本章内容中，我们将深入了解 🤗 Datasets 库，你将能够回答以下问题：
- 数据集不在 hub 上应该怎么做
- 如何对数据集进行切片（如果你确实需要使用 Pandas 怎么办）
- 如果你的数据集很大，会撑爆你的 RAM 应该怎么办
- Memory Mapping、Apache Arrow 是什么
- 如何创建自己的数据集并将其推至 Hub

## 1. 处理不在 Hugging Face Hub 上的数据集

🤗 Datasets 提供了加载本地和远程数据集的方法，支持下列格式：

|Data format|Loading script|Example|
|:--|:--|:--|
|CSV & TSV|csv|load_dataset("csv", data_files="my_file.csv")|
|Text files|text|load_dataset("text", data_files="my_file.txt")|
|JSON & JSON Lines|json|load_dataset("json", data_files="my_file.jsonl")|
|Pickled DataFrames|pandas|load_dataset("pandas", data_files="my_dataframe.pkl")|

### 1.1 加载本地数据集

我们使用 [SQuAD-it dataset](https://github.com/crux82/squad-it/)，它是大规模意大利语问答数据集。

:::details Ubuntu 下载并解压
```shell
!wget https://github.com/crux82/squad-it/raw/master/SQuAD_it-train.json.gz
!wget https://github.com/crux82/squad-it/raw/master/SQuAD_it-test.json.gz

!gzip -dkv SQuAD_it-*.json.gz
```
:::

```python
from datasets import load_dataset

squad_it_dataset = load_dataset("json", data_files="SQuAD_it-train.json", field="data")
squad_it_dataset
```

```:no-line-numbers
DatasetDict({
    train: Dataset({
        features: ['paragraphs', 'title'],
        num_rows: 442
    })
})
```

加载本地文件会创建一个带有 `train` 的 `DatasetDict` 对象。我们可以通过下标查看几个示例如：`squad_it_dataset["train"][0]`。

如何获得同时有 `train` 和 `test` 的 `DatasetDict` 对象呢？

```python
data_files = {"train": "SQuAD_it-train.json", "test": "SQuAD_it-test.json"}
squad_it_dataset = load_dataset("json", data_files=data_files, field="data")
squad_it_dataset
```

```no-line-numbers
DatasetDict({
    train: Dataset({
        features: ['paragraphs', 'title'],
        num_rows: 442
    })
    test: Dataset({
        features: ['paragraphs', 'title'],
        num_rows: 48
    })
})
```

:::tip
data_files 参数很灵活，可以是单个文件路径、文件路径 list、映射名称路径的字典，还可以使用 Unix shell 的匹配规则选择多有满足规则的文件（如 `data_files="*.json"` 匹配所有的 json 文件）。
:::

🤗 Datasets 的 loading script 支持自动解压，所以我们可以跳过自己解压的过程，直接使用下面的代码加载数据：
```python
data_files = {"train": "SQuAD_it-train.json.gz", "test": "SQuAD_it-test.json.gz"}
squad_it_dataset = load_dataset("json", data_files=data_files, field="data")
```


### 1.2 加载远程数据集

将 `data_files` 设置为 url 即可。

```python
url = "https://github.com/crux82/squad-it/raw/master/"
data_files = {
    "train": url + "SQuAD_it-train.json.gz",
    "test": url + "SQuAD_it-test.json.gz",
}
squad_it_dataset = load_dataset("json", data_files=data_files, field="data")
```

## 2. 切片

### 2.1 Slicing and dicing 数据

和 Pandas 类似，🤗 Datasets 也提供了一些函数处理 `Dataset` 和 `DatasetDict` 对象。在[第三章](../section1/Chapter3.md)中我们介绍了 `Dataset.map()`，本章我们将介绍其他函数。

接下来我们使用的数据集为 [Drug Review Dataset](https://archive.ics.uci.edu/dataset/462/drug+review+dataset+drugs+com)。

TSV 是 CSV 的变体，它和 CSV 的区别在于 CSV 用逗号作为分割符，而 TSV 使用制表符作为分隔符。所以我们可以使用 csv 加载的方式并指定 delimiter。

```python
from datasets import load_dataset

data_files = {"train": "drugLibTrain_raw.tsv", "test": "drugLibTest_raw.tsv"}
drug_dataset = load_dataset("csv", data_files=data_files, delimiter="\t")
```

我们可以抽取一些样本来观察，以对数据有一个直观的认识。可以使用 `Dataset.shuffle()` 和 `Dataset.select()` 来随机抽取样本。

```python
drug_sample = drug_dataset["train"].shuffle().select(range(1000))

# 选取前面几个样本
drug_sample[:3]
```

:::details 运行结果
```:no-line-numbers
{'Unnamed: 0': [1468, 3422, 1444],
 'urlDrugName': ['cymbalta', 'tazorac', 'tirosint'],
 'rating': [9, 5, 4],
 'effectiveness': ['Highly Effective',
  'Moderately Effective',
  'Moderately Effective'],
 'sideEffects': ['No Side Effects',
  'Severe Side Effects',
  'Moderate Side Effects'],
 'condition': ['sever depression',
  'acne',
  'thyroid/total thyroidectomy due to cancer'],
 'benefitsReview': ["This medication saved my life. The depression had gotten so sever that I was unable to function properly. It has made me feel like a 'real' person again. It has not done much for the anxiety, panic, or OCD. The Xanax helps with that area. I will be going to the psychiatrist in 2 weeks for the anxiety, panic, and OCD. Hoping to stay on the Cymbalta. I was on Lexapro 30mg from 2000-2006. Then switched to Celexa (cost reasons) 60mg from 2007-2008. The Celexa just about costed me my life. It was ineffective for the Depression. Try not to take Celexa for cost reasons, Lexapro shows much more promise in its effectiveness.",
  'It exfoliated my skin.',
  'I started taking Tirosint 125mcg 6 weeks ago due to a gluten and caseine allergy. I previously was taking synthroid however, the company couldnt verify the inactive ingredients. So to avoid gluten, caseine, and some really nasty anxiety symptms I switched to the Tirosint. \r\r\n\r\r\nThe anxiety symptoms subsided from 1 attack per day to none. This was great!, but then new symptoms started after three weeks.'],
 'sideEffectsReview': ['Weight gain, which is to be expected when you "feel better"',
  'My skin became extremely dry, irritated, red, and would peel.',
  'I felt dperessed, tired and very sore. My finger joints hurt so bad and to the touch. My back, and legs ached. Then my lower legs, ankles and feet started to swell. it is so bad that I cannot walk upon waking in the morning. If Im on my feet for more than an hour I have to elevate my legs due to the pain and swelling. I also gained alot of weight 8lbs. I\'m a healthy 37 year old woman, I am active with two small boys, and eat an extremley healthy diet due to my Celiacs and Caseine allergies. \r\r\n\r\r\nI recently had my blood levels checked and to my surprise I was taking way too much Tirosint. My Endo said that the swelling and pain wasnt from the Tirosint and that I should see my Primary doctor...REALLY??  I was shocked due to my "hypo" symptoms. Im thinking of returning to Synthroid and switching doctors...'],
 'commentsReview': ['Depression and Anxiety',
  'Use once daily, at night.  Wash face, use toner and leave to dry (10 minutes).  Then apply pea size amount of cream all over face, excluding eye area.  Let soak in (15 minutes), then layer with moisturizer.  Must wear sunscreen daily.',
  '125 mcg Tirosint per day and doubled on Sat and Sun. \r\r\n\r\r\nListen to your body and be persistent with your doctors.']}
```
:::


`Dataset.select()` 需要传入一个可迭代的索引，这里我们传入了 `range(1000)` 从随机打乱的数据集中选取前 1000 个样本。我们可以看出数据集的一些特点了：
- `Unnamed: 0`: 可能是患者的 ID
- `condition`: 描述健康状况的标签，有大写有小写
- 各类 review: 长短不一，混有 Python 行分隔符（\r\n）、html 字符编码（见 🤗 官方示例，如`&#039;`）

下面我们验证一下 Unnamed 0 是患者 ID 的猜想，这里会用到 `Dataset.unique()`：

```python
for split in drug_dataset.keys():
    assert len(drug_dataset[split]) == len(drug_dataset[split].unique("Unnamed: 0"))
```

上面的代码没抛出 `AssertionError`，看来是患者 ID 的这个想法是正确的。我们将该列重命名为 patient_id，这里会用到 `DatasetDict.rename_column()`:

```python
drug_dataset = drug_dataset.rename_column(
    original_column_name="Unnamed: 0", new_column_name="patient_id"
)
```

我们使用 `Dataset.map()` 标准化所有的 condition：
```python
def lowercase_condition(example):
    return {"condition": example["condition"].lower()}


drug_dataset.map(lowercase_condition)
```

```:no-line-numbers
AttributeError: 'NoneType' object has no attribute 'lower'
```

看来我们还需要把 condition 为 None 的数据过滤掉（使用 `Dataset.filter()`）：
```python
drug_dataset = drug_dataset.filter(lambda x: x["condition"] is not None)
```

### 2.2 创建新列

在处理 review 字段时，最好是要统计一下字数。我们就简单基于空格来进行词数统计。

```python
def compute_review_length(example):
    return {"benefit_review_length": len(example["benefitsReview"].split())}

drug_dataset = drug_dataset.map(compute_review_length)
```

这样，我们就增加了 benefit_review_length 列。我们还可以使用 `Dataset.sort()` 以该列为基准做排序
```python
drug_datasets["train"].sort("benefit_review_length")
```

:::tip `Dataset.add_column()`
我们还可以使用 `Dataset.add_column()` 增加列。可以传入 Python list 或 numpy。
:::

review 的词数较少时（极端情况比如只有一个词）对于预测没有提供相对有用的信息。下面我将使用 Dataset.filter() 将少于 30 个词的 review 去掉。

```python
drug_dataset = drug_dataset.filter(lambda x: x["benefit_review_length"] > 30)
print(drug_dataset.num_rows)
```
```:no-line-numbers
{'train': 1445, 'test': 473}
```

review 中还有一些 html 编码，可以使用 Python 的 html module 来解码：
```python
import html

text = "I&#039;m a transformer called BERT"
html.unescape(text)
```

```:no-line-numbers
"I'm a transformer called BERT"
```

```python
drug_dataset = drug_dataset.map(lambda x: { "benefitsReview": html.unescape(x["benefitsReview"])})
```

### 2.3 `map()` 方法

`Dataset.map()` 有一个参数是 `batched`。将其设为 True 后，map 函数将一次处理多个数据（成为一批 a batch），batch size 可以配置，默认情况下为 1000.