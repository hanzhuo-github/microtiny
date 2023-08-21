---
lang: zh-CN
title: Array
description:
date: 2023-08-11
category:
  - 前端
tag:
  - js
---

## 1. 快速介绍

```js
let arr = new Array();
let arr = [];

let fruits = ["Apple", "Orange", "Plum"];
fruits[3] = "Banana";
alert(fruits[2]);

// arr.at(i)  支持「负数」
alert(fruits[fruits.length - 1])
alert(fruits.at(-1))

/**  push() pop() */
alert(fruits.pop());    // 删掉了 Banana，并将其 alert
alert(fruits);          // Apple, Orange, Plum

fruits.push("Pear");    // 相当于 fruits[fruits.length] = "Pear"
alert(fruits);          // Apple, Orange, Plum, Pear

/**  shift() unshift() */
alert(fruits.shift());    // 删掉了 Apple， 并将其 alert
alert(fruits);            // Orange, Plum, Pear

fruits.unshift('Apple');
alert( fruits ); // Apple, Orange, Plum, Pear

// push() 和 unshift() 可以一次添加多个元素
let fruits = ["Apple"];
fruits.push("Orange", "Peach");
fruits.unshift("Pineapple", "Lemon");
alert( fruits );        // ["Pineapple", "Lemon", "Apple", "Orange", "Peach"]


/** 循环 */
let arr = ["Apple", "Orange", "Pear"];
// 1. for
for (let i = 0; i < arr.length; i++){
    alert(arr[i])
}

// 2. for ... of 只获取元素，不获取索引
for ( let fruit of fruits) {
    alert(fruit)
}

// 3. for ... in 获取索引
// 适用于普通对象并做了对应优化，但是不适用于数组，速度要慢 10-100 倍
for (let key in fruits) {
    alert(fruits[key])
}

/** length */
// 显示地将 length 减小再恢复原长，此过程不可逆（被截断的元素并不会找回来，是 undefined）
// 清空数组最简单的方式
arr.length = 0

// 多维数组
let matrix = [
  [1, 2, 3],
  [4, 5, 6],
  [7, 8, 9]
];

/** toString() */
// 以逗号连接数组中的元素
let arr = [1, 2, 3];
alert( arr ); // 1,2,3
alert( String(arr) === '1,2,3' ); // true

// 数组没有 Symbol.toPrimitive，也没有 valueOf，只能执行 toString 进行转换
alert( [] + 1 );    // "1"
alert( [1] + 1 );   // "11"
alert( [1,2] + 1 ); // "1,21"
```

### 不要用 `==` 比较数组

- 仅当两个对象引用的是同一个对象时，它们才相等 `==`
- 如果 `==` 两边一个是对象、一个是基本类型，那么该对象会被转换为原始类型
- `null == undefined`

```js
// 左边是基本类型，右边是数组，于是数组被转换成了基本类型: ''
0 == [];    // true，'' 被转换成了数字0
'0' == [];  // false，'' 不需要进一步进行类型转化，它们是不同的字符串
```

数组可以逐项比较，用 `for` 循环或迭代来进行。


## 2. 数组的方法

上面已经介绍了 `push()`, `pop()`, `shift()`, `unshift()`。

- `arr.splice(start[, deleteCount, elem1, ..., elemN])`
    - 改变原数组，添加、删除、插入都可以完成
    - 从 `start` 开始修改，删除 `deleteCount` 个元素，并在当前位置插入 `elem1, ..., elemN`
    - 返回被删除的元素所组成的数组
    - 允许负向索引
        ```js
        let arr = [1, 2, 5];
        arr.splice(-1, 0, 3, 4);
        alert( arr ); // 1,2,3,4,5
        ```

- `arr.slice([start], [end])`
    - 不改变原数组，将 [start, end) 区间的元素复制到新的数组中
    - `start` 和 `end` 都可以是负数 

- `arr.concat(arg1, arg2...)`
    - 不改变原数组。创建新数组，其中包含来自于其他数组和其他项的值
    - 接受任意数量的参数，数组或值都行

    :::details `argN` 是数组时，其中的所有元素都会被复制；否则，复制参数本身
    ```js
    let arr = [1, 2];
    alert( arr.concat([3, 4]) ); // 1,2,3,4
    alert( arr.concat([3, 4], [5, 6]) ); // 1,2,3,4,5,6
    alert( arr.concat([3, 4], 5, 6) ); // 1,2,3,4,5,6
    ```
    对于对象（即使是类数组对象），由于它不是数组，所以会被当做元素直接添加
    ```js
    let arr = [1, 2];
    let arrayLike = {
    0: "something",
    length: 1
    };

    alert( arr.concat(arrayLike) ); // 1,2,[object Object]
    ```

    如果类数组中有 `Symbol.isConcatSpreadable` 属性，那么它会被当做一个数组来处理：
    ```js
    let arr = [1, 2];
    let arrayLike = {
        0: "something",
        1: "else",
        [Symbol.isConcatSpreadable]: true,
        length: 2
    };

    alert( arr.concat(arrayLike) ); // 1,2,something,else
    ```
    :::


