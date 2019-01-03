# JavaScript引擎基本原理:Shapes和Inline Cashes

> 原文链接: [JavaScript engine fundamentals:Shapes and line Cahes](https://mathiasbynens.be/notes/shapes-ics)

  这篇文章描述了一些在js引擎中通用的关键点, 并不只是V8, 这个引擎的作者(Benedikt和Mathias)开发的. 作为一名JavaScript的开发者, 需要较深的理解JavaScript引擎是如何工作的, 那可以帮助你更改的冲原理层面提高你代码的性能.

## JavaScript 引擎管道

  这是你写出所有JS代码的开始. JS引擎会格式化你的代码, 并他们转成抽象语法树(AST).基于这个AST,解析器能够开始做他的事情, 开始产生字节码. 完美, 就在那一刻, 引擎开始真正的运行JS代码.

  ![图片](https://mathiasbynens.be/_img/js-engines/js-engine-pipeline.svg)

  为了能让他跑的更快,这些字节码能够和压缩后的数据一起发送给优化编译器, 这些优化编译器能够根据基于压缩后的代码, 做出某些确认的假设. 然后产生优化程度更高的代码.

  如果某些假设是不正确的, 那么优化编译器会自动去优化, 并返回解释器. (TODO: 不太理解退回到解释器, 是退回成初识的代码吗?)

## JavaScript引擎中的解释器和编译器管道

  现在让我们放到到在管道中的一个部分, 那是你真正运行JavaScript的地方. 就是代码被解析和优化的地方. 然后去对比一些在流行的JavaSript引擎中某些不同的地方.

  总的来说, 一个管道包含一个解析器和一个优化编译器 . 解释器会快速并源源不断的产生没有被优化过的字节码. 然后优化编译器会多花点时间.  但是最后产生一些优化程度更高的机器码.

  ![图片](https://mathiasbynens.be/_img/js-engines/interpreter-optimizing-compiler.svg)

  这种常见的管道, 几乎和V8中存在的一样. JavaScript引擎在Chrome和Node中是使用方式如下:

  ![图片](https://mathiasbynens.be/_img/js-engines/interpreter-optimizing-compiler-v8.svg)

  解释器在V8中被称为启动装置(Ignition), 负责生成和执行字节码. 当运行这些字节码的时候, 他会收集分析数据, 这些数据用来加速后面的执行. 当一个函数***hot***的时候. 举个例子, 就是他经常执行的时候, 生成字节码和分析的数据会被通过到TurboFan, 我们的优化编译器, 基于分析的数据会生成更高优化程度的机器码.

  ![图片](https://mathiasbynens.be/_img/js-engines/interpreter-optimizing-compiler-spidermonkey.svg)

  SpiderMonkey,   Mozilla的JavaScript引擎被用在火狐和SpriderNode上面, 他有一点点的不同. 他有两个优化编译器. 解释器首先使用基础的优化器优化, 产生一些优化后的代码. 当代码开始运行的时候, 会产生一些分析的数据, IonMonkey能够基于这些分析的数据产生更高程度的优化代码, 如果推测的优化项是错误的, 那么IconMonkey就会退回到基础优化器产生的代码.

  ![图片](https://mathiasbynens.be/_img/js-engines/interpreter-optimizing-compiler-chakra.svg)

  Chakra, 被用在Edge和Node-ChakraCore中的JavaScript引擎,设置了两个非常小的优化编译器. 解析器使用SimpleJIT开始优化, (JIT表示Just-In-Time compiler实时编译器), 哪里会产生一个优化后的代码. 产生一些分析后的数据, 这个FullJIT能够产生优化程度更高的代码.

  ![图片](https://mathiasbynens.be/_img/js-engines/interpreter-optimizing-compiler-jsc.svg)

  JavaScriptCore(简称JSC), 苹果用在Sarari上的和React Native上的JavaScript引擎. 使用三种不同的优化引擎, 使他变得极致. LLInt(Low-Level Interpreter), 最底层的的解析器, 使用基层优化器优化, 然后使用DFG(Data Flow Graph)优化器, 然后再使用FTL(Faster Than Light)优化器.

  为什么一些引擎比其他的引擎使用的更多的优化编译器. 这是权衡利弊的结果. 一个解析器能够分成快速的产生字节码, 但是字节码通常不够高效. 另一个方面来说, 一个优化编译器需要花费更长的事件, 但是最终可以产生一些更加高效的机器码. 这就是在更加快速的运行代码或者牺牲一些时间, 最后运行一些性能更高的代码. 一些引擎选择增加多个使用不同时间/高性能的优化编译器, 允许他们对于权衡利弊这事进行更高程度的控制, 但是增加了复杂性. 另一个方面, 权衡利弊也和内存的使用有关系. 后面的文章会有介绍.

  我们只是重点讲了在每一个浏览器中, 关于管道中的解析器和优化器的不同. 但基于这些不同, 在更高的层面上, **所有的JavaScript引擎都有相同的特性**: 那就是格式化和一些在管道中解析器和优化器的特性.

## JavaScript的对象模型

  让我们通过放到一些方面的实现来看看JavaScript引擎相同的部分.

  举个例子: JavaScript引擎如何实现的JavaScript的对象模型? 又使用来的哪些技巧来提升访问JavaScript对象的性能. 事实证明: 所有主要引擎的实现都非常相似.

  ECMAScript规范在本质上定义了所有的对象都作为一个字典, 用一些
  key, 去对应一些属性的描述.

  ![图片](https://mathiasbynens.be/_img/js-engines/object-model.svg)

  除了表示本身的`[[value]]`, 这个规范定义了一些其他的属性.

    * `[[writable]]` 确定这个属性是否可以重新分配,
    * `[[Enumerable]]` 确定了这个属性能否在`for-in`循环中展示,
    * 和`[[Configurable]]` 确定了这个属性能否被删除.

  这两个中括号(double square brackets)的表示, 看起来非常有趣, 这是规范表示不能直接保留的JavaScript属性. 通过使用JavaScript中的`Object.getOwnPropertyDesriptor`API, 你仍然可以任何给定的对象上面属性的描述.

  ```js
  const obj = {a:1}
  Object.getOwnPropertyDescriptor(obj, 'a')
  // {value: 1, writable: true, enumerable: true, configurable: true}
  ```

  好了, JavaScript就是这么定义对象的. 但是对于数组又是如何定义的呢?

  你一定能够想到, 数组作为一个特殊的类型的对象. 其中一个区别就是数组对于数组的索引, 有特殊的处理. ESMA规范规定 ***数组 索引*** 是一个特殊的术语. 在JS中数组的最大限制为2^23-1个元素. 数组的索引是任何在限制内的有效值, 就是从0到2^23-2的任何整数.

  另一个不同就是数组会有一个特殊的`length`属性.

  ```js
  const array = ['a', 'b']
  array.length  // 2
  array[2] = 'c'
  array.length  // 3
  ```

  在这个例子中, 数组被创建的时候`length`是`2`. 当我们分配另一个元素到索引2的位置上的时候, `length`属性自动被修改了.

  JavaScript定义数组的方式和对象类似. 例如: 所有的属性, 包括数组的索引, 都使用明确的使用字符串表示. 在数组中的第一个元素, 就是存储在属性`'0'`下面.

  ![图片](https://mathiasbynens.be/_img/js-engines/array-1.svg)

  `'length'`属性这是一个不能枚举和删除的属性.

  当一个元素被添加到数组中的时候, JavaScript会自动的更新`length`属性的`[[value]]`属性.

  通常来说, 数组和对象非常相似.

## 优化属性访问

  现在我们知道在JavaScript中对象是如何定义的, 让我们深入到JavaScript引擎如何高效的使用对象工作.

  让我们看下最简单的JavaScript程序, 访问属性是最常见的简单操作. 所以, JavaScript引擎能否快爽的属性是至关重要的.

  ```js
  const object = {
    foo: 'bar',
    baz: 'qux
  }
  // 在这, 我们访问object上的foo属性
  doSomething(objet.foo)
  //          ^^^^^^^^^
  ```

### Shapes

  在JavaScript程序中, 经常出现多个对象具有相同的属性. 这就表明, 很多对象具有相同的 ***模型(shape)***.

  ```js
  const object1 = { x: 1, y: 2 };
  const object2 = { x: 3, y: 4 };
  // 此时object1和object2就具有相同的模型
  ```

  一种非常常见的操作就是, 方位相同模型上的对象上的相同属性

  ```js
  function logX(object) {
    console.log(object.x);
    //          ^^^^^^^^
  }
  const object1 = { x: 1, y: 2 };
  const object2 = { x: 3, y: 4 };

  logX(object1);
  logX(object2)
  ```

  这一点非常重要, JavaScript能够基于对象的模型, 优化对象的属性访问. 下面是他的工作方式.

  我们假设我们有一个对象, 上面有`x`和`y`两个属性, 并且他使用的了我们之前讨论的字典数据结构: 使用字符串作为key, 这些key各自指向了他们对于对于属性的描述.

  ![图片](https://mathiasbynens.be/_img/js-engines/object-model.svg)

  当我们访问其中一个属性, 例如`object.y`, 然后引擎会去寻找在`JSObject`上的key`y`, 然后找到在一致的属性描述, 最后返回`[[Value]]`

  但是, 这些属性的藐视存储在缓存中的什么位置呢? 我们又是如何将这些描述作为`JSObject`一个部分进行存储的呢? 假设我们会看到后面更多的对象,使用这个模型. 这个时候,存储这个对象的整个字典,包括属性名称和描述,就变成了一种浪费. 因为所有具有相同模型的对象都是重复的. 这会造成非常多重复和不必要的内存使用. 作为一种优化方式, 引擎会存储个别对象的模型`Shape`.

  ![图片](https://mathiasbynens.be/_img/js-engines/shape-1.svg)

  模型包含了除了`[[Value]]`以外所有的属性名称和描述. 相反`Shape`包含了`JSObject`内部值的偏移量(offset), 所以引擎可以获取到正确的values值. 每一个`JSObject`都有都用这个相同的模型指针表示精确的模型接口. 现在每一个`JSObject`只需要存储属于他的独一无二的值.

  ![图片](https://mathiasbynens.be/_img/js-engines/shape-2.svg)

  好处就是当我们有多个对象的时候, 好处就变得明显. 无论我们有多少个对象, 只要他们有相同的墨香, 我们只需要存储一此模型和属性的信息.

  所有的JavaScript引擎都用到了模型的优化手段, 但是他们不一定成为模型:

    *  Academic papers: ***Hidden Classes*** (让人和js中的class搞混)
    *  V8: ***Maps*** (容易和`Map`混淆)
    * Chakra: ***Types*** (容易和js中的动态类型, 还有`typeof` 运算符搞混)
    * JavaScriptCore: ***Structures***
    * SpiderMonkey: ***Shapes***

  在本文中, 我们将继续使用shapes这个单词.

### Transition chains and tress

  当你有一个对象, 这个对象有一个确定的模型, 但是当你添加一个属性的时候, 会发生什么? 引擎发现一个新的模型的时候, 如何如何?

  ```js
  const object = {};
  object.x = 5;
  object.y = 6
  ```

  这种模型在JavaScript引擎中被称为 ***转换链(transition chains)***. 举个例子:

  ![图片](https://mathiasbynens.be/_img/js-engines/shape-chain-1.svg)

  这个对象起初时没有任何属性, 所以他指向一个空的模型. 当下一个操作添加了一个属性`x`, 并且赋值为`5`, 这时引擎就会转换为包含一个属性x为5, 并且第一个的偏移量为`0`的模型. 当再次添加属性y的时候, 引擎再次转换为另一个包含x和y的模型, 并且y的偏移量为1对应到`JSObject`上.

  > 提示: 模型收到添加属性顺序的影响. 例如: `{ x: 4, y: 5}` 和 `{ y: 5, x: 4 }` 使用的是不同的模型

  我们甚至不需要存储每一个模型的完整属性表. 相反, 每一个模型只需要知道新的属性的信息. 举个例子: 在下面的案例中, 我们并没有在最后一个模型中存储属性x的信息. 因为可以在之前的链(chain)找到他. 为了实现这个功能, 每一个模型, 都链接了他的上一个模型.

  ![图片](https://mathiasbynens.be/_img/js-engines/shape-chain-2.svg)

  如果你在代码中写下`o.x`, 引擎就会沿着转换链一层层的向上寻找, 一直找到一个模型有关于属性'x'的信息.

  但当我们不能创建一个原型链的时候呢?举个例子:首先我们有两个空对象, 然后我们对于他们分别添加不同的属性.

  ```js
  const object1 = {};
  object1.x = 5;
  const object2 = {};
  object2.y = 6;
  ```

  在这个例子中, 我们有一个分支来代替链, 结束的时候, 我们有一个 ***转换树(transition tree)***

  ![图片](https://mathiasbynens.be/_img/js-engines/shape-tree.svg)

  在这, 我们创建了一个空对象`a`, 然后给他添加了属性`x`. 结束后, `JSObject`包含一个唯一值和两个模型: 一个空模型, 和一个只包含属性x的模型.

  第二个例子开始的时候, 我们有一个控模型`b`, 然后添加了一个属性`y`. 最后, 我们有了两个模型连, 一共是有三个模型.

  那是不是意味着我们总是在开始时使用一个空模型?未必,引擎会针对那些含有确定属性的对象进行优化. 让我们给另外一个空对象添加属性x, 然后有一个对象已经拥有了确定的属性`x`

  ```js
  const object1 = {};
  object1.x = 5;
  const object2 = { x: 6 };
  ```

  在这个例子中, 首先我们是有一个空模型, 然后转换到一个包含属性`x`的模型. 就像我们之前看到的那样.

  在`object2`的例子中, 直接产生包含x属性的一个对象是意义的, 而不是先产生空对象, 再去转换.

  ![图片](https://mathiasbynens.be/_img/js-engines/empty-shape-bypass.svg)

  这个对象的描述, 一开始就从一个, 包含一个属性`x`的模型开始的. 有效的跳过了空模型. 这是V8和SpiderMonkey所使用的. 这种优化模式缩短了转换链, 并让对象的构造更加高效.

  Benedikt's 的博客[surprising polymorphism in React applications](https://medium.com/@bmeurer/surprising-polymorphism-in-react-applications-63015b50abc)讨论了这些微小的细节如何影响所展示的真实性能.

  下面是一个拥有'x', 'y', 和'z'的属性的3D的例子.

  ```js
  const point = {};
  point.x = 4;
  point.y = 5;
  point.z = 6;
  ```

  通过我们前面学到的, 会用在内存中使用三个模型来创建这个对象(并没有计算空模型). 当访问属性`x`的时候, 比如, 你在程序里写到`point.x`在你的程序里. 引擎需要沿着转换链线性寻找. 他会先寻找最下面的模型. 然后一层层向上寻找, 一直在最上面的模型中找到属性`x`的描述.

  ![图片](https://mathiasbynens.be/_img/js-engines/shapetable-1.svg)

  当我们做的操作越来越多的时候, 那一定会变得非常慢. 尤其是当一个对象具有非常多的属性的时候. 寻找属性的时间复杂度为`O(n)`, 即和对象上的属性数量线性相关. 为了加快搜索属性, JavaScript引擎加入了一个`ShapeTable`的数据结构. 这个`ShapeTable`是一个字典, 其中属性key映射不同模型上的属性描述.

  ![图片](https://mathiasbynens.be/_img/js-engines/shapetable-2.svg)

  稍等, 现在让我们往前想一想... 这就是我们之前添加模型的地方. 这就是关于模型的全部.

  模型的处理方式是非常有效的. 另一种优化方式称之为 ***内嵌缓存(Inline Caches)***