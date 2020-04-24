# vue中methods中的方法闭包缓存问题

> 本人所有文章首发在博客园: [http://www.cnblogs.com/zhangrunhao/](http://www.cnblogs.com/zhangrunhao/)

## 问题背景

### 需求描述

* 在路由的导航栏中需要, 判断是否为第一次点击
* 需要一个标志位来记录是否点击过
* 现状:
  * 这个标志位只在一个函数中用过.不希望存放全局
  * 希望在这个methods中形成闭包, 用来缓存这个函数
  * 做出如下尝试后, 发现可以实现.
* 当前问题:
  * 不能在闭包调用时找到正确的this.

### 诡异点

* 测试使用时: 返回的this找到了window

```html
// 测试使用:
  <div id="app">
    <button @click="test">测试按钮</button>
  </div>
  <script>
    var app = new Vue({
      el: '#app',
      methods: {
        test: (() => {
          `use strict`
          console.log(this) // Window
          var flag = true
          return () => {
            console.log(this) // Window
            flag = false
          }
        })()
      }
    })
  </script>
```

* 实际项目中的this变成了`undefined`![错误截图](http://oz17n4xja.bkt.clouddn.com/36krWechatIMG1.jpeg)

* 更加诡异的是`debugger`之后, 我们一步步来看

* 当前代码:

```js
    pointJump: (() => {
      let isFirstChanged = false;
      console.log(this);
      debugger;
      return entry => {
        console.log(this);
        console.log(isFirstChanged);
        debugger;
        isFirstChanged = true;
      };
    })(),
```

* 操作:
  1. 刷新页面, 第一次函数立即执行![第一步](http://oz17n4xja.bkt.clouddn.com/36kr/WechatIMG2.jpeg)
  2. 页面生成完成后: 我们再次通过按钮触发事件: **此时debugger显示内存中为Vue的顶级对象, 而在控制台打印出来的依旧是undefined**
  ![在debugger中显示的内容](http://oz17n4xja.bkt.clouddn.com/WechatIMG3.jpeg)
  ![控制台显示的内容](http://oz17n4xja.bkt.clouddn.com/WechatIMG4.jpeg)

### 执行过程分析

* 第一次执行的时候为undefined是正常的, 因为第一次闭包执行, 没有找到this
* 当我们再次执行的时候, 虽然调用起来的上下文, 也就是this已经改了, 但是因为在作用域中那个`this`所代表的空间还是`undefined`, 所以没有能改变过来.
* 就造成了我们所看到的诡异的现象.

### 与测试文件有差别的原因

* 因为在测试环境下, 没有能开启严格模式.
* 经过两次不同位置的的开启尝试, 都不对
* 依旧可以找到window对象
* 现在推测是在vue内部进行的实现, 因为引入的vue版本不同.**需要再进行测试, 看来源码还是要好好过一遍**

```html
  <script>
    var app = new Vue({
      el: '#app',
      methods: {
        test: (() => {
          `use strict`
          console.log(this) // Window
          var flag = true
          return () => {
            console.log(this) // Window
            flag = false
          }
        })()
      }
    })
  </script>
```

### 最后找到原因的测试

* 因为箭头函数的this是不会改变, 拥有根据父级能够返回的this
* 然后因为上面的闭包环境中的this, 指向的一直都是`undefined`

```js
const test = (() => {
  let aaa = true;
  return function () {
    console.log(this);
    aaa = false;
  };
})();
mainJump(entry) {
  test.call(this);
},
```

## 解决方法

* **形成闭包返回的函数中, 不要使用箭头函数, 使用function定义即可**

```js
    pointJump: (() => {
      let isFirstChanged = false;
      return function () {
        console.log(this); // Vue的顶级对象
        isFirstChanged = true;
      };
    })(),
```

## 总结

* 箭头函数不会被call, bind等方法改变this指向
* 在闭包中返回函数, 缓存变量时, 使用function进行返回函数的定义.