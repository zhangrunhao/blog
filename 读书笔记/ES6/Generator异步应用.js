
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
// fs.readFile(fileName, callback)

// var Thunk = function (fileName) {
//   return function (callback) {
//     return fs.readFile(fileName, callback)
//   }
// }

// var readFileThunk = Thunk(fileName)
// readFileThunk(callback)

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