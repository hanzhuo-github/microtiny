const e=JSON.parse('{"key":"v-c6beb0e0","path":"/ai/deep-rl/policy-gradient.html","title":"Policy Gradient with PyTorch","lang":"zh-CN","frontmatter":{"lang":"zh-CN","title":"Policy Gradient with PyTorch","description":null,"article":false,"date":"2023-11-14T00:00:00.000Z","order":4},"headers":[{"level":2,"title":"1. Policy-gradient methods 的优劣","slug":"_1-policy-gradient-methods-的优劣","link":"#_1-policy-gradient-methods-的优劣","children":[{"level":3,"title":"1.1 优点","slug":"_1-1-优点","link":"#_1-1-优点","children":[]},{"level":3,"title":"1.2 缺点","slug":"_1-2-缺点","link":"#_1-2-缺点","children":[]}]},{"level":2,"title":"2. Policy-gradient 算法","slug":"_2-policy-gradient-算法","link":"#_2-policy-gradient-算法","children":[{"level":3,"title":"2.1 损失函数","slug":"_2-1-损失函数","link":"#_2-1-损失函数","children":[]},{"level":3,"title":"2.2 Gradient Ascent，Policy-gradient Theorem","slug":"_2-2-gradient-ascent-policy-gradient-theorem","link":"#_2-2-gradient-ascent-policy-gradient-theorem","children":[]}]}],"git":{"createdTime":1700236816000,"updatedTime":1700236816000,"contributors":[{"name":"Sunshine","email":"hanzhuosoul@gmail.com","commits":1}]},"readingTime":{"minutes":3.63,"words":1089},"filePathRelative":"ai/deep-rl/policy-gradient.md","localizedDate":"2023年11月14日","excerpt":"<p>之前介绍的 Q-Learning 是 value-based 方法，我们训练 value function 作为确定最优 policy 的中间媒介。这一章将介绍一种 policy-based 方法：policy gradient，然后使用 PyTorch 实现 Monte Carlo Reinforcement (policy gradient 的一种)。</p>\\n<p>先回顾一下 policy-based methods，我们直接训练 <span class=\\"katex\\"><span class=\\"katex-mathml\\"><math xmlns=\\"http://www.w3.org/1998/Math/MathML\\"><semantics><mrow><msup><mi>π</mi><mo lspace=\\"0em\\" rspace=\\"0em\\">∗</mo></msup></mrow><annotation encoding=\\"application/x-tex\\">\\\\pi ^ {*}</annotation></semantics></math></span><span class=\\"katex-html\\" aria-hidden=\\"true\\"><span class=\\"base\\"><span class=\\"strut\\" style=\\"height:0.6887em;\\"></span><span class=\\"mord\\"><span class=\\"mord mathnormal\\" style=\\"margin-right:0.03588em;\\">π</span><span class=\\"msupsub\\"><span class=\\"vlist-t\\"><span class=\\"vlist-r\\"><span class=\\"vlist\\" style=\\"height:0.6887em;\\"><span style=\\"top:-3.063em;margin-right:0.05em;\\"><span class=\\"pstrut\\" style=\\"height:2.7em;\\"></span><span class=\\"sizing reset-size6 size3 mtight\\"><span class=\\"mord mtight\\"><span class=\\"mord mtight\\">∗</span></span></span></span></span></span></span></span></span></span></span></span>，parameterize the policy。</p>"}');export{e as data};
