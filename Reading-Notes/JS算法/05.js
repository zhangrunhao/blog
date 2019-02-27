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
list.append('a')
list.append('b')
list.append('c')
list.append('d')

list.resver()
debugger

