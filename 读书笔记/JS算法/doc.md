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
* 如果不是数组, 例如对象, 函数, 或者其他类型的话, 会直接作为元素添加上去

### 迭代

* map: 遍历返回新数组, 每一项由新的组成, 不改变原数组
* forEach: 遍历数组, 没有返回结果, 不改变数组. 但是可以通过参数进行改变
* some: 一项返回true, 就是true
* every: 每一项都返回true, 才是true
* filter: 返回一个返回值true的值, 组成的新数组
* reduce: (pre, cur, index, arr) 每一项的结果向后叠加, 并返回新的操作结果

### 排序

* reverse: 反转
* sort, (a, b) 接受一个函数参数. 根据函数返回的结果, 返回负数, a>b, a在前面

```js
var arr = [1, 5, 4]
// a, b两个数相比较, 返回小于0的数的话, a 放到前面
arr.sort((a, b) => {
  return a - b
})
console.log(arr) [1,4,5]
```

* 封装数组中是对象, 然后根据对象中的某个特定属性进行排列

```js
var obj1 = {
  age: 20
}
var obj2 = {
  age: 10
}
var arr = [obj1, obj2]

arr.sort(comp('age'))


function comp(key) {
  return (a, b) => {
    return a[key] - b[key]
  }
}
console.dir(arr)
```

* 重点: 返回的小于0的话, 那么这个值就在前面.

### 搜索

* indexOf
* lastIndexOf

### 数组输出为字符串

* join: 按照指定的字符拼接数组的每一项, 返回. 如果什么都不传的话, 就是toString
* toString

## 03栈

> 后进先出, 也是编译器中保存遍历, 方法调用等的方式

### 实现栈

```js
class Stack {
  constructor () {
    this.items = []
  }
  push(item) {
    return this.items.push(item)
  }
  pop() {
    return this.items.pop()
  }
  peek() {
    return this.items[this.items.length - 1]
  }
  isEmpty() {
    return this.items.length === 0
  }
  clear() {
    return this.items = []
  }
  size() {
    return this.items.length
  }
}
```

### 利用栈实现十进制转其他进制

* 因为每一次取余后, 都是一次压栈操作, 放到最里面
* 操作完成后, 是出栈操作, 也就是从最上面开始取

```js
function divideBy(num, base) {
  var stack = new Stack, res = ''
  while (num > 0) {
    var rem = Math.floor(num % base)
    stack.push(rem)
    num = Math.floor(num / base)
  }
  while(!stack.isEmpty()) {
    res += stack.pop()
  }
  return res
}
var num = 10
console.log(divideBy(10, 8))
console.log(num.toString(8))
```