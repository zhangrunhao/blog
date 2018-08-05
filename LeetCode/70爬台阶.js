// var climbStairs = function(n) { // 递归的话, 栈就炸了..
//   if (n === 1) {
//       return 1
//   }
//   if (n === 2) {
//       return 2
//   }
//   if (n > 2) {
//       return climbStairs +  climbStairs(n - 1 )
//   }
// };


/**
 * @param {number} n
 * @return {number}
 */
var climbStairs = function(n) {
    var arr = [0, 1, 2]
    var res = 0
    if (n <= 2) {
        return arr[n]
    }
    for (var i = 3 ; i <= n; i++) {
        arr[i] = arr[i-1] + arr[i-2]
    }
    return arr[n]
};
var res = climbStairs(4)
debugger