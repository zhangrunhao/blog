// 即使有双向箭头, 依旧可以找到想要的元素, 及时返回即可, 只是会浪费空间
// 但在有双向箭头的情况下, 如果没有了正确元素, 就会形成死循环.
var graph = {
  you: ['bob'],
  bob: ['anuj', 'alice', 'peggy'],
  alice: ['peggy', 'bob', 'claire'],
  claire: ['jonny'],
  jonny: ['thom'],
  anuj: [],
  peggy: [],
  thom: []
}

var searchArr = []
searchArr = Array.prototype.concat(searchArr, graph.you)

while(searchArr.length !== 0) {
  var person = searchArr.shift()
  if (searchName(person)) {
    console.log('找到了:' + person)
    return
  } else {
    searchArr = Array.prototype.concat(searchArr, graph[person])
  }
}

function searchName(name) {
  return name.slice(name.length-1) === 'm'
}