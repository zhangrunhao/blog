// 虚拟DOM可以在任何支持JavaScript的平台实现
// vue 在web和weex上的实现是一致的. 
// DOM节点反应到真实节点上时, 有一层适配层.
// 不同平台只需要使用适配层所提供的接口, 不需要关心内部实现.

const hooks = ['create', 'activate', 'update', 'remove', 'destroy']

const modules = [ // 真实文件中通过引用引入
  attrs,
  klass, // class
  events,
  domProps,
  style,
  transition
]

for (i = 0; i < hooks.length; ++i) {
  cbs[hooks[i]] = []
  for (j = 0; j < modules.length; ++j) {
    if (isDef(modules[j][hooks[i]])) {
      cbs[hooks[i]].push(modules[j][hooks[i]])
    }
  }
}

// 遍历完成后就变成了

// cbs.create = [ atts['create'], klass['create'] ]

// 也就是在指定的地方调用cbs中的所有回调函数, 以便更新所有需要更新的地方

// 例如在我们 调用 invokeCtreatHook 的回调时, 就就是调用了所有含有 create 这个回调的modlues, 例如attrs, class等
// 会把这些统一更新一遍