// 二. 给定一个包含 m x n 个元素的矩阵（m 行, n 列），请按照顺时针螺旋顺序，返回矩阵中的所有元素。
// 输入:
// [
//  [ 1, 2, 3, 4 ],
//  [ 5, 6, 7, 8 ],
//  [ 9, 10, 11, 12],
//  [13, 14, 15, 16]
//  [17, 18, 19, 20]
// ]
// 输出: [1,2,3,6,9,8,7,4,5]

// 我的方案 时间复杂度: O(n^2): 卧槽
// 卧槽, 这么回事, 我自己理解错了
// function sani(array) {
//   var m = arr[0].length
//   var n = arr[0].length
//   var res = []
//   for(var i = 0; i < m; i++) {
//     for (var j =0 ; j < n; j++) {
//       if ((m%2) === 0) {
//         res.push(arr[i].pop())
//       } else {
//         res.push(arr[i].shift())
//       }
//     }
//   }
//   return res
// }

// 思路牛逼
const snail = function(array) {
  var result;
  while (array.length) {
    debugger
    // Steal the first row.
    result = (result ? result.concat(array.shift()) : array.shift());
    // Steal the right items.
    for (var i = 0; i < array.length; i++){
      result.push(array[i].pop());
    }
    // Steal the bottom row.
    result = result.concat((array.pop() || []).reverse());
    // Steal the left items.
    for (var i = array.length - 1; i >= 0; i--){
      result.push(array[i].shift());
    }
  }
  return result;
}


var arr = [
  [ 1, 2, 3, 4 ],
  [ 5, 6, 7, 8 ],
  [ 9, 10, 11, 12],
  [13, 14, 15, 16],
  [17, 18, 19, 20]
 ]
var res = snail(arr)
console.log(res)
debugger;