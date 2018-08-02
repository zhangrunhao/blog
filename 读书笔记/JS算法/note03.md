# 学习JavaScript数据结构与算法 (三)

> * 学习JavaScript数据结构与算法 的笔记
> * 学习第八章 树 结构
> * > 本人所有文章首发在博客园: [http://www.cnblogs.com/zhangrunhao/](http://www.cnblogs.com/zhangrunhao/)

## 基础

* 没有父节点, 就是根节点
* 子树, 由他的节点和后代组成

## 二叉树

* 节点最多有两个
* 二叉搜索树: 只允许你在左侧节点, 存储比父节点小的值, 右侧存储等于或者大于父节点的值

```js
class Node {
  constructor(key) {
    this.key = key
    this.left = null
    this.right = null
  }
}

class BinarySearchTree {
  constructor() {
    this.root = null
  }
  insert(key) {
    var newNode = new Node(key)
    if (this.root === null) {
      this.root = newNode
    } else {
      insertNode(this.root, newNode)
    }
  }
  has(key) {
    return searchNode(this.root, key)
  }
  inOrderTraverse(cb)  { // 中序遍历
    inOrderTraverse(this.root, cb)
  }
  preOrderTraverse(cb) { // 先序遍历
    preOrderTraverse(this.root, cb)
  }
  postOrderTraverce(cb) { // 后序遍历
    postOrderTraverce(this.root, cb)
  }
  min() {
    return (function (node) {
      if (node) {
        while (node && node.left !== null) {
          node = node.left
        }
        return node.key
      }
      return null
    })(this.root)
  }
  max() {
    return (function (node) {
      if (node) {
        while (node && node.right !== null) {
          node = node.right
        }
        return node.key
      }
      return null
    })(this.root)
  }
  remove(key) {
    this.root = remove(this.root, key)
  }

  static insertNode(node, newNode) { // 这样写是静态方法, 通过类来调用
  }
}

function insertNode(node, newNode) { // 这样写是静态方法, 通过类来调用
  if (newNode.key < node.key) { // 在左边
    if (node.left === null) { // 看左边存在, 那就往左边继续插入
      node.left = newNode
    } else {
      insertNode(node.left, newNode)
    }
  } else { // 右边
    if (node.right === null) {
      node.right = newNode
    } else {
      insertNode(node.right, newNode)
    }
  }
}

function inOrderTraverse(node, cb) { // 中序遍历
  if (node !== null) {
    inOrderTraverse(node.left, cb)
    cb(node)
    inOrderTraverse(node.right, cb)
  }
}

function preOrderTraverse(node, cb) {
  if (node !== null) {
    cb(node)
    preOrderTraverse(node.left, cb)
    preOrderTraverse(node.right, cb)
  }
}

function postOrderTraverce(node, cb) {
  if (node !== null) {
    postOrderTraverce(node.left, cb)
    postOrderTraverce(node.right, cb)
    cb(node)
  }
}

function searchNode(node, key) {
  debugger;
  if (node === null) return false
  if (key > node.key) {
    debugger
    return searchNode(node.right, key)
  } else if (key < node.key) {
    debugger
    return searchNode(node.left, key)
  } else {
    return true
  }
}

var tree = new BinarySearchTree

tree.insert(10)
tree.insert(6)
tree.insert(12)
tree.insert(14)
tree.insert(3)
tree.insert(7)

// tree.inOrderTraverse((node) => {
//   console.log(node)
// })
// tree.preOrderTraverse((node) => {
//   console.log(node)
// })
// tree.postOrderTraverce((node) => {
//   console.log(node)
// })

var cc = tree.has(12)
debugger;

```
