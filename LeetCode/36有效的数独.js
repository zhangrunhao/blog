// 我的答案, 终于算是通过了, 但是结果很不理想
var isValidSudoku = function(board) {

  for (let i = 0; i < 9; i++) {
    if (isHasSameItem(board[i])) {
      return false
    }
  }
  
  var temp = copyArr(board)
  for (let i = 0; i < 9; i++) {
    let tempItem = []
    for (let j = 0; j < 9; j++) {
      tempItem = tempItem.concat(temp[j].splice(0 ,1))
    }
    if (isHasSameItem(tempItem)) {
      return false
    }
  }

  var temp = copyArr(board)

  for (let j = 0 ; j < 3 ; j++) {
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
      } else if ( i < 9) {
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
function isHasSameItem (arr) {
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

var board = [["8","3",".",".","7",".",".",".","."],["6",".",".","1","9","5",".",".","."],[".","9","8",".",".",".",".","6","."],["8",".",".",".","6",".",".",".","3"],["4",".",".","8",".","3",".",".","1"],["7",".",".",".","2",".",".",".","6"],[".","6",".",".",".",".","2","8","."],[".",".",".","4","1","9",".",".","5"],[".",".",".",".","8",".",".","7","9"]]

board = [
  ["8","3",".",".","7",".",".",".","."],
  ["6",".",".","1","9","5",".",".","."],
  [".","9","8",".",".",".",".","6","."],
  ["8",".",".",".","6",".",".",".","3"],
  ["4",".",".","8",".","3",".",".","1"],
  ["7",".",".",".","2",".",".",".","6"],
  [".","6",".",".",".",".","2","8","."],
  [".",".",".","4","1","9",".",".","5"],
  [".",".",".",".","8",".",".","7","9"],
]

board = [
  [".",".",".",".","5",".",".","1","."],
  [".","4",".","3",".",".",".",".","."],
  [".",".",".",".",".","3",".",".","1"],
  ["8",".",".",".",".",".",".","2","."],
  [".",".","2",".","7",".",".",".","."],
  [".","1","5",".",".",".",".",".","."],
  [".",".",".",".",".","2",".",".","."],
  [".","2",".","9",".",".",".",".","."],
  [".",".","4",".",".",".",".",".","."]
]

board = [
  [".",".",".",".",".",".","5",".","."],
  [".",".",".",".",".",".",".",".","."],
  [".",".",".",".",".",".",".",".","."],
  ["9","3",".",".","2",".","4",".","."],
  [".",".","7",".",".",".","3",".","."],
  [".",".",".",".",".",".",".",".","."],
  [".",".",".","3","4",".",".",".","."],
  [".",".",".",".",".","3",".",".","."],
  [".",".",".",".",".","5","2",".","."],
]

var res = isValidSudoku(board)
