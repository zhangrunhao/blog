var fs = require('fs')
var path = require('path')

let filePath1 = path.join(__dirname, './test1.txt')
let filePath2 = path.join(__dirname, './test2.txt')
let filePath3 = path.join(__dirname, './test3.txt')

var readFile = function (fileName) {
  return new Promise(function (reslove, reject) {
    fs.readFile(fileName, function (err, data) {
      if (err) return reject(err)
      reslove(data)
    })
  })
}

var gen = function * () {
  var r1 = yield readFile(filePath1)
  var r2 = yield readFile(filePath2)
  console.log(r1.toString())
  console.log(r2.toString())
}


function co(gen) { // 接受generator为参数, 返回一个promise对象
  var ctx = this;

  return new Promise(function (reslove, reject) {
    // 判断gen是不是函数. 
    // 如果是的话, 就执行这个函数, 
    // 如果不是, 就把promise的状态改为resloved, 更改的方式就是执行reslove
    if (typeof gen === 'function') gen = gen.call(ctx)
    if (!gen || typeof gen.next !== 'function') return reslove(gen)

    onFulfilled()
    // 将next函数, 包含在了onFulfilled函数中, 捕获抛出的错误
    function onFulfilled(res) {
      var ret;
      try {
        ret = gen.next(res)
      } catch (error) {
        return reject(error)
      }
      next(ret)
    }

    // 关键函数, next函数, 通过onFulfilled函数不断调用next.
    function next(ret) {
      // 检车generator函数是否执行结束
      if (ret.done) return reslove(ret.value)
      // 确保每一步的值是promise
      var value = toPromise.call(ctx, ret.value)
      // 使用onFulfilled函数再次调用next函数
      if (value && isPromise(value)) return value.then(onFulfilled, onRejected)

      // 在参数不符合的情况下, 更改状态为rejected, 终止执行
      return onRejected(
        new TypeError('yield只能是function, promise, generator, array, object, 你用的(ret.value)这个不行')
      )
    }

  })
}

// 在co模块内部, 可以在yeild后面直接写一个数组或者一个对象, 都可以通过yield, 来进行异步加载.
// 其实js中正真正的异步, 就是多个promise同时执行, 然后, 然后一个promise.all, 就是异步的最好体现.
// promise, 就是回调函数再次封装



// var g = gen()
// g.next().value.then(function (data) {
//   g.next(data).value.then(function (data) {
//     g.next(data)
//   })
// })
// function run(gen) {
//   var g = gen()
//   function step(data) {
//     var result = g.next(data)
//     if (result.done) return
//     result.value.then(step)
//   }
//   step()
// }


// function run(gen) {
//   var g = gen()
//   function step(data) {
//     var result = g.next(data)
//     if (result.done) return result.value
//     result.value.then(function (data) {
//       step(data)
//     })
//   }
//   step()
// }

// run(gen)





// var thunkify = require('thunkify')
// // 通过这个函数包装之后, 那么只需要传入回调函数, 就可以自动执行了
// var readFileThunk = thunkify(fs.readFile)


// // 通过回调函数不断接收和交出程序的执行权
// function run(fn) {
//   var gen = fn()
//   function step(err, data) {
//     var result = gen.next(data)
//     if (result.done) return
//     result.value(step)
//   }
//   step()
// }

// run(gen)

// g 就是表示Generator函数的内部指针.
// next 负责将指针移动到下一步, 并返回该步的信息
// var g = gen()
// var r1 = g.next()
// r1.value(function (err, data) {
//   if (err) throw err
//   var r2 = g.next(data)
//   r2.value(function (err, data) {
//     g.next(data)
//   })
// })


// var thunkify = require('thunkify')
// function f(a, b, callback) {
//   var sum = a + b
//   callback(sum)
//   callback(sum)
// }

// var ft = thunkify(f)
// ft(1, 2)(console.log)

// const thunkify = {
//   name: '111'
// }
// thunkify.name = 2

