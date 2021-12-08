function Person(name, age) {
  this.name = name;
  this.age = age;
  this.habit = "pingPang"
}

Person.prototype.strength = 60;
Person.prototype.sayName = function () {
  console.log("I am " + this.name)
}

// var person = new Person("zhangrh", 28)

function ObjectFactory(Construct, ...args) {
  var obj = {}
  obj.__proto__ = Construct.prototype
  var res = Construct.apply(obj, args)
  return typeof res === "object" ? ret : obj
}


var person = ObjectFactory(Person, "zhangrh", 28)

console.log(person.name)
console.log(person.age)
console.log(person.strength)
person.sayName();