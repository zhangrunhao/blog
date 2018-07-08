
// 深拷贝之究极体


function clone (value) {
  if (Array.isArray(value)) {
    return value.map(clone)
  } else if (value && typeof value === 'object') {
    const res = {}
    for (const key in value) {
      res[key] = clone(value[key])
    }
    return res
  } else {
    return value
  }
}

var obj = {
  name: 'zhangrh',
  info: {
    age: 20,
    school: ['wuxun', 'minda', {
      method: [
        function goPa() {
          console.log('papapa')
        },
        {
          aaa: {
            bbb: 'bbb'
          }
        }
      ]
    }],
  }
}

var obj1 = clone(obj)
obj = null
console.dir(obj1)
