// 大神解法一
var isValidSudoku = function (board) {
  var set = {};
  for (var i = 1; i <= 9; i++) set[i] = [];

  for (var i = 0; i < 9; i++) {
    for (var j = 0; j < 9; j++) {
      var s = board[i][j]; // 这是遍历整个board, 取出对应的值
      if (Number(s)) { // 如果取出的值是数字
        var index = parseInt(i / 3) * 3 + parseInt(j / 3); // 把九个数组划分成三块, 0-8位索引
        for (var k = 0; k < set[s].length; k++) {
          if (i == set[s][k][0] || j == set[s][k][1] || index == set[s][k][2]) { // 如果有重复的数字, 就比较他们是否在同一行, 用一列, 或者同一个index中
            return false;
          }
        }
        set[s].push([i, j, index]);
      }
    }
  }
  return true;
};


// 大神解法二
var isValidSudoku1 = function(board) {
    
  //   检查每一行
    for (let arr of board) {            
      let row = []
      for (let c of arr) {
        if (c !== '.') row.push(c);
      }
      let set = new Set(row)
      if (set.size !== row.length) return false;
    }
    
  //   检查每一列
    for (let i = 0; i < 9; i++) {
      let col = []
      board.map( arr => {
        if (arr[i] !== '.') col.push(arr[i])
      })
      let set = new Set(col)
      if (set.size !== col.length) return false;
    }
    
  //   检查每个小方块
    for (let x = 0; x < 9; x += 3) {
      for (let y = 0; y < 9; y += 3) {
        let box = []
        for (let a = x; a < 3 + x; a ++) {
          for (let b = y; b < 3 + y; b ++) {
            if (board[a][b] !== '.') box.push(board[a][b])
          }
        }
        let set = new Set(box)
        if (set.size !== box.length) return false
      }
    }
    
  return true
  };




// 我的答案, 终于算是通过了, 但是结果很不理想
var isValidSudoku2 = function (board) {
  for (let i = 0; i < 9; i++) {
    if (isHasSameItem(board[i])) {
      return false
    }
  }
  var temp = copyArr(board)
  for (let i = 0; i < 9; i++) {
    let tempItem = []
    for (let j = 0; j < 9; j++) {
      tempItem = tempItem.concat(temp[j].splice(0, 1))
    }
    if (isHasSameItem(tempItem)) {
      return false
    }
  }
  var temp = copyArr(board)
  for (let j = 0; j < 3; j++) {
    let tempItem = []
    for (let i = 0; i < 9; i++) {
      if (i < 3) {
        tempItem = tempItem.concat(temp[i].splice(0, 3))
        if (tempItem.length === 9) {
          if (isHasSameItem(tempItem)) return false
          tempItem = []
        }
      } else if (i < 6) {
        tempItem = tempItem.concat(temp[i].splice(0, 3))
        if (tempItem.length === 9) {
          if (isHasSameItem(tempItem)) return false
          tempItem = []
        }
      } else if (i < 9) {
        tempItem = tempItem.concat(temp[i].splice(0, 3))
        if (tempItem.length === 9) {
          if (isHasSameItem(tempItem)) return false
          tempItem = []
        }
      }
    }
  }
  return true
};

// 判断一个九位的数组是否, 有重复的数字
function isHasSameItem(arr) {
  arr = arr.concat()
  arr = arr.filter(item => {
    return item !== '.'
  })
  return arr.length !== [...new Set(arr)].length
}

function copyArr(arr) {
  if (typeof arr === 'object') {
    return arr.map(item => copyArr(item))
  } else {
    return arr
  }
}

var board = [
  ["8", "3", ".", ".", "7", ".", ".", ".", "."],
  ["6", ".", ".", "1", "9", "5", ".", ".", "."],
  [".", "9", "8", ".", ".", ".", ".", "6", "."],
  ["8", ".", ".", ".", "6", ".", ".", ".", "3"],
  ["4", ".", ".", "8", ".", "3", ".", ".", "1"],
  ["7", ".", ".", ".", "2", ".", ".", ".", "6"],
  [".", "6", ".", ".", ".", ".", "2", "8", "."],
  [".", ".", ".", "4", "1", "9", ".", ".", "5"],
  [".", ".", ".", ".", "8", ".", ".", "7", "9"]
]

board = [
  ["8", "3", ".", ".", "7", ".", ".", ".", "."],
  ["6", ".", ".", "1", "9", "5", ".", ".", "."],
  [".", "9", "8", ".", ".", ".", ".", "6", "."],
  ["8", ".", ".", ".", "6", ".", ".", ".", "3"],
  ["4", ".", ".", "8", ".", "3", ".", ".", "1"],
  ["7", ".", ".", ".", "2", ".", ".", ".", "6"],
  [".", "6", ".", ".", ".", ".", "2", "8", "."],
  [".", ".", ".", "4", "1", "9", ".", ".", "5"],
  [".", ".", ".", ".", "8", ".", ".", "7", "9"],
]

board = [
  [".", ".", ".", ".", "5", ".", ".", "1", "."],
  [".", "4", ".", "3", ".", ".", ".", ".", "."],
  [".", ".", ".", ".", ".", "3", ".", ".", "1"],
  ["8", ".", ".", ".", ".", ".", ".", "2", "."],
  [".", ".", "2", ".", "7", ".", ".", ".", "."],
  [".", "1", "5", ".", ".", ".", ".", ".", "."],
  [".", ".", ".", ".", ".", "2", ".", ".", "."],
  [".", "2", ".", "9", ".", ".", ".", ".", "."],
  [".", ".", "4", ".", ".", ".", ".", ".", "."]
]

board = [
  [".", ".", ".", ".", ".", ".", "5", ".", "."],
  [".", ".", ".", ".", ".", ".", ".", ".", "."],
  [".", ".", ".", ".", ".", ".", ".", ".", "."],

  ["9", "3", ".", ".", "2", ".", "4", ".", "."],
  [".", ".", "7", ".", ".", ".", "3", ".", "."],
  [".", ".", ".", ".", ".", ".", ".", ".", "."],

  [".", ".", ".", "3", "4", ".", ".", ".", "."],
  [".", ".", ".", ".", ".", "3", ".", ".", "."],
  [".", ".", ".", ".", ".", "5", "2", ".", "."],
]

var res = isValidSudoku(board)
debugger