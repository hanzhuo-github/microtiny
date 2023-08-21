const n=JSON.parse('{"key":"v-5095a1d2","path":"/basic/character-encoding/Chapter1.html","title":"1. 术语","lang":"zh-CN","frontmatter":{"lang":"zh-CN","title":"1. 术语","description":null,"article":false,"order":1},"headers":[{"level":2,"title":"1. 基本术语","slug":"_1-基本术语","link":"#_1-基本术语","children":[]},{"level":2,"title":"2. 现代字符编码模型","slug":"_2-现代字符编码模型","link":"#_2-现代字符编码模型","children":[{"level":3,"title":"2.1 抽象字符表（ACR, Abstract Character Repertoire）","slug":"_2-1-抽象字符表-acr-abstract-character-repertoire","link":"#_2-1-抽象字符表-acr-abstract-character-repertoire","children":[]},{"level":3,"title":"2.2 编号字符集（CCS, Coded Character Set）","slug":"_2-2-编号字符集-ccs-coded-character-set","link":"#_2-2-编号字符集-ccs-coded-character-set","children":[]},{"level":3,"title":"2.3 字符编码方式/形式/格式/规则（CEF, Character Encoding Form）","slug":"_2-3-字符编码方式-形式-格式-规则-cef-character-encoding-form","link":"#_2-3-字符编码方式-形式-格式-规则-cef-character-encoding-form","children":[]},{"level":3,"title":"2.4 字符编码模式CES（CES, Character Encoding Scheme）","slug":"_2-4-字符编码模式ces-ces-character-encoding-scheme","link":"#_2-4-字符编码模式ces-ces-character-encoding-scheme","children":[]},{"level":3,"title":"2.5 传输编码语法（TES, Transfer Encoding Syntax）","slug":"_2-5-传输编码语法-tes-transfer-encoding-syntax","link":"#_2-5-传输编码语法-tes-transfer-encoding-syntax","children":[]},{"level":3,"title":"2.6 小结","slug":"_2-6-小结","link":"#_2-6-小结","children":[]}]}],"git":{"createdTime":1692617079000,"updatedTime":1692617079000,"contributors":[{"name":"Sunshine","email":"hanzhuosoul@gmail.com","commits":1}]},"readingTime":{"minutes":8.08,"words":2423},"filePathRelative":"basic/character-encoding/Chapter1.md","localizedDate":"2023年8月21日","excerpt":"<p>本系列文章是对<a href=\\"https://www.zhihu.com/column/paogenjiudi\\" target=\\"_blank\\" rel=\\"noopener noreferrer\\">知乎专栏「刨根问底字符编码」</a> 的学习记录。</p>\\n<h2> 1. 基本术语</h2>\\n<ul>\\n<li>\\n<p><strong>位（bit, binary digit）</strong>，表示为 <code>b</code>，亦称二进制位、比特位、位元，指二进制数中的一位。</p>\\n<ul>\\n<li>位串（bit string）：一连串的位</li>\\n</ul>\\n</li>\\n<li>\\n<p><strong>字节（byte）</strong>，表示为 <code>B</code>，又称位元组：</p>\\n<ul>\\n<li>半字节（nibble）：4个 bit</li>\\n<li>字节（byte）：8个 bit。有时用 8 位组（Octet）来强调 8 比特串</li>\\n<li>字（word）、双字（Dword, double word）、四字（Qword, Quad word）、十字（Tbyte, Ten byte）</li>\\n</ul>\\n<blockquote>\\n<p>现代 PC 一般以字节为单位，称为为按字节编址，因此字节一般也是存储器的最小存取单位以及处理器的最小寻址单位。<br>\\n这与字符编码关系密切，比如码元的单字节与多字节、字节序的大端序与小端序等，都与以字节为基础的基本数据类型密切相关。</p>\\n</blockquote>\\n</li>\\n<li>\\n<p><strong>字与字长</strong></p>\\n<ul>\\n<li>字（word）：作为一整个整体来处理或运算的一串比特位，通常分为若干字节</li>\\n<li>字长：字的长度（位数），决定了 CPU 一次操作实际处理的比特位数量。字长由 CPU 对外数据通路的数据总线宽度决定。</li>\\n</ul>\\n<blockquote>\\n<p>一般来说，计算机可以最高效处理的数据大小应该与其字长相同。<br>\\n桌面平台的处理器字长基本是 64 位，嵌入式平台 32 位，在某些专业领域（高端显卡等）64位甚至高达128位、256位。</p>\\n</blockquote>\\n</li>\\n<li>\\n<p><strong>编码（encode）</strong>：信息从一种形式转换为另一种形式的过程</p>\\n</li>\\n<li>\\n<p><strong>解码（decode）</strong>：编码的逆过程</p>\\n</li>\\n<li>\\n<p><strong>字符集（character set、charset）</strong></p>\\n</li>\\n<li>\\n<p><strong>字符编码（character encoding）</strong>：将字符集中的字符按一定方式编码为某指定集合中的某一对象的过程。</p>\\n</li>\\n<li>\\n<p><strong>字符编码模型（character encoding model）</strong>：反应字符编码系统的构成特点和个构成部分之间相互关系的模型框架。</p>\\n<ul>\\n<li>ASCII：传统字符编码模型。将字符集中的字符进行编号，编号就是该字符的编码</li>\\n<li>统一码（Unicode）、通用字符集（UCS）：现代字符编码模型</li>\\n</ul>\\n<blockquote>\\n<p>现代字符编码模型：</p>\\n<ol>\\n<li>有哪些字符</li>\\n<li>这些字符的编号是什么</li>\\n<li>这些编号如何编码成一系列逻辑层面有限大小的数字，即<strong>码元序列</strong></li>\\n<li>这些逻辑层面的码元序列如何转换为（即映射为）物理层面的<strong>字节序列(即字节流)</strong></li>\\n<li>在某些特殊的传输环境中（比如Email中），再进一步将字节序列进行适应性编码处理</li>\\n</ol>\\n<p>&nbsp;</p>\\n<p>核心思想：创建一个能够用<strong>不同方式</strong>来编码的<strong>通用</strong>字符集</p>\\n</blockquote>\\n</li>\\n</ul>"}');export{n as data};
