import{_ as a}from"./plugin-vue_export-helper-c27b6911.js";import{o as e,c as r,b as h}from"./app-2c4d3118.js";const t={},d=h('<h2 id="栈的应用" tabindex="-1"><a class="header-anchor" href="#栈的应用" aria-hidden="true">#</a> 栈的应用</h2><h3 id="函数调用栈" tabindex="-1"><a class="header-anchor" href="#函数调用栈" aria-hidden="true">#</a> 函数调用栈</h3><p>操作系统给每个线程分配了一块独立的内存空间，这块内存被组织成“栈”这种结构，用来存储函数调用时的临时变量。每进入一个函数，就会将临时变量作为一个栈帧入栈，当被调用函数执行完成，返回之后，将这个对应的栈帧出栈。</p><h3 id="表达式求值" tabindex="-1"><a class="header-anchor" href="#表达式求值" aria-hidden="true">#</a> 表达式求值</h3><p>编译器可以通过两个栈来实现四则运算。一个栈用来保存操作数，一个栈用来保存运算符。</p><p>从左向右遍历表达式，遇到数字时，直接入栈。遇到运算符时，与栈顶的运算符进行比较。如果比栈顶元素的优先级高，就入栈；否则，从运算符栈中取出运算符，从操作数栈栈顶取出 2 个操作数，进行运算后，将结果压入操作数栈。继续比较当前运算符和新的栈顶运算符。</p><h3 id="括号匹配" tabindex="-1"><a class="header-anchor" href="#括号匹配" aria-hidden="true">#</a> 括号匹配</h3><p>用栈保存未被匹配的左括号，从左到右扫描字符串，当扫描到左括号时，将其压入栈中，当扫描到右括号时，取出栈顶的左括号，判断能否匹配，如果能则继续（否则，判定括号不匹配）。匹配完之后，栈为空，否则判定括号不匹配。</p><h3 id="浏览器回退、前进" tabindex="-1"><a class="header-anchor" href="#浏览器回退、前进" aria-hidden="true">#</a> 浏览器回退、前进</h3><p>使用两个栈来实现。当按顺序访问页面 a、b、c 后，按照其顺序，将 a、b、c 压入栈 1。当点击回退时，将栈 1 的栈顶取出压入栈 2 中。当前进时，将栈 2 的栈顶取出压入栈 1。栈 1 没有数据了的话，说明不能再回退了；栈 2 没有数据了的话，说明不能再前进了。</p>',10),c=[d];function i(n,s){return e(),r("div",null,c)}const p=a(t,[["render",i],["__file","stack.html.vue"]]);export{p as default};
