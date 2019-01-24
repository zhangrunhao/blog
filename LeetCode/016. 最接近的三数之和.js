/**
 * @param {number[]} nums
 * @param {number} target
 * @return {number}
 */
var threeSumClosest = function(nums, target) { // 执行时间: 1993ms
  var len = nums.length;
  var diff = Number.MAX_VALUE;
  var res = null;
  for (var i = 0; i < len; i++) {
    for (var j = 0; j < len; j++) {
      for (var k = 0; k < len; k++) {
        if (i !== j && i !== k && j !== k) {
          debugger
          var sum = nums[i] + nums[j] + nums[k]
          var temp = Math.abs(sum - target)
          if (temp < diff) {
            res = sum
            diff = temp
          }
          debugger
        }
      }
    }
  }
  debugger
  return res
};

// 大神解答第一版, 好像用了三元运算符的速度, 比之前提升很多.
var threeSumClosest = function (nums, target) { // 136ms
  const arr = nums.sort((a, b) => a - b)
  let res = null
  for (let i = 0, len = arr.length; i < len; i++) {
    let left = i + 1
    let right = len - 1
    while (left < right) {     
      let cur = arr[i] + arr[left] + arr[right]
      if (res == null) res = cur
      res = Math.abs(cur - target) < Math.abs(res - target) ? cur : res

      if (cur > target) { // 加和比预期的要大, 就只能变小.
        right--
      } else {
        left++
      }
    }
  }
  return res
}

var arr = [-1,2,1,-4]
var tag = 1

arr = [0,2,1,-3]
tag = 1

arr = [1,1,-1,-1,3]
tag = -1
debugger
var res = threeSumClosest(arr, tag)
debugger
