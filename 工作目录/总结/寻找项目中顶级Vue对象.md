# 寻找项目中顶级Vue对象 (一)

> 个人博客首发博客园: [http://www.cnblogs.com/zhangrunhao/](http://www.cnblogs.com/zhangrunhao/)

## 参考

> 感谢作者

* [从一个奇怪的错误出发理解 Vue 基本概念](https://segmentfault.com/a/1190000008530684)
* [安装 - Vue.js](https://cn.vuejs.org/v2/guide/installation.html)
* [渲染函数 - Vue.js](https://cn.vuejs.org/v2/guide/render-function.html)
* [Vue2 dist 目录下各个文件的区别](https://www.cnblogs.com/FineDay/p/8757166.html)
* [聊聊 package.json 文件中的 module 字段](https://loveky.github.io/2018/02/26/tree-shaking-and-pkg.module/)
* [ES6模块 和 CommonJS 的区别](https://wmaqingbo.github.io/blog/2017/09/15/ES6%E6%A8%A1%E5%9D%97-%E5%92%8C-CommonJS-%E7%9A%84%E5%8C%BA%E5%88%AB/)


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

### `/dist`文件夹下八个文件的区别

* 按照运行环境区分: 完整构建/运行时构建, 也就是是否可以使用`template`选项
* 按照模块化规范: UMD/CommonJS/ESModule
  * AMD: requireJS实现. 主要是异步加载模块. (偏向浏览器)
  * COMMONJS: Node, 同步加载, 模块无需包装. (偏向服务器)
  * UMD: AMD和COMMON的结合, (先判断是否执行export/Node), 再判断是否支持(define/AMD).
* vue.common.js: 基于`common`的完整构建. `使用webpack打包时, 需要配置别名.`(**这就不太理解了**)
  * 我又预感, 问题应该就出在webpack的配置中

```json
// webpack-1
{
  resolve: {
    alias: {
      'vue$': 'vue/dist/vue.common.js'
    }
  }
}
```

* vue.esm.js: 基于ESModule的完整构建. 使用webpack打包时, 也是需要配置
* vue.js: 基于UMD的完整构建
* vue.runtime.common.js: 基于common的运行时构建. 不支持template, .vue被解析成了render函数
* vue.runtime.esm.js: 基于ESModule的运行时构建.
* vue.runtime.js: 基于UMD的运行时构建.

### 项目直接引用的vue, 引用的是vue.runtime.common.js吗. 为何可以使用ESModle

* 先贴出vue的package.json

```json
{
  // ...
  "main": "dist/vue.runtime.common.js",
  "module": "dist/vue.runtime.esm.js",
  "unpkg": "dist/vue.js",
  "jsdelivr": "dist/vue.js",
  // ...
}
```

* main: 是基于COMMONJS的. module: 是基于ES6的.
* 因为使用ES6的话, 可以配置`uglifyjs-webpack-plugin`插件, 可以去除没有用到的函数.
* 但是因为有些npm包不支持ES6, 比如有些node环境.
* 这个时候, 会判断当前支持哪种环境, 然后选择不同的包.
* **引入的时候, 不论包怎么导出都可用`import`引入. 但是导出的时候, 就会区分出来. 使用export/export default关键字, 还是module.exports/exports导出**

> 结论, 我们的项目, 应该是引用了run.runtime.esm.js

### webpack中配置别名

* `baseConf.resolve.alias.vue = 'vue/dist/vue.common.js';`
* 当我们解析vue / vue$ 的时候, 就会解析到指定的目录下面.