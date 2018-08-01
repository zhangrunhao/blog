function insertionSort(array) {
  var length = array.length,
    j, temp;
  for (var i = 1; i < length; i++) {
    j = i;
    temp = array[i];
    while (j > 0 && array[j - 1] > temp) {
      array[j] = array[j - 1];
      j--;
    }
    array[j] = temp;
  };
}

var arr = [3, 5, 1, 4, 2, 6]
insertionSort(arr)
debugger