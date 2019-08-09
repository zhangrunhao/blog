var myObject = (function () {
  var _name = 'sven' 
  return {
    getName: function () {
      return _name
    }
  }
}())
console.log(myObject.getName()) // sven
console.log(myObject._name) // undefined 