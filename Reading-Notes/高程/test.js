
var obj = {
  aaa: 'aaa',
  bbb: 'bbb'
}
function json2Form(json) {  
  var str = [];  
  for(var p in json){  
      str.push(encodeURIComponent(p) + "=" + encodeURIComponent(json[p]));  
  }  
  return str.join("&");  
}
var res = json2Form(obj)
console.log(res)
// function add (num1) {
//   "use strict"
//   console.log(arguments.length)
//   console.log(arguments)
//   arguments[1] = 10
//   console.log(arguments)
//   console.log(arguments[0] + arguments[1])
// }

// add(10, 20)


// var num = 0
// outermost:
//   for (var i = 0; i < 10; i++) {
//     for (var j = 0; j < 10; j++) {
//       if (i == 5 && j == 5) {
//         console.log(i)
//         console.log(j)
//         continue outermost
//       }
//       num++
//     }
//   }
// console.log(num)



// var obj = {
//   a: 'aaa',
//   b: undefined,
//   num: {
//     one: '11',
//     we: {
//       jj: 'hjh'
//     }
//   }
// }

// for (var k in obj ) {
//   // console.log(k)
//   console.log(obj[k])
// }



// var s1 = '2'
// var s2 = "z"
// var b = false
// var f = 1.2
// var o = {
//   valueOf: function () {
//     return -1
//   }
// }

// console.log(--s1)
// console.log(--s2)
// console.log(--b)
// console.log(--f)
// console.log(--o)