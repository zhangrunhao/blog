// 
// 匹配id

var reg = /id=".*?"/
var str = '<div id="container" class="main"></div>'
var res = str.match(reg)
console.log(res)
debugger
