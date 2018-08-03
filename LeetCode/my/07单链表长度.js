var stack = {
  key: 1,
  next: {
    key: 2,
    next: {
      key: 3,
      next: {
        key: 4,
        next: {
          key: 5,
          next: null
        }
      }
    }
  }
}

var getStackLen = function (head, node, k) { // 调用栈不足
  if (!head || !head.next) {
    return head
  }
  if (k === 0) {
    return head
  }
  if (!node.next.next) {
    var nowHead = node.next
    nowHead.next = head
    node.next = null
    return getStackLen(nowHead, nowHead, --k)
  } else {
    return getStackLen(head, node.next, k)
  }
}
var myRotate = function (head, node, k, len = 1, trueK = false) {
  // debugger
  if (trueK) {
    if (k === 0) {
      var newHead = node.next
      node.next = null
      return newHead
    } else {
      return myRotate(head, node.next, --k, len, true)
    }
  }
  if (node.next) {
    return myRotate(head, node.next, k, ++len)
  } else {
    node.next = head
    if ( k > len ) { k = len - k % len} else { k = len - k}
    // debugger
    return myRotate(head, node, k, len, true)
  }
}
var rotateRight = function(head, k) {
  if (!head || !head.next) {
    return head
  } else {
    return myRotate(head, head, k)
  }
};

var res = rotateRight(stack, 1)
debugger