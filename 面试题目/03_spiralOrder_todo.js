// 一. 给定一个正整数 n，生成一个包含 1 到 n2 所有元素，且元素按顺时针顺序螺旋排列的正方形矩阵。
// 输入 3
// 输出: 
// [
//  [ 1, 2, 3 ],
//  [ 8, 9, 4 ],
//  [ 7, 6, 5 ]
// ]

// 二. 给定一个包含 m x n 个元素的矩阵（m 行, n 列），请按照顺时针螺旋顺序，返回矩阵中的所有元素。
// 输入:
// [
//  [ 1, 2, 3 ],
//  [ 4, 5, 6 ],
//  [ 7, 8, 9 ]
// ]
// 输出: [1,2,3,6,9,8,7,4,5]
const snail = function(array) {
  var result;
  while (array.length) {
    // Steal the first row.
    result = (result ? result.concat(array.shift()) : array.shift());
    // Steal the right items.
    for (var i = 0; i < array.length; i++){
      result.push(array[i].pop());
    }
    // Steal the bottom row.
    result = result.concat((array.pop() || []).reverse());
    // Steal the left items.
    for (var i = array.length - 1; i >= 0; i--){
      result.push(array[i].shift());
    }
  }
  return result;
}


snail = function(array) {
  var line = array.length;
  var row = line;
  var result = [];
  if(line == 1){
   return array[0]
  }else{
    circle(array);
  }
  return result;
  
  function circle(array){
    if(row > 1){
       for(var i = 0;i < row;i++){
         result.push(array[0][i]);
       }
       for(var j = 1;j < line;j++){
         result.push(array[j][line-1]);
         array[j].splice(line-1,1);
       }
       row --;line --;
       array.splice(0,1);
    }else{
       result.push(array[0]);    
    }
    if(row > 1){
       for(var k = row;k > 0;k--){
         result.push(array[row-1][k-1]);
       }
       for(var l = line - 1;l > 0;l--){
         result.push(array[l-1][0]);
         array[l-1].splice(0,1);
       }
       row--;line--;
       array.splice(row,1);
    }else{
       result.push(array[0]);
    }
    if(row > 1){
      circle(array);
    }
  }
}

// 就是蛇形打印二维数组