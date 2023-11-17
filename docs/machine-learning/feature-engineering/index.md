---
lang: zh-CN
title: 特征工程
description:
article: false
---


## 1. Introduction

特征工程是机器学习模型构建过程中的重要步骤之一。它涉及到选择、创建、转换和优化特征，以改进模型性能。

特征工程包括以下主要方面：
1. 特征选择：在原始数据中选择最相关的特征，去除不相关或冗余的特征，以减少数据维度和提高模型训练的速度。
2. 特征转换：对特征进行数学变换，如标准化、归一化、对数转换等，以确保特征具有相似的尺度和分布，有助于模型更好地理解数据。
3. 特征组合：将多个特征组合成新的特征，以捕捉特征之间的相互关系。这可以通过加法、乘法或其他方式来实现。
4. 特征创建：创建新的特征。例如，从文本数据中提取词袋模型或 TF-IDF 特征。
5. 处理缺失值：处理原始数据中的缺失值，可以通过填充、删除或其他方法来处理缺失值。
6. 离散化：将连续特征转化为离散特征，以适应某些机器学习算法，如决策树。
7. 特征缩放：将特征的范围缩放到特定的区间，以确保模型不会被某些特征的值范围所主导。

### 1.1 特征工程的目标

通过特征工程，我们可以：
1. 提高模型的预测表现。
2. 减少数据的使用、减少计算量。
3. 提高结果的可解释性。

### 1.2 关键原则

特征（feature）和目标（target）之间的关系必须是我们使用的模型可以学到的。即，如果我们选用线性模型，它只能学线性关系，所以我们使特征和目标具有线性关系。

