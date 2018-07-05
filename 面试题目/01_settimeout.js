setTimeout(function () {
  setTimeout(function () {
    console.log(3);
  }, 1000)
  setTimeout(function () {
    console.log(6);
  }, 1000)
  console.log(5);
  setTimeout(function () {
    console.log(1)
  }, 0)
}, 0)
setTimeout(function () {
  console.log(4);
}, 1000)
console.log(2)

// 2, 5, 1 - 1s --> 4, 3, 6