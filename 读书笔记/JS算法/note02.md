# 学习JavaScript数据结构与算法 (二)

> * 学习JavaScript数据结构与算法 的笔记, 包含一二三章
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
