var reverse = function(x) {
  var min = Math.pow(-2, 31)
  var max = Math.pow(2, 31) - 1 

  var sign = x < 0 ? -1 : 1
  if (x < 0) x *= -1
  var res = parseInt(String(x).split('').reverse().join('')) * sign
  if (res < min || res > max) {
      return 0
  }
  return res
};


var x = -123
var res = reverse(x)
debugger