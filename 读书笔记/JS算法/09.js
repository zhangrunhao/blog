const vertices = Symbol('vertices')
const map = Symbol('map')

class Grap {
  constructor() {
    this[vertices] = [] // 存储我们所有节点的名称
    this[map] = new Map // 通过字典表示邻接表
  }
  addVertex(item) { // 添加一个新的顶点
    this[vertices].push(item) // 首先放到顶点列表中
    this[map].set(item, []) // 在邻接表中, 顶点作为建, 对应一个空数组
  }
  addEdge(v, w) { // 添加两个顶点, 形成一条边
    // 无向图, 相互设置
    this[map].get(v).push(w)
    this[map].get(w).push(v)
  }
  toPrint() {
    let resStr = ''
    this[vertices].forEach((val, index, arr) => {
      resStr +=`${val} --> `
      resStr = this[map].get(val).reduce((pre, cur, index) => {
        return pre += cur
      }, resStr ) + '\n'
    })
    debugger
    console.log(resStr)
  }
  toOut() {
    let resStr = this[vertices].reduce((pre, cur) => {
      let r = pre + cur + '-->'
      let itemRes = this[map].get(cur).reduce((itemPre, curPre) => {
        return itemPre + curPre
      }, r)
      return itemRes + '\n'
    }, '')
    console.log(resStr)
  }
}

var myVertices = ['a', 'b', 'c', 'd', 'e', 'f', 'G', 'H', 'I']

const graph = new Grap
myVertices.forEach((val, index, arr) => {
  graph.addVertex(val.toLocaleUpperCase())
})

graph.addEdge('A', 'B');
graph.addEdge('A', 'C');
graph.addEdge('A', 'D');
graph.addEdge('C', 'D');
graph.addEdge('C', 'G');
graph.addEdge('D', 'G');
graph.addEdge('D', 'H');
graph.addEdge('B', 'E');
graph.addEdge('B', 'F');
graph.addEdge('E', 'I');

// console.log(graph)
graph.toOut()

debugger