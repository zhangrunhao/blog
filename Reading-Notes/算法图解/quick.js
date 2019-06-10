function quickSort(arr) {
  if (arr.length < 2) return arr
  var less = []
  var greater = []
  var pivot = arr[0]
  for (var i = 1; i < arr.length; i++) {
    if (arr[i] < pivot) {
      less.push(arr[i])
    } else {
      greater.push(arr[i])
    }
  }
  return Array.prototype.concat(quickSort(less), [pivot], quickSort(greater))
}

var arr = [2, 4, 1, 3, 3]
var res = quickSort(arr)
console.log(res)