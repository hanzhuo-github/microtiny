---
lang: zh-CN
title: 类型
description:
article: false
date: 2023-08-10
---

## 七种类型

- Undefined
- Null
- Boolean
- String
- Number
- Symbol
- Object

## 1. Undefined、Null

> **Q**：为什么有的编程规范要求用 `void 0` 代替 `undefined`？  
**A**：局部变量中的 `undefined` 可以修改（ES5 之后全局变量下的 `undefined` 只读），为了避免它在无意中被修改，建议使用 `void 0` 来获取 `undefined` 值。

## 2. [String](https://javascript.info/string)

> **Q**：字符串是否有最大长度？  
**A**：String 的最大长度是 $2^{53}-1$

String并非“字符串”，而是是字符串的 UTF16 编码，对 String 的各种操作如 charAt、charCodeAt、length 等，针对的都是 UTF-16 编码，每个 UTF-16 单元被认为是 1 个字符（处理 SP 平面的字符时要注意，SP 上的每个字符对应 4 字节）。所以字符串的最大长度实际上是受字符串的编码长度影响的。

JavaScrip 中的 String 永远无法变更，即字符串具有值类型的特征。

## 3. Number

Number 共有 18437736874454810627(即 $2^{64}-2^{53}+3$) 个值。

:::tip 
Number 用 64 位表示。

IEEE 754 标准：
s（符号位，1）+ e（指数位，11）+ f（尾数，52）

e 全 1 时的特殊值减掉（即 64 - 11 = 53），+3 是指三个特殊值：NaN、Infinity、-Infinity
- NaN：e 全 1，f 非 0
- Infinity：e 全 1，f = 0，正无穷（S 为 0），负无穷（S 为 1）
:::


JavaScript 中的 Number 类型基本符合 IEEE 754-2008 规定的双精度浮点数规则，但是 JavaScript 为了表达几个额外的语言场景（比如不让除以 0 出错，而引入了无穷大的概念），规定了几个例外情况：
- NaN，占用了 9007199254740990，这原本是符合 IEEE 规则的数字
- Infinity，无穷大
- Infinity，负无穷大


JavaScript 中有 +0 和 -0，区分他们的方法是检验 1/x 是 Infinity 还是 -Infinity

整数范围：-0x1f ffff ffff ffff 至 0x1f ffff ffff ffff

浮点数精度问题：0.1 + 0.2 != 0.3

正确的比较方法应该是使用 JavaScript 提供的最小精度：
```js
Math.abs(0.1 + 0.2 - 0.3) <= Number.EPSILON    // true
```

## 4. [Symbol](/post/Symbol.md)

对象的 key 只能是 String 类型或 Symbol 类型。使用字符串做 key 容易造成属性名的冲突，ES 6 引入 Symbol 正是为了防止属性名冲突的。

即使 description 相同，Symbol 也是不同的。

使用 JavaScript 内置的 `Symbol.*` 修改对象的内建行为。

## 5. Object

对于 JavaScript 中的几个基本类型，都在对象类型中有所对应，分别是

- Number
- String
- Boolean
- Symbol

要注意，`new Number(3)` 和数字 `3` 是不同的类型，前者是对象类型，后者是 Number 类型

```js
new Number(3) == 3;     // true
new Number(3) === 3;    // false
```

Number、String、Boolean 当跟 new 搭配时，是对应类型的构造器，会产生对象；直接调用表示强制类型转换。

Symbol 是 Symbol 对象构造器，但是用 new 调用会抛出错误。


## 6. 类型转换

`==` 运算会进行跨类型的比较，规则复杂。一般被认为是设计失误，很多实践中推荐禁止使用 `==`，而是要求进行显示转换后用 `===` 进行比较。


### 6.1 StringToNumber: `Number(str)`

数字（十进制、二进制、八进制、十六进制 & 科学计数法 E 或 e）：
- 30
- 0b111
- 0c13
- 0xFF
- 1e3
- -1e-2

:::warning 使用 `Number()` 而非 `parseInt()`、`parseFloat`
- `parseInt` 只支持十六进制前缀“0x”，忽略非数字字符，不支持科学计数法
    - 在比较旧的浏览器中，`parseInt` 还支持 0 开头的八进制前缀，这会造成错误。所以不论何时，都建议传入 `parseInt` 的第二个参数
- `parseFloat` 直接把字符串作为十进制进行解析，不能处理其他任何进制
:::

### 6.2 NumberToString: `String(num)`

- 在较小范围内，数字转字符串完全符合你的直觉
- 在 Number 的绝对值较大或较小时，字符串表示是用科学计数法

```js
let p = 10000000000000000
console.log(String(p));      // 10000000000000000
console.log(String(p));      // 1e+25
```

### 6.3 Object to primitive conversion 对象->基本类型的转换（拆箱转换）

- 布尔转换：没有对应的转换。所有的对象都是 `true`。
- 数值转换：当进行数学运算时进行数值转换。例如，`Date` 对象可以相减。
- 字符串转换：一般在输出的时候进行。比如 `alert(obj)`、`console.log(obj)` 等。

我们可以使用特殊的对象方法来实现字符串和数值转换。

ToFdo

### 6.4 基本类型->对象的转换（装箱转换）

Todo


