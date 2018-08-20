

var testPromise = new Promise((resolve, reject) => {
  reject('err')
  resolve('aaaa')
})


var res = testPromise.then((str) => {
  console.log(1)
  return str
}, err => {
  console.log(2)
  return err
})

res.then(res => {
  console.log(res)
}, err => {
  console.log(err)
})
console.log(res)
debugger