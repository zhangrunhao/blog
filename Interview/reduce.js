Array.prototype.fakeReduce = function (cb, base) {
  var len = this.length
  var arr = this.concat()
  if (!base) base = this.shift()
  var res = base
  while (len >= 0) {

  }
}


var arr = [1, 2, 3, 4]

var res = arr.reduce((pre, cur, index, arr) => {
  return pre + cur 
})
debugger
