import{_ as n}from"./plugin-vue_export-helper-c27b6911.js";import{o as s,c as a,b as t}from"./app-2c4d3118.js";const p={},e=t(`<h2 id="_1-快速介绍" tabindex="-1"><a class="header-anchor" href="#_1-快速介绍" aria-hidden="true">#</a> 1. 快速介绍</h2><div class="language-javascript line-numbers-mode" data-ext="js"><pre class="language-javascript"><code><span class="token keyword">let</span> arr <span class="token operator">=</span> <span class="token keyword">new</span> <span class="token class-name">Array</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
<span class="token keyword">let</span> arr <span class="token operator">=</span> <span class="token punctuation">[</span><span class="token punctuation">]</span><span class="token punctuation">;</span>

<span class="token keyword">let</span> fruits <span class="token operator">=</span> <span class="token punctuation">[</span><span class="token string">&quot;Apple&quot;</span><span class="token punctuation">,</span> <span class="token string">&quot;Orange&quot;</span><span class="token punctuation">,</span> <span class="token string">&quot;Plum&quot;</span><span class="token punctuation">]</span><span class="token punctuation">;</span>
fruits<span class="token punctuation">[</span><span class="token number">3</span><span class="token punctuation">]</span> <span class="token operator">=</span> <span class="token string">&quot;Banana&quot;</span><span class="token punctuation">;</span>
<span class="token function">alert</span><span class="token punctuation">(</span>fruits<span class="token punctuation">[</span><span class="token number">2</span><span class="token punctuation">]</span><span class="token punctuation">)</span><span class="token punctuation">;</span>

<span class="token comment">// arr.at(i)  支持「负数」</span>
<span class="token function">alert</span><span class="token punctuation">(</span>fruits<span class="token punctuation">[</span>fruits<span class="token punctuation">.</span>length <span class="token operator">-</span> <span class="token number">1</span><span class="token punctuation">]</span><span class="token punctuation">)</span>
<span class="token function">alert</span><span class="token punctuation">(</span>fruits<span class="token punctuation">.</span><span class="token function">at</span><span class="token punctuation">(</span><span class="token operator">-</span><span class="token number">1</span><span class="token punctuation">)</span><span class="token punctuation">)</span>

<span class="token doc-comment comment">/**  push() pop() */</span>
<span class="token function">alert</span><span class="token punctuation">(</span>fruits<span class="token punctuation">.</span><span class="token function">pop</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">)</span><span class="token punctuation">;</span>    <span class="token comment">// 删掉了 Banana，并将其 alert</span>
<span class="token function">alert</span><span class="token punctuation">(</span>fruits<span class="token punctuation">)</span><span class="token punctuation">;</span>          <span class="token comment">// Apple, Orange, Plum</span>

fruits<span class="token punctuation">.</span><span class="token function">push</span><span class="token punctuation">(</span><span class="token string">&quot;Pear&quot;</span><span class="token punctuation">)</span><span class="token punctuation">;</span>    <span class="token comment">// 相当于 fruits[fruits.length] = &quot;Pear&quot;</span>
<span class="token function">alert</span><span class="token punctuation">(</span>fruits<span class="token punctuation">)</span><span class="token punctuation">;</span>          <span class="token comment">// Apple, Orange, Plum, Pear</span>

<span class="token doc-comment comment">/**  shift() unshift() */</span>
<span class="token function">alert</span><span class="token punctuation">(</span>fruits<span class="token punctuation">.</span><span class="token function">shift</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">)</span><span class="token punctuation">;</span>    <span class="token comment">// 删掉了 Apple， 并将其 alert</span>
<span class="token function">alert</span><span class="token punctuation">(</span>fruits<span class="token punctuation">)</span><span class="token punctuation">;</span>            <span class="token comment">// Orange, Plum, Pear</span>

fruits<span class="token punctuation">.</span><span class="token function">unshift</span><span class="token punctuation">(</span><span class="token string">&#39;Apple&#39;</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
<span class="token function">alert</span><span class="token punctuation">(</span> fruits <span class="token punctuation">)</span><span class="token punctuation">;</span> <span class="token comment">// Apple, Orange, Plum, Pear</span>

<span class="token comment">// push() 和 unshift() 可以一次添加多个元素</span>
<span class="token keyword">let</span> fruits <span class="token operator">=</span> <span class="token punctuation">[</span><span class="token string">&quot;Apple&quot;</span><span class="token punctuation">]</span><span class="token punctuation">;</span>
fruits<span class="token punctuation">.</span><span class="token function">push</span><span class="token punctuation">(</span><span class="token string">&quot;Orange&quot;</span><span class="token punctuation">,</span> <span class="token string">&quot;Peach&quot;</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
fruits<span class="token punctuation">.</span><span class="token function">unshift</span><span class="token punctuation">(</span><span class="token string">&quot;Pineapple&quot;</span><span class="token punctuation">,</span> <span class="token string">&quot;Lemon&quot;</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
<span class="token function">alert</span><span class="token punctuation">(</span> fruits <span class="token punctuation">)</span><span class="token punctuation">;</span>        <span class="token comment">// [&quot;Pineapple&quot;, &quot;Lemon&quot;, &quot;Apple&quot;, &quot;Orange&quot;, &quot;Peach&quot;]</span>


<span class="token doc-comment comment">/** 循环 */</span>
<span class="token keyword">let</span> arr <span class="token operator">=</span> <span class="token punctuation">[</span><span class="token string">&quot;Apple&quot;</span><span class="token punctuation">,</span> <span class="token string">&quot;Orange&quot;</span><span class="token punctuation">,</span> <span class="token string">&quot;Pear&quot;</span><span class="token punctuation">]</span><span class="token punctuation">;</span>
<span class="token comment">// 1. for</span>
<span class="token keyword">for</span> <span class="token punctuation">(</span><span class="token keyword">let</span> i <span class="token operator">=</span> <span class="token number">0</span><span class="token punctuation">;</span> i <span class="token operator">&lt;</span> arr<span class="token punctuation">.</span>length<span class="token punctuation">;</span> i<span class="token operator">++</span><span class="token punctuation">)</span><span class="token punctuation">{</span>
    <span class="token function">alert</span><span class="token punctuation">(</span>arr<span class="token punctuation">[</span>i<span class="token punctuation">]</span><span class="token punctuation">)</span>
<span class="token punctuation">}</span>

<span class="token comment">// 2. for ... of 只获取元素，不获取索引</span>
<span class="token keyword">for</span> <span class="token punctuation">(</span> <span class="token keyword">let</span> fruit <span class="token keyword">of</span> fruits<span class="token punctuation">)</span> <span class="token punctuation">{</span>
    <span class="token function">alert</span><span class="token punctuation">(</span>fruit<span class="token punctuation">)</span>
<span class="token punctuation">}</span>

<span class="token comment">// 3. for ... in 获取索引</span>
<span class="token comment">// 适用于普通对象并做了对应优化，但是不适用于数组，速度要慢 10-100 倍</span>
<span class="token keyword">for</span> <span class="token punctuation">(</span><span class="token keyword">let</span> key <span class="token keyword">in</span> fruits<span class="token punctuation">)</span> <span class="token punctuation">{</span>
    <span class="token function">alert</span><span class="token punctuation">(</span>fruits<span class="token punctuation">[</span>key<span class="token punctuation">]</span><span class="token punctuation">)</span>
<span class="token punctuation">}</span>

<span class="token doc-comment comment">/** length */</span>
<span class="token comment">// 显示地将 length 减小再恢复原长，此过程不可逆（被截断的元素并不会找回来，是 undefined）</span>
<span class="token comment">// 清空数组最简单的方式</span>
arr<span class="token punctuation">.</span>length <span class="token operator">=</span> <span class="token number">0</span>

<span class="token comment">// 多维数组</span>
<span class="token keyword">let</span> matrix <span class="token operator">=</span> <span class="token punctuation">[</span>
  <span class="token punctuation">[</span><span class="token number">1</span><span class="token punctuation">,</span> <span class="token number">2</span><span class="token punctuation">,</span> <span class="token number">3</span><span class="token punctuation">]</span><span class="token punctuation">,</span>
  <span class="token punctuation">[</span><span class="token number">4</span><span class="token punctuation">,</span> <span class="token number">5</span><span class="token punctuation">,</span> <span class="token number">6</span><span class="token punctuation">]</span><span class="token punctuation">,</span>
  <span class="token punctuation">[</span><span class="token number">7</span><span class="token punctuation">,</span> <span class="token number">8</span><span class="token punctuation">,</span> <span class="token number">9</span><span class="token punctuation">]</span>
<span class="token punctuation">]</span><span class="token punctuation">;</span>

<span class="token doc-comment comment">/** toString() */</span>
<span class="token comment">// 以逗号连接数组中的元素</span>
<span class="token keyword">let</span> arr <span class="token operator">=</span> <span class="token punctuation">[</span><span class="token number">1</span><span class="token punctuation">,</span> <span class="token number">2</span><span class="token punctuation">,</span> <span class="token number">3</span><span class="token punctuation">]</span><span class="token punctuation">;</span>
<span class="token function">alert</span><span class="token punctuation">(</span> arr <span class="token punctuation">)</span><span class="token punctuation">;</span> <span class="token comment">// 1,2,3</span>
<span class="token function">alert</span><span class="token punctuation">(</span> <span class="token function">String</span><span class="token punctuation">(</span>arr<span class="token punctuation">)</span> <span class="token operator">===</span> <span class="token string">&#39;1,2,3&#39;</span> <span class="token punctuation">)</span><span class="token punctuation">;</span> <span class="token comment">// true</span>

<span class="token comment">// 数组没有 Symbol.toPrimitive，也没有 valueOf，只能执行 toString 进行转换</span>
<span class="token function">alert</span><span class="token punctuation">(</span> <span class="token punctuation">[</span><span class="token punctuation">]</span> <span class="token operator">+</span> <span class="token number">1</span> <span class="token punctuation">)</span><span class="token punctuation">;</span>    <span class="token comment">// &quot;1&quot;</span>
<span class="token function">alert</span><span class="token punctuation">(</span> <span class="token punctuation">[</span><span class="token number">1</span><span class="token punctuation">]</span> <span class="token operator">+</span> <span class="token number">1</span> <span class="token punctuation">)</span><span class="token punctuation">;</span>   <span class="token comment">// &quot;11&quot;</span>
<span class="token function">alert</span><span class="token punctuation">(</span> <span class="token punctuation">[</span><span class="token number">1</span><span class="token punctuation">,</span><span class="token number">2</span><span class="token punctuation">]</span> <span class="token operator">+</span> <span class="token number">1</span> <span class="token punctuation">)</span><span class="token punctuation">;</span> <span class="token comment">// &quot;1,21&quot;</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="不要用-比较数组" tabindex="-1"><a class="header-anchor" href="#不要用-比较数组" aria-hidden="true">#</a> 不要用 <code>==</code> 比较数组</h3><ul><li>仅当两个对象引用的是同一个对象时，它们才相等 <code>==</code></li><li>如果 <code>==</code> 两边一个是对象、一个是基本类型，那么该对象会被转换为原始类型</li><li><code>null == undefined</code></li></ul><div class="language-javascript line-numbers-mode" data-ext="js"><pre class="language-javascript"><code><span class="token comment">// 左边是基本类型，右边是数组，于是数组被转换成了基本类型: &#39;&#39;</span>
<span class="token number">0</span> <span class="token operator">==</span> <span class="token punctuation">[</span><span class="token punctuation">]</span><span class="token punctuation">;</span>    <span class="token comment">// true，&#39;&#39; 被转换成了数字0</span>
<span class="token string">&#39;0&#39;</span> <span class="token operator">==</span> <span class="token punctuation">[</span><span class="token punctuation">]</span><span class="token punctuation">;</span>  <span class="token comment">// false，&#39;&#39; 不需要进一步进行类型转化，它们是不同的字符串</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>数组可以逐项比较，用 <code>for</code> 循环或迭代来进行。</p><h2 id="_2-数组的方法" tabindex="-1"><a class="header-anchor" href="#_2-数组的方法" aria-hidden="true">#</a> 2. 数组的方法</h2><p>上面已经介绍了 <code>push()</code>, <code>pop()</code>, <code>shift()</code>, <code>unshift()</code>。</p><ul><li><p><code>arr.splice(start[, deleteCount, elem1, ..., elemN])</code></p><ul><li>改变原数组，添加、删除、插入都可以完成</li><li>从 <code>start</code> 开始修改，删除 <code>deleteCount</code> 个元素，并在当前位置插入 <code>elem1, ..., elemN</code></li><li>返回被删除的元素所组成的数组</li><li>允许负向索引<div class="language-javascript line-numbers-mode" data-ext="js"><pre class="language-javascript"><code><span class="token keyword">let</span> arr <span class="token operator">=</span> <span class="token punctuation">[</span><span class="token number">1</span><span class="token punctuation">,</span> <span class="token number">2</span><span class="token punctuation">,</span> <span class="token number">5</span><span class="token punctuation">]</span><span class="token punctuation">;</span>
arr<span class="token punctuation">.</span><span class="token function">splice</span><span class="token punctuation">(</span><span class="token operator">-</span><span class="token number">1</span><span class="token punctuation">,</span> <span class="token number">0</span><span class="token punctuation">,</span> <span class="token number">3</span><span class="token punctuation">,</span> <span class="token number">4</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
<span class="token function">alert</span><span class="token punctuation">(</span> arr <span class="token punctuation">)</span><span class="token punctuation">;</span> <span class="token comment">// 1,2,3,4,5</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div></li></ul></li><li><p><code>arr.slice([start], [end])</code></p><ul><li>不改变原数组，将 [start, end) 区间的元素复制到新的数组中</li><li><code>start</code> 和 <code>end</code> 都可以是负数</li></ul></li><li><p><code>arr.concat(arg1, arg2...)</code></p><ul><li>不改变原数组。创建新数组，其中包含来自于其他数组和其他项的值</li><li>接受任意数量的参数，数组或值都行</li></ul><details class="hint-container details"><summary>\`argN\` 是数组时，其中的所有元素都会被复制；否则，复制参数本身</summary><div class="language-javascript line-numbers-mode" data-ext="js"><pre class="language-javascript"><code><span class="token keyword">let</span> arr <span class="token operator">=</span> <span class="token punctuation">[</span><span class="token number">1</span><span class="token punctuation">,</span> <span class="token number">2</span><span class="token punctuation">]</span><span class="token punctuation">;</span>
<span class="token function">alert</span><span class="token punctuation">(</span> arr<span class="token punctuation">.</span><span class="token function">concat</span><span class="token punctuation">(</span><span class="token punctuation">[</span><span class="token number">3</span><span class="token punctuation">,</span> <span class="token number">4</span><span class="token punctuation">]</span><span class="token punctuation">)</span> <span class="token punctuation">)</span><span class="token punctuation">;</span> <span class="token comment">// 1,2,3,4</span>
<span class="token function">alert</span><span class="token punctuation">(</span> arr<span class="token punctuation">.</span><span class="token function">concat</span><span class="token punctuation">(</span><span class="token punctuation">[</span><span class="token number">3</span><span class="token punctuation">,</span> <span class="token number">4</span><span class="token punctuation">]</span><span class="token punctuation">,</span> <span class="token punctuation">[</span><span class="token number">5</span><span class="token punctuation">,</span> <span class="token number">6</span><span class="token punctuation">]</span><span class="token punctuation">)</span> <span class="token punctuation">)</span><span class="token punctuation">;</span> <span class="token comment">// 1,2,3,4,5,6</span>
<span class="token function">alert</span><span class="token punctuation">(</span> arr<span class="token punctuation">.</span><span class="token function">concat</span><span class="token punctuation">(</span><span class="token punctuation">[</span><span class="token number">3</span><span class="token punctuation">,</span> <span class="token number">4</span><span class="token punctuation">]</span><span class="token punctuation">,</span> <span class="token number">5</span><span class="token punctuation">,</span> <span class="token number">6</span><span class="token punctuation">)</span> <span class="token punctuation">)</span><span class="token punctuation">;</span> <span class="token comment">// 1,2,3,4,5,6</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>对于对象（即使是类数组对象），由于它不是数组，所以会被当做元素直接添加</p><div class="language-javascript line-numbers-mode" data-ext="js"><pre class="language-javascript"><code><span class="token keyword">let</span> arr <span class="token operator">=</span> <span class="token punctuation">[</span><span class="token number">1</span><span class="token punctuation">,</span> <span class="token number">2</span><span class="token punctuation">]</span><span class="token punctuation">;</span>
<span class="token keyword">let</span> arrayLike <span class="token operator">=</span> <span class="token punctuation">{</span>
<span class="token number">0</span><span class="token operator">:</span> <span class="token string">&quot;something&quot;</span><span class="token punctuation">,</span>
<span class="token literal-property property">length</span><span class="token operator">:</span> <span class="token number">1</span>
<span class="token punctuation">}</span><span class="token punctuation">;</span>

<span class="token function">alert</span><span class="token punctuation">(</span> arr<span class="token punctuation">.</span><span class="token function">concat</span><span class="token punctuation">(</span>arrayLike<span class="token punctuation">)</span> <span class="token punctuation">)</span><span class="token punctuation">;</span> <span class="token comment">// 1,2,[object Object]</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>如果类数组中有 <code>Symbol.isConcatSpreadable</code> 属性，那么它会被当做一个数组来处理：</p><div class="language-javascript line-numbers-mode" data-ext="js"><pre class="language-javascript"><code><span class="token keyword">let</span> arr <span class="token operator">=</span> <span class="token punctuation">[</span><span class="token number">1</span><span class="token punctuation">,</span> <span class="token number">2</span><span class="token punctuation">]</span><span class="token punctuation">;</span>
<span class="token keyword">let</span> arrayLike <span class="token operator">=</span> <span class="token punctuation">{</span>
    <span class="token number">0</span><span class="token operator">:</span> <span class="token string">&quot;something&quot;</span><span class="token punctuation">,</span>
    <span class="token number">1</span><span class="token operator">:</span> <span class="token string">&quot;else&quot;</span><span class="token punctuation">,</span>
    <span class="token punctuation">[</span>Symbol<span class="token punctuation">.</span>isConcatSpreadable<span class="token punctuation">]</span><span class="token operator">:</span> <span class="token boolean">true</span><span class="token punctuation">,</span>
    <span class="token literal-property property">length</span><span class="token operator">:</span> <span class="token number">2</span>
<span class="token punctuation">}</span><span class="token punctuation">;</span>

<span class="token function">alert</span><span class="token punctuation">(</span> arr<span class="token punctuation">.</span><span class="token function">concat</span><span class="token punctuation">(</span>arrayLike<span class="token punctuation">)</span> <span class="token punctuation">)</span><span class="token punctuation">;</span> <span class="token comment">// 1,2,something,else</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div></details></li><li><p><code>arr.forEach(function(item, index, array) {...});</code></p></li><li><p><code>indexOf(item, from)</code>、<code>lastIndexOf(item, from)</code>、<code>includes(item, from)</code></p><ul><li>都使用 <code>===</code> 进行比较</li><li><code>includes()</code> 可以正确处理 <code>NaN</code>，而另外两个不能</li></ul></li><li><p><code>arr.find(function(item, index, array) {...});</code></p><ul><li>返回满足条件的第一个元素 <ul><li>如果返回 <code>true</code>，则返回 item 并停止迭代</li><li>如果为假值，则返回 undefined</li></ul></li><li><code>arr.findIndex</code>、<code>arr.findLastIndex</code> 和 <code>arr.find</code> 有相同的语法，但是返回的是元素的索引而不是元素本身，没找到则返回 <code>-1</code>。</li></ul></li><li><p><code>arr.filter(function(item, index, array) {...});</code></p><ul><li>返回满足条件的元素组成的数组 <ul><li>如果 <code>true</code>， item 被 push 到 results，迭代继续</li><li>如果什么都没找到，则返回空数组</li></ul></li></ul></li><li><p><code>arr.map(function(item, index, array) {...});</code></p></li><li><p><code>arr.sort()</code></p><ul><li>对数组进行**原位（in-place）**排序</li><li>返回排序后的数组，但由于修改了数组本身（in-place 的含义），所以这个返回值一般会被忽略</li><li>默认情况下按照字符串进行排序<div class="language-javascript line-numbers-mode" data-ext="js"><pre class="language-javascript"><code><span class="token keyword">let</span> arr <span class="token operator">=</span> <span class="token punctuation">[</span> <span class="token number">1</span><span class="token punctuation">,</span> <span class="token number">2</span><span class="token punctuation">,</span> <span class="token number">15</span> <span class="token punctuation">]</span><span class="token punctuation">;</span>
arr<span class="token punctuation">.</span><span class="token function">sort</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
<span class="token function">alert</span><span class="token punctuation">(</span> arr <span class="token punctuation">)</span><span class="token punctuation">;</span>  <span class="token comment">// 1, 15, 2</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div></li><li>可以自定义顺序进行排序，提供一个函数作为 <code>arr.sort()</code> 的参数 <ul><li>比较函数要返回：正数表示大于，负数表示小于</li></ul><div class="language-javascript line-numbers-mode" data-ext="js"><pre class="language-javascript"><code><span class="token keyword">let</span> arr <span class="token operator">=</span> <span class="token punctuation">[</span> <span class="token number">1</span><span class="token punctuation">,</span> <span class="token number">2</span><span class="token punctuation">,</span> <span class="token number">15</span> <span class="token punctuation">]</span><span class="token punctuation">;</span>
arr<span class="token punctuation">.</span><span class="token function">sort</span><span class="token punctuation">(</span><span class="token punctuation">(</span><span class="token parameter">a<span class="token punctuation">,</span> b</span><span class="token punctuation">)</span> <span class="token operator">=&gt;</span> a <span class="token operator">-</span> b<span class="token punctuation">)</span><span class="token punctuation">;</span>
<span class="token function">alert</span><span class="token punctuation">(</span>arr<span class="token punctuation">)</span><span class="token punctuation">;</span>  <span class="token comment">// 1, 2, 15</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div></li></ul></li><li><p><code>arr.reverse()</code> 颠倒顺序</p></li><li><p><code>split</code> 和 <code>join</code></p><ul><li><code>str.split(delim[, arrLength])</code></li><li><code>arr.join(glue)</code></li></ul></li><li><p><code>reduce/reduceRight</code> 根据数组计算单个值</p><ul><li>语法：<code>arr.reduce(function(accumulator, item, index, array) {...}, [initial]);</code><ul><li><code>accumulator</code>: 上一个函数调用的结果，第一次等于 <code>initial</code>（如果提供了的话），如果没有提供，那么会将数组的第一个元素作为初始值，并从第二个元素开始迭代</li><li><code>item</code>: 当前的数组元素</li><li><code>index</code>: 当前索引</li><li><code>arr</code>: 数组本身</li></ul></li><li><code>reduceRight</code> 从右到左</li></ul></li><li><p><code>Array.isArray(value)</code> 判断 <code>value</code> 是否为数组。对数组用 <code>typeof(value)</code> 只能得到 <code>object</code>。</p></li><li><p><code>arr.some(fn)</code>、<code>arr.every(fn)</code> 检查是否「存在/所有」元素满足 <code>fn</code></p></li><li><p><code>arr.fill(value, start, end)</code> 从索引 <code>start</code> 到 <code>end</code>，用重复的 <code>value</code> 填充数组</p></li><li><p><code>arr.copyWithin(target, start, end)</code> 将位置 <code>start</code> 到 <code>end</code> 的所有元素复制到<strong>自身</strong>的 <code>target</code> 位置（覆盖现有元素）</p></li><li><p><code>arr.flat(depth)/arr.flatMap(fn)</code> 从多维数组创建一个新的扁平数组。</p></li><li><p><code>Array.of(element0[, element1[, …[, elementN]]])</code> 基于可变数量的参数创建一个新的 Array 实例，而不需要考虑参数的数量或类型。</p></li></ul><p>注：几乎所有函数的数组方法，比如 <code>find</code>，<code>filter</code>，<code>map</code>，除了 <code>sort</code> 是一个特例，都接受一个可选的附加参数 <code>thisArg</code>。</p><details class="hint-container details"><summary>\`thisArg\`</summary><p>下面是完整的语法</p><div class="language-javascript line-numbers-mode" data-ext="js"><pre class="language-javascript"><code>arr<span class="token punctuation">.</span><span class="token function">find</span><span class="token punctuation">(</span>func<span class="token punctuation">,</span> thisArg<span class="token punctuation">)</span><span class="token punctuation">;</span>
arr<span class="token punctuation">.</span><span class="token function">filter</span><span class="token punctuation">(</span>func<span class="token punctuation">,</span> thisArg<span class="token punctuation">)</span><span class="token punctuation">;</span>
arr<span class="token punctuation">.</span><span class="token function">map</span><span class="token punctuation">(</span>func<span class="token punctuation">,</span> thisArg<span class="token punctuation">)</span><span class="token punctuation">;</span>
<span class="token operator">...</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>使用 <code>army</code> 的方法 <code>canJoin()</code> 作为过滤器，<code>thisArg</code> 用于传递上下文</p><div class="language-javascript line-numbers-mode" data-ext="js"><pre class="language-javascript"><code><span class="token keyword">let</span> army <span class="token operator">=</span> <span class="token punctuation">{</span>
  <span class="token literal-property property">minAge</span><span class="token operator">:</span> <span class="token number">18</span><span class="token punctuation">,</span>
  <span class="token literal-property property">maxAge</span><span class="token operator">:</span> <span class="token number">27</span><span class="token punctuation">,</span>
  <span class="token function">canJoin</span><span class="token punctuation">(</span><span class="token parameter">user</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
    <span class="token keyword">return</span> user<span class="token punctuation">.</span>age <span class="token operator">&gt;=</span> <span class="token keyword">this</span><span class="token punctuation">.</span>minAge <span class="token operator">&amp;&amp;</span> user<span class="token punctuation">.</span>age <span class="token operator">&lt;</span> <span class="token keyword">this</span><span class="token punctuation">.</span>maxAge<span class="token punctuation">;</span>
  <span class="token punctuation">}</span>
<span class="token punctuation">}</span><span class="token punctuation">;</span>

<span class="token keyword">let</span> users <span class="token operator">=</span> <span class="token punctuation">[</span>
  <span class="token punctuation">{</span><span class="token literal-property property">age</span><span class="token operator">:</span> <span class="token number">16</span><span class="token punctuation">}</span><span class="token punctuation">,</span>
  <span class="token punctuation">{</span><span class="token literal-property property">age</span><span class="token operator">:</span> <span class="token number">20</span><span class="token punctuation">}</span><span class="token punctuation">,</span>
  <span class="token punctuation">{</span><span class="token literal-property property">age</span><span class="token operator">:</span> <span class="token number">23</span><span class="token punctuation">}</span><span class="token punctuation">,</span>
  <span class="token punctuation">{</span><span class="token literal-property property">age</span><span class="token operator">:</span> <span class="token number">30</span><span class="token punctuation">}</span>
<span class="token punctuation">]</span><span class="token punctuation">;</span>

<span class="token comment">// 找到 army.canJoin 返回 true 的 user</span>
<span class="token comment">// 如果不传 army 作为 thisArg，那么 this.canJoin 将被作为独立函数调用，this 是 undefined</span>
<span class="token comment">// 也可以用 users.filter(user =&gt; army.canJoin(user)) 这是是 army 调用的，于是 this 是 army</span>
<span class="token keyword">let</span> soldiers <span class="token operator">=</span> users<span class="token punctuation">.</span><span class="token function">filter</span><span class="token punctuation">(</span>army<span class="token punctuation">.</span>canJoin<span class="token punctuation">,</span> army<span class="token punctuation">)</span><span class="token punctuation">;</span>

<span class="token function">alert</span><span class="token punctuation">(</span>soldiers<span class="token punctuation">.</span>length<span class="token punctuation">)</span><span class="token punctuation">;</span> <span class="token comment">// 2</span>
<span class="token function">alert</span><span class="token punctuation">(</span>soldiers<span class="token punctuation">[</span><span class="token number">0</span><span class="token punctuation">]</span><span class="token punctuation">.</span>age<span class="token punctuation">)</span><span class="token punctuation">;</span> <span class="token comment">// 20</span>
<span class="token function">alert</span><span class="token punctuation">(</span>soldiers<span class="token punctuation">[</span><span class="token number">1</span><span class="token punctuation">]</span><span class="token punctuation">.</span>age<span class="token punctuation">)</span><span class="token punctuation">;</span> <span class="token comment">// 23</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div></details>`,11),o=[e];function c(l,i){return s(),a("div",null,o)}const k=n(p,[["render",c],["__file","js-array.html.vue"]]);export{k as default};
