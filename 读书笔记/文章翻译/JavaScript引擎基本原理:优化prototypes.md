# JavaScript引擎基本原理: 优化prototypes

  这篇文章介绍了一些JavaScript引擎常用的优化关键点, 并不只是Benedikt和Mathias开发的v8. 作为一名js开发者, 更深层次的了解引擎的工作原理可以帮助你了解你代码的性能特征.

  之前, 我们js使用shapes和inline caches优化对象和数组的访问. 这篇文章介绍了优化管道的权衡利弊(trade-off, 就是前面的使用解析器和优化器的权衡), 以及介绍了引擎如何提升访问原型的性能.

## 优化层(tiers)和权衡利弊(trade-off)的执行

  我们上一篇文章介绍了现在JavaScript引擎都拥有的相同的管道(pipeline):

  ![图片](https://mathiasbynens.be/_img/js-engines/js-engine-pipeline.svg)

  我们也指出, 即使在引擎之间的高程度管道如此类似, 但是在优化管道的时候, 还是会有一些不同. 那是什么原因呢? 为什么一些引擎可以做到比其他引擎更高程度的优化层呢? 那就导致了权衡利弊这种结果, 是选择更快的产生代码去运行, 还是花费更多的时间在最后运行优化程度更高的代码.

  ![图片](https://mathiasbynens.be/_img/js-engines/tradeoff-startup-speed.svg)

  解析器可以更快的产生机器码, 但是这些机器码通常并不高效. 优化器使用另一种方式多花费一点时间可以产生更加高效的机器码.

  事实上这就是V8所使用的模型. V8中的解析器被称为启动器(ignition), 单就原始代码的执行速度而言, v8的解释器(ignition)是最快的. V8的优化器叫做(TurboFan), 最后可以产生优化程度更高的机器码.

  ![图片](https://mathiasbynens.be/_img/js-engines/tradeoff-startup-speed-v8.svg)

  启动延迟和执行速度之间的权衡, 导致了一些引擎选择在他们中间添加一个优化层. 举个例子: SpiderMonkey添加了一个 基线 (BaseLine) 在解释器和他的整个IconMonkey优化器之间.

  ![图片](https://mathiasbynens.be/_img/js-engines/tradeoff-startup-speed-spidermonkey.svg)

  解释器可以更快的产生字节码, 但是字节码的执行相对较慢. 基线 可以使用多一点时间产生代码, 但是可以提供更好的运行时间优化. 最后, IonMonkey优化器花费更长的时间产生的机器码, 这些代码可以运行的更加高效.

  让我们从一个具体的例子看下不同引擎下的管道(pipeline)如何使用它. 下面是一段在热循环中重复获取的代码.

  ```js
  let result = 0;
  for (let i = 0; i < 4242424242; i++) {
    result += i;
  }
  console.log(result);
  ```

  v8开始使用Ignition解释器运行代码. 引擎通过一些细节确定这段代码是 ***热(hot)*** 的, 开始启动TurboFan frontend, 这是TurboFan的一部分. 用来处理收集的数据, 生成一个基础的机器代码的表示. 这些东西通过不同的线程发送给TurboFan优化器, 用于以后的性能提升.

  ![图片](https://mathiasbynens.be/_img/js-engines/pipeline-detail-v8.svg)

  当优化器开始执行的时候, v8依旧使用ignition运行字节码. 当一些优化完成的时候, 我们获得更高执行效率的机器码, 然后接下来就是使用这些机器码进行运行.

  SpiderMonkey开始也是使用解释器运行代码. 但是他在中间已经添加了基线层, 这表示热代码(hot code)在第一时间发送给基线层. 基线层优化器在主线程上产生基线代码, 并在准备就绪后执行代码.

  ![图片](https://mathiasbynens.be/_img/js-engines/pipeline-detail-spidermonkey.svg)

  当代码运行一会的时候, SpiderMonkey启动Ionmonkey fronted, 和开始优化, 这和V8非常相似. 能够在IconMonkey开始优化的时候, 继续在Baseline上运行. 最后, 当优化结束, 优化后的代码代替基线代码开始执行.

  Chakra的体系结构和SpiderMonkey非常相似, 但是Chakra为了避免主线程阻塞会尝试运行更多的某些东西. 为了替代编译器运行在主线程的所有部分, Chaka会把所有编译器看起来像是需要的字节码和分析数据复制出来, 并发送他们给优化器, 用来决定优化过程.

  ![图片](https://mathiasbynens.be/_img/js-engines/pipeline-detail-chakra.svg)

  一旦代码产生完成, 引擎就开始运行SimpleJIT的代码. 相同的方式启动FullJIT. 这种方式的好处是: 复制所需要的时间远远低于一个完整的优化器(fronted)运行运行. 但是这种方式的缺点是, **启发式的复制(copy heuristic)** 会失去一些需要当前优化方式的信息, 所以没能保证代码质量会造成某种程度的延迟.

  在JavaScriptCor引擎中, 所有的优化编译器都会和JavaScript主线程一起 **完全同步** 执行. 那里并没有复制的部分. 相反, 主线程仅仅是触发在另一个线程上的编译工作, 也就是优化工作. 这些优化器会使用复杂的锁定方案访问主线程上的分析数据.

  ![图片](https://mathiasbynens.be/_img/js-engines/pipeline-detail-javascriptcore.svg)

  这种方案优点是减少了JavaScript优化器在主线程上的闪避(jank). 负面影响是需要处理复杂的多线程问题, 并且需要为各种操作付出锁的消耗.

  我们讨论了关于在解释器上更快的产生代码和在解释器上更快的产生代码. 但是还有一种权衡: **内存占用**! 为了说明这个问题, 下面是求两数加和的简单的JavaScript程序.

  ```js
  function add(x, y) {
    return x + y;
  }
  add(1, 2)
  ```

  下面是我们使用V8引擎中的ignition解释器, 对`add`函数产生的字节码.

  ```md
  StackCheck
  Ldar a1
  Add a0, [0]
  Return
  ```

  不要担心这些真实的字节码, 你并不需要真会认识他们. 需要强调的点是**只有四个表示**

  当代码变热的时候, TurboFan会产生下面这种更高程度优化的机器码.

  ```md
  leaq rcx,[rip+0x0]
  movq rcx,[rcx-0x37]
  testb [rcx+0xf],0x1
  jnz CompileLazyDeoptimizedCode
  push rbp
  movq rbp,rsp
  push rsi
  push rdi
  cmpq rsp,[r13+0xe88]
  jna StackOverflow
  movq rax,[rbp+0x18]
  test al,0x1
  jnz Deoptimize
  movq rbx,[rbp+0x10]
  testb rbx,0x1
  jnz Deoptimize
  movq rdx,rbx
  shrq rdx, 32
  movq rcx,rax
  shrq rcx, 32
  addl rdx,rcx
  jo Deoptimize
  shlq rdx, 32
  movq rax,rdx
  movq rsp,rbp
  pop rbp
  ret 0x18
  ```

  这里有 ***非常*** 多的代码, 尤其是当我们和字节码中四个表示符相比的时候. 和机器码相比, 字节码变得更加紧凑, 尤其是和优化过后的机器码相比. 但从另一个方面来说, 字节码需要一个解释器进行运行, 但是优化过后的代码可以通过处理器直接执行.

  这就是JavaScript引擎不去优化一切的主要原因之一. 刚刚我们看到的, 产生优化后的机器码需要更长的时间, 除此之外, 还有我们刚刚学到的**优化后的机器码也需要更高的内存空间**

  ![图片](https://mathiasbynens.be/_img/js-engines/tradeoff-memory.svg)

  > 摘要: JavaScript引擎有不同的优化层的原因: 对于解释器更快的产生字节码, 和优化器更加快速的产生代码的权衡. 这是一个策略, 你是否愿意付出更大的复杂度和开支, 来添加更多的优化层, 来获取更加精细的决策. 总结, 这是关于产生代码过程中优化程度, 和内存使用的权衡. 这就是JavaScript引擎只优化hot函数的原因.

## 优化原型属性访问

  上一篇文章中介绍到: JavaScript引擎如何通过引入Shapes和Inline Caches来优化对象属性. 回顾下: 引擎将对象的`Shape`和对象的值分开存储.

  ![图片](https://mathiasbynens.be/_img/js-engines/shape-2.svg)

  Shapes 支持一种被称为 ***Inline Caches 或者 ICs*** 的优化. 结合起来, Shapes和ICs能够提升你代码中相同地方, 重复访问的属性.

  ![图片](https://mathiasbynens.be/_img/js-engines/ic-4.svg)

### 类和基于原型的编程(Classes and prototype-based programming)

  现在我们知道如何更加快速的访问JavaScript对象上的属性, 让我们来看下最近JavaScript中新增的: classess. 下面是这种JavaScript类语法的表示形式:

  ```js
  class Bar {
    constructor(x) {
      this.x = x;
    }
    getX() {
      return this.x;
    }
  }
  ```

  尽管这是在JavaScript中新出现的一一种概念, 但他也不过是之前JavaScript关于原型编程的语法糖:

  ```js
  function Bar(x) {
    this.x = x;
  }
  Bar.prototype.getX = function getX() {
    return this.x;
  }
  ```

  在这, 我们分配了一个`getX`属性到`Bar.prototype`对象上. 他的实际的工作方式和其他的对象是一样的, 因为**在JavaScript中原型就是一个对象**! JavaScript语言更像是一门基于原型编程的语言, 通过原型分享方法的使用, 字段(也就是那些值)实际存储在真实的实例上.

  让我们仔细观察下, 当通过`Bar`的执行创建一个新的`foo`实例的时候, 所发生的一切.

  ```js
  const foo = new Bar(true)
  ```

  运行这段代码可以产生一个实例对象, 这个实例对象有一个模型, 这个模型上面只有一个属性`x`. `Bar.prototype`属于类`Bar`, 上面拥有属性`foo`

  ![图片](https://mathiasbynens.be/_img/js-engines/class-shape-1.svg)

  这个`Bar.prototype`也拥有它自己的模型, 包含了唯一的属性`getX`, 它的值对应了我们的函数`getX`, 就是执行的时候, 返回`this.x`的函数. `Bar.prototype`的原型就是`Object.prototype`, 这是JavaScript语言的一部分. `Object.prototype`就是原型链的根节点, 然后他的原型指向`null`.

  ![图片](https://mathiasbynens.be/_img/js-engines/class-shape-2.svg)

  当我们使用这个相同的类创建另一个实例的时候, 两个实例会共享一个对象模型, 就像我们前面讨论的那样. 两个实例的指针都指向同一个相同的`Bar.prototype`对象.

### Prototype property access

  好了, 现在我们知道了当我们定义一个类和创建一个实例的时候发生了什么. 但是, 如果我们运行一个实例上的方法会发生什么呢? 就像下面这样.

  ```js
  class Bar {
    constructor(x) {
      this.x = x;
    }
    getX() {
      return this.x;
    }
  }
  const foo = new Bar(true);
  const x = foo.getX();
  //            ^^^^^
  ```

  你可以理解为任何方法的执行都作为两个步骤.

  ```js
  const x = foo.getX();

  // 实际经过了两个步骤
  const $getX = foo.getX;
  const x = $getX.call(foo)
  ```

  第一步的时候, 加载这个函数, 那只是原型上的一个属性, 他的值恰恰是一个函数.第二步的时候, 使用实例上作为`this`运行这个值. 让我们完成从实例`foo`上加载函数`getX`的第一步.

  ![图片](https://mathiasbynens.be/_img/js-engines/method-load.svg)

  引擎先从`foo`实例开始寻找, 发现在`foo`模型上没有`getX`属性, 然后就会沿着原型链一直寻找. 当我们找到`Bar.prototype`, 获取了他的原型的模型, 发现了`getX`属性, 并且存储了偏移量`0`. 我们在`Bar.prototype`上发现`getX`是一个`JSFunction`. 那就是他了.

  JavaScript的灵活性, 可能让他们的原型链突然发生变化. 例如:

  ```js
  const foo = new Bar(true);
  foo.getX();
  // -> true

  Object.setPrototypeOf(foo, null);
  foo.getX();
  // -> Uncaught TypeError: foo.getX is not a function
  ```

  在这个例子中, 我们两次与运行`foof.getX()`, 但是每一次执行都有完全不同意义和结果. 这就是为什么, 即使原型在JavaScript仅仅是一个对象, 提高原型上属性的访问速度比仅仅提高在常规对象上面普通属性的访问, 要更有挑战性.

  下面这个程序, 能够发现, 加载原型属性是非常频繁的操作: 你每一次执行函数的时候都会发生.

  ```js
  class Bar{
    constructor(x) {
      this.x = x;
    }
    getX() {
      return this.x;
    }
  }
  const foo = new Bar(true);
  const x = foo.getX;
  //        ^^^^^^^^
  ```

  之前, 我们讨论了如果进行常规属性的加载优化, 便是通过使用Shapes和ICs. 那么我们应该如如优化具有相关模型的原型属性的的重复访问呢? 我们看下面的属性访问如果工作.

  ![图片](https://mathiasbynens.be/_img/js-engines/prototype-load-checks-1.svg)

  为了在某些特定的案例中保证对重复属性访问的最快速度, 我们需要确定以下三点.

1. `foo`的模型确定不含有`getX`, 并且模型不会改变. 这表示, 没有任何对于`foo`对象的添加或者删除属性的操作, 也不会对现有属性描述进行改变.
2. `foo`的原型依旧是最初的`Bar.prototype`. 这表示`foo`的原型不会通过`Object.setPrototypeOf()`或者直接访问特殊的`__proto__`进行改变.
3. `Bar.prototype`上的模型, 包含`getX`并且不会改变. 也就表示, 不会对`Bar.prototype`进行任何添加或者删除属性, 或缺对属性描述进行修改.

  在这个例子中, 我们需要对原型本身进行一次检查, 然后需要对原型上的每一个原型进行两次检查, 一直找到包含我们需要属性的原(**我不明白这里为什么需要检查两次**).`1+2N`次查找(N表示表示原型的复杂程度, (**是指原型链的长度, 还是原型上注册的属性个数**))在我们的案例中听起来没这么糟糕, 因为整个原型链相对短一些. 但是引擎经常会处理一些相对较长的原型链, 就想在一个普通的DOM案例中. 下面是例子:

  ```js
  const anchor = document.createElement('a');
  // -> HTMLAnchorElement

  const title = anchor.getAttribute('title');
  ```

  我们有了一个`HTMLAnchorElement`, 然后我们执行了元素上的`getAttrubute()`方法. 这个简单的锚点元素的原型链, 已经存在6层原型长度. 大部分使用的DOM方法不会在在`HTMLAnchorelElment`原型上直接注册, 但是在更高程度的原型链上.

  ![图片](https://mathiasbynens.be/_img/js-engines/anchor-prototype-chain.svg)

  只有在`Element.prototype`上面才可以发现方法`getAttribute()`方法. 那就意味着, 我们每次调用`anchor.getAttribute()`, JavaScript引擎都需要做一下工作:

1. 检查`getAttribute`是否存在于`anthor`对象本身.
2. 检查`HTMLAnchorElement.prototype`这个原型对象.
3. 确认`getAttribute`属性不在上面.
4. 检查下一个原型:`HTMLElement.prototype`
5. 确认`getAttribute`属性也不在这.
6. 终于检查到了下一个原型`Element.prototype`
7. 发现了`getAttribute`属性

  一共是七次查找. 因为在web中, 这种代码非常常见. 引擎应用一些技巧减少原型属性访问的检查次数, 是很关键的.

  退回上一个例子, 当我们访问`foo`上面的`getX`属性的时候, 一共经过了三次查找.

  ```js
  class Bar {
    constructor(x) {
      this.x = x;
    }
    getX() {
      return this.x;
    }
  }

  const foo = new Bar(true);
  const $getX = foo.getX;
  ```

  对于每个涉及的对象的模型, 我们都需要做属性检查, 直接找到携带属性的那个. 如果我们能够通过折叠属性检查变成缺少检查, 来检查属性检查, 就太好了. 并且这是引擎应用的非常重要的小技巧: 引擎存储在实例本身上的原型链替换为存储在`Shape`上.

  ![图片](https://mathiasbynens.be/_img/js-engines/prototype-load-checks-2.svg)

  每一个模型都指向了原型. 这也意味着每一次`foo`原型改变的时候, 引擎都会转变成一个新的模型. 现在我们只需要去检查一个对象的模型, 即可以判断是否含有目标属性, 又可以保护原型链.

  通过这个方法, 我们加快原型属性的访问, 从`1+2N`变为`1+N`. 但是那已经具有非常大的消耗, 因为依旧和原型链的长度线性相关. 引擎应用不同的技巧减少以后检查的次数, 尤其是后面关于相同属性加载的访问执行.

### Validity cells

  基于这个目的, V8特意处理的模型的形状. 每一个原型都有与其他对象不共享的模型 尤其是其他的原型对象. 并且这些原型模型, 都会有一个特殊的`ValidityCell`与他关联.

  ![图片](https://mathiasbynens.be/_img/js-engines/validitycell.svg)

  无论是任何关联原型的改变, 或者是原型上属性的改变, 这个`ValidityCell`都会失效. 让我们看下他实际如何工作.

  为了提高后面属性的加载, V8会在内存中安置一个具有四个属性的在线缓存.

  ![图片](https://mathiasbynens.be/_img/js-engines/ic-validitycell.svg)

  当我们第一次运行这段代码的时候, 进行预热处理, V8记录了我们发现原型上属性的偏移量, 含有这个属性的原型(在这个例子中就是`Bar.prototype`), 实例的模型(这个例子中是`foo`的模型), 然后也会有一条线指向当前的ValidityCell, 也就是 ***立即原型(immediate prototype)*** 那是一条来自实例原型的线(在这个例子中也是发生在`Bar.prototype`).

  下一次执行的时候, 这个内嵌缓存就被打开了, 引擎会去查找实例模型, 和`ValidityCell`. 当他是有效的时候, 引擎可以理解查找出`Prototype`上的`Offset`, 不再进行额外的查找.

  ![图片](https://mathiasbynens.be/_img/js-engines/validitycell-invalid.svg)

  当原型改变的时候, 给原型分配一个小的模型, 上一个`ValidityCell`失效. 导致在线缓存在下一次执行的时候关掉, 影响性能.

  让我们退回到之前的DOM元素的例子, 他意味着, 在`Object.prototype`上的任何改变, 都不只是让他自己的内嵌缓存失效, 但是也让他下面的原型, 包括`EventTarget.prototype`, `Node.prototype`, `Element.prototype`等等, 一直到`HTMLAnchorElement.prototype`的路都垮掉了.

  ![图片](https://mathiasbynens.be/_img/js-engines/prototype-chain-validitycells.svg)

  实际上, 在代码中修改`Object.prototype`表示再无性能可言. 千万不要这么做.

  让我们通过一个具体的例子探索更多. 看的出, 我们有一个类`Bar`, 并且我们有一个函数`loadX`, 通过`Bar`对象执行. 我们只是在刚刚通过一个来自相同类的实例, 执行了`loadX`这个函数.

  ```js
  class Bar { /* ... */ }
  function loadX(bar) {
    return bar.getX(); // IC for 'getX' on `Bar` instance
  }

  loadX(new Bar(true));
  loadX(new Bar(false));
  // IC in 'loadX' now links the `ValidityCell` for `Bar.prototype`

  Object.prototype.newMethod = y => y;
  // The `ValidityCell` in the `loadX` IC is invalid now, because `Object.prototype` changed
  ```

  在`loadX`上的内嵌缓存指向了`Bar.prototype`的`ValidityCell`. 如果你随后做了一些操作, 例如突然改变了`Object.prototype`, 这是JavaScript中所有原型的根节点, `ValidityCell`都会变得无效, 并且所有的在线缓存在下一次更改的时候, 都会关闭, 导致性能变得很差.

  让`Object.prototype`突然改变是非常糟糕的方法, 因为他可以让所有在此操作之前引擎放置的, 关于原型加载的内嵌缓存都失效. 下面是两一个不要做的例子:

  ```js
  Object.prototype.foo = function() {
    /* ... */
  };

  // Run critical code
  someObject.foo();
  // End of critical code

  delete Obejct.prototype.foo;
  ```

  我们扩展了`Object.prototype`, 那会让引擎之前放置的在线缓存失效. 然后我们使用这个新原型方法运行了一些代码. 整个引擎必须重新开始, 当我欧恩访问原型属性的时候, 设置新的属性缓存. 在最后, 我们自己"清除了自己", 然后移除了我们最近添加的原型方法.

  清除也许听起来是一个好主意, 真的吗? 哇, 在这个案例中, 他达到了最坏的后果. 修改`Object.prototype`删除上的属性, 会让所有的IC再次全部失效, 引擎又要重新开始.

  > 提示: 尽管, 原型只是一个对象, 但是他们已经通过JavaScript引擎特殊处理, 优化了再原型上查找方法的性能. 让你的原型保持孤独. 或者, 当你需要去移动原型的时候, 那就再所有的代码之前操作, 保证你最后一次操作, 并不让引擎针对你代码的优化失效.

## 另外

  我们学习了JavaScript引擎如何存储对象和类, `Shpae`s, 内嵌缓存, 和`ValidityCell`如果帮助我们优化原型操作. 基于这些知识, 我们发现了一个使用的JavaScript编码优化技巧, **不要乱搞原型**, (或者 你真的真的需要这么做的话, 在所有代码运行执行处理他.)