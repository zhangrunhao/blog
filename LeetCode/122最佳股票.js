var arr = [7,1,5,3,6,4]
// 7
function maxProfit(arr) {
  debugger
  var p = 0; // 每一次的差价
  var res = 0 // 结果
  for (var i = 1; i < arr.length; i++) {
    p = arr[i] - arr[i-1]
    if (p > 0) [
      res = res + p
    ]
  }
  return res
}


// var maxProfit = function(prices) {
//   debugger
//   let maxProfit = 0
//   let curMin = prices[0]
//   for(let i = 1; i < prices.length; i++){
//       if (prices[i] > curMin) {
//           maxProfit += prices[i] - curMin
//       }
//       curMin = prices[i]
//   }
//   return maxProfit
// };
var res = maxProfit(arr)
debugger
