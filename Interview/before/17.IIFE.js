let name = 'aa';
(function foopp() {
  name = 10
  console.log(name) // 10
}());
console.log(name) // 10