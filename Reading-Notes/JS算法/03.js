// 实现栈的基本功能
class Stack {
  constructor () {
    this.items = []
  }
  push(item) {
    return this.items.push(item)
  }
  pop() {
    return this.items.pop()
  }
  peek() {
    return this.items[this.items.length - 1]
  }
  isEmpty() {
    return this.items.length === 0
  }
  clear() {
    return this.items = []
  }
  size() {
    return this.items.length
  }
}

// 利用栈, 实现十进制转其他进制
function divideBy(num, base) {
  var stack = new Stack, res = ''
  while (num > 0) {
    var rem = Math.floor(num % base)
    stack.push(rem)
    num = Math.floor(num / base)
  }
  while(!stack.isEmpty()) {
    res += stack.pop()
  }
  return res
}
var num = 10
console.log(divideBy(10, 8))
console.log(num.toString(8))
