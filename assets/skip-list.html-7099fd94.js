const a=JSON.parse('{"key":"v-3a6dc312","path":"/code/data-structure-and-algorithm/skip-list.html","title":"跳表","lang":"zh-CN","frontmatter":{"lang":"zh-CN","title":"跳表","description":null,"article":false,"date":"2023-08-28T00:00:00.000Z"},"headers":[{"level":2,"title":"1. 跳表","slug":"_1-跳表","link":"#_1-跳表","children":[]},{"level":2,"title":"2. 时间复杂度","slug":"_2-时间复杂度","link":"#_2-时间复杂度","children":[]},{"level":2,"title":"3. 空间复杂度","slug":"_3-空间复杂度","link":"#_3-空间复杂度","children":[]},{"level":2,"title":"4. 高效的动态插入和删除（）","slug":"_4-高效的动态插入和删除","link":"#_4-高效的动态插入和删除","children":[]},{"level":2,"title":"5. 跳表索引动态更新","slug":"_5-跳表索引动态更新","link":"#_5-跳表索引动态更新","children":[]}],"git":{"createdTime":1700236816000,"updatedTime":1700236816000,"contributors":[{"name":"Sunshine","email":"hanzhuosoul@gmail.com","commits":1}]},"readingTime":{"minutes":3.15,"words":944},"filePathRelative":"code/data-structure-and-algorithm/skip-list.md","localizedDate":"2023年8月28日","excerpt":"<p>跳表（Skip List）是一种各方面性能都比较优秀的动态数据结构，可以支持快速的插入、删除、查找操作，写起来也不复杂，甚至可以代替红黑树（Red-black Tree）。</p>\\n<h2> 1. 跳表</h2>\\n<p>跳表类似于在链表中实现二分查找。在链表中进行查找时，只能从头到尾遍历链表，这样的查找效率很低，时间复杂度是 <span class=\\"katex\\"><span class=\\"katex-mathml\\"><math xmlns=\\"http://www.w3.org/1998/Math/MathML\\"><semantics><mrow><mi>O</mi><mo stretchy=\\"false\\">(</mo><mi>n</mi><mo stretchy=\\"false\\">)</mo></mrow><annotation encoding=\\"application/x-tex\\">O(n)</annotation></semantics></math></span><span class=\\"katex-html\\" aria-hidden=\\"true\\"><span class=\\"base\\"><span class=\\"strut\\" style=\\"height:1em;vertical-align:-0.25em;\\"></span><span class=\\"mord mathnormal\\" style=\\"margin-right:0.02778em;\\">O</span><span class=\\"mopen\\">(</span><span class=\\"mord mathnormal\\">n</span><span class=\\"mclose\\">)</span></span></span></span>。</p>"}');export{a as data};
