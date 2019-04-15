# Vue初始化

## Vue上面的函数怎么来的

### vue的打包路径

* 在web中使用的vue打包路径: `npm run build` 打包生成vue.js
* 下面是依次引入:
  * src/platforms/web/entry-runtime-with-compiler.js
  * src/platforms/web/runtime/index.js
  * src/core/index.js
  * src/core/instance/index.js

### instance/index.js

* 这个js文件就是Vue本身了
* 首先这是一个构造函数, 然后在执行`new`的时候, 会执行一个`this._init`函数
* 导出这个Vue之前, 都会挂载一些函数, 我们就来看看, 分别挂载了什么

```js
import { initMixin } from './init'
import { stateMixin } from './state'
import { renderMixin } from './render'
import { eventsMixin } from './events'
import { lifecycleMixin } from './lifecycle'
import { warn } from '../util/index'

function Vue (options) {
  if (process.env.NODE_ENV !== 'production' &&
    !(this instanceof Vue)
  ) {
    warn('Vue is a constructor and should be called with the `new` keyword')
  }
  this._init(options)
}

initMixin(Vue)
stateMixin(Vue)
eventsMixin(Vue)
lifecycleMixin(Vue)
renderMixin(Vue)

export default Vue
```

### initMixin

* 主要就是挂载了_init方法, 这是最关键的.

### stateMixin

* $set
* $delete
* $watch

### eventsMixin

* $on
* $once
* $off
* emit

### lifecycleMixin

* $_update
* $forceUpdate
* $destroy

### renderMixin

* $nextTick
* _render

### $mount

* 在`src/platforms/web/runtime/index.js`进行挂载.
* 这里引入了`/src/core/instance/lifecycle.js`中的`mountComponent`函数

## `new vue`都干了什么

> 在这里就执行了一个_init函数

### 总览函数, 逐个分析

```js
  Vue.prototype._init = function (options?: Object) {
    const vm: Component = this
    // a uid
    vm._uid = uid++

    let startTag, endTag
    /* istanbul ignore if */
    if (process.env.NODE_ENV !== 'production' && config.performance && mark) {
      startTag = `vue-perf-start:${vm._uid}`
      endTag = `vue-perf-end:${vm._uid}`
      mark(startTag)
    }

    // a flag to avoid this being observed
    vm._isVue = true
    // merge options
    if (options && options._isComponent) {
      // optimize internal component instantiation
      // since dynamic options merging is pretty slow, and none of the
      // internal component options needs special treatment.
      initInternalComponent(vm, options)
    } else {
      vm.$options = mergeOptions(
        resolveConstructorOptions(vm.constructor),
        options || {},
        vm
      )
    }
    /* istanbul ignore else */
    if (process.env.NODE_ENV !== 'production') {
      initProxy(vm)
    } else {
      vm._renderProxy = vm
    }
    // expose real self
    vm._self = vm
    initLifecycle(vm)
    initEvents(vm)
    initRender(vm)
    callHook(vm, 'beforeCreate')
    initInjections(vm) // resolve injections before data/props
    initState(vm)
    initProvide(vm) // resolve provide after data/props
    callHook(vm, 'created')

    /* istanbul ignore if */
    if (process.env.NODE_ENV !== 'production' && config.performance && mark) {
      vm._name = formatComponentName(vm, false)
      mark(endTag)
      measure(`vue ${vm._name} init`, startTag, endTag)
    }

    if (vm.$options.el) {
      vm.$mount(vm.$options.el)
    }
  }
```

### initLifecycle

* 初始化各种状态

```js
export function initLifecycle (vm: Component) {
  const options = vm.$options

  // locate first non-abstract parent
  let parent = options.parent
  if (parent && !options.abstract) {
    // 不断向下深复制所有的parent, 找到最终元素,
    while (parent.$options.abstract && parent.$parent) {
      parent = parent.$parent
    }
    parent.$children.push(vm)
  }

  // 确定该组件的状态, 初始化一些需要东西
  vm.$parent = parent
  vm.$root = parent ? parent.$root : vm

  vm.$children = []
  vm.$refs = {}

  vm._watcher = null
  vm._inactive = null
  vm._directInactive = false
  vm._isMounted = false
  vm._isDestroyed = false
  vm._isBeingDestroyed = false
}
```

