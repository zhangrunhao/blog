
function bianryList(arr, item) {
  var low = 0
  var heigh = arr.length - 1
  while (low <= heigh) {
    var mid = Math.floor((low + heigh)/2)
    var temp = arr[mid]
    if (temp === item) return mid
    if (temp > item) {
      heigh = mid - 1
    } else {
      low = mid + 1
    }
    debugger
  }
  return null
}

var arr = [1,2,3,5,6,9,12,15]
var res = bianryList(arr, 15)
debugger;