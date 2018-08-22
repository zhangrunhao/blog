var A = function A(a, b , c) {
  this.a = a
  this.b = b
  this.c = c
}

var B = function b() {}

B.prototype.say = function say() {
  console.log(this.a)
}

A.prototype.__proto__ = B.prototype



var a = new A (1, 2, 3)
console.log(a)
a.say()