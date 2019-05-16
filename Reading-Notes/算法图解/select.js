function selectSmallestIndex(arr) {
  var smallest = arr[0]
  var smallestIndex = 0
  for (var i = 0; i < arr.length; i++) {
    if (arr[i] < smallest) {
      smallest = arr[i]
      smallestIndex = i
    }
  }
  return smallestIndex
}

function selectsSort(arr) {
  var newArr = []
  var len = arr.length
  for (var i = 0; i < len; i++) {
    var smallestIndex = selectSmallestIndex(arr)
    newArr.push(arr[smallestIndex])
    arr.splice(smallestIndex, 1)
  }
  return newArr
}

var arr = [2, 4, 6, 1, 3, 4, 6, 2, 7]
var res = selectsSort(arr)
console.log(res)
debugger;