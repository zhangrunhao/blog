function sum(arr) {
  if (arr.length == 0) {
    return 0
  } else if (arr.length == 1) {
    return arr[0]
  } else {
    return arr[0] + sum(arr.slice(1))
  }
}

var arr = [1, 2, 3, 4, 5]

var res = sum(arr)
console.log(res)