# 源码01

## render阶段

* 深度优先方式, 以此执行fiber节点的beginWork和completeWork

## mount beginWork流程

```js
/**
 * 注意: beginWork阶段只会创建一个子fiber节点
 * beginWork: 创建当前fiber节点的第一个子fiber节点
 * (根据当前节点的类型, 进入不同的update的逻辑) ->
 * updateHostComponent$1: 
 * (判断当前WorkProgressFiber是否存在对应的currentFiber, 决定是否标记EffectTags)
 * ->
 * reconcileChildren:
 * (判断当前fiber节点的children是什么类型, 执行不同的创建操作)
 * ->
 * reconcileSingleElement:
 * ->
 * createFiberFromElement:
 * ->
 * FiberNode: 创建一个子Fiber节点
 */
 ```

## mount completeWork流程

* `appendAllChildren`如何把子节点的dom元素, 挂载在父节点的dom元素下?

```js
/**
 * completeWork阶段: 
 * (根据不同的tag, 进入不同的case)
 * ->
 * createInstance: 创建dom
 * ->
 * appendAllChildren: 创建好的dom节点, 插入到之前创建好的dom树中
 * (img是创建的第一个节点, 所以会跳过插入阶段)
 * ->
 * appendInitialChild:
 * 如果是存在子节点的节点, 执行completeWork. child存在, child添加到父节点
 * 接着判断sibling是否存在, 存在的话, 继续添加到父节点
 * 没有的话, 后来会走到父节点的completeWork, 就可以继续向父节点的节点, 添加元素了.
 * ->
 * workInProgress.stateNode = instance: 创建好的dom, 挂载到fiber节点上
 * ->
 * finalizeInitialChildren: 设置属性
 * 
 * 全部节点执行完成后, 会形成一颗完整的dom树
 */
```
