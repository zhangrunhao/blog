"use strict"
var person = {
    name: 'zhangrh',
    age: 21,
    job: 'software engineer',

    sayName: function () {
        alert(this.name)
    }
}
// person.sayName()

var person = {
    name: 'zhangrh'
}

Object.defineProperty(person, 'age', {
    // value: 11,  
    // writable: true,
    configurable: true,
    get: function () {
        return 10
    },
    set: function () {
       console.log(1)
       return 2
    }
})

person.age = 11
// delete person.age
person.name = 'aa'
console.log(person.age)

