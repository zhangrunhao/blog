function binary_search(list, item) {
  var low = 0
  var high = list.length - 1
  while (low <= high) {
    var mid = Math.floor((low + high) / 2)
    var guess = list[mid]
    if (guess === item) {
      return mid
    } else if (guess < item) {
      low = mid + 1
    } else if (guess > item) {
      high = mid - 1
    }
  }
  return null
}

var arr = [1, 3, 4, 6, 7, 9]
var res = binary_search(arr, 4)
console.log(res)