/**
 * 
 * 修改数据 => 修改视图
 * 
 * 修改数据 => set方法 => 让闭包中的Dep调用notify => Watcher => get方法 => vm._update(vm.render(), hydraing)
 * 
 */

// updata 方法的第一个参数 是 vnode对象, 和之前旧的vnode进行__patch__
Vue.prototype._update = function (vnode:VNode, hydraing: Boolean) {
  // 找到我们这个vue组件
  const vm: component = this
  if (vm._mounted) { // 如果这个组件挂载过的话, 就让他,执行更新的方法
    callHook(vm, 'beforeUpdate')
  }
  // 缓存上一个目标元素
  const prevEl = vm.$el
  // 缓存上一个虚拟节点
  const prevVnode = vm._vnode

  // todo: 不清楚作用
  const preActiveInstance = activeInstance
  activeInstance = vm

  // 虚拟节点赋值
  vm._vnode = vnode

  if (!prevVnode) {
    // 上一个节点不存在, 就是第一次渲染
    vm.$el = vm._patch_(
      vm.$el,
      vnode,
      hydraing,
      false, // removeObly: 等会得到_patch_函数去看
      vm.$options._parentElm,
      vm.$options._refElm
    )
  } else {
    // 更新节点
    vm.$el = vm.__patch__(prevVnode, vnode)
  }

  // 还是不明白这个地方的用处
  activeInstance = preActiveInstance

  // 更新实例对象的__vue__
  if (prevEl) {
    prevEl.__vue__ = null //todo 这是什么意思, 清空?
  }

  if (vm.$el) { // 如果存在节点
    vm.$el.__vue__ = vm // 就把当前这个实例放到el的__vue__属性上
  }

  // 如果是父节点是一个HOC, 最好也更新的他的$el
  // 当前节点就是父节点, 这是什么鬼?
  if (vm.$vnode && vm.$parent && vm.$vnode === vm.$parent._vnode) {
    // 就把当前的dom节点放到他的父元素上面
    vm.$parent.$el = vm.$el
  }
  
  // 有这么一句注释
  // 程序执行钩子函数的时候, 必须保证 子组件的更新 在必须要在父组件的钩子函数中执行
}



