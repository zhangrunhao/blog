
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
    if (this.length === 0) return
    // var list = new LinkDist
    // this是旧链表, list是新链表
    var pre = null, cur = this.head, index = 0
    while (index++ < this.length) {
      if (index = 0) {
        pre = cur
        cur.next = null
      } else {
        cur.next = pre
        cur = cur.next
      }
    }
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
list.toString()

list.resver()


// 双向链表
class doubleNode extends Node {
  constructor () {
    this.prev = null // 增加一个指向前一个元素的指针
  }
}
class doubleLinkList extends LinkDist {
  constructor () {
    this.trail = null
  }
  insert(position, element) {
    var node = new doubleNode(element)
    var cur = this.head, previsous = null, index = 0
    if (position === 0) { // 在第一个位置进行添加
      if (!this.hend) { // 空的双向链表
        this.head = node
        this.trail = node
      } else { // 有值
        node.next = cur
        cur.prev = node
      }
    } else if (position === this.length) { // 末尾
      cur = this.trail
      cur.next = node
      node.prev = cur
      node = this.trail
    } else {
      while(index++ < position) {
        previsous = cur
        cur = cur.next
      }
      nodex.next = cur
      previsous.next = node

      cur.prev = node
      node.prev = previsous
    }
    this.length++
    return true
  }
  return false
}
