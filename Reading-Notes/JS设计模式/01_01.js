// 动态类型和鸭子类型
var duck = {
  name: 'duck',
  duckSinging: function () {
    console.log('ga')
  }
}
var chicken = {
  name: 'chicken',
  duckSinging: function () {
    console.log('ga')
  }
}
var choir = []
var joinChoir = function (animal) {
  if (animal && typeof animal.duckSinging === 'function') {
    choir.push(animal)
    console.log(animal.name + '加入')
  }  
}
joinChoir(duck)
joinChoir(chicken)
