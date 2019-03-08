(function foopp() {
  foopp = 10
  console.log(foopp) // function foopp() {...} // 在IIFE同名函数, JS解析器会忽略
}());

console.log(foopp) // ReferenceError: foopp is not defined