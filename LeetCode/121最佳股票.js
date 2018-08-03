// 输入: [7,1,5,3,6,4]
// 输出: 5
// 解释: 在第 2 天（股票价格 = 1）的时候买入，在第 5 天（股票价格 = 6）的时候卖出，最大利润 = 6-1 = 5 。

// function betterSlect(nums) {
//   var minP = 0;
//   for (var i = 0; i < nums.length; i++) {
//     for (var j = i + 1; j < nums.length; j++) {
//       var temp = nums[j] - nums[i]
//       if (temp > minP) minP = temp
//     }
//   }
//   return minP
// }

var maxProfit = function (prices) {
  var maxProfit = 0;
  var minPrice = Number.MAX
  for (let i = 0; i < prices.length; i++) {
    minPrice = Math.min(prices[i], minPrice)
    maxProfit = Math.max(maxProfit, prices[i] - minPrice)
    debugger
  }
  return maxProfit
};

var arr = [7, 1, 5, 3, 6, 4]
var res = maxProfit(arr)
debugger