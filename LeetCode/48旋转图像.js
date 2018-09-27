


var rotate = function(matrix) {
  debugger
  var l = matrix.length
  for (var i = 0; i < l; i++) { // i 表示每一次需要拆分的数组
      var target = matrix[i]
      for (var j = 0; j < l; j++) { // j 表示每一次需要添加元素的数组
          var item = target.splice(0, 1)[0]
          matrix[j].splice(matrix[j].length - i, 0, item)
      }
  }
};

var matrix = [
  [1,2,3],
  [4,5,6],
  [7,8,9]
]

rotate(matrix)
console.log(matrix);
debugger