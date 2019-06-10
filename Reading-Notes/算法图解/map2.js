var graph = {
  you: ['bob'],
  bob: ['anuj', 'alice', 'peggy'],
  // alice: ['peggy', 'bob', 'claire'],
  alice: ['peggy', 'bob'],
  claire: ['jonny'],
  jonny: ['thom'],
  anuj: [],
  peggy: [],
  thom: []
}

function search(name) {
  var searchArr = graph['you']
  var searched = []

  while (searchArr.length !== 0) {
    var person = searchArr.shift()
    var inSearched = false
    searched.forEach((item, index) => {
      if (item === person) {
        inSearched = true
      }
    })

    if (!inSearched) {
      if (searchName(person)) {
        console.log('找到了' + person)
        return
      } else {
        searched.push(person)
        searchArr = Array.prototype.concat(searchArr, graph[person])
      }
    }
  }
}

function searchName(name) {
  return name.slice(name.length-1) === 'm'
}

search('you')