这是一个[使用特征工程提高准确性的例子](https://www.kaggle.com/code/ryanholbrook/what-is-feature-engineering)。


## 2. 互信息（Mutual Information, MI）

当拿到一个比较复杂的数据集（比如有成百上千个特征）且没有对应的说明的时候，我们会感觉不知道何从下手。

实际上，我们可以先用特征效用指标（feature utility metric，衡量每个特征和目标之间的关联程度）来构建一个排名，选择其中最有用的一些特征进行开发。

我们使用的指标就叫做互信息（mutual information），它和相关性（correlation）很像，也是衡量两个量之间的关系。但是相关性只能检测到线性关系，而互信息可以检测任何类型的关系。

所以说，当我们刚开始还不知道使用什么模型的时候，互信息就显得非常重要了。


### 2.1 什么是互信息

互信息用不确定性（uncertainty）来描述关联性。如果两个变量之间存在关联，那么知道一个变量的取值，将会使我们对另一个变量的取值有更精确的估计，即不确定性降低。互信息（MI）衡量的就是这种关系，即知道一个量后，可以降低多少对另一个量的不确定性。

### 2.2 互信息分数

互信息最小是 0，表示两个量之间是独立的；最大没有上限，但是实际应用中，高于 2.0 的分数也不常见。（MI 是对数量，所以它涨得很慢。）

在使用 MI 时要了解以下内容：
- MI 是基于自身的评估，它可以帮助我们理解一个特征的潜在预测能力。
- MI 是单变量度量：特征可能在与其他特征的交互时具有信息量，但是每个特征本身却没什么信息量。互信息是无法检测出特征之间的相互作用的。
- 一个特征的实际有用性取决于我们使用的模型：一个特征只有在它与目标的关系是我们的模型可以学的范围内才有用。高的 MI 分数并不意味着我们的模型能够有效地利用这些信息。我们可能需要首先对特征进行变换，以使与目标的关联更明显，以便模型能够更好地学习。

这是一个[使用 MI 的例子](https://www.kaggle.com/code/ryanholbrook/mutual-information)。

主要代码：
```python
from sklearn.feature_selection import mutual_info_regression

def make_mi_scores(X, y, discrete_features):
    mi_scores = mutual_info_regression(X, y, discrete_features=discrete_features)
    mi_scores = pd.Series(mi_scores, name="MI Scores", index=X.columns)
    mi_scores = mi_scores.sort_values(ascending=False)    
    return mi_scores
```

:::details 相关代码
```python
# 获得 MI 分数
def make_mi_scores(X, y):
    X = X.copy()
    for colname in X.select_dtypes(["object", "category"]):
        X[colname], _ = X[colname].factorize()
    # All discrete features should now have integer dtypes
    discrete_features = [pd.api.types.is_integer_dtype(t) for t in X.dtypes]
    mi_scores = mutual_info_regression(X, y, discrete_features=discrete_features, random_state=0)
    mi_scores = pd.Series(mi_scores, name="MI Scores", index=X.columns)
    mi_scores = mi_scores.sort_values(ascending=False)
    return mi_scores

# 绘制 mi_score 横向条形图
def plot_mi_scores(scores):
    scores = scores.sort_values(ascending=True)
    width = np.arange(len(scores))
    ticks = list(scores.index)
    plt.barh(width, scores)
    plt.yticks(width, ticks)
    plt.title("Mutual Information Scores")

# 散点图
sns.relplot(x="curb_weight", y="price", data=df)

# 用 fuel_type 进行着色
sns.lmplot(x="horsepower", y="price", hue="fuel_type", data=df);
```

```python
# 设置Matplotlib的默认样式和属性
plt.style.use("seaborn-whitegrid")
plt.rc("figure", autolayout=True)   # 自动布局图形
plt.rc(
    "axes",
    labelweight="bold",
    labelsize="large",
    titleweight="bold",
    titlesize=14,
    titlepad=10,
)

# 绘制 3 个子图，横坐标分别对应 features
features = ["YearBuilt", "MoSold", "ScreenPorch"]
sns.relplot(
    x="value", y="SalePrice", col="variable", data=df.melt(id_vars="SalePrice", value_vars=features), facet_kws=dict(sharex=False),
)

# boxen
sns.catplot(x="BldgType", y="SalePrice", data=df, kind="boxen")

# 相当于在多个子图中进行 hue
feature = "GrLivArea"
sns.lmplot(
    x=feature, y="SalePrice", hue="BldgType", col="BldgType",
    data=df, scatter_kws={"edgecolor": 'w'}, col_wrap=3, height=4,
)
```
:::

## 3. 特征创建（Creating Features）

### 3.1 数学转换

我们经常使用数学公式来对特征进行处理，它们一般都是领域知识。

比如我们会使用「冲程比」来描述发动机性能和效率。

```python
autos["stroke_ratio"] = autos.stroke / autos.bore
```

另外，数据可视化可以帮助我们选择对数据进行重塑的方式（通常是使用幂函数或对数进行）。

比如，对于高度偏斜分布的数据，即数据分布中存在明显的不对称性，通常是右偏（正偏）或左偏（负偏），使用对数可以压缩数据的范围，减小极端值的影响，并使分布更加接近正态分布。

```python
# If the feature has 0.0 values, use np.log1p (log(1+x)) instead of np.log
accidents["LogWindSpeed"] = accidents.WindSpeed.apply(np.log1p)
```

### 3.2 计数（Counts）

表示有无的特征一般用 0-1 或 True-False 来标记。Python 中的 Boolean 类型可以直接相加。

当我们想要以大于 0 为依据判断是否存在时，可以用 DataFrame 内置的 `gt`（greater than）方法来进行判断。

::: code-tabs#counts
@tab sum
```python
# roadway_features 中的列都是表明事故发生地附近是否有某种设施
roadway_features = ["Amenity", "Bump", "Crossing", "GiveWay",
    "Junction", "NoExit", "Railway", "Roundabout", "Station", "Stop",
    "TrafficCalming", "TrafficSignal"]
accidents["RoadwayFeatures"] = accidents[roadway_features].sum(axis=1)
```
@tab df 内置的 gt
```python
components = [ "Cement", "BlastFurnaceSlag", "FlyAsh", "Water",
               "Superplasticizer", "CoarseAggregate", "FineAggregate"]
concrete["Components"] = concrete[components].gt(0).sum(axis=1)
```
:::

:::info
这是一篇关于 Box-Cox Transformation 的内容，[Data cleaning](https://www.kaggle.com/code/alexisbcook/scaling-and-normalization/tutorial) 也是个非常常用的 normalizer。
:::

### 字符串合并与拆分

有些字符串中蕴含着某些信息，比如身份证号码（地区、出生日期）、电话号码（区号）等。

可以使用 `str` accessor 来对 DataFrame 的列做操作。

```python
# 把 Policy 这一列根据空格拆分，形成新的两列 Type 和 Level
customer[["Type", "Level"]] = (  # Create two new features
    customer["Policy"]           # from the Policy feature
    .str                         # through the string accessor
    .split(" ", expand=True)     # by splitting on " "
                                 # and expanding the result into separate columns
)
```

当然也可以将多个字段合并。

```python
# 将 make 和 body_style 合并到 make_and_style 列中
autos["make_and_style"] = autos["make"] + "_" + autos["body_style"]
```

:::info
对于其他类型的数据：
- dates and times，请查看 [Parsing Dates](https://www.kaggle.com/code/alexisbcook/parsing-dates/tutorial)
- Latitudes and longitudes，请查看 [Geospatial Analysis](https://www.kaggle.com/learn/geospatial-analysis)
:::

### 3.3 Group Transforms

我们还可以在分组下聚合多行信息。


使用聚合函数，Group transform 将两个特征结合起来：一个是提供分组依据的类别特征，另一个是希望聚合的数值特征。例如，对于“按州计算的平均收入”，会选择州（State）作为分组特征，平均值（mean）作为聚合函数，收入（Income）作为聚合特征。在Pandas中使用 `groupby` 和 `transform` 方法。

这种方法允许我们根据某个类别将数据分组，并在每个组中应用聚合函数，然后将聚合的结果返回到原始数据中，以创建新的特征。这对于分析数据中不同类别之间的关系和差异非常有用，因为它可以帮助我们洞察数据的不同方面和模式。

```python
customer["AverageIncome"] = (
    customer.groupby("State")  # for each state
    ["Income"]                 # select the income
    .transform("mean")         # and compute its mean
)
```

`mean` 是内置的 DataFrame 方法，除此之外还有：`max`, `min`, `median`, `var`, `std`, `count`。

例如，如果想要统计非数值特征（categorical feature）的频率：
```python
customer["StateFreq"] = (
    customer.groupby("State")
    ["State"]
    .transform("count")
    / customer.State.count()
)
```

如果我们进行了训练集和验证集的划分，为了保持各自的独立性，最好在训练集上创建群组特征，然后将其连接到验证集上。我们可以在训练集上使用 `drop_duplicates` 来创建一个唯一的值集合，然后在验证集上使用 `merge`方法进行连接。

```python
# Create splits
df_train = customer.sample(frac=0.5)        # 从 customer 中取 50% 作为训练集
df_valid = customer.drop(df_train.index)    # 去除训练集中的部分作为验证集

# Create the average claim amount by coverage type, on the training set
df_train["AverageClaim"] = df_train.groupby("Coverage")["ClaimAmount"].transform("mean")

# Merge the values into the validation set
df_valid = df_valid.merge(
    df_train[["Coverage", "AverageClaim"]].drop_duplicates(),       # 去掉这两列中重复的行
    on="Coverage",
    how="left",
)

df_valid[["Coverage", "AverageClaim"]].head(10)
```

:::details df.merge 方法
`how="left"` 表示左连接，还可以使用 `right` (右连接), `inner` (内连接), `outer` (外连接)。

```python
df1 = pd.DataFrame({'A': ['A0', 'A1', 'A2'],
                    'B': ['B0', 'B1', 'B2']})

df2 = pd.DataFrame({'A': ['A1', 'A2', 'A3'],
                    'C': ['C1', 'C2', 'C3']})
```

::: code-tabs #merge
@tab left
```python
left_join = df1.merge(df2, on="A", how="left")
#   A   B   C
# 0 A0  B0  NaN
# 1	A1	B1	C1
# 2	A2	B2	C2
```
@tab right
```python
right_join = df1.merge(df2, on="A", how="right")
# 	A   B   C
# 0	A1	B1	C1
# 1	A2	B2	C2
# 2	A3	NaN	C3
```
@tab inner
```python
inner_join = df1.merge(df2, on="A", how="inner")
#   A   B   C
# 0	A1	B1	C1
# 1	A2	B2	C2
```
@tab outer
```python
outer_join = df1.merge(df2, on="A", how="outer")
#   A   B   C
# 0	A0	B0	NaN
# 1	A1	B1	C1
# 2	A2	B2	C2
# 3	A3	NaN	C3
```
:::

:::tip
了解模型本身的优劣对于创建特征尤为重要，以下是一些大家需要知道的内容：
- 线性模型自然地学习 sums 和 differences，但不能学习更复杂的关系。

- 比率对大多数模型来说通常比较难学习。因此，将特征组合为比率往往可以带来性能的提升。

- 线性模型和神经网络通常更适合使用**标准化**的特征。特别是神经网络需要特征缩放到接近0的值。而树模型（例如随机森林和XGBoost）有时可以从标准化受益，但通常受益较少。

- 树模型可以学习几乎任何特征组合，但当某个组合特别重要时，尤其是在数据有限的情况下，明确创建这个组合特征仍然会有益。树模型通常具有很高的灵活性，但在一些情况下，明确地提供关键特征可以帮助它们更好地捕捉关系。

- 计数特征对于树模型尤其有帮助，因为这些模型没有自然的方式来跨多个特征同时聚合信息。计数特征可以提供有关数据的聚合信息，帮助模型更好地理解数据。
:::

## 4. 使用 K-Means 进行聚类

K-means 使用欧氏距离来衡量数据点之间的相似性。它通过在特征空间内放置一些点，称为质心（centroids），来创建聚类（clusters）。数据集中的每个点都被分配到距离它最近的质心所属的聚类。在"K-means"中，"k" 表示要创建的质心（即聚类）的数量。

简而言之，K均值聚类是一种无监督机器学习方法，旨在将数据分为"k"个紧凑的簇，使得同一簇内的数据点彼此相似，而不同簇之间的数据点差异较大。这个方法的核心思想是通过迭代的方式，不断更新质心的位置，以便最大程度地减小簇内数据点与质心之间的距离。K均值聚类通常需要指定要创建的簇的数量 "k"，这是一个关键参数，需要谨慎选择。

我们主要关注 `scikit-learn` 的三个参数：`n_clusters`, `max_iter`, `n_init`。

K-Means 主要是两步。首先是随机初始化一定数量（`n_clusters`）的质心（centroids），然后迭代执行下面的两个操作：
1. 将数据点分配给最近的质心所属的簇；
2. 移动质心，以减小与其所属簇中数据点之间的距离。

直到质心不再移动，或迭代到最大次数（`max_iter`），迭代停止。这两个操作是K均值聚类的核心步骤，它们的目标是不断改进簇的质量，使簇内的数据点更加相似，簇与簇之间的距离更大。

由于初始质心的随机位置可能导致不理想的聚类结果，因此K均值聚类通常会重复多次（`n_init`），并返回具有最小总距离的数据点和其质心之间的最佳聚类。这种方式有助于降低随机初始化对聚类结果的影响，提高聚类的稳定性。

![](/images/ml/feature-engineering/k-means.gif)


如果想要分成更多的簇，可以使用更大的 `max_iter`；如果数据比较复杂，可以使用更多的`n_clusters`。一般来讲，我们确定 `n_clusters` 就可以了。到底选择多少个簇由我们研究的问题和使用的模型来决定，我们可以使用交叉验证等方法来对这个参数进行调优。

```python
from sklearn.cluster import KMeans

kmeans = KMeans(n_clusters=6)
X["Cluster"] = kmeans.fit_predict(X)
X["Cluster"] = X["Cluster"].astype("category")
```

:::details 可视化
```python
sns.relplot(
    x="Longitude", y="Latitude", hue="Cluster", data=X, height=6,
)

# boxen  不同 cluster 上 MedHouseValue 的值分布情况
X["MedHouseVal"] = df["MedHouseVal"]
sns.catplot(x="MedHouseVal", y="Cluster", data=X, kind="boxen", height=6)
```
:::

> 注：K-means 聚类对数据的尺度（scale）十分敏感，不同特征的 scale 差异可能会影响 K-means 的结果，所以我们最好进行 rescale 或 normalization。


## 5. 






