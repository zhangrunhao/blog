# 学习JavaScript数据结构与算法 (二)

> * 学习JavaScript数据结构与算法 的笔记
> * 包含第四章队列, 第五章链表
> * > 本人所有文章首发在博客园: [http://www.cnblogs.com/zhangrunhao/](http://www.cnblogs.com/zhangrunhao/)

## 04队列

### 实现基本队列

```js
class Queue {
  constructor () {
    this.items = []
  }
  enqueue(item) {
    return this.items.push(item)
  }
  dequeque() {
    return this.items.shift()
  }
  font() {
    return this.items[0]
  }
  isEmpty() {
    return this.items.length === 0
  }
  clear() {
    return this.items = []
  }
  size() {
    return this.items.length
  }
}
```

### 实现具有优先级的队列

```js

class QueueElement {
  constructor(element, priority) {
    this.element = element
    this.priority = priority
  }
}

class priorityQueue extends Queue {
  enqueue(element, priority) {
    var item = new QueueElement(element, priority)
    if (this.isEmpty()) { // 队列为空, 直接入队
      this.items.push(item)
    } else {
      var added = false // 是否添加过的标志位
      this.items.forEach((val, index, arr) => {
        // 此处决定最小优先队列, 还是最大优先队列
        // 如果我们添加的元素的优先级刚刚好大于遍历到的那个元素
        // 就插入到这个元素的位置
        // 也能保证在相同优先级下面, 的队尾
        if (item.priority > val.priority && !added) {
          arr.splice(index, 0, item)
          added = true
        }
      })
      // 如果优先级小于全部的元素, 就放到队尾
      !added && this.items.push(item)
    }
  }
}

var priQue = new priorityQueue
priQue.enqueue('a', 1)
priQue.enqueue('a', 1)
priQue.enqueue('b', 5)
priQue.enqueue('c', 3)
priQue.enqueue('d', 7)
debugger;
```

### 循环队列 模仿击鼓传花

```js
function hotPotato(nameList) {
  var queue = new Queue
  nameList.forEach((val) => {
    queue.enqueue(val)
  })
  while(queue.size() > 1) {
    var num = Math.floor(Math.random() * 10 + 1)
    debugger;
    for(let i = 0; i < num; i++) {
      queue.enqueue(queue.dequeque())
    }
    var outer = queue.dequeque()
    console.log(`${outer}被淘汰了`)
  }
  var winner = queue.dequeque()
  console.log(`${winner}胜利`)
  return winner
}

var nameList = ['a', 'b', 'c', 'd', 'e']
hotPotato(nameList)
```

## 05链表

> * 数组很容易根据指针找到固定元素
> * 链表寻找某个元素, 只能从头遍历

### 单项链表

```js
class Node {
  constructor(element) {
    this.element = element
    this.next = null
  }
}

class LinkDist {
  constructor() {
    this.length = 0
    this.head = null
  }
  append(element) {
    return append.call(this, element)
  }
  search(postion, cb) {
    return search.call(this, postion, cb)
  }
  insert(position, element) {
    return insert.call(this, position, element)
  }
  removeAt(postion) {
    return removeAt.call(this, postion)
  }
  indexOf(element, cb) {
    var cur = this.head, pre = null
    while(cur.next) {
      if (cur.element === element) {
        cb.call(this, pre, cur)
      }
      pre = cur
      cur = cur.next
    }
    return null
  }
  remove(element) {
    this.indexOf(element, (pre, cur) => {
      if (pre && cur) {
        pre.next = cur.next
        this.length--
      } else if (cur) {
        this.head = cur.next
        this.length--
      }
    })
  }
  isEmpty() {
    return this.length === 0
  }
  size() {
    return this.length
  }
  toString() {
    var res = '', cur = this.head, index = 0
    while (index++ < this.length) {
      res += cur.element
      cur = cur.next
    }
    return res
  }
  getHead() {
    return this.head
  }
}

function append(element) {
  var node = new Node(element)
  var cur = null
  if (this.head === null) {
    this.head = node
  } else {
    cur = this.head // 先指向当前的第一个元素
    while(cur.next) { // 只要有next就往下迭代
      cur = cur.next
    }
    cur.next = node // 没有next的时候, 保存下next指向node
  }
  this.length++
}
function search(position, cb) {
  if (position > -1 && position < this.length) {
    var cur = this.head, pre = null, index = 0
    if (position === 0) {
      cb.call(this, null, cur)
    } else {
      while (index++ < position) {
        pre = cur
        cur = cur.next
      }
      cb.call(this, pre, cur)
    }
    return cur
  } else {
    cb.call(this, null, null)
    return null
  }
}
function removeAt(position) {
  return this.search(position, (pre, cur) => {
    if (pre) {
      pre.next = cur.next
      this.length--
    } else if (cur) {
      this.head = cur.next
      this.length--
    } else {
      throw new Error('未找到元素')
      return false
    }
  })
}
function insert(position, element) {
  this.search(position, (pre, cur) => {
    if (pre && cur) {
      // 除第一项以外的
      pre.next = new Node(element)
      pre.next.next = cur
    } else if (cur) {
      // 第一项
      this.head = new Node(element)
      this.head.next = cur
    } else {
      throw new Error('元素并不存在')
    }
    this.length++
  })
}

var list = new LinkDist
list.append(15)
list.append(10)
list.append(5)
list.insert(1, 9)
list.remove(10)
var res = list.toString()
```

### **单项链表反转**

> 搞了两天, 也真是够了...

```js
  resver() {
    var cur = this.head
    var pre = null
    var next = null
    while (cur !== null) {
      next = cur.next
      cur.next = pre
      pre = cur
      cur = next
    }
    this.head = pre
  }
```