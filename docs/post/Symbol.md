---
lang: zh-CN
title: Symbol
description:
date: 2023-08-10
category:
  - 前端
tag:
  - js
  - js 基本类型
---

`symbol` 是唯一标识符的基本类型，用 `Symbol([name])` 创建。

symbol 的值总是不同的，这样我们可以用于“隐藏”对象属性。JavaScript 提供了系统 symbol，用 `Symbol.*` 进行访问，使用它们可以修改一些内建行为。

如果想让同名 symbol 相等，需要用到全局注册表，用 `Symbol.for(name)` 获取以及注册，返回的是 symbol；用 `Symbol.keyFor(symbol)` 可以在全局注册表中寻找其 name。

<!-- more -->

对象的 key 只能是 String 类型或 Symbol 类型。使用字符串做 key 容易造成属性名的冲突，ES 6 引入 Symbol 正是为了防止属性名冲突的。

## 1. Symbols

```js
let id = Symbol();

// 传入 description
let id1 = Symbol("id");
let id2 = Symbol("id");

id1 == id2      // false
```

:::warning Symbols 不能自动转化成 String
Symbol 不能自动转换成 String，你可以用 `toString()` 方法，或者输出 `symbol.description`

```js
let id = Symbol("id");

console.log(id);                // TypeError
console.log(id.toString());     // Symbol(id)
console.log(id.description);    // id
```
:::

## 2. 作用

当我们使用外部的 user 对象时，想为该对象增加属性时，使用 Symbol 可以避免属性名冲突，有效防止双方对该属性进行的重写覆盖。

```js
// another code
let user = {
    id: 'Their Id',
    name: 'John',
}
```

```js
let id = Symbol("id")

user[id] = "Our Id"
```

我们定义对象的时候，如果使用 Symbol，应该是：
```js
let id = Symbol("id");

let user = {
  name: "John",
  age: 30,
  [id]: 123 // not "id": 123
};
```

:::tip 使用 for...in 遍历 key 或 Object.keys(obj) 时，Symbol 会被略过

```js
let id = Symbol("id");
let user = {
  name: "John",
  age: 30,
  [id]: 123
};

for (let key in user) alert(key);   // name, age
Object.keys(user);                  // ['name', 'age']
```

想要获得 symbol 属性，可以用以下方法：

- `Object.getOwnPropertySymbols(obj)` 可以获取所有的 symbol 属性
- `Reflect.ownKeys(obj)` 可以返回对象**所有**键，包括 symbol


:::

:::tip Object.assign() 既拷贝 string，也拷贝 symbol

```js
let id = Symbol("id");
let user = {
  [id]: 123
};

let clone = Object.assign({}, user);

alert( clone[id] ); // 123
```

我们在拷贝或者合并对象时是希望对所有的属性做操作的。
:::

## 3. Global symbols

有时我们希望在不同的地方使用相同名字的 symbol 且它们对应的实体也是相同的。

为了达到这个目的，我们需要使用**全局 symbol 注册表（global symbol register）**，全局注册表中的 symbol 被称为**全局 Symbol**。

### 3.1 Symbol.for(key) 读取 symbol

在注册表中读取 symbol 时使用 `Symbol.for(key)`。如果全局注册表中有 description 为 key 的 symbol，就会返回该 symbol，都则将创建一个新的 symbol（即创建了 `Symbol(key)`），并将其存储在注册表中。

```js
// 从全局注册表中读取
let id = Symbol.for("id"); // 如果该 symbol 不存在，则创建它

// 再次读取（可能是在代码中的另一个位置）
let idAgain = Symbol.for("id");

// 相同的 symbol
alert( id === idAgain ); // true
```

### 3.2 Symbol.keyFor(symbol) 读取 description

```js
// 通过 name 获取 symbol
let sym = Symbol.for("name");
let sym2 = Symbol.for("id");
let local_sym = Symbol("local")

// 通过 symbol 获取 name
alert( Symbol.keyFor(sym) ); // name
alert( Symbol.keyFor(sym2) ); // id
alert( Symbol.keyFor(local_sym) ); // undefined 只能查找全局注册表中的 symbol
```

## 4. 系统 symbol

JavaScript 内置了很多[系统 symbol](https://tc39.es/ecma262/#sec-well-known-symbols)，用 `Symbol.*` 来调用。我们可以用它们来微调对象的各个方面。

- Symbol.hasInstance
- Symbol.isConcatSpreadable
- Symbol.iterator
- Symbol.toPrimitive

可以参考 [iterables](/post/iterables.md) ，其中使用 `Symbol.iterator` 微调对象，以使得对象具有迭代性质。

## 总结

- `symbol` 是唯一标识符的基本类型，用 `Symbol([name])` 创建。

- symbol 的值总是不同的，这样我们可以用于“隐藏”对象属性。JavaScript 提供了系统 symbol，用 `Symbol.*` 进行访问，使用它们可以修改一些内建行为。

- 如果想让同名 symbol 相等，需要用到全局注册表，用 `Symbol.for(name)` 获取以及注册，返回的是 symbol；用 `Symbol.keyFor(symbol)` 可以在全局注册表中寻找其 name。

- 注意：
    - 使用 `for...in` 遍历 key 或 `Object.keys(obj)` 时，Symbol 会被略过
    - `Object.getOwnPropertySymbols(obj)` 可以获取所有的 symbol 属性
    - `Reflect.ownKeys(obj)` 可以返回对象**所有**键，包括 symbol
    - `Object.assign()` 既拷贝**所有**的属性，包括 symbol