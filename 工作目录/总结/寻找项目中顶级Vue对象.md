# 寻找项目中顶级Vue对象

## 参考

* [从一个奇怪的错误出发理解 Vue 基本概念](https://segmentfault.com/a/1190000008530684)
* [安装 - Vue.js](https://cn.vuejs.org/v2/guide/installation.html)
* [渲染函数 - Vue.js](https://cn.vuejs.org/v2/guide/render-function.html)

## 问题背景

* 在调试Chrome的时候, 发现不能找到`vm`这个对象.
* 在`window`下面也没有看到这个对象.
* 产生了好奇心.

## 过程分析

* 在dev环境下面:
  * 在控制台看的时候放到了 `window`的`__VUE_DEVTOOLS_GLOBAL_HOOK__`中
* 找到了new Vue的运行栈.
* 但是没能确定在Vue中具体的运行过程.
* 应该是在import的时候, webpack就把引入的Vue对象放到了某个地方, 保存起来了.

## 运行时构建的Vue库/独立构建的Vue库

* 使用`import`/`require`引入的是 运行时构建的Vue库 `dist/vue.runtime.common.js`
* 使用`<script>`引入的是独立构建的Vue库
* **区别就是是否包含一个template功能**, 因为在运行时构建的Vue库中, 我们通过打包工具webpack等解决了这一问题.

## 选择挂载优先级

* `render`渲染函数 > `template`编译模板 > 挂载到el属性上的指定DOM

### render函数

* 挂载在Vue的顶级函数上面. 渲染的最优先选择
* `render: function(cb / createElement) {}` // 所有的的核心都在这个回调函数中
* 这个回调函数就是createElement函数, 也就是我们用来创建VNode的函数, render返回的就是 回调函数的执行结果
* `return createElement(tag, data, array)` // 这个就是我们的返回结果
* 参数第一个表示, 我们的标签名称, 或者是一个实例组件. data就是我们这个组件的描述信息了. 什么都有.
* 最后一个参数, 我们用来递归形成的子标签, 或者子组件, 数组表示平行关系
* 第二个参数, 如果是一个字符串的话, 就是我们想要往里面插入的子组件陈列
* render: h => h(App) / render(h) {return h('div', this.hi)}

### vue不渲染Dom, 实现场景直接通信

* 新建文件 `import Vue from 'vue; export EventBus = new Vue()`
* 通过`$on`添加监听事件
  * `import EventBus from './event-bus.js; EventBus.$on('customerEvent', function() {})`.
  * 此处尽量不要使用箭头函数, 里面的指针不易改变
  * 回头自己试试.
* 其他文件引入, 通过`$emit`触发
  * `import EventBus from './event-bus.js; EventBus.$emit('customerEvent', ...params)`

## 查找vue.runtime.common.js

> 应该从打包工具开始查找