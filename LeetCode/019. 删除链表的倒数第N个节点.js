/**
 * Definition for singly-linked list.
 * function ListNode(val) {
 *     this.val = val;
 *     this.next = null;
 * }
 */
/**
 * @param {ListNode} head
 * @param {number} n
 * @return {ListNode}
 */
// 我认为, 我刚刚的递归做法, 被题目上的恒成立坑了
var removeNthFromEnd = function (head, n) { // 首先是一个逗比解法
  var girl = head
  var boy = head
  while (n >= 0) {
    if (!girl) return head.next
    girl = girl.next
    --n
  }
  while(girl) {
    boy = boy.next
    girl = girl.next
  }
  boy.next = boy.next.next
  return head
};

var removeNthFromEnd = function (head, n) { // 速度短暂提高, 偏向稳定, 通过减少判断提高速度
  let curr = new ListNode(0);
  curr.next = head; // 大神就是牛逼, 这种方式来避免空

  let pre = curr;
  let next = curr;
  
  do {
    next = next.next
  } while (--n >= 0);

  while(next) {
    pre = pre.next;
    next = next.next
  }
  pre.next = pre.next.next;
  return curr.next;
}

var head = {
  val: 1
}
removeNthFromEnd(head, 1)
debugger