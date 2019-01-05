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
