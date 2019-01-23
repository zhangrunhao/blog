/**
 * @param {number[]} nums
 * @param {number} target
 * @return {number}
 */
var threeSumClosest = function(nums, target) {
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

var arr = [-1,2,1,-4]
var tag = 1
var res = threeSumClosest(arr, tag)
debugger
