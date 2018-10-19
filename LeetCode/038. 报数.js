/**
 * @param {number} n
 * @return {string}
 */
var countAndSay = function(n) {
  debugger
  var resStr = '1'  // 结果字符串
  for (var i = 1; i < n; i++ ) {
    var nowRes = ''; // 当前的字符串
    var count = 1; // 当前重复的次数

    for (var j = 0; j < resStr.length; j++) { // 遍历上一个字符串
      if (resStr[j] === resStr[j+1]) { // 如果和后面的相等
        count++ // 数量+1
      } else {
        nowRes = nowRes + count + resStr[j] // 没有相等的了, 拼接出来
        count = 1 // 重置次数
      }
    }
    resStr = nowRes // 给了当下.
  }
  return resStr
};

var res = countAndSay(4)
debugger