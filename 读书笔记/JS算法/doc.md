# 学习JavaScript数据结构与算法

## 01基础

### 循环

* 斐波那契数列

```js
var fibonaci = [1,1]
for (var i = 2; i< 20;i++) {
  fibonaci[i] = fibonaci[i-1] + fibonaci[i-2]
}
```

## 02数组

### 添加和删除元素

* push: 放到最后
* pop: 取最后一个
* unshift: 放到第一个
* shifit: 取第一个
* push 和 pop 模拟栈
* unshift 和 pop 模拟队列

```js
// 因为最后引用了一个i+1, 但是i已经是小于length的最小索引
var arr = [0,1,2,3,4,5]
for (var i = 0;i<arr.length;i++) {
  arr[i] = arr[i+1]
}
console.log(arr) // [ 1, 2, 3, 4, 5, undefined ]
```

* pop和shift可以改变数组的长度
* **pop和shift不接受传参**
* spilce(index, length, ...补充的元素)取出数组中间的元素, 并返回
* splice改变原数组

### 多维数组矩阵

## 数组常用方法

### 数组合并

* concat: 可以合并多个数组
* 参数如果是数组, 进行解析合并.