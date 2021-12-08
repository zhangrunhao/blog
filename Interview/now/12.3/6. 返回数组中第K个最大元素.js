var findKthLargest = function(nums, k) {
  nums.sort((a, b) => {
    return b - a
})
 return nums[k - 1]
  
};

findKthLargest([3,2,3,1,2,4,5,5,6], 4)


// [
//   6, 5, 5, 4, 3,
//   3, 2, 2, 1
// ]
// element 6
// k 4
// count 0
// max -1
// ----------
// element 5
// k 4
// count 1
// max 6
// ----------
// element 5
// k 4
// count 1
// max 6
// ----------
// element 4
// k 4
// count 1
// max 6
// ----------
// element 3
// k 4
// count 1
// max 6
// ----------
// element 3
// k 4
// count 1
// max 6
// ----------
// element 2
// k 4
// count 1
// max 6
// ----------
// element 2
// k 4
// count 1
// max 6
// ----------
// element 1
// k 4
// count 1
// max 6
// ----------