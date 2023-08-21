---
lang: zh-CN
title: Iterables 可迭代对象
description:
date: 2023-08-11
category:
  - 前端
tag:
  - js
---
可以用 `for...of` 进行遍历的都是 `可迭代对象（iterable）`。它是通过 `Symbol.iterator` 实现的，该属性值是个函数，返回一迭代器（迭代器必须有 `next()` 函数，`next()` 函数返回 `{done: Boolean, value: any}`，当 `done: true` 时迭代结束）。

String 和 Array 内部实现了 Symbol.iterable，它们内置的可迭代对象。用 `for...of` 对 String 进行遍历时，`surrogate pairs` 是可以被争取处理的。

有索引和 `length` 属性的对象叫类数组（array-like）。

`Array.from(obj[, mapFn, thisArg])` 将可迭代对象或类数组 `obj` 转化为真正的数组。


<!-- more -->


任何可以在 `for...of` 循环中使用的对象都是可迭代对象。例如，数组和字符串都是可迭代的。

对象本身不是数组，如果它表示一个集合（list 或 set），那么我们会很自然地想使用 `for..of` 来遍历它。如何使得一个表示集合的对象可以被 `for..of` 遍历呢？

## 1. Symbol.iterator

我们有这样一个对象，它表示数字区间，我们希望遍历该对象获取该数字区间的值。

```js
let range = {
    from: 1,
    to: 5,
};

// 目标：
// for (let num of range) ... num = 1, 2, 3, 4, 5
```

我们为对象增加一个名为 `Symbol.iterator` 的方法。

- 当使用 `for...of` 时，它会调用这个方法（没有则会报错）。这个方法必须返回一个迭代器（iterator）——一个有 `next` 方法的对象。

- 之后，`for...of` *只对这个被返回的对象（即被返回的迭代器）进行操作*。

- 当 `for...of` 循环希望获取下一个数值时，它就调用这个对象的 `next()` 方法。

- `next()` 方法返回的结果的搁置必须是 `{done: Boolean, value: any}`，当 `done=True` 时，表示循环结束，否则 `value` 时下一个值。

我们来看一下代码实现
```js
// 1. for..of 调用 Symbol.iteration 对应的函数
range[Symbol.iterator] = function() {
    // 返回迭代器
    return {
        current: this.from,
        last: this.to,

        // 迭代器要有 next 方法
        next() {
            if (this.current <= this.last) {
                return { done: false, value: this.current++ };
            } else {
                return { done: true };
            }
        }
    }
}
```

:::details 迭代器和它所迭代的对象是分开的
- `range` 本身没有 `next()` 属性
- 迭代器是在 `range[Symbol.iteration]()` 被调用时生成的

当然我们也可以让 range 直接成为一个迭代器：
```js
let range = {
    from: 1, 
    to: 5,

    [Symbol.iterator]() {
        this.current = this.from;
        return this;
    }

    next() {
        if (this.current <= this.to) {
            return { done: false, value: this.current++ };
        } else {
            return { done: true };
        }
    }
}
```

但是这样的问题是，我们不能使用同时运行两个 `for...of` 了。因为同时进行循环的情况下他们共享迭代状态，而我们只有一个迭代器。不过并行执行 `for...of` 还是很罕见的。
:::

:::info 无穷迭代器
可以创建无穷迭代器。比如设置 `range.to = Infinity`。

对于无穷迭代器，我们可以使用 `break` 来停止。
:::

## 2. 显示调用迭代器

String 都是可迭代的，即可以使用 `for...of` 对其进行遍历。对于 SP 上的 surrogate pairs 也可以正常地处理。

```js
let str = '𝒳😂';
for (let char of str) {
    alert( char ); // 𝒳，然后是 😂
}
```


下面我们直接使用迭代器本身来进行 `for...of` 遍历。

```js{5}
let str = "Hello"

// 实现 for (char of str) alert(char); 的效果

let iterator = str[Symbol.iterator]();

while (true) {
    let result = iterator.next();
    if (result.done) break;
    alert(result.value);        // 输出字符
}
```

这样做给了我们更多的控制权，不过很少这样做。比如，我们可以迭代一部分，做一些其他的操作，然后再继续迭代。


## 3. 可迭代（iterable）v.s. 类数组（array-like）

- iterables: 实现了 `Symbol.iterator` 方法的对象
- array-likes: 有索引和 `length` 属性的对象

例如，String 它既是 iterable 也是 array-like。上面的 `range` 是 iterable 但不是 array-like。

这里给一个 array-like 的对象：
```js
let arrayLike = {
    0: "apple",
    1: "banana",
    length: 2,
}
```

要注意，iterables 和 array-likes 都*不是 array*，没有 `push`、`pop` 等数组方法。

但是对于 `arrayLike` 这个对象，我们可能会很自然地想到，如果能用 array 的方法就好了。

## 4. Array.from

`Array.from` 可以将 iterables 和 array-likes 转成 array。

:::code-tabs#Array.from

@tab array-like

```js{1}
let arr = Array.from(arrayLike);

alert(arr.pop());       // banana
```

@tab iterable

```js{1}
let arr = Array.from(range);

alert(arr);         // 1, 2, 3, 4, 5
```
:::


`Array.from` 的完整语法为

```js
Array.from(obj[, mapFn, thisArg])
```

例：
```js
let arr = Array.from(range, num => num * num)

alert(arr);     // 1, 4, 9, 16, 25
```

对于 surrogate pairs，str 的 `slice` 方法不能正确处理，我们可以利用 Array.from 来做处理：
```js
function slice(str, start, end) {
    return Array.from(str).slice(start, end).join('')
}

let str = '𝒳😂𩷶'

slice(str, 1, 3);       // 😂𩷶
str.slice(1, 3);    // \uDCB3\uD83D
```

## 总结
- 可迭代对象（iterables）：可以用 `for...of` 进行遍历的对象
    - 使用 `Symbol.iterator` 实现
        - `obj[Symbol.iterator]()` 的结果被称为 迭代器（iterator）
        - 迭代器必须有 next() 方法，它返回 `{done: Boolean, value: any}`，`done:true` 表明迭代结束，否则 value 就是 next 值。
    - String 和 Array 是内置的可迭代对象。
    - 字符串迭代器可以正确处理 surrogate pair。
- 类数组（array-like）：有索引和 `length` 属性的对象
- `Array.from(obj[, mapFn, thisArg])` 将可迭代对象或类数组转化为真正的数组。