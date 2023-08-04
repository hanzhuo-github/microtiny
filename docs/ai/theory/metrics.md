---
title: 机器学习的评价指标
article: false
---

在评价一个二分类的机器学习模型的性能时，我们通常可以选择 Accuracy、Precision、Recall、F1 Score 等指标。

使用分类器做预测后，可以绘出混淆矩阵（Confusion Matrix）：

![](/images/confusion_matrix.png)

- True Positive (TP): 把正样本成功预测为正。
- True Negative (TN)：把负样本成功预测为负。
- False Positive (FP)：把负样本错误地预测为正。
- False Negative (FN)：把正样本错误的预测为负。

### 1. 准确性 Accuracy

$$
Accuracy = \frac{TP+TN}{TP+TN+FP+FN}
$$

```python
from sklearn.metric import accuracy_score

print('Accuracy: %.3f' % accuracy_score(y_test, y_pred))
```

### 2. 精确度 Precision

$$
Precision = \frac{TP}{TP+FP}
$$

- 在预测为Positive的所有数据中，真实Positve的数据到底占多少

```python
from sklearn.metric import precision_score

print('Precision: %.3f' % precision_score(y_test, y_pred))
```

### 3. 召回率 Recall

$$
Recall = \frac{TP}{TP+FN}
$$

- 在所有的Positive数据中，到底有多少数据被成功预测为Positive

```python
from sklearn.metric import recall_score

print('Recall: %.3f' % recall_score(y_test, y_pred))
```

### 4. F1-分数 F1 Score

$$
F1-score = \frac{2 \times Precision \times Recall}{Precision+Recall}
$$

- F1 Score 是 Precision 和 Recall 的综合考量。它赋予Precision score和Recall Score相同的权重，以衡量其准确性方面的性能，使其成为准确性指标的替代方案。

```python
from sklearn.metric import f1_score

print('Recall: %.3f' % f1_score(y_test, y_pred))
```

:::tip Recall v.s. Precision[^first]
- Recall > Precision:

当 FN 的成本代价很高，希望尽量避免产生 FN 时，应该着重考虑提高Recall指标。
例如，癌症诊断场景中，False Negative 是得了癌症的病人没有被诊断出癌症，这种情况是最应该避免的。我们宁可把健康人误诊为癌症 (FP)，也不能让真正患病的人检测不出癌症 (FN) 而耽误治疗离世。所以，癌症诊断系统的目标是：尽可能提高Recall值，哪怕牺牲一部分Precision。

- Precision > Recall: 

当 FP 的成本代价很高，希望尽量避免产生 FP 时，应该着重考虑提高Precision指标。
例如，垃圾邮件分类时，垃圾邮件为Positive，正常邮件为 Negative，False Positive 是把正常邮件识别为垃圾邮件，这种情况是最应该避免的。我们宁可把垃圾邮件标记为正常邮件 (FN)，也不能让正常邮件直接进垃圾箱 (FP)。于是，垃圾邮件分类的目标是：尽可能提高Precision值，哪怕牺牲一部分recall。

继续以癌症诊断场景为，FP 是将没有患癌症的人诊断为癌症，虽然这不致命，但是会给患者带来麻烦
:::


------
参考：[多分类模型Accuracy, Precision, Recall和F1-score的超级无敌深入探讨](https://zhuanlan.zhihu.com/p/147663370)

