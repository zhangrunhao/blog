var isValidSudoku = function(board) {

  for (let i = 0; i < 9; i++) {
    if (isHasSameItem(board[i])) {
      return false
    }
  }
  
  var temp = board.concat()
  for (let i = 0; i < 9; i++) {
    debugger
    let tempItem = []
    for (let j = 0; j < 9; j++) {
      let res = temp[j].splice(0 ,1)
      debugger;
      tempItem.push(res)
    }
    debugger
    if (isHasSameItem(tempItem)) {
      debugger
      return false
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

var board = [["8","3",".",".","7",".",".",".","."],["6",".",".","1","9","5",".",".","."],[".","9","8",".",".",".",".","6","."],["8",".",".",".","6",".",".",".","3"],["4",".",".","8",".","3",".",".","1"],["7",".",".",".","2",".",".",".","6"],[".","6",".",".",".",".","2","8","."],[".",".",".","4","1","9",".",".","5"],[".",".",".",".","8",".",".","7","9"]]

var res = isValidSudoku(board)

debugger