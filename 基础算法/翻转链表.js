/**
 * Definition for singly-linked list.
 * function ListNode(val) {
 *     this.val = val;
 *     this.next = null;
 * }
 */
/**
 * @param {ListNode} head
 * @return {ListNode}
 */
var reverseList = function(head) {
  var cur = head
  var pre = null
  var next = null
  while (cur !== null) {
      next = cur.next
      cur.next = pre
      pre = cur
      cur = next
  }
  return pre
  
};