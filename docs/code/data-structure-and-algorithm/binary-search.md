---
lang: zh-CN
title: 二分查找
description:
article: false
date: 2023-08-25
---

二分查找针对的是有序集合。每次通过跟中间元素对比，将待查找区间缩小为之前的一半，直到找到要查找的元素，或者区间被缩小为 0。

## 1. 时间复杂度：$O(log n)$

假设数据大小是 n，每次查找后都会变为原来的一半。最坏情况下，直到区间为缩小为 0 才停止：

$$
n, \frac{n}{2},  \frac{n}{4}, \frac{n}{8}, ..., \frac{n}{2^{k}},...
$$

当 $\frac{n}{2^{k}} = 1$ 时，k 的值就是总共缩小的次数。每次操作只涉及两数比较大小，所以时间复杂度就是 $O(k) = O(log_{2}{k})=O(log n)$。

## 2. 二分查找的递归与非递归实现

这里我们实现一个==简单==的二分查找。

最简单的情况就是有序数组中不存在重复元素。

:::code-tabs#二分查找

@tab 循环

```java
public int bsearch(int[] a, int n, int value) {
    int low = 0;
    int high = n - 1;

    while (low <= high) {
        int mid = (low + high) / 2;
        if (a[mid] == value) {
            return mid;
        } else if (a[mid] < value) {
            low = mid + 1;
        } else {
            high = mid - 1;
        }
    }

    return -1;
}
```

@tab 递归

```java
public int bsearch(int[] a, int n, int val) {
    return bsearchProcess(a, 0, n-1, val);
}

private int bsearchProcess(int[] a, int low, int high, int value) {
    if (low > high) return -1;

    int mid = low + (high - low) >> 1;

    if (a[mid] == value) {
        return mid;
    } else if (a[mid] < value) {
        return bsearchProcess(a, mid+1, high, value);
    } else {
        return bsearchProcess(a, low, mid-1, value);
    }
}
```
:::

- mid 的取值
    如果 low 和 high 比较大，使用 `(low+high)/2` 可能会溢出。改进：`low+(high-low)/2`。改成位操作：`low+(high-low)>>1`

## 3. 二分查找应用场景的局限性

- 二分查找依赖的是顺序表（数组）
- 二分查找针对的是有序数据
    排序的时间复杂度最低的是 $O(n log n)$。如果遇到一组静态数据，没有频繁的插入、删除操作，可以进行一次排序、多次二分查找。这样排序的成本可被均摊。

    如果有频繁的插入和删除操作，想使用二分查找，要么每次插入、删除之后保证数据仍然有序，要么在每次二分查找前都进行排序。无论哪种方法，维护有序的成本都是很高的。针对这种动态数据集合，查找数据用二叉树。

- 数据量太小不适合二分查找
    数据量很小的时候，直接顺序遍历就可以了。
    
    但是，如果数据之间的比较操作非常耗时，无论数据量大小，都推荐使用二分查找。

- 数据量太大不适合二分查找
    二分查找的底层需要依赖数组这种数据结构，而数组为了支持随机访问的特性，要求内存空间连续，对内存的要求比较苛刻。比如，我们有 1GB 大小的数据，如果希望用数组来存储，那就需要 1GB 的连续内存空间。

## 4. 更复杂的二分查找

### 4.1 查找第一个值等于给定值的元素

```java{11}
public int bsearch(int[] a, int n, int value) {
    int low = 0;
    int high = n - 1;
    while (low <= high) {
        int mid = low + (high - low) >> 1;
        if (a[mid] > value) {
            high = mid - 1;
        } else if (a[mid] < value) {
            low = mid + 1;
        } else {
            if ((mid == 0) || a[mid - 1] != value) return mid;
            else high = mid - 1;
        }
    }

    return -1;
}
```

### 4.2 查找最后一个值等于给定值的元素

```java{11,12}
public int bsearch(int[] a, int n, int value) {
    int low = 0;
    int high = n - 1;
    while (low <= high) {
        int mid = low + (high - low) >> 1;
        if (a[mid] > value) {
            high = mid - 1;
        } else if (a[mid] < value) {
            low = mid + 1;
        } else {
            if ((mid == n-1) || a[mid + 1] != value) return mid;
            else low = mid + 1;
        }
    }

    return -1;
}
```

### 4.3 查找第一个大于等于给定值的元素

```java{6, 7}
public int bsearch(int[] a, int n, int value) {
    int low = 0;
    int high = n - 1;
    while (low <= high) {
        int mid = low + (high - low) >> 1;
        if (a[mid] >= value) {
            if ((mid == 0) || a[mid - 1] < value) return mid;
            else high = mid - 1;
        } else (a[mid] < value) {
            low = mid + 1;
        } 
    }

    return -1;
}
```

### 4.4 查找最后一个小于等于给定值的元素

```java{6, 7}
public int bsearch(int[] a, int n, int value) {
    int low = 0;
    int high = n - 1;
    while (low <= high) {
        int mid = low + (high - low) >> 1;
        if (a[mid] > value) {
            high = mid - 1;
        } else (a[mid] < value) {
            if ((mid == n-1) || a[mid + 1] > value) return mid;
            else low = mid + 1;
        } 
    }

    return -1;
}
```

