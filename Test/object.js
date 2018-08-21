var obj = {
  a: 'aaa'
}

var propotype = {
  b: 'bbb'
}

obj.__proto__ = propotype

for (var key in obj) {
  console.log(Object.prototype.hasOwnProperty.call(obj, key))
  console.log(key)
}