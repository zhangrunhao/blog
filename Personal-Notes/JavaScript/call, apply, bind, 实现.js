// # call, apply, bind, 实现

// call

Function.prototype.call2 = function (context, ...args) {
  context = context || window
  context.fn = this
  context.fn(...args)
  delete context.fn
}

Function.prototype.apply2 = function (context, args) {
  context = context || window
  context.fn = this
  if (!(args instanceof Array)) args = []
  context.fn(...args)
  delete context
}

Function.prototype.bind2 = function (context, ...args1) {
  const self = this
  var fn = function (...args2) {
    return self.call(this instanceof fn ? this: context, ...args1.concat(args2))
  }
  fn.prototype = this.prototype
  return fn
}



var value = 2

var foo = {
  value: 1
}

function bar(name, age) {
  this.habit = "shopping" // foo.habit = "shopping"
  console.log(this.value) // 2
  console.log(name) // "daisy"
  console.log(age)
}

bar.prototype.friend = "kevin"

var bindFoo = bar.bind(foo, "daisy")

var obj = new bindFoo(18)
console.log(obj)
console.log(obj.habit)
console.log(obj.friend)

// bar.call2(foo, "zhangrh", 28)
// bar.apply(foo, ["zhang", 28])
// var f = bar.bind2(foo, "zhangrh")
// f.call2(foo2, 29)
