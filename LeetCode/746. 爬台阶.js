var minCostClimbingStairs = function (cost) {
  debugger
  var len = cost.length
  // 一个数组存储走过的步数
  var arr = [0, 0]
  for (var i = 2; i <= len; i++) {
    arr[i] = Math.min(arr[i - 1] + cost[i - 1], arr[i - 2] + cost[i - 2])
  }
  return arr[len]
};

var res = minCostClimbingStairs([0, 0, 1, 1])
debugger