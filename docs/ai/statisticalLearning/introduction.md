---
title: 简介
article: false
---

本篇文章记录了一些相关概念以及 notation

### 1. 概念

- error term: 误差项，has mean zero
- lease squares 最小二乘法 -> linear regression -> continuous or quantitative values
- linear discriminant analysis  线性判别分析, logistic regression -> non-numerical value: categorical or qualitative values
- generalized liner model: entire class of statistical learning methods that include both linear and regression
- classification and regression trees, generalized additive models 广义加性模型
- neural network, support vector machine
- scalar 标量
- K-nearest neighbor classifier
- cross-validation, bootstrap
- stepwise selection, ridge regression, principal components regression, lasso
-----
- non-linear statistical learning
- non-linear additive models
- tree-based methods: bagging, boosting, random forests
- support vector machines: a set of approaches for performing both linear and non-linear classification
- deep learning
- survival analysis
-----
- unsupervised
- principal components analysis, K-means clustering, hierarchical clustering
- multiple hypothesis testing 多重假设检验


### 2. Notation

- n: The number of distinct data points/observations
- p: the number of variables that are available for use in making predictions
- $x_ij$: the value of the *j*th variable for the *i*th observation
- **X**: $n \times p$ matrix
$$ \mathbf{X} = 
\begin{pmatrix}
x_{11} & x_{12} & \cdots & x_{1p} \\
x_{21} & x_{22} & \cdots & x_{1p} \\
\vdots & \vdots & \ddots & \vdots \\
x_{n1} & x_{n2} &\cdots & x_{np} \\
\end{pmatrix}
$$

- $x_i$: the rows of **X**. A vector of length *p*
$$x_i = 
\begin{pmatrix}
x_i1 \\
x_i2 \\
\vdots \\
x_ip \\
\end{pmatrix}
$$

$$\mathbf{X} = 
\begin{pmatrix}
x_1^T \\
x_2^T \\
\vdots \\
x_n^T \\
\end{pmatrix}
$$

- $\mathbf{x_j}$: the column of **X**
$$\mathbf{x_j} = 
\begin{pmatrix}
x_1j \\
x_2j \\
\vdots \\
x_nj \\
\end{pmatrix}
$$

$$\mathbf{X} = 
\begin{pmatrix}
\mathbf{x_1} & \mathbf{x_1} & \cdots & \mathbf{x_p}
\end{pmatrix}
$$

- $y_i$:
$$\mathbf{y} = 
\begin{pmatrix}
y_1 \\
y_2 \\
\vdots \\
y_n \\
\end{pmatrix}
$$

- 长度为 *n* 的向量：小写加粗
- 长度非 *n* 的向量：小写
- 标量：小写
- 矩阵：大写粗体
- 随机变量：大写

一些标记：

- 标量：$a \in \mathbb{R}$
- a vector of length *k*：$a \in \mathbb{R}^k$
- $r \times s$ 矩阵：$\mathbf{A} \in \mathbb{R}^{k\times s}$


- input: predictors, independent variables, features, variables
- output: response, dependent variable
