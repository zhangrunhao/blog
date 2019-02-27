var Animal = {
   speak() {
     console.log(this.name + ' makes a noise.');
   }
};

class Dog {
   constructor(name) {
   this.name = name;
   Object.setPrototypeOf(this, Animal)
  }
}

// Object.setPrototypeOf(Dog.prototype, Animal);// If you do not do this you will get a TypeError when you invoke speak

var d = new Dog('Mitzie');
console.log(d.__proto__ === Animal)
// console.log(Dog.prototype.__proto__ === Animal)
d.speak(); // Mitzie makes a noise