# Promise.then(a, b)与Promise.then(a).catch(b)问题详解

> 原文: [When is .then(success, fail) considered an antipattern for promises?](https://stackoverflow.com/questions/24662289/when-is-thensuccess-fail-considered-an-antipattern-for-promises)

## 问题

  我在[bluebrid promise FAQ](https://github.com/petkaantonov/bluebird/wiki/Promise-anti-patterns)上面看到, 在那里讲到`.then(sucess, fail)`是一个[antipattern](https://github.com/petkaantonov/bluebird/wiki/Promise-anti-patterns#the-thensuccess-fail-anti-pattern). 我不能理解他关于`try`和`catch`的解释. 下面这个例子有什么错误.

  ```js
  some_promise.call()
  .then(function(res) {logger.log(res), function(err) {logger.log(err)}})
  ```

  这好像表示出, 下面才是正确的使用方式.

  ```js
  some_promise_call()
  .then(function(res) {logger.log(res)})
  .catch(function(err) {logger.log(err)})
  ```

  这两个例子有什么不同?

## 解答

### 他们有什么不同

  这个`.then()`会返回一个promise, 这个promise,以防在回调函数中出现的错误. 以便进行rejected的执行. 这意味着, 当你成功的`logger`执行的过程中, 发生了错误, 这个错误就会通过下一个`.catch`中的回调函数捕获, 但是没有办法在`sucess`后面的`fail`回调函数所捕获.

  下面是一张**控制流程**图:

  ![图片](https://i.stack.imgur.com/wX5mr.png)

  在同步代码中展示:

  ```js
  // some_promise_call().then(looger.log, looger.log)
  then: {
    try {
      var resluts = some_call()
    } catch(e) {
      logger.log(e)
      break then;
    }
    // else
    looger.log(resluts)
  }
  ```

  第二个`log`(就像是在`.then`中的第一个参数), 只有在没有异常发生的时候执行. 这种块级运行和`break`语法看起来有点奇怪. 这其实就是[Python中的`try-except-else`](https://stackoverflow.com/q/16138232/1048572)(推荐阅读).

  ```js
  // some_promise_call().then(logger.log).catch(logger.log)
  try {
    var results = some_call()
    logger.log(results)
  } catch (e) {
    logger.log(e)
  }
  ```

  这个`catch`也会捕获来着成功logger这个函数执行中所发生的异常.

  他们有非常大的不同.

### 我不理解他关于try和catch的解释

  分歧点就是在于你想要每一步都捕获错误, 还是不喜欢在链式中捕获错误. 一种预期就是你希望所有的错误都通过同一种错误处理, 当然, 当你使用`antipattern`(反模式)的时候, 错误在一些then的回调中并没有进行处理.

  然而, 这种模式的确非常有用. 当你确实希望错误发生的时候, 只在那一步进行处理, 并且你希望做一些完全不同的错误处理. 也就是这个错误是不可恢复的. 注意, 那就是你的流程控制分支, 当然, 在某些情况下他会非常实用.

### 关于你这个例子的错误

  ```js
  // 询问错误的例子:
  some_promise_call()
  .then(function(res) {logger.log(res)}), function(err) {logger.log(err}})
  ```

  当你需要重复你的回调函数的时候, 也就是catch后面继续执行的时候, 最好这么处理:

  ```js
  some_promise_call()
  .catch(function(e) {
    return e // 这是完全可以的, 我们将会打印这个错误
  })
  .done(function(res) {
    logger.log(res)
  })
  ```

  你也可以继续使用[`.finally()`](http://bluebirdjs.com/docs/api/finally.html)来处理.