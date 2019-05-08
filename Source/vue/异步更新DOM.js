// 如果我们改变了某个已经被观察的数据, 就会调用dep.notif()
// dep.notify => 就会让其中所有的subs, 也就是队列中存的sub, 都去执行update方法
// sub, 是一个watcher

update () {
  if (this.computed) {
    // 关于 lazy 和 active 的处理
  } else if (this.sync) {
    // 异步的话, 直接执行
    this.run()
  } else {
    // 核心: 异步推送到观察者队列中 , 下一个tick时调用
    queueWatcher(this)
  }
}
// 每个组件都有一个对应的watcher对象, 
// 在get某个属性的时候, 就把这个属性记录为依赖
// 也可能是在初始化的时候, data数据变成可观察的

queueWatcher (watcher) {
  // 我认为可能是, 一个data可能有许多个watcher
  // 那么更新的时候, 也可能会影响
  const id = watcher.id // 获取这个wather的id
  if (has[id] == null) { // 这个id不存在的话
    has[id] = true // 让他存在
    if (!flushing) { // 如果没有flush掉, 直接push进队列
      // 不清楚这里的flush事指什么, queue可能就是我们需要更新的wather队列.
      // 一个对象, 可能被很多的wather观察, 还是说每一次变动都会产生一个wather
      queue.push(watcher)
    } else {
      // 如果flushing已经准备好了, 就通过他的id切下来这个watcher
      // 如果他的id已经过去了, 他将会在下一次立即执行
      let i = queue.length - 1
      while (i > index && queue[i].id > watcher.id) { 
        // 大概就是一直找到大于index的值 i 和 并且这个id比最后的water的id大
        // 具体原因, 还要慢慢找
        i--
      }
      // 找到这个i了, 就把这个, 放到这个wather, 应该存在的指定顺序中.
      queue.splice(i + 1, 0, watcher)
    }
    if (!waiting) { // 如果可以立即执行了, 就进入到下一次执行队列
      waiting = true // 下一次循环执行开始
      nextTick(flushSchedulerQueue)
    }
  }
}
