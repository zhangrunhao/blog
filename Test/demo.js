function add(a, b) {
  return a + b
}
function sub(a, b) {
  return a - b
}
function commonDivision(a, b) {
  while (b !== 0) {
    if (a > b) {
      a = sub(a, b)
    } else {
      b = sub(b, a)
    }
  }
  return a
}



const ids = [123, 332, 334, 555]
const showArray = [],

ids.forEach((id, index) => {
  axios.post({id}).then((res) => {
    showArray.splice(index, 0, res)
  })
})