// console.log(thunkify.name)
// // const fs = require('fs')
// var Thunk = function (fn) {
//   return function () {
//     var args = Array.prototype.slice.call(arguments)
//     return function (callback) {
//       args.push(callback)
//       // 这里的this指的就是, 在我们传入callback函数的时候, 谁来调用的, 
//       // 就是外边的那个, fileAReadFileCallback(callback)
//       console.log(this)
//       return fn.apply(this, args)
//     }
//   }
// }

// // 这一步返回第二行的那个函数, 也就是需要传参的函数.
// // 这个会把参数都截取下来, 也是我们的readFileThunk函数, 这个函数可以截取参数, 返回一个需要传入callback的函数
// var readFileThunk = Thunk(fs.readFile)
// debugger
// // 就是这个, 这里返回了一个需要传入callback的函数, fileAReadFileCallback 这么一个函数
// // 这里就把需要传入的参数都传进去了
// var fileAReadFileCallback = readFileThunk('path/fileA')
// // fileAReadFileCallback(() => {
// //   // 原本这里的this, 要指向当前上下文的, 也就是, ReadFileContext
// //   // 因为是箭头函数, 所以指向了一个空对象, 不然应该是全局对象
// //   // 我也不太懂了..
// //   console.log(this)
// //   debugger
// //   // 需要处理的事情...
// //   // 这里传入callback, 就会传入到最后那个函数, 然后就会执行一个我们本来的fs.readFile这个函数, 通过this调用
// //   // 这里的this, 是指什么呢
// // })
// // fileAReadFileCallback(function () {
// //   // 这里就指向了ReadFileContext
// //   console.log(this)
// //   debugger
// // })

// fs.readFile('path/fileA', () => {
//   console.log(this) // 空对象, 应该是初始化的时候, 向上找没找到的原因
//   debugger
// })

// fs.readFile('a.a', function () {
//   // 这里的this就不会改变. 上次知乎真是尴尬, 麻蛋
//   console.log(this)
//   debugger
// })
// const Thunk = function (fn) {
//   return function (...args) {
//     return function (callback) {
//       return fn.call(this, ...args, callback)
//     }
//   }
// }

// function f(a, cb) {
//   cb(a)
// }

// const ft = Thunk(f)
// ft(1)(console.log)


// thunk函数, 
// fs.readFile(fileName, callback)

// var Thunk = function (fileName) {
//   return function (callback) {
//     return fs.readFile(fileName, callback)
//   }
// }

// var readFileThunk = Thunk(fileName)
// readFileThunk(callback)

// function *  gen() {
//   var a = 'a'
//   yield 1
//   yield 2
//   debugger
//   var b = 'b'
//   debugger
//   yield 3
//   return 4
// }

// function func(a) {
//   debugger
//   // func1()
//   return 'a'
// }

// function func1(b) {
//   debugger
//   return 'b'
// }

// var g = gen()
// g.next()
// debugger
// func()
// debugger
// g.next()
// debugger
// g.next()
// debugger




// function func1(a) {
//   a = 1
//   var func2Return = func2()
//   return func2Return
// }

// function func2(b) {
//   b = 2
//   func3()
//   return function () {
//     console.log(b)
//     return b =+ 5
//   }
// }

// function func3(c) {
//   c = 3
//   return c
// }
// var a = '1a'
// debugger
// var res = func1()
// res()
// res()

// debugger


// function f(m) {
//   return m * 2
// }

// f(x + 5)

// var thunk = function () {
//   return x + 5
// }

// function f(thunk) {
//   return thunk() * 2
// }


// var fetch = require('node-fetch')

// function * gen() {
//   debugger
//   var url = "https://api.github.com/users/github"
//   debugger
//   var result = yield fetch(url)
//   debugger
//   console.log(result.bio)
//   debugger
// }
// debugger
// var g = gen()
// debugger
// var result = g.next() // 此时result返回了一个promise
// debugger
// result.value.then(function (data) {
//   debugger
//   return data.json()
// }).then(function (data) {
//   debugger
//   g.next(data)
// })
// debugger // 先执行这里, 在执行promise中的then