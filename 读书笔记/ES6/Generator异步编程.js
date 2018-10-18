function * numbers() {
  yield 1
  yield 2
  return 3
  yield 4
}

// 展运算符, Array.from(), 解构赋值, for of 内部调用的都是 遍历器 接口
var res 
res = [...numbers()]
debugger
res = Array.from(numbers())
debugger
let [x, y] = numbers()
debugger
for (let n of numbers()) {
  console.log(n)
}
debugger

// 为原生object对象, 添加遍历接口
// function * objectEntries() {
//   let propKeys = Object.keys(this)
//   for (let propKey of propKeys) {
//     yield [propKey, this[propKey]]
//   }
// }

// let jane = { first: 'Jane', last: 'Doe'}

// jane[Symbol.iterator] = objectEntries

// for (let [key, value] of jane) {
//   console.log(`${key}: ${value}`)
// }



// function * fibonacci() {
//   let [prev, curr] = [0, 1]
//   for(;;) {
//     yield curr;
//     [prev, curr] = [curr, prev + curr]
//   }
// }

// for (let n of fibonacci()) {
//   if (n > 1000) break
//   console.log(n)
// }

// function * foo() {
//   yield 1;
//   yield 2
//   yield 3
//   yield 4
//   return 5
// }

// for (let val of foo()) {
//   console.log(val)
// }

// function wrapper(generatorFunction) {
//   debugger
//   return function aaa (...args) {
//     debugger
//     let generatorObject = generatorFunction(...args)
//     generatorObject.next();
//     debugger
//     return generatorObject
//   }
// }


// const wrapped = wrapper(function *() {
//   console.log('start')
//   console.log(`First input: ${yield}`)
//   debugger
//   return 'DONE'
// })

// debugger

// var res = wrapped()
// debugger
// var r
// r = res.next('sss')
// debugger
// r = res.next('ss')
// debugger

// function * dataConsumer() {
//   console.log('start')
//   yield 'dd'
//   console.log(`1. ${yield}`)
//   console.log(`2. ${yield}`)
//   return 'result'
// }

// let genObj = dataConsumer()
// var res 
// debugger
// res = genObj.next() // res : dd
// debugger
// res = genObj.next('a') // res: undefiend, a代表了上一个yield的返回值, 所以不会输出
// debugger
// res = genObj.next('b')

// res = genObj.next('b')
// debugger


// 通过next注入不同的值, 来让函数体内部进行不同的操作
// function * foo(x) {
//   var y = 2 * (yield (x+1))
//   var z = yield (y / 3)
//   return (x + y + z)
// }
// debugger
// var a = foo(5)
// var res 
// res = a.next()
// res = a.next()
// res = a.next()

// var b = foo(5)
// var r
// r = b.next()
// r = b.next(12) // next 的参数表示上一次yield的返回值
// r = b.next(12)

// 第一个next用来启动遍历器, 所以不需要参数




// yield 没有返回值, 返回的是next的参数

// function * f() {
//   debugger
//   for (var i = 0 ; true; i++) {
//     debugger
//     var reset = yield i
//     debugger
//     if (reset) {
//       debugger
//       i = -1
//     }
//   }
// }

// var g = f()
// var res 
// debugger
// res = g.next()
// debugger
// res = g.next()
// debugger
// res = g.next(true)
// debugger


// var myIterable = {}
// myIterable[Symbol.iterator] = function *() {
//   yield 1
//   yield 2
//   yield 3
// }

// // 这个Gentrator函数赋值给 这个对象的 Stymbol.iterator属性
// // 那么这个对象, 就有了 迭代的接口 可以被 ... 运算

// var res = [...myIterable]
// debugger

// function * gen() {
  
// }

// var g = gen()
// debugger
// var res = g[Symbol.iterator]() === g
// debugger


// function * demo () {
//   // console.log('Hello' + yield);
//   // console.log('Hello' + yield 123);
//   console.log(1)
//   debugger
//   console.log('Hello' + (yield));
//   debugger
//   console.log(yield 123)
//   console.log('Hello' + (yield 123));
//   debugger
// }

// function * demo() {
//   debugger
//   foo(yield 'a', yield 'b')
//   debugger
//   function foo(a, b) {
//     debugger
//     console.log(a)
//     console.log(b)
//   }
//   let input = yield
// }


// var ff = demo()
// debugger
// var res = ff.next()
// debugger
// var res = ff.next()
// debugger
// var res = ff.next()
// debugger



// 每一次都去遍历, 然其向下不断执行
// var arr = [1, [[2, 3], 4], [5, 6]];

// var flat = function* (a) {
//   var length = a.length;
//   for (var i = 0; i < length; i++) {
//     var item = a[i];
//     if (typeof item !== 'number') {
//       yield* flat(item);
//     } else {
//       yield item;
//     }
//   }
// };

// for (var f of flat(arr)) {
//   console.log(f);
// }


// var arr = [1, [[2, 3], 4], [5, 6]];

// var flat = function * (a) {
//   for (var i = 0 ; i < arr.length; i++) {
//     var item = arr[i]
//     if (typeof item !== 'number') {
//       yield * flat(item)
//     } else {
//       yield item
//     }
//   }
// }

// for (var f of flat(arr)) {
//   console.log(f)
// }

// yeild, 暂缓执行

// function * f() {
//   console.log('执行了')
// }

// // 第一次执行的时候, 只是返回一个生成器
// var generator = f()

// setTimeout(() => {
//   // 只有在调用next函数的时候, 才会执行
//   generator.next();
// }, 2000);







// 概念
// function * helloWorldGenerator() {
//   yield 'hello'
//   yield 'world'
//   return 'end'
// }

// var res;
// var hw = helloWorldGenerator();
// debugger
// res = hw.next()
// debugger
// res = hw.next()
// debugger
// res = hw.next()
// debugger
// res = hw.next()
// debugger
// res = hw.next()
// debugger
