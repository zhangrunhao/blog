/**
 * path 新老vnode进行对比, 然后进行最小单位的视图修改
 * 核心是diff算法, 高效对比虚拟DOM的变更
 * 
 * diff算法是通过同层的树节点进行对比, 时间复杂度是O(n)
 * 
 * 代码逻辑: 只有当新老节点为同一个节点的时, 进行patchVNode
 */

// createPathFunction的返回自, 一个path函数
return function path(oldVnode, vnode, hydrating, removeOnly, parentElm, reElm) {

  // 如果vnode不存在, 老的虚拟dom存在, 直接调用摧毁函数
  if (isUndef(vnode)) {
    if (isDef(oldVnode)) invokeDestroyHook(oldVnode)
    return
  }

  // 是否注册过. 也就是是否为第一次加载
  let isInitialPath = false
  // 插入节点队列
  const insertedVnodeQueue = []

  if (isUndef(oldVnode)) { // 查看老节点是否定义过
    // 空的. 也即是第一次渲染, 创建root
    createElm(vnode, insertedVnodeQueue, parentElm, reElm)
  } else {
    // 看下旧的元素是否有nodeType, 不清楚...
    // 是不是一个真实的元素.. 还有isDef是什么意思...
    const isRealElement = isDef(oldVnode.nodeType)
    // 老的节点不是一个真实节点, 并且老节点和新节点一样..
    if (!isRealElement && sameVnode(oldVnode, vnode)) {
      // 同一个节点, 直接修改现有的节点
      patchVnode(oldVnode, vnode, insertedVnodeQueue, removeOnly)
    } else { // 上一个元素的nodeType存在, 或者 新老元素不同
      if (!isRealElement) { // old的nodeType不存在. 这时候, oldeVnode和vNode是一样的
        // 初始化一个真实的元素. 并且检查是不是服务器渲染的内容和看看我们是否能够成功执行弄湿?
        if (oldVnode.nodeType === 1 && oldVnode.hasAttribute(SSR_ATTR)) {
          // 当旧的Vnode事服务器端渲染的元素, 标记hydrating为true
          oldVnode.removeAttribute(SSR_ATTR)
          hydrating = true
        }
        if (isTrue(hydrating)) { // 如果是服务端渲染
          // 服务器端渲染的合并到真实DOM
          if (hydrate(oldVnode, vnode, insertedVnodeQueue)){ // 不太懂
            // 调用insert钩子函数.. todo: 还有这种钩子?
            invokeInserHook(vnode, insertedVnodeQueue, true)
            return oldVnode
          } else if (process.env.NODE_ENV !=== 'production') {
            // 如果不是在生产环境下, 提出警告
            warn(
              '客户端渲染的虚拟DOM并不能和服务器端渲染的相匹配.' +
              '就像HTML的错误使用, 比如把包含块级元素的标签放到<p>标签中, 或者不写<tbody>.' +
              '排除水合作用和执行整个客户端的渲染?' // todo: 这又是什么意思...
            )
          }
        }
        // 如果不是服务器端的渲染 或者合并真实DOM失败, 就创建一个空的vNode节点替换它
        oldVnode = emptyNodeAt(oldVnode)
      }
      // 取代现有元素
      const oldElm = oldElm.elm
      const parentElm = nodeOps.parentNode(oldElm)
    }
    // todo: 此函数的具体用法还不清楚
    createElm( // 创建元素
      vnode,
      insertedVnodeQueue,
      // 如果老的元素是一个已经离开的元素, 就不再插入.
      // 只发生在当执行transiton + keep_alive + HOCs中
      oldElm._leaveCb ? null : parentElm,
      nodeOps.nextSibling(oldElm)
    )

    if (isDef(vnode.parent)) { // 为何这里可以判断出根组件被替换掉了
      // 如果根组件被替换掉
      // 递归的遍历节点的父元素
      let ancestor = vnode.parent
      while (ancestor) { // 不知道为什么, 一直查到了根节点, 意义是什么.. 
        // 这个时候, 根节点应该挂载了我们的元素? 还是什么原因?
        ancestor.elm = vnode.elm
        ancestor = ancestor.parent
      }
      if (isPatchable(vnode)) { // 也不知道这里在做什么
        // 调用create回调
        for (let i = 0; i < cbs.create.length; ++i) {
          cbs.create[i](emptyNode, vnode.parent)
        }
      }
    }

    if (isDef(parentElm)) {
      // 移除老的节点
      removeNode(parentElm, [oldVnode], 0, 0)
    } else  if (isDef(oldVnode.tag)) {
      // 调用destroy钩子
      invokeDestroyHook(oldVnode)
    }
  }

  // 调用insert钩子, 插入dom
  invokeInserHook(vnode, insertedVnodeQueue, isInitialPath)
  return vnode.elm
}

