---
lang: zh-CN
title: Introduction
description:
article: false
date: 2023-11-07
order: 1
---


正则是匹配模式，要么匹配字符，要么匹配位置。

## 1. 字符匹配

横向模糊匹配：`{m,n}`
纵向模糊匹配：`[abc]`

- 字符组：
    - 范围表示法
        - `[123456ancdefGHIJKLM]` 可以写成 `[1-6a-fG-M]`
        - 要表示 `a`、`-`、`z` 三个字符中的一个，可以写成 `[-az]` 或 `[az-]` 或 `[z\-z]`
    - 排除字符组
        - `[^abc]` 表示除了 `a`、`b`、`c` 之外的任意字符
    - 常见简写
        |字符组|含义|
        |:--|:--|
        |\d|表示 [0-9]。|
        |\D|表示 [^0-9]。表示除数字外的任意字符。|
        |\w|表示 [0-9a-zA-Z_]。表示数字、大小写字母和下划线。|
        |\W|表示 [^0-9a-zA-Z_]。非单词字符。|
        |\s|表示 [ \t\v\n\r\f]。表示空白符，包括空格、水平制表符、垂直制表符、换行符、回车符、换页符。|
        |\S|表示 [^ \t\v\n\r\f]。 非空白符。|
        |.|表示 [^\n\r\u2028\u2029]。通配符，几乎任意字符。换行符、回车符、行分隔符和段分隔符除外。|

        - 匹配任意字符：`[\d\D]`、`[\w\W]`、`[\s\S]`、`^`

- 量词（惰性）：
    |量词|含义|
    |:--|:--|
    |{m,}|表示至少出现 m 次。|
    |{m}|等价于 {m,m}，表示出现 m 次。|
    |?|等价于 {0,1}，表示出现或者不出现。|
    |+|等价于 {1,}，表示出现至少一次。|
    |*|等价于 {0,}，表示出现任意次，有可能不出现。|

    - 惰性量词 & 贪婪量词：上面的两次都进行贪婪匹配，在量词后加个 `?` 可实现惰性匹配

- 多选分支（惰性）：`(p1|p2|p3)`


## 2. 位置匹配

6 个锚：
- `^`：行开头。
- `$`：行结尾。
- `\b`：单词边界，即 `\w` 和 `\W` 之间的位置，也包括 `\w` 和 `^` 之间的位置，也包括 `\w` 与 `$` 之间的位置。
- `\B`：非单词边界。具体说来就是 `\w` 与 `\w`、 `\W` 与 `\W`、`^` 与 `\W`，`\W` 与 `$` 之间的位置。
- `(?=p)`：其中 `p` 是一个子模式，整体指 `p` 前面的位置，或者说该位置后面要匹配 `p`。
- `(?!p)`：与 `(?=p)` 相反。
> `(?=p)` 和 `(?!p)` 分别叫 positive lookahead 和 negative lookahead，ES 5 之后还支持 positive lookbehind 和 negative lookbehind，分别为 `(?<=p)` 和 `(?<!p)`

    ::: code-tabs#锚
    @tab `^`和`$`
    ```js
    result = "hello".replace(/^|$/g, '#');
    console.log(result);
    // => "#hello#"
    ```

    @tab `\b`
    ```js
    let result = "[JS] Lesson_01.mp4".replace(/\b/g, '#');
    console.log(result);
    // => "[#JS#] #Lesson_01#.#mp4#"
    ```

    @tab `\B`
    ```js
    let result = "[JS] Lesson_01.mp4".replace(/\B/g, '#');
    console.log(result);
    // => "#[J#S]# L#e#s#s#o#n#_#0#1.m#p#4"
    ```

    @tab `(?=p)`
    ```js
    let result = "hello".replace(/(?=l)/g, '#');
    console.log(result);
    // => "he#l#lo
    ```

    @tab `(?!p)`
    ```js
    let result = "hello".replace(/(?!l)/g, '#');
    console.log(result);
    // => "#h#ell#o#"
    ```
    :::