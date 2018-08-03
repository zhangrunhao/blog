function quickArr(arr) {
  var len = arr.length
  if (len < 2) {
    return arr
  }
  debugger
  var temp = arr[0]
  var left = []
  var right = []
  arr.forEach((val, index, arr) => {
    if (index === 0) {
      return
    }
    if (val < temp) {
      left.push(val)
    } else {
      right.push(val)
    }
  })
  // return Array.prototype.concat(quickArr(left), temp, quickArr(right))
  return quickArr(left).concat(temp, quickArr(right))
}

var arr = [1, 3, 4, 2, 5, 6]
var res = console.log(quickArr(arr))
console.log(arr)
debugger;