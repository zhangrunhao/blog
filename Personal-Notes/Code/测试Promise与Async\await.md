# 测试Promise与Async/await的基本使用

> 想在项目中用, 发现自己不是很熟

## promise基本使用

### 基本使用-思路

* `new Promise()`返回了一个状态机
* 一个完全无法被外界影响的状态机
* 构造函数, 传入一个函数, 两个参数, 分别是`reslove, reject`
* 表示执行的回调函数, 也就是`.then()`, `.cache()`函数
* 达到内部调用外部函数的作用, 行程异步

```js
function init () {
  var p = new Promise((resolve, reject) => {
    reject(new Error(1))
  })
  p.then(a => {
    console.log(a)
  }).catch(b => {
    console.log(b)
  })
  console.log(p)
}
init()
```

### 基本使用-注意事项

* 命名不可错误
* reject回调函数中, 尽量放入一个`new Error`
* 如果直接在`new Promise()`的构造函数中, `throw new Error()`
* 也不会触发程序的停止, 而是被外面的`.cache()`所捕获
* **如果函数没有进行`.cache()`的话, 会抛出异常**
* 但不会影响其他程序的执行

```js
function init () {
  var p = new Promise((resolve, reject) => {
    throw new Error(1)
  })
  p.then(a => {
    console.log(a)
  }).catch(e => {
    console.log(e) // Error: 1
  })
}
init()
```

```js
function init () {
  var p = new Promise((resolve, reject) => {
    throw new Error(1)
  })
  var p1 = new Promise((resolve, reject) => {
    resolve(1)
  })
  p.then(a => {
    console.log(a)
  })
  p1.then(a => {
    console.log(a)
  })
  setTimeout(() => {
    console.log(3)
  }, 1000)
}
init()
console.log(2)

// 2
// 1
// Error: 1(抛出异常)
// (1s之后)
// 3
```

## async函数

### async函数-直接返回`new Promise`

* async 函数直接返回了新new的Promise

```js
async function a () {
  return new Promise((resolve, reject) => {
    resolve(2)
  })
}

function init () {
  setTimeout(() => {
    console.log(0)
  }, 0)
  var p = a()
  p.then(a => {
    console.log(a)
  })
  console.log(1)
}
init()
// 1
// 2
// 0
```

* 测试`new Promise中抛出错误, 是否影响执行`

```js
async function a () {
  return new Promise((resolve, reject) => {
    throw new Error(2)
  })
}

function init () {
  setTimeout(() => {
    console.log(0)
  }, 0)
  var p = a()
  p.then(a => {
    console.log(a)
  })
  console.log(1)
}
init()
// 1
// 报错: Uncaught (in promise) Error: 2
// 0
```

## async/await测试

### await的基本使用

* await返回的不再是Promise

```js
async function a () {
  return new Promise((resolve, reject) => {
    resolve(1)
  })
}

async function init () {
  setTimeout(() => {
    console.log(0)
  }, 0)
  var p = await a()
  p.then(a => {
    console.log(a)
  })
  console.log(1)
}
init()
// Uncaught (in promise) TypeError: p.then is not a function
// 0
```

* 使用reslove返回正确的结果

```js
async function a () {
  return new Promise((resolve, reject) => {
    resolve(2)
  })
}

async function init () {
  setTimeout(() => {
    console.log(0)
  }, 0)
  console.log(1)
  var p = await a()
  console.log(p)
}
init()
// 1
// 2
// 0
```

* 如果在`new Promise`的时候, 发生错误, 需要捕获await

```js
async function a () {
  return new Promise((resolve, reject) => {
    throw new Error('err') // reject(new Error('err')) 同样的效果
  })
}

async function init () {
  try {
    var p = await a()
  } catch (err) {
    console.log(err)
  }
  console.log(p)
}
init()
// Error: err
// undefined
```

* 可以在trycache的时候, 捕获了再抛出
* 若外边的函数, 未进行捕获处理, 将影响程序执行

```js
async function a () {
  return new Promise((resolve, reject) => {
    try {
      throw new Error('err')
    } catch (error) {
      reject(error)
    }
  })
}

async function init () {
  var p = await a()
  console.log(p)
}
init()
// 报错: Uncaught (in promise) Error: err
// 并且程序不会再继续执行
```

* 未使用async函数, 直接返回不是Promise的值, 接await可以直接输出

```js
async function a () {
  return 2
}

async function init () {
  var p = await a()
  console.log(p)
}
init()
```

* 只要使用了await就需要等待执行完, 返回了结果

```js
async function a () {
  var p = await b()
  console.log(p)
  return 'p'
}
async function b () {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      resolve(1)
    }, 2000)
  })
}

async function init () {
  var p = await a()
  console.log(p)
}
init()
// (2s)
// 1
// 'p'
```
