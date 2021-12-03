// 实现compose

// 参数是函数, 返回值也是参数
// 每一个函数的参数, 是上一个函数的返回值
// 函数自右向左执行

function compose(...fns) { // 1
  const len = fns.length
  let index = len - 1
  let result
  return function f1 (...args) {
    if (!fns[index]) return null
    result = fns[index].apply(this, args)
    if (index <= 0) {
      return result
    } else {
      index--
      return f1.call(null, result)
    }
  }
}

// var greet = function (name) {
//   return 'hi:' + name
// }
// var exclaim = function (statement) {
//   return statement.toUpperCase() + '!'
// }
// var welcome = compose(exclaim, greet)
// var res = welcome('dot')

var res = compose()

var r = res()
debugger