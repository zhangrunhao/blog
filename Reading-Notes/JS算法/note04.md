# 学习JavaScript数据结构与算法 (三)

> 学习第九章 图

## 01基本

* 图是一组`边`链接的`节点/顶点`
* G = (V, E): V是一组顶点, E是一组边. 链接V中的顶点
* 由一条边和另一边链接在一起的称为相邻顶点
* 度: 顶点的相邻节点数
* 路径: 顶点 v1, v2 .... vn 组成的一个连续序列, vi, vi+1是相邻的
* 简单路径: 不包含重复顶点
* 去除最后一个顶点, 环也是一个简单路径
* 无环图: 不存在环. 连通图: 每两个顶点之间都存在路径
* 有向图, 无向图
* 如果两个顶点在双向上面存在路径,就是强连通的
* 加权图, 未加权图

## 02图的表示

### 邻接矩阵

* 如果`i, j`相邻, 那么`arr[i][j] === 1` 否则为0

### 邻接表

* 可以用数组, 链表, 散列表, 字典等来表示
* 就是有一个确定的值, 然后他的相邻节点, 都放到他后面
* 数组就是二维数组, 链表就是每个节点, 有next指向下一个, 也有child, 包含他的子集

### 关联矩阵

* 关联矩阵用的二维数组的话, 那么lin
* 行表示顶点, 列表示边. 例如`arr[v][e] === 1` v这个顶点和e这条边相连
* 一般用于行比较多的情况下

## 03创建Grap类

```js
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
```

## 04遍历

### 