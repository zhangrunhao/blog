// 给定一个整数数组，判断是否存在重复元素。

// 如果任何值在数组中出现至少两次，函数返回 true。如果数组中每个元素都不相同，则返回 false。

// 示例 1:

// 输入: [1,2,3,1]
// 输出: true
// 示例 2:

// 输入: [1,2,3,4]
// 输出: false
// 示例 3:

// 输入: [1,1,1,3,3,4,3,2,4,2]
// 输出: true


// 我的解答
/**
 * @param {number[]} nums
 * @return {boolean}
 */
var containsDuplicate = function(nums) {
  var falg = false
  for (var i = 0; i < nums.length; i++) {
      for (var j = i + 1; j < nums.length; j++) {
          if (nums[i] === nums[j]) {
              falg = true
          }
      }
  }
  return falg
};


// 超酷的解答

/**
 * @param {number[]} nums
 * @return {boolean}
 */
var containsDuplicate = function(nums) {
  var set = new Set(nums)
  return set.size !== nums.length
};


// 正常思路
/**
 * @param {number[]} nums
 * @return {boolean}
 */
var containsDuplicate = function(nums) {
  var obj = {}
  var flag = false
  for (var i = 0; i < nums.length; i++) {
      if (nums[i] in obj) {
          flag = true
      } else {
          obj[nums[i]] = i
      }
  }
  return flag
};
