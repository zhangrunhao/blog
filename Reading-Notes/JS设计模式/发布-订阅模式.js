class Event {
  constructor() {
    this.clientList = []
    this.listen = this.listen
    this.notify = this.notify
  }
  listen(key, fn) {
    if (!this.clientList[key]) {
      this.clientList[key] = []
    }
    this.clientList[key].push(fn)
  }
  notify(key, ...args) {
    const _this = this
    const fns = this.clientList[key]
    if (!fns || fns.length === 0) {
      return false
    }
    for (let i = 0; i < fns.length; i++) {
      fns[i](...args)
    }
  }
  static install(obj) {
    const event = new Event
    Object.keys(event).forEach((key) => {
      obj[key] = event[key]
    })
  }
}

const saleStore = {}
// 安装完, 这个商店就有了发布-订阅的能力
Event.install(saleStore)

// 订阅
saleStore.listen('saleBananer', (price) => {
  console.log(`开始卖香蕉了, 需要告诉小米, 价格是: ${price}`)
})
saleStore.listen('saleBananer', (price) => {
  console.log(`小王 价格是: ${price}`)
})

saleStore.notify('saleBananer', 111)

const test = {}
Event.install(test)


debugger

