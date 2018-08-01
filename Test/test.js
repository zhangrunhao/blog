function fibonaci(n, n1 = 1, n2 = 1) {
  debugger
  if (n <= 2) {
    return 1
  }
  return fibonaci(n - 1, n2, n1 + n2)
}

// function fibonaci(n) { // RangeError: Maximum call stack size exceeded
//   if (n === 1) return 1
//   return n + fibonaci(n - 1)
// }
var res = fibonaci(5)
debugger