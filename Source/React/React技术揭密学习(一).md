# React技术揭密学习(一)

> 学习[React技术揭秘](https://react.iamkasong.com/)

## React15架构

* Reconciler: 协调器 - render 找出有变化的组件 - diff
* Renderer: 渲染器 - commit 渲染有变化的组件

### 15 - Reconciler

* 触发更新api
  * `this.setState`
  * `this.forceUpdate`
  * `ReactDom.render`
* 更新流程:
  * 调用函数组件, 或者class组件的`render`, 转换jsx为虚拟dom
  * 虚拟dom与上次更新的dom对比 (diff1)
  * 通过对比找出本次更新中变化的dom (diff2)
  * 通过Renderer将渲染变化的dom

### 15 - Renderer

* Reconciler通知Renderer进行更新
* 也就是render后调用commit函数

### 缺点

* `mount`调用`mountComponent`
* `update`调用`updateComponent`
* 两个方法都是递归更新组件
* 递归一旦开始就无法, 中途无法中断, 超过16ms, 用户感到卡顿
* **使用异步可中断的更新代替同步的更新**
* Reconciler和Renderer交替执行.
* 第一个组件的Renderer工作完成后, 再交给第二个组件的Reconciler
* 整个过程是同步的

## React16

* Scheduler: 调度任务的优先级, 高任务优先进入Reconciler -- schedule
* Reconciler: 找出变化的组件 -- render
* Renderer: 渲染变化的组件 -- commit

### 16 - Scheduler

* 以浏览器是否有剩余时间为标准, 当浏览器有剩余时间的时候, 通知我们.
* 类似`requestIdleCallback`:
  * 浏览器兼容性
  * 触发频率不稳定: 例如切换tab后, 之前的tab`requestIdleCallback`处罚频率变得很低
* React自己实现了一套`scheduler`
  * 浏览器空闲时间处罚回调
  * 多种调度优先级

### 16 - Reconciler

* 递归调用变为可中断的循环过程
* 每次循环判断当前是否有剩余时间
* Reconciler和Renderer不再是交替工作
  * Scheduler将任务交给Reconciler
  * Reconciler将变化的虚拟dom打上标记 增/删/更新
  * 所有组件的都完成了Scheduler和Reconciler后, 再交给Renderer
* Renderer根据tag同步执行dom操作
* Scheduler和Reconciler可能被打断的原因:
  * 有其他高优先级任务需要更新
  * 当前帧没有剩余时间
  * 因为是在内存中工作, 反复被打断也不会显示在页面中

## Fiber心智模型

* 代数效应: 函数式编程的一个概念. 将副作用从函数中抽离, 使函数关注点保持纯粹
* React中的: `useState`, `useReducer`, `useRef`
  * 不需要关注react中如何保存的
  * 只需要`useState`返回的是我们想要的`state`即可
* 异步可中断更新:
  * 更新在执行过程中可能会被打断(时间分片用尽/更高任务插入)
  * 可以继续执行时恢复之前执行中间态
* Generator:
  * 具有传染性
  * 执行的中间态上下关联
  * 只适合处理单一优先级任务的中断和执行
* 纤程(fiber), 进程(process), 线程(thread), 协程(Coroutine).程序执行过程
* 协程实现(Generator), 纤程实现(fiber), 代数效应在js中的实现
* React Fiber
  * 内部实现一套状态更新机制.
  * 支持任务不同优先级, 可中断和恢复.
  * 恢复之后复用之前的中间状态.
  * 每个任务单元为ReactElement对应的`Fiber`节点

## Fiber实现原理

* React15使用采用递归的方式创建和更新虚拟dom, 递归的状态不能中断. 如果组件层次深的话, 递归会占用`线程`很多的时间.
* React16使用Fiber架构, 将递归的**无法中断的更新**重构为**异步可中断更新**
* 含义
  * React15, 数据保存在递归调用栈中, 称为`stack reconciler`, React16中的`Reconciler`基于`fiber节点`, 称为`Reconciler Fiber`
  * 静态数据结构: 每个Fiber, 对应一个ReactElement, 保存了该组件的类型(FunctionComponent/ClassComponent/HostComponent), 对应的DOM节点信息
  * 动态工作单元: 每个Fiber节点保存了本次更新中该组件改变的状态, 要执行的工作(被删除/被插入到页面中/被更新).

* 作为架构:

```js
// 指向父级Fiber节点
/**
 * return 指的是当前节点执行完`completeWork`后, 返回的下一个工作单元
 */
this.return = null;
// 指向子Fiber节点
this.child = null;
// 指向右边第一个兄弟Fiber节点
this.sibling = null;

function App() {
  return (
    <div>
      i am
      <span>KaSong</span>
    </div>
  )
}
```

* 作为静态工作单元:

```js
// Fiber对应组件的类型 Function/Class/Host...
this.tag = tag;
// key属性
this.key = key;
// 大部分情况同type，某些情况不同，比如FunctionComponent使用React.memo包裹
this.elementType = null;
// 对于 FunctionComponent，指函数本身，对于ClassComponent，指class，对于HostComponent，指DOM节点tagName
this.type = null;
// Fiber对应的真实DOM节点
this.stateNode = null;
```

* 作为动态的工作单元:

```js
// 保存本次更新造成的状态改变相关信息
this.pendingProps = pendingProps;
this.memoizedProps = null;
this.updateQueue = null;
this.memoizedState = null;
this.dependencies = null;

this.mode = mode;

// 保存本次更新会造成的DOM操作
/**
 * 形成effectList链表, 递归调用所有需要改变的组件
 */
this.effectTag = NoEffect;
this.nextEffect = null;
this.firstEffect = null;
this.lastEffect = null;

// 调度优先级相关
this.lanes = NoLanes;
this.childLanes = NoLanes;
```

## Fiber工作原理

* Fiber节点通过stateNode保存对应的dom
* Fiber节点构成的fiber树, 对应dom树
* 更新dom时, 使用**双缓存技术**: 在内存中构建并直接替换的技术
  * 当前帧计算绘制量比较大的时候, 清除上一帧, 到绘制当前帧会有空白
  * 直接在内存绘制当前帧的动画, 绘制完成后直接替换. 不会有空白
  * 对应着`DOM树`的创建和更新
* 双缓存fiber树
  * 屏幕上对应的fiber树为`current fiber树`, 内存中对应的fiber树为`workInProcess fiber树`
  * `current fiber`和`workInProcess fiber` 通过`alternate`链接
  * `wipFiber`构建完成后, 交给`renderer`渲染, 渲染完成后, `current`指向`wipFiber`
  * 每次状态更新, 都会产生新的`wipFiber树`, 通过`current`与`wipFiber树`的替换, 完成`DOM`更新

### mount时

1. 首次执行`ReactDOM.render`创建`FiberRootNode`(源码中称为`fiberRoot`), 和`rootFiber`
   1. `fiberRootNode`为整个应用的根节点, `rootFiber`为当前`render`函数中传入组件的根节点
   2. `current`指向的`rootFiber`没有任何子fiber节点, `current fiber树`为空.
2. render阶段, 根据组件返回的jsx, 在内存中以此创建fiber节点, 并链接在一起构成fiber树, 称为`workInProcess fiber树`
   1. 构建`workInProcess fiber`树时, 会尝试复用`current fiber树`中已有的fiber节点的内在属性
   2. 首屏渲染时只有`rootFiber`存在对应的`current fiber`. `rootFiber.alternate => current rootFiber`
3. 构建完成的`workInProcess fiber树`, 在`commit阶段`渲染到页面上
   1. 此时dom树, 就变为了`workInProcess fiber树`对应的样子
   2. `fiberRootNode`更改`current`指针, 到`workInProcess fiber`树
   3. `workInProcess fiber树`变为了`current fiber`树

### update时

1. 我们点击`p节点`, 触发状态更新, 开启一次新的`render阶段`, 并构建一颗新的`workInProcess fiber树`
   1. `workInProcess fiber`的创建, 可以复用`current fiber树`对应的数据节点
   2. 是否复用的过程就是`diff`算法
2. `workInProcess Fiber树`在`render`阶段完成构建后进入到`commit阶段`渲染到页面上
   1. 渲染完毕后`workInProcess Fiber树`变为`current Fiber树`
3. `Fiber树`在构建和替换的过程中, 完成dom的更新操作

## JSX

* jsx在编译时, 会被`babel`编译为`React.createElement`
* `ReactElement`工作后, 会返回一个`ReactElement`, 并使用`$$typeof`进行标记
* 所有jsx运行后的返回结果都是`ReactElement`.
* `ClassComponent`对应的`Element`中的`type`字段为`AppClass`本身
* `FunctionComponent`对应的`Element`中的`type`字段为`AppFunc`本身
* React通过`ClassComponent.prototype.isReactComponent = {};`判断是否为`ClassComponent`
* mount时, Reconciler根据jsx描述的组件内容, 组成组件对应的`fiber节点`
* update时, Reconciler将jsx与`Fiber节点`保存的数据, 进行对比, 生成组件对应的节点. 并根据对比结果为`Fiber节点`打上tag
