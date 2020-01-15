/**
 * @param {string} s
 * @return {number}
 */
var firstUniqChar = function(s) { 
  // 我的答案,感觉有可优化的点, 比如一个字母如果找到了, 就把他对应的那个字母就不找了
  var l = s.length
  var temp, target
  for (var i = 0 ; i < l; i++) {
      var pre = s.slice(0, i)
      var back = s.slice(i + 1, l)
      temp = pre.concat(back)
      target = s[i]
      var res = temp.indexOf(target)
      if ( res === -1) { // 不存在重复的
          return i
      }
  }
  return -1
};


// 大神解法一

/**
 * @param {string} s
 * @return {number}
 */
var firstUniqChar = function(s) {
  for (var i=0;i<s.length;i++) {
      if (s.indexOf(s[i], i+1) == -1 && s.indexOf(s[i]) == i) {
          return i;
      }
  }
  return -1;
};


// 大神解法二
/**
 * @param {string} s
 * @return {number}
 */
var firstUniqChar = function(s) { // 牛逼, 牛逼, 牛逼
  for(var i=0;i<s.length;i++){
      if(s.indexOf(s[i])===s.lastIndexOf(s[i])){
          return i;
      }
  }
  return -1
};