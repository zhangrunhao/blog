/**
 * Definition for singly-linked list.
 * function ListNode(val) {
 *     this.val = val;
 *     this.next = null;
 * }
 */
/**
 * @param {ListNode} l1
 * @param {ListNode} l2
 * @return {ListNode}
 */
var mergeTwoLists = function(l1, l2) {
  var ln = null
  if (l1.val < l2.val) {
    ln = l1
  }
  while (l1 && l2) {
    if (l1.val < l2.val) {
      ln
    }
  }
};
