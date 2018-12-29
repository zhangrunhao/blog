function curry(fn) {
  let limit = fn.length
  return function handleFun (...args) {
    if (args.length >= limit) {
      return fn.apply(null, args)
    } else {
      return function (...arg) {
        return handleFun.apply(null, args.concat(arg)) // 因为返回的这个函数, 就是handleFunction, 所以, 函数空间没有变
      }
    }
  }
}

var sum = function (a, b, c) {
  return a+b+c
}

var res = curry(sum)(1)(2)(3)
console.log(res)
debugger