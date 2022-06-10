# React 技术揭密学习(三)

> 学习[React 技术揭秘](https://react.iamkasong.com/)

## Diff 算法

- `beginWork阶段`: 当前组件和上次更新时的`Fiber节点`进行比较(Diff 算法)
- 将比较的结果生成新的 Fiber 节点
- 一个`DOM节点`在某个时刻, 有四个节点与其相关
  - `current fiber`: 如果 dom 节点已经存在页面上, `current fiber`代表`dom节点`对应的`fiber节点`
  - `workInProcess Fiber`: 如果 dom 节点在本次更新渲染到页面上, `workInProcess fiber`代表`dom节点`对应的`fiber节点`
  - `dom节点`本身
  - `JSX对象`: `ClassComponent`中`render`方法返回的结果, `FunctionComponent`中的执行结果. `JSX对象`中包含了描述`DOM信息`的节点
  - **DIFF 算法的本质是: 对比`current fiber`和`JSX对象`生成`workInProcess fiber`**
- Diff 操作本身会带来性能消耗, 两棵树完全对比的算法复杂度为 O(n3), rect 的 diff 预设三个限制
  - 只对同级元素进行`diff`, 如果`dom节点`更新中跨域了层级, react 不会再尝试复用.
  - 两个不同类型的元素会产生不同的树. 如果元素由`div`变为了`p`, react 会销毁`div`和子孙节点, 并创建新的`p`节点和子孙节点.
  - 开发者通过`key prop`来暗示哪些子元素在不同的渲染下保持稳定.
- `reconcileChildFibers`: 根据`newChild`, 即是`jsx对象`类型调用不同的处理函数
  - `newChild`类型为`object`, `number`, `string`, 代表同级只有一个节点
  - `newChild`类型为`array`, 同级有多个节点

```js
// 根据newChild类型选择不同diff函数处理
function reconcileChildFibers(
  returnFiber: Fiber,
  currentFirstChild: Fiber | null,
  newChild: any
): Fiber | null {
  const isObject = typeof newChild === "object" && newChild !== null;

  if (isObject) {
    // object类型，可能是 REACT_ELEMENT_TYPE 或 REACT_PORTAL_TYPE
    switch (newChild.$$typeof) {
      case REACT_ELEMENT_TYPE:
      // 调用 reconcileSingleElement 处理
    }
  }
  if (typeof newChild === "string" || typeof newChild === "number") {
    // 调用 reconcileSingleTextNode 处理
  }
  if (isArray(newChild)) {
    // 调用 reconcileChildrenArray 处理
  }
  // 一些其他情况调用处理函数
  // 以上都没有命中，删除节点
  return deleteRemainingChildren(returnFiber, currentFirstChild);
}
```

### 单节点 diff

- `reconcileSingleElement`: 处理逻辑
- ![reconcileSingleElement](https://react.iamkasong.com/img/diff.png)
- 判断流程
  1. `while`遍历所有的`child/child.sibling`, 以此进行判断
  2. 判断`key`是否相同, -> key 不同直接对`fiber节点`标记删除
  3. 根据`tag`判断`type`是否相同 -> 不同的话, 将`fiber节点`和`fiber兄弟节点`标记为删除
  4. `key`和`type`都相同的时候, 复用该节点
- 情况介绍:
  - **`key`不同, 只删除当前的`fiber节点`. 因为其他节点, 还有复用可能性**
  - **`key`相同, `type`不同, 代表了唯一的复用可能性都没有了, 全部删除**
  - **key 默认为 null, 如果不传入的话, 默认全部相同**

```js
function reconcileSingleElement(
  returnFiber: Fiber,
  currentFirstChild: Fiber | null,
  element: ReactElement
): Fiber {
  const key = element.key;
  let child = currentFirstChild;
  // 首先判断是否存在对应DOM节点
  while (child !== null) {
    // 上一次更新存在DOM节点，接下来判断是否可复用
    // 首先比较key是否相同
    if (child.key === key) {
      // key相同，接下来比较type是否相同
      switch (child.tag) {
        // ...省略case
        default: {
          if (child.elementType === element.type) {
            // type相同则表示可以复用
            // 返回复用的fiber
            return existing;
          }
          // type不同则跳出switch
          break;
        }
      }
      // 代码执行到这里代表：key相同但是type不同
      // 将该fiber及其兄弟fiber标记为删除
      deleteRemainingChildren(returnFiber, child);
      break;
    } else {
      // key不同，将该fiber标记为删除
      deleteChild(returnFiber, child);
    }
    child = child.sibling;
  }
  // 创建新Fiber，并返回 ...省略
}
```

### 多节点 diff

- diff 思路
  - 可能的变化:
    - 更新: 节点属性更新/节点类型更新/节点内容更新
    - 新增或者删除
    - 位置变化
  - 因为兄弟节点是单向链表`child.sibling`, 所以不能使用双指针循环
  - 更新频率较高, 所以首先判断是否为更新
- diff 整体逻辑:
  - 第一遍遍历: 处理更新的节点
  - 第二遍便利: 处理不需要更新的节点
- 第一遍遍历
  - 找到 key 和 type 相同的节点, 复用 dom, 并标记更新
  - 遇到 key 不同的直接跳出循环.
  - key 相同, type 不同, `oldFiber`标记删除, `newFiber`标记插入, 并继续遍历.
- 第二遍遍历
  - newChildren 和 oldFiber 都没了, 理想情况
  - newChildren 有, oldFiber 没了, 后面都是插入
  - newChildren 没了, oldFiber 有, oldFiber 后面都删除
  - 都存在, 进行**位置移动**, 每次标记`lastPlacementIndex`, 用于被插入的位置.

## 状态更新

- 基本流程
  1. 触发状态更新(根据场景调用不同方法)
     - RectDOM.render
     - this.setState
     - this.forceState
     - useState
     - useReducer
  2. _每次状态更新都会创建一个保存更新状态相关内容的对象, 叫做`Update`,_
  3. `fiber`到`root`: (调用 markUpdateLaneFromFiberToRoot).
  4. 调用(ensureRootIsScheduled) 通知`Scheduler`根据**更新**的优先级, 决定以同步还是异步的方式, 调度本次更新.
  5. render 阶段(`performSyncWorkOnRoot`或者`performConcurrentWorkOnRoot`).
     - _`render阶段`的`beginWork`中会根据`Update`重新计算`state`_.
  6. commit 阶段(`commitRoot`).
- 整体流程
  1. 触发状态更新
  2. **创建 Update 对象**
  3. 从 fiber 到 root(`markUpdateLaneFromFiberToRoot`)
  4. 调度更新(`ensureRootIsScheduled`)
  5. render 阶段(`performSyncWorkOnRoot`和`performConcurrentWorkOnRoot`)
  6. commit 阶段(`commitRoot`)

### 心智模型

- 同步更新的 React
  - 没有优先级的概念, 高优先级的更新, 需要排在其他更新的后面
- 并发更新的 React
  - `高优先级的更新`, 会中断`低优先级的更新`
  - 先完成`render-commit流程`
  - `高优先级的更新`完成后, `低优先级的更新`基于更新后的结果`重新更新`

### Update

- 分类: 触发更新的方法所隶属的组件分类
  - ReactDom.render -- HostRoot
  - this.setState -- ClassComponent
  - this.forceUpdate -- ClassComponent
  - useState -- FunctionComponent
  - useReducer -- FunctionComponent
- HostRoot 和 ClassComponent 共用一套 Update 结构,
- FunctionComponent 使用一套 Update 结构
- **这里只介绍 HostRoot 和 ClassComponent 的`Update`结构**

- Update 结构

```js
const update: Update<*> = {
  eventTime, // 任务时间, 通过`performance.now()`获取的毫秒数
  lane, // 优先级相关,  Update的优先级可能是不同的
  suspenseConfig, // Suspense相关
  tag: UpdateState, // 更新的类型, 包括`UpdateState|ReplaceState|ForceUpdate|CaptureUpdate`
  payload: null, // 更新挂载的数据, 不同类型组件挂载的数据不同. ClassComponent, payload为this.setState的第一个传参; HostComponent, payload为ReactDom.render的一次参数.
  callback: null, // 更新的回调函数, `commit阶段的layout子阶段中处理的回调函数`
  next: null, // 和其他Update形成链表
};
```

- Update 与 Fiber 的联系

  - `Fiber节点`组成`Fiber树`, `Fiber节点`上的多个`Update`会组成链表, 并被包含在`fiber.updateQueue`中.
  - 同时调用两侧`setState`, 就会形成两个`Update`
  - `current fiber`保存的是`current updateQueue`
  - `workInProcess fiber`保存的是`workInProcess updateQueue`
  - `commit阶段`完成页面渲染后, `workInProcess fiber`树, 变成`current fiber`树.
  - `workInProcess fiber`树内的`fiber节点`的`updateQueue`, 变为`current updateQueue`

- UpdateQueue

  - 针对`HostComponent`:
    - 被处理完的`props`会被赋值给`workInProgress.updateQueue`
    - `workInProgress.updateQueue = (updatePayload: any);`
    - `updatePayload`是个`[key, value, key, value]`的数组
  - 针对`ClassComponent`和`HostRoot`的`UpdateQueue`:

- 针对`ClassComponent`和`HostRoot`的`UpdateQueue`:

```js
const queue: UpdateQueue<State> = {
  baseState: fiber.memoizedState, // 本次更新前该`Fiber节点`的`state`, `Update`基于该`state`计算更新后的`state`
  firstBaseUpdate: null, // 本次更新前该fiber已保存的`Update`, 链表头
  lastBaseUpdate: null, // 链表尾
  shared: {
    pending: null, // 触发更新时, 产生的`Update`会保存在`shared.pending`形成单向环形链表. 当Update计算state时, 被剪开, 并链接在`lastBaseUpdate`后面
  },
  effects: null, // 保存`update.callback !== null`中的`Update`
};
```

- 例子:
  1. 首先我们有两个更新, u1 和 u2 在上次没有更新: u1-->u2
  2. 此时加入一个需要更新的 u3: u3-->(u3)
  3. 再加入一个需要更新的 u4: u4-->u3-->(u4).
  4. 更新调度完成后, 进入`render阶段`:
  5. `shared.pending`被剪开, 变成:u1-->u2-->u3-->u4
  6. 遍历`updateQueue.baseUpdate`, 使用`baseUpdate`作为初始值, 此次遍历每个 Update, 产生最后的`state`.
- 优先级低的`state`会被跳过
- **遍历完成后, 获得最后的`state`, 就是该`Fiber节点`在本次更新中的 state.**
- **`state`的变化在`render阶段`产生和上次更新不同的`JSX对象`, 通过`Diff`算法, 产生`effectTag`, 在`commit阶段`渲染在页面上**
- **渲染完成后, 切换`current fiber树`, 整个更新流程结束**

### 优先级

- `状态更新`由`用户交互`产生, 用户心里对`交互`执行顺序有个预期.
- `React`根据`人机交互研究的结果`中, 用户对`交互`的预期顺序产生的`状态更新`赋予不同优先级.
- 如下
  - 生命周期方法: 同步执行.
  - 受控的用户输入: 比如输入框内输入文字, 同步执行.
  - 交互事件: 比如动画, 高优先级执行.
  - 其他: 比如数据请求, 低优先级执行.
- 如何调度优先级
  - 调度任务:`Scheduler`提供方法`runWidthPriority`.
  - 接受一个优先级和一个回调函数. 回调函数以优先级高低为顺序排列在一个`定时器`中, 并在合适的时间触发.
  - 优先级最终反应在`update.lane`变量上. 此变量可以区分`Update`优先级
- 例子:
  - 切换主题, 产生主题更新的优先级`u1`
  - `u1`触发进入`render`阶段.优先级低, 更新时间长
  - `u1`完成`render`阶段前, 用户输入了字母, 产生了`u2`
  - `u2`优先级高, **中断u1产生的`render阶段`**
  - _好奇: 如何中断低优先级的更新?_
  - 接下来进入u2更新阶段.
  - u2不是最后一个`Update`, 之前的`u1`由于优先级不够被跳过.
  - `update`之间可能有依赖关系, 所以被跳过的`update`及其后面所有的`update`, 会称为下次更新的`baseUpdate`.
  - 最终`u2`完成`render-commit`阶段
  - `commit阶段`结尾会再调度一次更新. 这次更新机遇`baseState`中的`firstBaseUpdate`保存的`u1`,开启一次的`render`阶段.
  - _`u2`对应的更新执行了两次, 相应的`render阶段`的生命周期钩子`componentWillXXX`也会处罚两次, 所以这些钩子被标记为`unsafe_`_
- 如何保证状态正确
  - `render阶段`可能被打断. 如果保证`updateQueue`中的`Update`不丢失.
    - `render阶段`, `shared.pending`的环被剪开并链接在`updateQueue.lastBaseUpdate`后面.
    - 实际上`shared.pending`会同时被链接在`workInProcess updateQueue.lastBaseUpdate`与`current updateQueue.lastBaseUpdate`后面.
    - 当`render阶段`被中断后重新开始时, 会基于`current updateQueue`克隆出`workInProgress updateQueue`.
    - 由于`current updateQueue.lastBaseUpdate`已经保存了上一次的`Update`, 所以不会丢失.
    - 当`commit阶段`完成渲染, 由于`workInProgress updateQueue.lastBaseUpdate`中保存了上一次的`Update`, 所以不会丢失.
  - 有时候, 当前`状态`需要依赖前一个`状态`. 如何在支持跳过`低优先级状态`同时保证状态依赖的连续性.
    - 当某个`Update`由于优先级低而被跳过时, 保存在`baseUpdate`中的不仅是该`Update`, 还包括链表中该`Update`之后所有的`Update`.

### ReactDom.render
