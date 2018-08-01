// 一. 给定一个正整数 n，生成一个包含 1 到 n2 所有元素，且元素按顺时针顺序螺旋排列的正方形矩阵。
// 输入 3
// 输出: 
// [
//  [ 1, 2, 3 ],
//  [ 8, 9, 4 ],
//  [ 7, 6, 5 ]
// ]

function spiral(n) {  
  var arr = [],
    count = n * n, // 最大数, 也就是最后一个数字
    num = 1, // 每一项都自加一
    start = 0, // 开始
    end = n - 1; // 每行的最后一个元素
  for (var k = 0; k < n; k++) {    
    arr.push(new Array)
  }  
  while (start < end) {
    for (var j = start; j < end + 1; j++) {      
      arr[start][j] = num++;    
    }
    for (var i = start + 1; i < end + 1; i++) {      
      arr[i][end] = num++;
    }
    for (var y = end - 1; y > start - 1; y--) {      
      arr[end][y] = num++;    
    }
    for (var x = end - 1; x > start; x--) {      
      arr[x][start] = num++;    
    }
    start += 1;   
    end -= 1;
    if (start == end) {      
      arr[start][end] = count;    
    }  
  }  
  return arr;
}

var arr = spiral(3)
debugger