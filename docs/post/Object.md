---
lang: zh-CN
title: Object
description:
date: 2023-08-14
category:
  - 前端
tag:
  - js
  - js 基本类型
---

## 1. 快速介绍

```js
// 创建
let user = new Object()
let user = {}

user.name = "John"
user.age = 10

delete user.age

user["likes birds"] = true
delete user["likes birds"]

// 判断属性是否存在
alert("age" in user)
let key = "age"
alert(key in user)

let key = prompt("输入一个 user 属性", "name")
alert(user[key])

for (key in obj) {
    alert(key)
    alert(obj[key])
}

function makeUser(name, age) {
    return {
        name,
        age,
    }
}

// 变量名不能是保留字
// 但  属性名没有这个限制
let obj = {
    for: 1,
    let: 2,
    return: 3,
}
alert( obj.for + obj.let + obj.return )     // 6

// 属性只能是 Symbol 或 Sting
let obj = {
    0: "test",      // 箱单与 "0": "test"
}
alter(obj["0"])
alter(obj[0])
```

## 2. 属性的顺序

整数属性会进行排序，其他属性按照创建的顺序显示。

:::info
如果一个字符串可以和一个整数互相转换，那么它就是*整数属性*。
```js
// Number(...) 显式转换为数字
// Math.trunc 是内建的去除小数部分的方法。
alert( String(Math.trunc(Number("49"))) ); // "49"，相同，整数属性
alert( String(Math.trunc(Number("+49"))) ); // "49"，不同于 "+49" ⇒ 不是整数属性
alert( String(Math.trunc(Number("1.2"))) ); // "1"，不同于 "1.2" ⇒ 不是整数属性
```
:::

如果想让属性按照自定义的方式（非数值大小）显示，只需给键名前加一个 `+`。

```js
let codes = {
  "+49": "Germany",
  "+41": "Switzerland",
  "+44": "Great Britain",
  // ..,
  "+1": "USA"
};

for (let code in codes) {
  alert( +code ); // 49, 41, 44, 1
}
```
