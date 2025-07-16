# React 学习 03-两种 Api 的使用

## forwardRef 和 useImperativeHandle

- 因为函数组件不能直接挂载 ref，需要有有个函数接收一层。进行转发。
- ref 只能直接挂载在 dom 或者 class 组件中。

### 不能直接挂载的原因

- 在 dom 中，如果挂载一个 ref。`<div ref={ref}>`, 会把这个 ref.current 指向这个 dom
- 在 class 组件中，如果挂载一个 ref。 `<ClassComp ref={ref}>`，会把 ref.current 指向这个函数组件的 this
- 在数组件中，如果挂载一个 ref, `<FuncComp ref={ref}`, 找不到什么地方挂载 ref.current, 因为函数组件执行会返回的是一段 JSX

### 解决这个问题

- 用 forwardRef 这个告诉函数组件，也告诉 react。不需要直接直接挂载。需要经过一层转发。
- 或者说，告诉 react，不是要挂载在函数组件上，而是函数组件中的某个 dom，或者内部的方法。

### useImperativeHandle

- 可以返回一个让父组件通过 ref 访问到的对象

## useContext

- 因为有些状态，需要在全局使用。例如 theme
- 层层向下传递太深了。

### 之前的传统写法

```tsx
const MyContext = React.createContext(default)

<MyContext.Provider value={1}>
<Child></Child>
</MyContext.Provider>

const Child = () => {
  return (
  <MyContext.Consumer>
  {
    // 这可以用各种名字 theme => ()
    value => (<div>{value}</div>)
  }
  </MyContext.Consumer>
  )
}

```

### 现在的写法

```tsx
const MyContext = React.createContext(default)

const Parent = () => {
  return (
    <MyContext.Provider value={1}>
      <Child></Child>
    </MyContext.Provider>
  )
}

const Child = () => {
  const value = useContext(MyContext)
  return (
    <div>{value}</div>
  )
}
```

### 实现原理

- 子组件使用 useContext 或者是`<Consumer>`时，react 会进行一个标记, 自动追踪对这个 Context 的依赖。
- 当 Provider 的 value 发生变化时，React 会从当前这个 Fiber 向下找，所有用过的依赖，都标记需要更新

### Context 疑问

- 是如何进行自动追踪 context 依赖的？
  - 每个 context 内部，都有一个依赖队列。所有用`useContext`，都会加入这个队列
  - 这个过程是在 render 过程完成的。就是执行每个组件的时候。
  - context 的 value 变化了。就会通过这个队列进行通知更新。
- Provider value 发生变化时。如何向下找，找的过程时 render？ 还是 commit。这个找的过程能被中断吗？
  - value 改变的时候，会进行一次新的 render
  - 新的 render，会遍历所有的子组件，并和依赖进行对比，如果依赖了，就标记需要更新。
  - 过程是可以进行中断的。如果有更高级任务的话，当前任务就会中断。
  - 有空闲的时候，再执行。如果是没有值的变化，就继续执行上次的 render。如果有的话，就开始了一个新的 render，放弃上次的。
- fiber 的遍历，是不是就是之前说的一个函数组件是一个单元？那找依赖是什么过程？如何与 render/commit 相联系？
  - fiber 的遍历，一个组件，一个 dom 都是一个 fiber。然后执行 userContext 的时候，会被收集起来。
  - 当 Provider 的 value 变化的时候，会重新 render，render 的过程中会对比有没有依赖，有的话，会打上需要更新的 tag。
- 其实我还是没很理解。放弃上次的 render 的 fiber 树。如果上此是从 b 组件开始执行的。这次 a 组件的值发生了变化。放弃了上次的 render 的 fiber 树，那 b 组件还能获取到正确的值吗？

## 再次梳理的 fiber 的渲染流程

### 整体流程

