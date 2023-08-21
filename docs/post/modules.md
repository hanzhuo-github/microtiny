---
lang: zh-CN
title: Export & Import
description:
date: 2023-08-07
category:
  - 前端
tag:
  - js
---
---

export 和 import 的用法

<!-- more -->

## 基本使用

### 1. export

::: code-tabs#export

@tab export
```js
export let weekdays = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

export const YEAR = 2023;

export class User {
    constructor(name) {
        this.name = name;
    }
}
```

@tab export separately
```js
// say.js
function sayHi(user) {
    alert(`Hello, ${user}!`);
}

function sayBye(user) {
    alert(`Bye, ${user}!`);
}

export { sayHi, sayBye };
```

:::

直接在变量、函数、class 前面加 `export` 即可。注：export function 和 class 时，不需要在最后加分号。

### 2. import

::: code-tabs#import 

@tab export

```js
import { sayHi, sayBye } from './say.js'

sayHi('John');
sayBye('John');
```

@tab import as

```js
import { sayHi as hi, sayBye as bye } from './say.js'

hi('John');
bye('John');
```

@tab import *
```js
import * as asy from './say.js'

say.sayHi('John');
say.sayBye('John');
```
:::

:::tip 不用担心引入得太多
使用现代构建工具（如 webpack 等）时，它们会将 modules 打包到一起并进行优化以加速 loading。它们也会将没有用到过的引用移除掉。
:::

### 3. export 使用 `as`

::: code-tabs#export as 

@tab export
```js
// say.js
...
export { sayHi as hi, sayBye as bye };
```

@tab import
```js
import * as say from './say.js';

say.hi('John');
bye.hi('John');
```
:::

### 4. export default
::: code-tabs#export default

@tab default
```js
// user.js
export default class User {
    constructor(name) {
        this.name = name
    }
}
```

@tab default name
```js
function sayHi(name) {
    alert(`Hello, ${user}!`)
}

export { sayHi as default };
```
:::

```js
import User from './user.js';

new User('John');
```

### 5. export 既有 default 又有命名实体

```js
// 📁 user.js
export default class User {
  constructor(name) {
    this.name = name;
  }
}

export function sayHi(user) {
  alert(`Hello, ${user}!`);
}
```

::: code-tabs#import

@tab import default

```js
// 📁 main.js
import {default as User, sayHi} from './user.js';

new User('John');
```

@tab import *
```js
// 📁 main.js
import * as user from './user.js';

let User = user.default; // the default export
new User('John');
```
:::

使用 default 导出时，import 时不需要加 `{}`，且 import 时可以是任何名称（最好和文件同名）。
|Named export|Default Export|
|:--|:--|
|export class User {...}|export default class User {...}|
|import {User} from ...|import User from ...|

使用 export default 时，可以不指定被导出实体的名称：
```js
export default function (user) {    // 没有 function name
    alert(`Hello, ${user}`)
}
```

## 2. Re-export

语法：`export ... from ...`

```js
export {sayHi} from './say.js'; // re-export sayHi

export {default as User} from './user.js'; // re-export default
```

当我们写 package 的时候，一个文件下面有很多 modules，我们会将所有的功能在统一的位置进行 export。这样其他人在使用该包的时候，可以从统一的位置进行 import。

现在我们有 auth 这个包，index.js 作为唯一的出口。auth 文件夹下其他的 modules 都从 index.js 的位置进行 export。

:::code-tabs#re-export

@tab import & export
```js
// 📁 auth/index.js

// import login/logout and immediately export them
import {login, logout} from './helpers.js';
export {login, logout};

// import default as User and export it
import User from './user.js';
export {User};
...
```

@tab export from
```js
// re-export login/logout
export {login, logout} from './helpers.js';

// re-export the default export as User
export {default as User} from './user.js';
```
:::

对于 default export，在进行 re-export 时需要进行单独处理。

对于 user.js 中的 default export:
```js
export default class User {
    //..
}
```

- 使用 `export User from './user.js'` 是不行的。我们应该使用 `export { default as User } from './user.js'`.

- 使用 `export * from './user.js'` 进行的 re-export 只会导出 named export，会忽略 default export。

```js
export * from './user.js';              // 导出了 named export
export { default } from './user.js';    // 导出了 default export
```
