/**
 * @param {string[]} strs
 * @return {string}
 */
var longestCommonPrefix = function (strs) {
  if (strs.length === 0) return ''
  return strs.reduce((pre, cur) => {
    for (var i = 0; i < Math.min(pre.length, cur.length); i++) {
      if (pre.charAt(i) !== cur.charAt(i)) {
        return pre.slice(0, i)
      }
    }
    // 应该是在for循环结束之后, 发现没有不同
    return pre.length <= cur.length ? pre : cur
  })
};

var arr = ["flower", "flow", "flight"]


var res = longestCommonPrefix(arr)
debugger