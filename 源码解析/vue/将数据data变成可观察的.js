// 监听函数
// obj, 我们设置监听的对象, 对象中的每一个属性值改变, 都执行一遍cb函数
function observe(obj, cb) {
  debugger
  Object.keys(obj).forEach(key => defineReactive(obj, key, obj[key], cb))
}

// 定义依赖收集函数
function defineReactive(obj, key, value, cb) {
  Object.defineProperty(obj, key, {
    enumerable: true, // 可枚举
    configurable: true, // 可修改这几个属性
    get: () => {
      /* 依赖收集. */
      debugger;
      return value // 第一次设置的时候, value, 就是我们在data中定义的值
    },
    set: newValue => {
      value = newValue // 此后的每个属性的值, 就是我们设置的新值
      cb() // 订阅者回收消息
    }
  })
}

class Vue {
  constructor(options) {
    debugger;
    this._data = options.data
    debugger;
    observe(this._data, options.render) // 其实这就相当于一旦改变 data上面的值, 就执行一遍render函数
  }
}

const vue = new Vue({
  data: {
    text: 'text',
    text2: 'text2'
  },
  render() {
    console.log('render')
  }
})
debugger
vue._data.text = 'ssss'

debugger