# React 学习 02-commit 渲染

## 简单介绍

- commit 阶段就是把 render 形成的改变一把执行到 dom 上

## 深度优先遍历

- render 阶段，会在每个 fiber 上，有一个 effectTag, 还有一个 nextEffect。
- render 阶段是采用深度优先遍历。

```txt
      P
   /  |   \
  A   B    C
  |   |    |
 A1  B1   C1
```

遍历顺序：

```txt
P → A → A1 → B → B1 → C → C1
```

形成的链表执行顺序

```txt
Effect链: A1 → A → B1 → B → C1 → C → P
```

## 具体执行过程

- 会先执行一遍这个链表上的删除操作。
- 再执行一遍这个链表上的更新/新增的操作。
- 最后执行一遍 Effect 操作。例如 LayoutEffect

### 具体的操作

- 插入节点（新创建的 DOM 节点）
- 更新节点（已有节点属性更新，比如修改 className、style、textContent 等）
- 删除节点（从 DOM 移除已删除的 Fiber 节点）
- 事件绑定与解绑（如绑定新的 onClick，解绑旧事件）
- 处理 ref 设置（ref.current = dom 节点）

## useEffect 和 useLayoutEffect 的区别

### useEffect

- 异步执行，首先是变动 dom，然后浏览器绘制，然后异步执行所有的 useEffect

### useLayoutEffect

- 同步执行，再所有的 dom 变动都完成后，再浏览器绘制之前进行变动。
- 这里能读取到最新的 dom 信息，然后会卡浏览器的绘制。
- **_因为，浏览器的 js 代码执行和 dom 渲染都是在主线程中！长时间 js 代码执行会阻塞 dom 的渲染！_**
