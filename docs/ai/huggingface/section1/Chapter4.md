---
lang: zh-CN
title: 4. 共享 Models 和 Tokenizers
description:
article: false
---

[Hugging Face Hub](https://huggingface.co/) 是主网站，我们可以在里面找到各种最新的模型和数据集，也可以上传自己的模型和数据集。

其中的模型不局限于  🤗 Transformers 或者 NLP。你可以自己去探索。

模型都用 Git 进行托管，允许版本控制和重现。另外，在 Hub 上共享模型会自动为该模型部署托管的推理 API。


## 1. 使用预训练模型

如我们要使用 camembert-base checkpoints.

::: code-tabs#python

@tab pipeline

```python
# 使用 pipeline
from transformers import pipeline

camembert_fill_mask = pipeline("fill-mask", model="camembert-base")
results = camembert_fill_mask("Le camembert est <mask> :)")
```

@tab model architecture

```python
# 直接使用 model architecture
from transformers import CamembertTokenizer, CamembertForMaskedLM

tokenizer = CamembertTokenizer.from_pretrained("camembert-base")
model = CamembertForMaskedLM.from_pretrained("camembert-base")
```

@tab Auto* Class

```python Auto*
# 推荐使用 Auto* Class，因为这种实现与 architecture 无关
from transformers import AutoTokenizer, AutoModelForMaskedLM

tokenizer = AutoTokenizer.from_pretrained("camembert-base")
model = AutoModelForMaskedLM.from_pretrained("camembert-base")
```

:::

::: tip
使用预训练模型时，可以在 model card 中查看它是如何训练的，在哪些数据集上训练的，局限性和 bias 。
:::

## 2. 共享预训练模型

创建模型仓库的三种方法：
- 使用 `push_to_hub` API
- 使用 `huggingface_hub` python 库
- 在 web 页面上创建

创建好仓库后，就可以通过 git 或者 git-lfs 上传文件了。

### 2.1 创建模型仓库
#### 2.1.1 使用 `push_to_hub` API

你需要身份令牌一遍 huggingface_hub 知道你的权限。

:::code-tabs

@tab Notebook

```python
from huggingface_hub import notebook_login

notebook_login()
```

@tab Terminal

```python
huggingface-cli login
```

:::

如果你使用 Trainer API 训练模型，将模型上传至 Hub 最简单的方式就是在定义 TrainerArguments 时配置 `push_to_hub=True`

```python
from transformers import TrainerArguments

training_args = TrainerArguments(
    "bert-finetuned-mrpc", save_strategy="epoch", push_to_hub=True
)
```

当你调用 `trainer.train()` 时，Trainer 会在每次保存 model 时（按照上面的配置，是每个 epoch）将你的 model 上传到 Hub 中对应的仓库上。仓库名称为你选择的输出路径（如上面的 bert-finetuned-mrpc），你也可以用 `hub_model_id="a_different_name"` 来设置不同的名称。如果要将 model 上传到你所在的组织下，你可以使用 `hub_model_id="my_organization/mu_repo_name"`。

训练结束后，使用 `trainer.push_to_hub()` 上传最后一版 model。它会生成 model card。

在较低层的实现中，我们可以直接通过 models、tokenizers、configuration 对象的 `push_to_hub()` 方法来访问 Model Hub。这种方式既可以创建仓库，又能将 model 和 tokenizer 文件直接推到仓库中。

首先创建 model 和 tokenizer。
```python
from transformers import AutoModelForMaskedLM, AutoTokenizer

checkpoint = "camembert-base"

model = AutoModelForMaskedLM.from_pretrained(checkpoint)
tokenizer = AutoTokenizer.from_pretrained(checkpoint)
```

你可以训练模型、对模型进行微调、向 tokenizer 中增加 tokens。做完你想做的事情时候，你可以使用 `push_to_hub()` 将 model 推到仓库中

```python
model.push_to_hub("dummy-model")
```

这将会创建名为 dummy-model 的仓库，其中会填上你的 model 文件。

同样，对 tokenizer 也可做同样的操作。现在你的仓库中有了全部所需的文件。
```python
tokenizer.push_to_hub("dummy-model")
```

如果你想将仓库放到组织下：
```python
tokenizer.push_to_hub("dummy-model", organization="huggingface")
```

如果你想使用某个特定的 Hugging Face token：
```python
tokenizer.push_to_hub("dummy-model", organization="huggingface", use_auth_token="<TOKEN>")
```

#### 2.1.2 使用 `huggingface_hub` python 库

你需要使用 CLI 的登录命令
```shell
huggingface-cli login
```

huggingface_hub 库提供了很多方法和类。下面是和仓库创建、删除等有关的方法
```python
from huggingface_hub import (
    # User management
    login,
    logout,
    whoami,

    # Repository creation and management
    create_repo,
    delete_repo,
    update_repo_visibility,

    # And some methods to retrieve/change information about the content
    list_models,
    list_datasets,
    list_metrics,
    list_repo_files,
    upload_file,
    delete_file,
)
```

```python
# 创建仓库
from huggingface_hub import create_repo

create_repo("dummy-model")
# 可以指定 organization
# create_repo("dummy-model", organization="huggingface")
```

除了可以指定 organization，还有一些参数：
- private: 是否对其他人可见
- token: 是否想用给定的 token 覆盖缓存中的 token
- repo_type: 是都要创建 dataset 或 space（而非创建 model）。接受的值可以是 “dataset” 或 “space”


#### 2.1.3 使用 web 页面

这里不展开介绍，按照页面提示进行即可。

### 2.2 上传 model files

Hugging Face Hub 的文件管理系统基于 git（对于 regular files）和 git-lfs（对于大文件，large file storage）。

下面我们将介绍三种上传文件到 Hub 的方法。

#### 2.3.1 `upload_file` 方法

使用 `upload_file()` 不需要 git 或 git-lfs，它使用 http post 请求将文件直接传到 🤗 Hub。但是它没有办法处理 5GB 以上的文件。

```python
from huggingface_hub import upload_file

upload_file(
    "<path_to_file>/config.json",
    path_in_repo="config.json",
    repo_id="<namespace>/dummy-model",
)
```

还有一些其他的参数：
- token
- repo_type

#### 2.3.2 `Repository` 类

`Repository` 类以于 git 的方式管理本地仓库。使用该类需要安装 git 和 git-lfs

:::details 安装 git-lfs

参考 [Git Large File Storage](https://git-lfs.com/)

::: code-tabs#shell
@tab Ubuntu
```shell
curl -s https://packagecloud.io/install/repositories/github/git-lfs/script.deb.sh | sudo bash
sudo apt-get install git-lfs
```
@tab Mac
```shell
brew install git-lfs
```
:::

:::

我们使用刚刚建好的仓库。首先我们克隆远端仓库：
```python
from huggingface_hub import Repository

repo = Repository("<path_to_dummy_folder>", clone_from="<namespace>/dummy-model")
```

这将在本地创建文件夹<path_to_dummy_folder>。该文件夹中包含 .gitattributes 文件。


我们还会使用一些传统的 git 方法，参考[文档](https://github.com/huggingface/huggingface_hub/tree/main/src/huggingface_hub#advanced-programmatic-repository-management)：
```python:no-line-numbers
repo.git_pull()
repo.git_add()
repo.git_commit()
repo.git_push()
repo.git_tag()
```

现在我们有想要推到 Hub 上的 model 和 tokenizer，并成功 clone 了仓库。

首先，确保我们本地 clone 的版本是最新的：
```python
repo.git_pull()
```

然后我们就可以保存 model 和 tokenizer files 了：
```python
model.save_pretrained("<path_to_dummy_folder>")
tokenizer.save_pretrained("<path_to_dummy_folder>")
```

目前，<path_to_dummy_folder> 中包含了全部的 model 和 tokenizer files。接下来可以使用传统的 git 工作流将他们推到远端 hub：
```python
repo.git_add()
repo.git_commit("Add model and tokenizer files")
repo.git_push()
```

#### 2.3.3 `git-based` 方法

直接使用 git 和 git-lfs 来上传文件。请确保安装了 git 和 git-lfs。

首先，初始化 git-lfs
```shell:no-line-numbers
git lfs install
```

接下来，第一步是克隆 model 仓库：
```shell:no-line-numbers
git clone https://huggingface.co/<namespace>/<your-model-id>
```

例如，我的 username 是 hanzhuo，使用的 model name 是 dummy-model
```shell:no-line-numbers
git clone https://huggingface.co/hanzhuo/dummy-model
```

现在我的工作路径中有一个 dummy-model 文件夹，
```shell:no-line-numbers
cd dummy-model && ls
```

可以使用 git 来添加小文件，对于大文件，需要使用 git-lfs。

回顾一下之前获得 model 和 tokenizer 的方式：
```python
from transformers import AutoModelForMaskedLM, AutoTokenizer

checkpoint = "camembert-base"

model = AutoModelForMaskedLM.from_pretrained(checkpoint)
tokenizer = AutoTokenizer.from_pretrained(checkpoint)

# Do whatever with the model, train it, fine-tune it...

model.save_pretrained("<path_to_dummy_folder>")
tokenizer.save_pretrained("<path_to_dummy_folder>")
```

我们看一下 dummy-model 下的文件目录：
```:no-line-numbers
config.json  pytorch_model.bin  README.md  sentencepiece.bpe.model  special_tokens_map.json tokenizer_config.json  tokenizer.json
```

如果使用 `ls -lh` 命令，可以发现 pytorch_model.bin 的大小超过了 400MB。

接下来使用常规的 git 命令：

```shell:no-line-numbers
git add .
git status
```

```:no-line-numbers
On branch main
Your branch is up to date with 'origin/main'.

Changes to be committed:
  (use "git restore --staged <file>..." to unstage)
  modified:   .gitattributes
	new file:   config.json
	new file:   pytorch_model.bin
	new file:   sentencepiece.bpe.model
	new file:   special_tokens_map.json
	new file:   tokenizer.json
	new file:   tokenizer_config.json
```


再看一下 git-lfs ：
```shell:no-line-numbers
git lfs status
```

```:no-line-numbers
On branch main
Objects to be pushed to origin/main:


Objects to be committed:

	config.json (Git: bc20ff2)
	pytorch_model.bin (LFS: 35686c2)
	sentencepiece.bpe.model (LFS: 988bc5a)
	special_tokens_map.json (Git: cb23931)
	tokenizer.json (Git: 851ff3e)
	tokenizer_config.json (Git: f0f7783)

Objects not staged for commit:

```

可以观察到 *pytorch_model.bin* 和 *sentencepiece.bpe.model* 使用的 LFS，其余的都是 Git。

最后，commit 并 push
```shell
git commit -m "First model version"
git push
```

## 3. 建立 model card

建立 model card 是通过 *README.md* 来完成的。为了理解 model card 的重要作用，你可以阅读 [Model Cards for Model Reporting](https://arxiv.org/abs/1810.03993)。

model card 通常开篇为简短的概述说明其用途，然后是以下几部分：
- Model description 描述
- Intended uses & limitations 预期用途和限制
- How to use  如何使用
- Limitations and bias 局限性和偏见
- Training data  训练数据
- Training procedure  训练过程
- Variable & metrics  评估指标
- Evaluation results  评估结果

### Model card metadata

在 Hugging Face Hub 中，有的 model 属于特定的类型，你可以通过 tasks, languages, libraries 等等来筛选。

请查看 [camembert-base model card](https://huggingface.co/camembert-base/blob/main/README.md)，你能看到在 model card header 中有如下信息：
```md:no-line-numbers
---
language: fr
license: mit
datasets:
- oscar
---
```

具体配置可查看 [full model card specification](https://github.com/huggingface/hub-docs/blame/main/modelcard.md)。