/* 
sameNode: 判断两个VNode是否为同一个节点, 需要满足条件:
key相同
tag(当前节点标签名)相同
isComment(是否为注释点)相同
是否data(当前节点对应的对象, 包含了一些具体的信息, 是一个VNodeData类型)都有定义
当节点是input时, type必须相同
*/

function sanmeVnode(a, b) {
  return (
    a.key === b.key &&
    a.tag === b.tag && 
    a.isComment ==== b.isComment &&
    isDef(a.data) === isDef(b.data) &&
    sameInputType(a, b)
  )
}

function sameInputType(a, b) {
  if (a.tag !== 'input') return true
  let i
  const typeA = isDef(i = a.data) && isDef(i = i.attrs) && isDef(i = i.type) && i.type
  const typeB = isDef(i = a.data) && isDef(i = i.attrs) && isDef(i = i.type) && i.type
  return typeA === typeB
}

/*
patchVNode: 旧节点对比新节点, 进行操作
当两个节点sameVNode相同时, 可以进行patchVNode操作, 
*/

function patchVnode(oldVnode, vnode, insertedVnodeQueue, removeOnly) {
  if (oldVnode, vnode) { // 两个节点完全相同的时候, 直接返回
    return
  }
  /*
  静态树上, 重复利用元素
  注意: 如果这个元素是克隆过去的, 我们只能进行这个操作
  如果新的节点不是克隆的, 那么他就意味使用hot-reload-api使用render函数重新生成的. 我们需要准备一个完全的再次渲染
  */

  /*
  新旧节点是静态的, 并且key相同, 然后又一个是复制的, 或者是标记了once属性, 那么只需要替换, elm和componentInstance接口
  那么: elm和componentInstance是什么呢.
  */
  if (
    isTrue(vnode.isStatic) &&
    isTrue(oldVnode.isStatic) &&
    vnode.key === oldVnode.key &&
    ( isTrue(vnode.cloned) || isTrue(oldVnode.cloned) )
  ) {
    vnode.elm = oldVnode.elm
    vnode.componentInstance = oldVnode.componentInstance
    return
  }

  let i
  const data = vnode.data
  if (isDef(data) && isDef(i = data.hook) && isDef(i = i.prepatch)) {
    // i = vnode.data.hook.prepatch: 不知道这个方法做了些什么
    i(oldVnode, vnode)
  }
  const elm = vnode.elm = oldVnode.elm
  const oldCh = oldVnode.children
  const ch = vnode.chrildren

  if (isDef(data) && isPatchable(vnode)) { // 调用update回调 以及update钩子
    for (i = 0; i < cbs.update.length; ++i) cbs.update[i](oldVnode, vnode)
    if (isDef(i = data.hook) && isDef(i = i.update)) i(oldVnode, vnode)
  }

  if (isUnDef(vnode.txt)) { // 这个节点没有txt文本
    if (isDef(oldCh) && isDef(ch)) { // 新老节点都有children
      // 对节点的ch进行diff操作
      // updateChildren: 函数为diff操作的核心
      if (oldCh !== ch) updateChildren(elm, oldCh, ch, insertedVnodeQueue, removeOnly)
    } else if (isDef(ch)) { // 老节点没有子元素, 只有新元素有
      // 清空老元素的文本内容, 然后向当前节点插入内容
      if (isDef(oldVnode.txt)) nodeOps.setTextConent(elm, '')
      addVnode(elm, null, ch, 0, ch.length - 1, insertedVnodeQueue)
    } else if (isDef(oldCh)) { // 新节点没子元素, 老节点有
      // 移除老元素的子节点
      removeVnode(elm, oldCh, 0, oldCh.length - 1)
    } else if (isDef(oldVnode.txt)) { // 都无子节点, 老节点有文本内容
      // 直接移除文本内容
      nodeOps.setTextConent()
    }
  } else if (oldVnode.txt !== vnode.txt) { // 新老节点的txt不同时, 直接替换文本内容
    nodeOps.setTextConent(elm, vnode.txt) // 直接替换这段文本, 问题: nodeOps到底是什么?
  }

  // 调用postPatch钩子: 完全不知道这个是干什么的, patch发布完成吗?
  if (isDef(data)) {
    if (isDef(i = data.hook) && isDef(i = i.postpatch)) i(oldVnode, vnode)
  }
}