- 当一个组件发生 setState 时，会给这个组件打上更新的标签。并且给往上所有的父节点，都打上“有子节点更新”的标签
- 这就是更新冒泡的过程
- 比如 B state 变了，但是没有其他的变化。那最小公共父节点 LCA(low common ancestor)，那就只从 B 开始 render。
- 此时 C state 也变了，这个时候，B 的 render 还没结束。就放弃 B 正在生成的 fiber 树，然后从 B 和 C 的公共父节点 A 开始 render。
- react 会收集所有的“待处理的更新”，放到一个全局的队列 update queue.
- 也就是刚刚这种多次 set state 时，都能从这个队列找到 LCA。作为开始 render 的起点。
- 这样从 A 节点的一次 render，就把 B,C 节点都包括好了。

### 关键点 / 一些特定名词

- 可中断恢复
  - 比如 B 在进行 render 过程，也就是创造 workInProgress tree 的时候，
  - 第一种情况：C 又更新了。那 B 的这个 tree 就被放弃了，从 A 开始 render，创建一个新的 tree.
  - 第二种情况：浏览器没时间了，那就暂停下来。等待下个事件队列有时间的时候。这个在时间切片里说过。
- 更新冒泡
  - 给自己标记上“更新”。往上所有父节点标记“有子节点更新”。
- 批量更新合并
  - 就是什么调和，并发啥的，合并成一次更新。比如多次渲染。
- updateQueue: 所有的 setState 最后都合并到 updateQueue 上
- findNextLanes: React 分析所有待更新的 Fiber, 决定从哪个 fiber 上开始更新。
- renderRoot：LAC 开始协调子树。

### 关于渲染的疑问

- 这个全局队列是什么？里面放的是什么？每次更新，都是如何从这个全局队列中找数据的？
- 什么是“并发调度”？什么又是“批量调度”
  - 并发就是“time slice”
  - 批量调度，还没看懂。就是合并 set state.不会产生多次 render
- 如果是这样，那一直有 setState, 是不是就会一直在产生新的 workInProgress tree. 不会走到 commit 渲染过程中。
  - 理论上是这样，但是会有一个兜底策略。
- renderRoot, lac 开始协调子树啥意思？
  - 协调子树就是遍历所有的 fiber 子节点，判断哪些节点需要更新，哪些不变。还有新增，删除啥的
  - 整个过程就是 reconcile, 就是协调。也可以说是 diff
  - 会对比上一次的 current tree 产生一个新的 wip tree，还有一份 effect list。
  - 然后提交这个 wip tree 和 effect list 给 commit，最终落地渲染。
- 一直 set state 的兜底策略是啥?
- 我现在最大的疑问是，这个 updateQueue 里面存的 FiberRoot，还有多次 setState 之前合并的这个关系。这里还不清楚。
  - 当我们执行一个 set state 时，会把这个 set state 放到 当前这个 fiber 的 update queue 上，
  - 然后把这个 fiber 标记为“更新”， 然后冒泡，把所有的父节点，都标记上“有子节点更新”。
  - 当前是不是有 wip 正在生成。有的话，停止。开始进行这个新的更新。然后 render 的时候，会把这个 fiber 的整个 update queue 合并到一起。

## 搞清楚 beginWork, completeWork, 还有 commit 的具体流程

### beginWork

- 遍历 fiber,看看是否需要更新。需要更新的话，返回一个新的 JSX
- 一直到没有子节点了，进行 completeWork

### completeWork

- 子节点逐步返回父节点。然后收集需要更新的 effect List.

### commit

- 根据 effect list 一口气更新 list。

### 疑问

- 遍历当前 fiber，是什么意思？遇到函数组件，类组件等其他不同组件是如何处理的？
  - 函数组件：调用这个函数组件，根据返回的 JSX，专成子 fiber 节点
  - 类组件：new 一个实例，然后执行 render 函数
  - HostComponent: 原声 DOM，根据 children，也是生成 fiber
  - Fragment: 不生成 dom， 生成子 fiber
  - Provider,Consumer, 继续生成子 fiber，收集依赖
  - Suspense
- 完成 completeWork 的收集，是不是就完成了这次 render?就应该把这个更新交给调度器了？
  - 调度器一执行，到 commit 就 ok 了。
- fiber 节点如何判断自己和子节点有没有需要副作用（比如要插入/删除/更新 DOM
  - 通过对比新旧 fiber 的各种属性。
