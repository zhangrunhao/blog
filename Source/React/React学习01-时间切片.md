# React 学习 01-时间切片

## 几个基本原理

### MessageChannel

- 实现异步调用任务有几个方式。
  - 宏任务 setTimeout 等，一个 loop 任务执行一遍
  - 微任务 promise.then，一个宏任务执行结束，清空微任务队列
  - 动画帧 requestAnimationFrame 微任务清空后，重绘重排前执行。每次执行间隔 16.6m 左右
  - 动画帧 requestAnimationFrame 是一种宏任务，在每个浏览器重绘重排之前触发，通常每次执行间隔大约为 16.6ms 左右（60fps）。
  - 空闲任务 requestIdleCallback 完成渲染，并且浏览器空闲执行，
- 不用微任务原因：因为微任务不能中断
- 不用动画帧
  - 帧只能处理一小段任务，不能调度多个优先级, 比如执行 ac 两个任务，需要插入 b，插不了
  - 每一个任务周期，都必须等待 16ms

```js
const box = document.body.querySelector(".box");
let start;
function animate(time) {
  if (!start) start = time;
  const progress = time - start;
  console.log("当前时间戳 time:>> ", time);
  const x = Math.min(progress * 0.1, 300);
  box.style.transform = `translateX(${x}px)`;
  requestAnimationFrame(animate);
}
requestAnimationFrame(animate);
```

- 空闲任务:不同浏览器表现不
- 不用 timeout 原因
  - 被 throttle（如后台页面）
  - 任务队列中按 FIFO 执行, MC 更快

```js
setTimeout(() => console.log("timeout"), 0);
const { port1, port2 } = new MessageChannel();
port1.onmessage = () => console.log("messagechannel");
port2.postMessage(null);
```

### performance.now()

- 页面加载到现在的一个时间。高精度计时

```js
const s = performance.now();
console.log("before :>> ", s);
for (let index = 0; index < 100000; index++) {
  const li = document.createElement("li");
  li.innerHTML = index;
  document.body.appendChild(li);
}
const e = performance.now();
const gap = performance.now();
console.log("after:>> ", performance.now());
console.log("gap:>> ", e - s); // 40ms左右
```

## 时间切片的具体原理

- React 是吧一个大任务，拆成了一段段的。每段之间插入中断点。如果时间到了，就暂停执行。然后记录执行到哪个片段了。
- 核心代码

```js
function workLoop() {
  // 看看有没有下个工作，和时间够不够用了。一般就是5ms
  while (nextUnitOfWork && !shouldYield()) {
    // 有下个工作，并且还有时间, 执行工作。
    // 并获取到再下个工作
    nextUnitOfWork = performUnitOfWork(nextUnitOfWork);
  }
  if (nextUnitOfWork) {
    // 这里是没有时间了，有下个工作了
    // 时间片耗尽，放到下一个宏任务继续
    scheduleCallback(workLoop);
  } else {
    // 没有下个工作了。
    // 全部完成，可以 commit
    commitRoot();
  }
}

function performUnitOfWork(unit) {
  // 做具体渲染逻辑（比如更新函数组件，创建 DOM 节点）
  // 这个过程很快，通常 < 1ms
  /**
   * 执行函数组件，获得新的dom结构，函数组件就是在这里执行！
   * 获取到新的state,props,context等, 记录这些的变化。
   */
  const next = beginWork(unit);
  // 每做完一个 fiber，就可以中断
  if (!next) {
    // 工作完成了，开始向上收集整个fiber树
    completeUnitOfWork(unit);
  }
  return next;
}

function shouldYield() {
  return performance.now() >= deadline;
}
```

- 模仿一个异步发消息的宏任务执行方法

```js
let channel = new MessageChannel();
let taskQueue = [];
// 这个lock的目的是为了避免异步操作过程中，
/**
 * 比如中断执行了，我们推入了一个函数。
 * 这个时候，交处浏览器的主线程。
 * 等浏览器执行完成后，会执行一个onmessage。
 * 会再次进行咱们的workLoop.
 *
 * 但如果在浏览器执行过程中，有变化。比如，数据更新，上一次useEffect更新。或者点击啥的。
 *
 * 这个锁就是为了避免重复被安排。一次只安排一个。
 * 可能会造成，连续发送两次postMessage. 会可能重复执行workLoop
 */
let isScheduled = false;

function scheduleCallback(callback) {
  taskQueue.push(callback);

  if (!isScheduled) {
    isScheduled = true;
    channel.port1.postMessage(null); // 触发异步执行
  }
}

// 注册 port1 的消息处理器（作为“调度器入口”）
channel.port2.onmessage = () => {
  isScheduled = false;

  const callback = taskQueue.shift();
  if (callback) {
    callback(); // 继续执行 workLoop
  }
};
```

## 其他问题

### commit 以后，如何更新 dom。这个过程和调度器的关系

- commit 以后，不能中断。一口气执行全部 dom 更新任务
- 两次更新
  - 如果上一更更新到了 commit 阶段，下一次 render 阶段，会等待上一次 commit 执行完，如果执行时间很长，会有卡的感觉。
  - 如果还没到 commit 阶段，会根据先后顺序合并成一个。
- 推荐使用函数式的 setState(prev => newState) 写法，因为这种方式能正确累加多个连续的状态变化，避免因闭包捕获旧状态值导致的状态覆盖问题。

### 到底哪些地方是可以被中断的？提交了 state 以后的中断流程

- render 阶段, commit 之前。
- render 阶段: 构建下一次渲染需要的 fiber 树。
  - 对每个 fiber 执行 beginWork.
  - 得到 jsx/记录 props/state/context 变化/
  - render 阶段不会形成 effect 链表，而是给每个 fiber 打上标记。commit 阶段会统一收集这些打了标记的链表。再进行 dom 操作。
  - 执行 completeWork
  - 收集接点，形成一个完整的 fiber 树
- 构建 Effect 链表，哪些接点需要变动
- _每处理一个 fiber 接点都可以中断更新_

## 简单理解整个过程

### 初始化的时候

1. 从跟节点开始，层层执行，形成 fiber.每个 fiber 形成都可以被中断。
2. 执行到最后，没有 fiber 还需要执行了。执行 commit 提交。
3. commit 阶段是 React 一次性将变化应用到真实 DOM 上，包括创建 DOM 节点、更新属性、绑定事件、执行 ref 设置以及调用 layout effect（useLayoutEffect）等操作。commit 阶段不受调度器控制，也不可中断，必须同步执行完毕。

### 状态更新时

1. 找到变动的最小公用父组件。
2. 调度器放入一个：重新开始 render 的函数
3. 还是可中断的 render 过程。这个过程中，还有新的合并，都会放到一起。
4. 都执行完了，一把 commit。

### 疑问

- 什么是调用 ref,什么是通知 effect
  - inputRef.current = 真实的 DOM 节点; // 这里就是调用 ref
  - commit 完成 dom 更新以后，才会执行 effect，一把执行全部 effect
- 如果在更新过程中，有了其他父组件，兄弟组件，或者子组件也有了 state 更新，会插入一个新的 render 吗？还是等待上次 render，commit 结束?
- 如果是在 render 阶段出现新的更高优先级更新，当前的 render 会被彻底打断并丢弃，React 会从根节点或最近公共父组件重新开始构建新的 Fiber 树（不会保留旧 Fiber 树的任何状态）。
- 如果是兄弟组件，新的 render 会找到共用父组件开始 render
- 如果是子组件发生更新，那父组件也会重新 render。
- 重新 render 的含义就是，放弃正在渲染的 fiber 树，重新开始一个新的 fiber 树
