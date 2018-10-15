var isAnagram = function(s, t) { // 第一版
  return sortString(s) === sortString(t)
};

function sortString(str) {
  var arr = str.split('')
  arr.sort(function (a, b) {
    return a.localeCompare(b) // 根据本地对比规则排序
  })
  var res = arr.join('')
  return res
}


var isAnagram = function(s, t) { // 简化一版
  function sortString(s) {
      return s.split('').sort().join('')
  }
  return sortString(s) === sortString(t)
};