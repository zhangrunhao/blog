

var src = 'http://10.2.154.234:3000/src/project/1908_parade/asset/c1/video.mp4'

var reg = /(?<=asset\/).*(?=\/video)/

var res = src.match(reg)
// var res = src.replace(reg, 'aaaa')

console.log(res)

