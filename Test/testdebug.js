var arr = Symbol('arr')

class Test {
  constructor() {
    this[arr] = [1,2,3,4,5]
  }
  test() {
    this[arr].forEach((val, index, arr) => {
      debugger
      console.log(this)
    })
  }
}

var test = new Test

test.test()