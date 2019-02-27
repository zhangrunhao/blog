// 我们可以通过this, 也就是vue对象,直接访问到data上的值, 通过代理完成的

_proxy.call(this, this.data)

function _proxy(data) {
  const that = this // 我们的vue对象
  Object.keys(data).forEach(key => { // 遍历我们需要代理对象中的每一个值
    Object.defineProperty(that, key, { // 然后给我们的vue对象, 设置这个属性值
      configurable: true, // 其他属性值可配置
      enumerable: true, //可枚举
      get: function proxyGetter() { // 我们直接访问this上的值, 就变成了访问data上的值
        return that._data[key]
      },
      set: function proxySetter(newValue) { // 设置同理
        that._data[key] = newValue
      }
    })
  })  
}