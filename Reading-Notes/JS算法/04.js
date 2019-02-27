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


class QueueElement {
  constructor(element, priority) {
    this.element = element
    this.priority = priority
  }
}

class priorityQueue extends Queue {
  enqueue(element, priority) {
    var item = new QueueElement(element, priority)
    if (this.isEmpty()) {
      this.items.push(item)
    } else {
      var added = false
      this.items.forEach((val, index, arr) => {
        if (item.priority > val.priority && !added) {
          arr.splice(index, 0, item)
          added = true
        }
      })
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
