var request = require("request");

var count = 0;
var max = 80000;

function randomWord(randomFlag, min, max){
  var str = "",
      range = min,
      arr = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', 'a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z', 'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z'];

  // 随机产生
  if(randomFlag){
      range = Math.round(Math.random() * (max-min)) + min;
  }
  for(var i=0; i<range; i++){
      pos = Math.round(Math.random() * (arr.length-1));
      str += arr[pos];
  }
  return str;
}

let timer = null;
// let isRunTimer = false

var vote = function () {
  var isRunTimerVote = false
  timer = setTimeout(() => {
    console.log('定时器执行')
    isRunTimerVote = true
    vote()
  }, 3000);
  var str = randomWord(false, 32)
  request({
    url: "https://youngblood.zhengzai.tv/api/band/vote",
    method: "post",
    json: true,
    headers: {
        "content-type": "application/json",
    },
    body: {
      id: "891", // 妙手回
      id: "727", // pizza face
      sign: str
    }
  }, function (error, response, body) {
    if (!error && response.statusCode === 200 && body.status === 1) {
      if (timer)  clearTimeout (timer)
      console.log('已投票: ' + count)
      if (++count < max && !isRunTimerVote) vote()
    } else {
      console.log('投票失败')
      if (++count < max && !isRunTimerVote) {
        console.log('未达到投票数, 继续投票')
        vote()
      }
    }
  });
}
vote()