### initEvents

* 初始化事件, 尤其是events, 还有一个listenners.

```js
export function initEvents (vm: Component) {
  vm._events = Object.create(null)
  vm._hasHookEvent = false
  // init parent attached events
  const listeners = vm.$options._parentListeners
  // 更新监听函数什么鬼呢?
  if (listeners) {
    updateComponentListeners(vm, listeners)
  }
}
```

### initRender

```js
export function initRender (vm: Component) {
  vm._vnode = null // the root of the child tree
  vm._staticTrees = null // v-once cached trees
  const options = vm.$options
  const parentVnode = vm.$vnode = options._parentVnode // the placeholder node in parent tree
  const renderContext = parentVnode && parentVnode.context
  vm.$slots = resolveSlots(options._renderChildren, renderContext)
  vm.$scopedSlots = emptyObject
  // bind the createElement fn to this instance
  // so that we get proper render context inside it.
  // args order: tag, data, children, normalizationType, alwaysNormalize
  // internal version is used by render functions compiled from templates
  // 这里的createElement关键, 确定了我们需要页面上需要渲染的函数
  vm._c = (a, b, c, d) => createElement(vm, a, b, c, d, false)
  // normalization is always applied for the public version, used in
  // user-written render functions.
  vm.$createElement = (a, b, c, d) => createElement(vm, a, b, c, d, true)

  // todo: 这里还没有搞太懂
  // $attrs & $listeners are exposed for easier HOC creation.
  // they need to be reactive so that HOCs using them are always updated
  const parentData = parentVnode && parentVnode.data

  /* istanbul ignore else */
  if (process.env.NODE_ENV !== 'production') {
    defineReactive(vm, '$attrs', parentData && parentData.attrs || emptyObject, () => {
      !isUpdatingChildComponent && warn(`$attrs is readonly.`, vm)
    }, true)
    defineReactive(vm, '$listeners', options._parentListeners || emptyObject, () => {
      !isUpdatingChildComponent && warn(`$listeners is readonly.`, vm)
    }, true)
  } else {
    defineReactive(vm, '$attrs', parentData && parentData.attrs || emptyObject, null, true)
    defineReactive(vm, '$listeners', options._parentListeners || emptyObject, null, true)
  }
}
```

### 这个时候, 调用钩子函数`beforeCreate钩子`

### initInjections

* 这是一个高级用法, 在初识话data和prop之前, 来设置一些应该设置的值
* 好吧, 还没有深入

### initState

* 关键步骤:
  1. props
  2. methods
  3. data
  4. computed
  5. watcher

```js

export function initState (vm: Component) {
  vm._watchers = []
  const opts = vm.$options
  if (opts.props) initProps(vm, opts.props)
  if (opts.methods) initMethods(vm, opts.methods)
  if (opts.data) {
    initData(vm)
  } else {
    observe(vm._data = {}, true /* asRootData */)
  }
  if (opts.computed) initComputed(vm, opts.computed)
  if (opts.watch && opts.watch !== nativeWatch) {
    initWatch(vm, opts.watch)
  }
}
```

### initProvide

* 在初识完一系列的data, 和prop之后执行调用, 需要深入

### 调用`created`函数

### mount

* 如果存在options.el上面的el, 那么就会调用, mount函数
* 这个函数指的就是在`mountComponent`函数.

### 这时候, 调用`beforeMount`

### 在mount中

* 开始执行一系列的update和render函数
* 执行结束后, 执行mounted, 这个时候, 这个组件就算渲染完成了.

## 疑问

* **如果在一个父组件中有两个子组件, 那么这个两个组件生命周期的执行顺序是什么?**
* **需要深入的还很多啊, 看了很多的文章, 杜宇Dep, Watcher, Observer的关系还是没这么清楚**
* **还有就是vue在初识化的过程中做了很多不知道的操作**