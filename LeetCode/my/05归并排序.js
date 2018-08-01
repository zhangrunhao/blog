function mergeSort(arr) {
  var len = arr.length
  if (len < 2) {
    return arr
  }
  var mid = Math.floor(len / 2)
  var left = arr.slice(0, mid)
  var right = arr.slice(mid, len)
  return merge(mergeSort(left), mergeSort(right))
}

function merge(left, right) {
  var reslut = []
  var li = 0
  var ri = 0
  while (li < left.length && ri < right.length) {
    if (left[li] > right[ri]) {
      reslut.push(right[ri++])
    } else {
      reslut.push(left[li++])
    }
  }

  while (li < left.length) {
    reslut.push(left[li++])
  }
  while (ri < right.length) {
    reslut.push(right[ri++])
  }

  return reslut
}

var arr = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]
mergeSort(arr)
debugger