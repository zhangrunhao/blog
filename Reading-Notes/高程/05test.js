var str = 'aab'
var res = str.localeCompare('aaa')
console.log(res)

// var text = 'cat, bat, sat, fat'
// var pattern = /.at/
// var matches = text.match(pattern)
// console.log(matches)



// var s1 = 'abcd'

// var res = s1.charAt(6)
// console.log(res)

// var objs1 = String(s1)
// objs1.color = 'red'
// console.log(objs1.color)

// window.color = "red"
// var o = {
//   color: 'blue'
// }

// function sayColor() {
//   console.log(this.color)
// }

// o.sayColor = sayColor
// o.sayColor()

// var pattern = new RegExp("\\[bc\\]at", 'gi')
// var res = pattern.toLocaleString()
// console.log(res)

// var text = "000-000-00000"
// var pattern = /\d{3}-\d{2}-\d{4}/
// console.log(pattern.exec(text))
// console.log(pattern.valueOf())


// var text = "mom and dad and baby"
// var pattern = /mom( and dad (and baby)?)?/gi
// var matches = pattern.exec(text)
// console.log(matches.index) // 0
// console.log(matches.input) // 
// console.log(matches.length)

// var re = null
// var i

// 字面量方式
// for (i =0 ; i < 10; i++) {
//   re = /cat/g
//   console.log(re.test("catastrophe"))
// }
// for (i=0;i<10;i++) {
//   re = new RegExp('cat', 'g')
//   console.log(re.test("catastrophe"))
// }



// var test = new Date(2012, 3, 4)


// console.log(test.toString()) // Wed Apr 04 2012 00:00:00 GMT+0800 (CST)
// console.log(test.toLocaleString()) // 2012-4-4 00:00:00
// var arr = [2, 1, 10, 3, 5, 4]

// var newArr = arr.slice()
// console.log(newArr)
// newArr.push('111')
// console.log(arr)
// function compare(value1, value2) {
//   if (value1 < value2) {
//     return -1
//   } else if (value1 > value2) {
//     return 1
//   } else {
//     return 0
//   }
// }
// arr.sort(compare)
// console.log(arr)


// console.log(arr)
// arr.sort()
// console.log(arr)
// console.log(typeof arr[0])


// var arr = new Array(3)
// console.log(arr) // [ <3 empty items> ]

// var arr = new Array(3, 'a')
// console.log(arr) // [ 3, 'a' ]

// console.log(Array.isArray(arr.valueOf()))

// console.log(arr.toLocaleString())

// console.log(arr.join(' '))