- `arr.forEach(function(item, index, array) {...});`

- `indexOf(item, from)`、`lastIndexOf(item, from)`、`includes(item, from)`
    - 都使用 `===` 进行比较
    - `includes()` 可以正确处理 `NaN`，而另外两个不能

- `arr.find(function(item, index, array) {...});`
    - 返回满足条件的第一个元素
        - 如果返回 `true`，则返回 item 并停止迭代
        - 如果为假值，则返回 undefined
    - `arr.findIndex`、`arr.findLastIndex` 和 `arr.find` 有相同的语法，但是返回的是元素的索引而不是元素本身，没找到则返回 `-1`。

- `arr.filter(function(item, index, array) {...});`
    - 返回满足条件的元素组成的数组
        - 如果 `true`， item 被 push 到 results，迭代继续
        - 如果什么都没找到，则返回空数组

- `arr.map(function(item, index, array) {...});`

- `arr.sort()`
    - 对数组进行**原位（in-place）**排序
    - 返回排序后的数组，但由于修改了数组本身（in-place 的含义），所以这个返回值一般会被忽略
    - 默认情况下按照字符串进行排序
        ```js
        let arr = [ 1, 2, 15 ];
        arr.sort();
        alert( arr );  // 1, 15, 2
        ```
    - 可以自定义顺序进行排序，提供一个函数作为 `arr.sort()` 的参数
        - 比较函数要返回：正数表示大于，负数表示小于
        ```js
        let arr = [ 1, 2, 15 ];
        arr.sort((a, b) => a - b);
        alert(arr);  // 1, 2, 15
        ```

- `arr.reverse()` 颠倒顺序

- `split` 和 `join`
    - `str.split(delim[, arrLength])`
    - `arr.join(glue)`

- `reduce/reduceRight` 根据数组计算单个值
    - 语法：`arr.reduce(function(accumulator, item, index, array) {...}, [initial]);`
        - `accumulator`: 上一个函数调用的结果，第一次等于 `initial`（如果提供了的话），如果没有提供，那么会将数组的第一个元素作为初始值，并从第二个元素开始迭代
        - `item`: 当前的数组元素
        - `index`: 当前索引
        - `arr`: 数组本身
    - `reduceRight` 从右到左

- `Array.isArray(value)` 判断 `value` 是否为数组。对数组用 `typeof(value)` 只能得到 `object`。

- `arr.some(fn)`、`arr.every(fn)` 检查是否「存在/所有」元素满足 `fn`

- `arr.fill(value, start, end)` 从索引 `start` 到 `end`，用重复的 `value` 填充数组

- `arr.copyWithin(target, start, end)` 将位置 `start` 到 `end` 的所有元素复制到**自身**的 `target` 位置（覆盖现有元素）

- `arr.flat(depth)/arr.flatMap(fn)` 从多维数组创建一个新的扁平数组。

- `Array.of(element0[, element1[, …[, elementN]]])` 基于可变数量的参数创建一个新的 Array 实例，而不需要考虑参数的数量或类型。


注：几乎所有函数的数组方法，比如 `find`，`filter`，`map`，除了 `sort` 是一个特例，都接受一个可选的附加参数 `thisArg`。

:::details `thisArg`

下面是完整的语法
```js
arr.find(func, thisArg);
arr.filter(func, thisArg);
arr.map(func, thisArg);
...
```
使用 `army` 的方法 `canJoin()` 作为过滤器，`thisArg` 用于传递上下文
```js
let army = {
  minAge: 18,
  maxAge: 27,
  canJoin(user) {
    return user.age >= this.minAge && user.age < this.maxAge;
  }
};

let users = [
  {age: 16},
  {age: 20},
  {age: 23},
  {age: 30}
];

// 找到 army.canJoin 返回 true 的 user
// 如果不传 army 作为 thisArg，那么 this.canJoin 将被作为独立函数调用，this 是 undefined
// 也可以用 users.filter(user => army.canJoin(user)) 这是是 army 调用的，于是 this 是 army
let soldiers = users.filter(army.canJoin, army);

alert(soldiers.length); // 2
alert(soldiers[0].age); // 20
alert(soldiers[1].age); // 23
```
