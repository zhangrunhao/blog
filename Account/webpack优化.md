# 记账项目 - webpack优化

## 参考

* [學習 Webpack5 之路（優化篇)](https://iter01.com/614277.html)
* [脑阔疼的webpack按需加载](https://juejin.cn/post/6844903718387875847)
* [Code-Splitting](https://reactjs.org/docs/code-splitting.html#code-splitting)

## 思考过程

### 第一步: 查找哪里这么大体积

* 当前打包后 3.15M, 下载后3.3M
* 没有开始source-map, 所以不是这个问题
* 不再引入全部的Icon后, 变为577k
* 第一件事, 就是考虑如何动态引入Icon
* 无法动态引入, 全部存入cdn, 每次通过Image, src进行引入

### 第二步: 提取下核心库

* 我想不明白的是, 及时提取了, 到时候, 不还是得下载, 使用强缓存?
* 那又怎么解决第一次打开慢的问题

### 第三部分: `lazy`实现懒加载组件

* 核心库提取后, 可以方便后续加载, 现在的问题是找出用户看到页面的时候时间花在哪里
* 现在还是拆分代码, 发现即使拆分出来基础库, 第一次加载的index.js太大了, 占用了太长时间.
* 解决办法: 使用webpack 配合 react中的`lazy`方法

```jsx
import React, { Suspense, lazy } from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';

const Home = lazy(() => import('./routes/Home'));
const About = lazy(() => import('./routes/About'));

const App = () => (
  <Router>
    <Suspense fallback={<div>Loading...</div>}>
      <Switch>
        <Route exact path="/" component={Home}/>
        <Route path="/about" component={About}/>
      </Switch>
    </Suspense>
  </Router>
);
```

* 结果: Scripting时间降低为321ms.
* 所有的js都已经拆开, 变为动态加载.

## 结果

* 图标全部保存cdn, 使用svg进行展示
* webpack抽取依赖库代码, 形成不易变动代码
* 组件使用懒加载方式, 保持首次js最小初始化
* 学习到: 官方文档, 包含一切.
