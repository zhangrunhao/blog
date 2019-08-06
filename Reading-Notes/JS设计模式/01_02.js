// 多态

var googleMap = {
  show: function () {
    console.log('开始渲染谷歌地图')
  }
}

var baiduMap = {
  show: function () {
    console.log('开始渲染百度地图')
  }
}

// var  renderMap = function (type) {
//   if (type === 'google') {
//     googleMap.show()
//   } else if (type === 'baidu') {
//     baiduMap.show()
//   }
// }
var renderMap = function (map) {
  if (map.show instanceof Function) {
    map.show()
  }
}
renderMap(googleMap)
renderMap(baiduMap)

// var makeSound = function (animal) {
//   animal.sound()
// }
// var Duck = function () {
// }
// Duck.prototype.sound = function () {
//   console.log('ga')
// }
// var Chicken = function () {
// }
// Chicken.prototype.sound = function () {
//   console.log('ge')
// }
// makeSound(new Duck()) // ga
// makeSound(new Chicken()) // ge
// var Dog = function () {
// }
// Dog.prototype.sound = function () {
//   console.log('wang')
// }
// makeSound(new Dog()) // wang

// var makeSound = function (animal) {
//   if (animal instanceof Duck) {
//     console.log('ga')
//   } else if (animal instanceof Chicken) {
//     console.log('ge')
//   }
// }

// var Duck = function () {
// }
// var Chicken = function () {
// }

// makeSound(new Duck()) // ga
// makeSound(new Chicken()) // ge