# React技术揭密学习(一)

> 学习[React技术揭秘](https://react.iamkasong.com/)

## Render阶段 - 协调器 - Reconciler工作

* `render阶段`开始于`performSyncWorkOnRoot`或者`performConcurrentWorkOnRoot`.
* 取决于同步还是异步更新

```js
// performSyncWorkOnRoot会调用该方法
function workLoopSync() {
  while (workInProgress !== null) {
    performUnitOfWork(workInProgress);
  }
}

// performConcurrentWorkOnRoot会调用该方法
function workLoopConcurrent() {
  while (workInProgress !== null && !shouldYield()) {
    performUnitOfWork(workInProgress);
  }
}
```

* shouldYield: 判断浏览器当前是否存在剩余时间.
* workInProcess: 代表当前已经创建的`workInProcess fiber`
* performUnitOfWork:
  * 创建下一个`Fiber节点`, 并赋值给`workInProcess`
  * 并将`workInProcess`与已经创建的`Fiber节点`链接起来, 构成一个fiber树
* `Fiber Reconciler`重构了`Stack Reconciler`, 通过遍历实现可中断的递归
* performUnitOfWork. 工作分为"递"和"归"
* "递"阶段
  * 从`rootFiber`开始向下深度优先遍历. 为每个`fiber节点`调用`beginWork`方法
  * 该方法会根据传入的`Fiber节点`创建`子Fiber节点`, 并将两个`Fiber`节点链接起来.
  * 如果有兄弟节点, 并根据节点, 依次创建兄弟节点
  * 遍历到叶子节点时, 会进入归阶段.
* "归"阶段
  * 归节点调用`completeWork`阶段, 处理`fiber节点`
  * 某个fiber节点完成执行完`completeWork`
    * 如果其存在`兄弟Fiber节点`, 会进入兄弟节点的递阶段
    * 如果不存在`兄弟fiber节点`, 会进入`父级Fiber`的归阶段
* "递"和"归"会交替执行, 直到"归"到`rootFiber`. `render阶段`的工作完成

> 单一文本的叶子节点不会执行`beginWork/completeWork`

### beginWork

```js
function beginWork(
  current: Fiber | null,
  workInProgress: Fiber,
  renderLanes: Lanes,
): Fiber | null {
  // ...省略函数体
}
```

* current: 当前组件对应的`Fiber节点`在上一次更新时的`Fiber节点`. `workInProcess.alternate`
* workInProcess: 当前组件对应的`fiber节点`
* renderLanes: 优先级相关
* 区分mount还是update
  * mount时: `current === null`
  * update时: `current !== null`
* begin工作分为两部分:
  * update时: `current节点`存在, 满足一定条件, 进行复用. 克隆`current.child`到`workInProcess.child`
  * mount时: 除了`fiberRootNode`以外, `current === null`. 根据`fiber.tag`不同, 创建不同类型的`子fiber节点`

* Update: 满足如下情况. -> `didReceiveUpdate = false;`直接复用上一次的`fiber节点`
  * `oldProps === newProps && workInProcess.type === current.type`不变
  * `includesSomeLane(renderLanes, updateLanes)`, 当前节点的优先级不够
* Mount:
  * 根据不同类型的tag, 进入不同类型的`Fiber`的创建逻辑
  * 最终都会执行`reconcileChildren`: 根据`fiber节点`创建`子fiber节点`

```js
function beginWork(
  current: Fiber | null,
  workInProgress: Fiber,
  renderLanes: Lanes
): Fiber | null {

  // update时：如果current存在可能存在优化路径，可以复用current（即上一次更新的Fiber节点）
  if (current !== null) {
    const oldProps = current.memoizedProps;
    const newProps = workInProgress.pendingProps;

    if (
      oldProps !== newProps ||
      hasLegacyContextChanged() ||
      (__DEV__ ? workInProgress.type !== current.type : false)
    ) {
      didReceiveUpdate = true;
    } else if (!includesSomeLane(renderLanes, updateLanes)) {
      didReceiveUpdate = false;
      switch (workInProgress.tag) {
        // 省略处理
      }
       // 复用current
      return bailoutOnAlreadyFinishedWork(
        current,
        workInProgress,
        renderLanes,
      );
    } else {
      didReceiveUpdate = false;
    }
  } else {
    didReceiveUpdate = false;
  }


  // mount时：根据tag不同，创建不同的子Fiber节点
  switch (workInProgress.tag) {
    case IndeterminateComponent: 
      // ...省略
    case LazyComponent: 
      // ...省略
    case FunctionComponent: 
      // ...省略
    case ClassComponent: 
      // ...省略
    case HostRoot:
      // ...省略
    case HostComponent:
      // ...省略
    case HostText:
      // ...省略
    // ...省略其他类型
  }
}
```

* reconcileChildren工作:
  * `mount`: 创建新的子`fiber节点`
  * `update`: 会将当前`fiber节点`和上次更新的`fiber节点`对比(diff), 产生结果比较新的`fiber节点`
  * 最终都会生成新的`子fiber节点`, 赋值给`workInProcess.child`, 作为本次`beginWork`的返回值
  * 并作为下一次: `performUnitOfWork`执行时`workInProcess`的传参
  * `reconcileChildFibers`会为生成的`Fiber节点`带上`effectTag`属性

```js
export function reconcileChildren(
  current: Fiber | null,
  workInProgress: Fiber,
  nextChildren: any,
  renderLanes: Lanes
) {
  if (current === null) {
    // 对于mount的组件
    workInProgress.child = mountChildFibers(
      workInProgress,
      null,
      nextChildren,
      renderLanes,
    );
  } else {
    // 对于update的组件
    workInProgress.child = reconcileChildFibers(
      workInProgress,
      current.child,
      nextChildren,
      renderLanes,
    );
  }
}
```

* effectTag
  * render(Reconciler)阶段时在内存中工作的. 工作接受后, 通知`Renderer`进行dom操作
  * dom的操作保存在`effectTag`中
* 通知`Renderer`将`Fiber节点`对应的dom插入到页面中需要满足两个条件
  * `fiber.stateNode`存在, 即`fiber节点`保存了对应的`dom节点`
  * `Fiber节点`上存在`Placement effectTag`
* `fiber.state`Node会在`completeWork`中完成
* mount时只用`rootFiber`会被赋值`Placement effectTag`. `commit`阶段一次性插入完成
* ![beginWork流程图](https://react.iamkasong.com/img/beginWork.png)

### commitWork

```js
function completeWork(
  current: Fiber | null,
  workInProgress: Fiber,
  renderLanes: Lanes,
): Fiber | null {
  const newProps = workInProgress.pendingProps;

  switch (workInProgress.tag) {
    case IndeterminateComponent:
    case LazyComponent:
    case SimpleMemoComponent:
    case FunctionComponent:
    case ForwardRef:
    case Fragment:
    case Mode:
    case Profiler:
    case ContextConsumer:
    case MemoComponent:
      return null;
    case ClassComponent: {
      // ...省略
      return null;
    }
    case HostRoot: {
      // ...省略
      updateHostContainer(workInProgress);
      return null;
    }
    case HostComponent: {
      // ...省略
      return null;
    }
  // ...省略
```

* HostComponent: 原生组件对应的`fiber节点`
* Update时:
  * `Fiber节点`对应的dom节点已经存在了, 不需要生成dom节点, 主要处理props
    * `onClick, onChange`等回调函数的注册
    * 处理`style prop`
    * 处理`DANGEROUSLY_SET_INNER_HTML prop`
    * 处理`children prop`
  * 主要调用`updateHostComponent`
    * 处理完的`props`赋值给`workInProcess.updateQueue`
    * 并最终会在`commit阶段(Renderer)`渲染在页面上
    * `workInProgress.updateQueue = (updatePayload: any);`
    * `updatePayload`为数组, 偶数为变化的`prop key`, 奇数为`prop value`
* Mount时
  * 主要逻辑:
    * 为`fiber节点`增加对应的dom节点
    * 将子孙dom节点插入到刚生成的dom节点上
    * 与update时中的`updateHostComponent`类似的`props`处理过程
* completeWork阶段属于归阶段函数. 每次调用`appendAllChildren`时, 都会将已生成的子孙dom节点插入到当前生成的dom节点下.
* "归"到`rootFiber`时, 已经有一颗已经构建好的内存中的`dom树`

```js
case HostComponent: {
  popHostContext(workInProgress);
  const rootContainerInstance = getRootHostContainer();
  const type = workInProgress.type;

  if (current !== null && workInProgress.stateNode != null) {
    // update的情况
    updateHostComponent(
      current,
      workInProgress,
      type,
      newProps,
      rootContainerInstance,
    );
  } else {
    // mount的情况
    // ...省略服务端渲染相关逻辑
    const currentHostContext = getHostContext();
    // 为fiber创建对应DOM节点
    const instance = createInstance(
        type,
        newProps,
        rootContainerInstance,
        currentHostContext,
        workInProgress,
      );
    // 将子孙DOM节点插入刚生成的DOM节点中
    appendAllChildren(instance, workInProgress, false, false);
    // DOM节点赋值给fiber.stateNode
    workInProgress.stateNode = instance;

    // 与update逻辑中的updateHostComponent类似的处理props的过程
    if (
      finalizeInitialChildren(
        instance,
        type,
        newProps,
        rootContainerInstance,
        currentHostContext,
      )
    ) {
      markUpdate(workInProgress);
    }
  }
  return null;
}
```

* effectList
* 解决需要所有`fiber节点`, 找到标记`effectTag`的`fiber`
* `completeWork`的上层函数`completeUnitOfWork`中:
* 每次执行完`completeWork`, 且存在`effectTag`的`fiber节点`, 会保存在`effectList`单向链表中
* 第一个节点保存在`fiber.firstEffect`
* 最后一个节点保存在`fiber.lastEffect`
* 在"归"阶段, 所有`effectTag的Fiber节点`, 都会追加到这条链表中
* 最终形成一条以`rootFiber.firstEffect`为起点的`effectList`
* `commit阶段`只需要遍历`effectList`即可

```js
                       nextEffect         nextEffect
rootFiber.firstEffect -----------> fiber -----------> fiber
```

* `render阶段`全部完成工作后.
  * `performSyncWorkRoot`函数中, `fiberNode`传递给`commitRoot`.
  * 开启`commit阶段`的工作

* ![completeWork流程图](https://react.iamkasong.com/img/completeWork.png)

## Commit阶段 - 渲染器 - Renderer器工作

* `fiberRootNode`作为传参
* `fiberRootNode.firstEffect`上保存了一条需要执行`副作用`的`Fiber节点单向链表`
* 这些fiber节点的`updateQueue`上保存了变化的props
* 这些副作用对应的dom操作, 在`commit阶段`执行
* 一些声明周期钩子函数(componentDidXXX), hook(useEffect)在`commit阶段执行`.
* `commit阶段`的主要工作
  * `before mutation阶段`: 执行dom操作前
  * `mutation阶段`: 执行dom操作
  * `layout阶段`: 执行dom操作后
* `before mutation之前`和`layout之后`还有一些工作
  * `useEffect`的触发
  * `优先级相关`重置
  * `ref`的绑定的解绑
* `before mutation`之前
  * 变量赋值, 状态重置
  * 最后会赋值一个`firstEffect`, `commit`三个子阶段都会用到
* `layout`之后
  * `useEffect`相关处理
  * 性能追踪相关
  * 在`commit`出发一些生命周期函数, hook

### before mutation

* 遍历`effectList`并调用`commitBeforeMutationEffects`函数处理

```js
// 保存之前的优先级，以同步优先级执行，执行完毕后恢复之前优先级
const previousLanePriority = getCurrentUpdateLanePriority();
setCurrentUpdateLanePriority(SyncLanePriority);

// 将当前上下文标记为CommitContext，作为commit阶段的标志
const prevExecutionContext = executionContext;
executionContext |= CommitContext;

// 处理focus状态
focusedInstanceHandle = prepareForCommit(root.containerInfo);
shouldFireAfterActiveInstanceBlur = false;

// beforeMutation阶段的主函数
commitBeforeMutationEffects(finishedWork);

focusedInstanceHandle = null;
```

* `commitBeforeMutationEffects`
  * 处理`DOM节点`渲染/删除后的`autoFocus`, `blur`的逻辑
  * 调用`getSnapshotBeforeUpdate`生命周期钩子
  * 调度`useEffect`

```js
function commitBeforeMutationEffects() {
  while (nextEffect !== null) {
    const current = nextEffect.alternate;

    if (!shouldFireAfterActiveInstanceBlur && focusedInstanceHandle !== null) {
      // ...focus blur相关
    }

    const effectTag = nextEffect.effectTag;

    // 调用getSnapshotBeforeUpdate
    if ((effectTag & Snapshot) !== NoEffect) {
      commitBeforeMutationEffectOnFiber(current, nextEffect);
    }

    // 调度useEffect
    if ((effectTag & Passive) !== NoEffect) {
      if (!rootDoesHavePassiveEffects) {
        rootDoesHavePassiveEffects = true;
        // 以某个优先级调用一个回调函数
        scheduleCallback(NormalSchedulerPriority, () => {
          // 调用useEffect
          flushPassiveEffects();
          return null;
        });
      }
    }
    nextEffect = nextEffect.nextEffect;
  }
}
```

* 调用`getSnapshotBeforeUpdate`
  * `render阶段`的任务可能被中断重新开始, `componentWillXXX`钩子可能被多次触发. 变为不安全的
  * 使用新的`getSnapshotBeforeUpdate`, 在`commit阶段`内同步执行, 所以只会触发一次
* 异步调度
  * `flushPassiveEffects`方法从全局变量`rootWithPendingPassiveEffects`获取`effectList`
  * `effectList`包含了需要执行副作用的`Fiber节点`
    * 插入dom节点(PLACEMENT)
    * 更新dom节点(UPDATE)
    * 删除dom节点(DELETION)
    * 当一个`FunctionComponent`含有`useEffect`或者`useLayoutEffect`时, 它的fiber节点也会含有`Passive effectTag`
  * `flushPassiveEffect`内部遍历`effectList`, 执行`effect回调函数`
  * `useEffect`分成三步:
    1. `before mutation阶段`在`scheduleCallback`中调度`flushPassiveEffects`
    2. `layout阶段`之后, 将`effectList`赋值给`rootWidthPendingPassiveEffects`
    3. `scheduleCallBack`触发`flushPassiveEffects`, `flushPassiveEffects`内部遍历`rootWidthPendingPassiveEffects`
  * 原因:
    * 在浏览器完成渲染和绘制以后, 传给`useEffect`的函数会延迟调用.
    * 使得它试用于许多浏览器常见的副作用场景, 比如设置订阅和事件处理等情况
    * 因此不应该在函数中执行阻塞浏览器更新屏幕的操作
    * **防止同步执行时阻塞浏览器渲染**

### mutation阶段

* 同样遍历`effectList`, 执行函数, `commitMutationEffects`

```js
nextEffect = firstEffect;
do {
  try {
      commitMutationEffects(root, renderPriorityLevel);
    } catch (error) {
      invariant(nextEffect !== null, 'Should be working on an effect.');
      captureCommitPhaseError(nextEffect, error);
      nextEffect = nextEffect.nextEffect;
    }
} while (nextEffect !== null);
```

* `commitMutationEffects`
  * 根据`ContentRest effectTag`重置文本节点
  * 更新`ref`
  * 根据`effectTag`分别处理, 其中`effectTag`分别包括(`Placement|Update|Deletion|Hydrating`)

```js
function commitMutationEffects(root: FiberRoot, renderPriorityLevel) {
  // 遍历effectList
  while (nextEffect !== null) {
    const effectTag = nextEffect.effectTag;
    // 根据 ContentReset effectTag重置文字节点
    if (effectTag & ContentReset) {
      commitResetTextContent(nextEffect);
    }
    // 更新ref
    if (effectTag & Ref) {
      const current = nextEffect.alternate;
      if (current !== null) {
        commitDetachRef(current);
      }
    }
    // 根据 effectTag 分别处理
    const primaryEffectTag = effectTag & (Placement | Update | Deletion | Hydrating);
    switch (primaryEffectTag) {
      // 插入DOM
      case Placement: {
        commitPlacement(nextEffect);
        nextEffect.effectTag &= ~Placement;
        break;
      }
      // 插入DOM 并 更新DOM
      case PlacementAndUpdate: {
        // 插入
        commitPlacement(nextEffect);
        nextEffect.effectTag &= ~Placement;
        // 更新
        const current = nextEffect.alternate;
        commitWork(current, nextEffect);
        break;
      }
      // SSR
      case Hydrating: {
        nextEffect.effectTag &= ~Hydrating;
        break;
      }
      // SSR
      case HydratingAndUpdate: {
        nextEffect.effectTag &= ~Hydrating;
        const current = nextEffect.alternate;
        commitWork(current, nextEffect);
        break;
      }
      // 更新DOM
      case Update: {
        const current = nextEffect.alternate;
        commitWork(current, nextEffect);
        break;
      }
      // 删除DOM
      case Deletion: {
        commitDeletion(root, nextEffect, renderPriorityLevel);
        break;
      }
    }
    nextEffect = nextEffect.nextEffect;
  }
}
```

* `Placement effect`: `fiber节点`对应的`dom节点`需要插入到页面中
  1. 获取父级dom节点
  2. 获取fiber的兄弟节点, **`getHostSibling`非常耗时, 因为同一个`fiber节点`不止包含`HostComponent`***
  3. 根据dom节点是否存在, 判断执行`parentNode.insertBefore`或者`parentNode.appendChild`
* `Update effect`: `fiber节点`需要更新, 调用`commitWork`
  * `FunctionComponent mutation`
    * 当`fiber.tag`为`FunctionComponent`, 会调用`commitHookEffectListUnmount`.
    * 遍历`effectList`, 执行所有`useLayoutEffect hook`的销毁函数
  * `HostComponent mutation`
    * 调用`commitUpdate`
    * 最终在`updateDOMProperties`中将`render阶段 completeWork`中为`fiber节点`赋值的`updateQueue`对应的内容, 渲染在页面上

```js
for (let i = 0; i < updatePayload.length; i += 2) {
  const propKey = updatePayload[i];
  const propValue = updatePayload[i + 1];

  // 处理 style
  if (propKey === STYLE) {
    setValueForStyles(domElement, propValue);
  // 处理 DANGEROUSLY_SET_INNER_HTML
  } else if (propKey === DANGEROUSLY_SET_INNER_HTML) {
    setInnerHTML(domElement, propValue);
  // 处理 children
  } else if (propKey === CHILDREN) {
    setTextContent(domElement, propValue);
  } else {
  // 处理剩余 props
    setValueForProperty(domElement, propKey, propValue, isCustomComponentTag);
  }
}
```

* Deletion Effect: 当`fiber节点`含有`effectTag`时, 调用`commitDeletion`
  * 递归调用`fiber节点`以及`子孙fiber节点`. 调用`fiber.tag`为`ClassComponent`的`componentWillUnComponent`.
  * 从页面中移除`fiber节点`对应的`dom节点`
  * 解绑`ref`
  * 调度`useEffect`的销毁函数

### layout

* 代码是在dom渲染完成后执行的
* 该阶段触发的生命周期钩子和`hook`可以直接访问到已经改变后的`dom`
* 遍历`effectList`, 执行函数

```js
function commitLayoutEffects(root: FiberRoot, committedLanes: Lanes) {
  while (nextEffect !== null) {
    const effectTag = nextEffect.effectTag;

    // 调用生命周期钩子和hook
    if (effectTag & (Update | Callback)) {
      const current = nextEffect.alternate;
      commitLayoutEffectOnFiber(root, current, nextEffect, committedLanes);
    }

    // 赋值ref
    if (effectTag & Ref) {
      commitAttachRef(nextEffect);
    }

    nextEffect = nextEffect.nextEffect;
  }
}
```

* `commitLayoutEffects`
  1. `commitLayoutEffectOnFiber`调用生命周期钩子和hook相关操作
     * `ClassComponent`调用`ComponentDidMount`/`ComponentDidUpdate`
     * 调用`this.state()`第二个参数函数
     * `FunctionComponent`调用`useLayoutEffect`回调函数, 调度`useEffect`的销毁和回调函数
     * `useLayoutEffect()`: 从上一次更新的销毁到这次更新执行, 是同步执行的
     * `useEffect()`: 需要先调度, 在`Layout阶段`执行完成后, 再异步执行
  2. `commitAttachRef`: 赋值ref: 获取dom实例, 更新dom

* `mutation阶段`执行后, `layout`开始前, **切换`root.current = finishWork`**
* 因为layout执行的生命周期函数和hook需要获取新的dom信息
