/**
 * @param {string} s
 * @return {boolean}
 */
// var isPalindrome = function (s) {
//   s = s.toLocaleLowerCase()
//   s = s.split('').filter((v) => {
//     return /\w/.test(v)
//   }).join('')
//   debugger
//   var l = s.length
//   for (var i = 0; i < l; i++) {
//     var a = s[i]
//     var b = s[l-1-i]
//     if (a !== b) {
//       debugger
//       return false
//     }
//   }
//   return true
// };

// var s = "race a car"
// var s = "A man, a plan, a canal: Panama"
// var res = isPalindrome(s)
// debugger


// 大神解法: 精简准确
var isPalindrome = function (s) {
  if (s === '') return true
  // replace 如果返回的true, 就会被后面的替换
  s = s.toLocaleLowerCase().replace(/[^a-zA-Z0-9]/g, '').split('')
  return s.toString() === s.reverse().toString()
}

var s = "race a car"
var s = "A man, a plan, a canal: Panama"
var res = isPalindrome(s)
debugger