var fetch = require('node-fetch')

function * gen() {
  debugger
  var url = "https://api.github.com/users/github"
  debugger
  var result = yield fetch(url)
  debugger
  console.log(result.bio)
  debugger
}
debugger
var g = gen()
debugger
var result = g.next() // 此时result返回了一个promise
debugger
result.value.then(function (data) {
  debugger
  return data.json()
}).then(function (data) {
  debugger
  g.next(data)
})
debugger // 先执行这里, 在执行promise中的then