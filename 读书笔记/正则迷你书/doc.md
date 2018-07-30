# JavaScript正则表达式 (一)

## 01字符匹配

> 正则表达式是匹配模式, 要么匹配字符, 要么匹配位置

### 01两种模式

* 横向模式 {m, n} 最少m, 最多n

```js
var str = 'abbbc abc ac cdaabbbcadabbbbc'
var res = str.match(/ab{2,4}c/g)
console.log(res) // Array(3) ["abbbc", "abbbc", "abbbbc"]
debugger
```

* 纵向模式: [abc], 是abc三个中的一个

```js
var str = 'a1ca2caaabbcsa3cb3c'
var res = str.match(/a[123]c/g)
console.log(res) // Array(3) ["a1c", "a2c", "a3c"]
```

### 02字符组

* 范围表达式: [123456abcd] = [1-6a-d]: 是在里面选一种
* 表示 a, -, z 中的一个 [-az]
* 排除字符组:表示非其中的任何一个[^abc] 不是abc中的任何一个
* \d: [1-9]  \D: [^1-9]. \w: [0-9a-zA-Z_] \W: [^0-9a-zA-Z_]. \s: 空白符 \S: 非空白符. .: 通配符
* '[^]': 任意字符

### 03量词

> 量词也就是重复, {m, n}的准确描述

* {m,} : 至少出现m此
* {m} : {m, m}: 出现m次
* ? : {0,1}出现一次或者不出现
* `+` : {1,}至少出现一次
* `*` : {0,} 出现任意次, 也有可能不出现

* 贪婪匹配: 匹配尽可能多的字符

```js
var reg = /\d{2,5}/g
var str = '122 12344 1 111111    1 a123aad3aaa'
var res = str.match(reg)
console.log(res) // 122 12344 11111 123
```

* 惰性模式: 匹配尽可能少的字符
* 给{}横向匹配加个?就是尽可能少的匹配, 有两个就够了
* **那还要5个干什么呢?**

```js
var reg = /\d{2,5}?/g
var str = '122 12344 1 111111    1 a123aad3aaa'
var res = str.match(reg)
console.log(res) // ["12", "12", "34", "11", "11", "11", "12"]
```

* 一模一样的

```js
var reg = /\d{2,5}?/g
var reg1 = /\d{2}?/g
var str = '122 12344 1 111111    1 a123aad3aaa'
var res = str.match(reg)
var res1 = str.match(reg1)
console.log(res) // ["12", "12", "34", "11", "11", "11", "12"]
console.log(res1) //["12", "12", "34", "11", "11", "11", "12"]
```

* 在量词后面加个 ? 就是惰性匹配, 匹配尽可能少的.

### 04多选分支

* 使用 | 管道符: 表示不是这种, 是那种也行
* 分支结构是惰性的, 匹配上就是了

```js
var reg = /aaa|bb/g
var str = 'aaabbabaaabbb aaabb abbb'
var res = str.match(reg)
console.log(res) // ["aaa", "bb", "aaa", "bb", "aaa", "bb", "bb"]'
```

### 05应用

* 匹配颜色

```js
var reg = /#{1}[1-9a-zA-Z]{6}|#{1}[1-9a-zA-Z]{3}/g
var str = '#dddcccddcdc#cddsd3aaa#ddd#aaaa#a4433'
var res = str.match(reg)
console.log(res) // ["#dddccc", "#cddsd3", "#ddd", "#aaa", "#a44"]
```

* 匹配时间

```js
// 错误写法
// 01:22
// 23:10
// 00:00
var reg = /[0-2]{1}\d{1}:[0-5]{1}\d{1}/g
var str = 'AAD12D200:2281:34DD23:3DS44:3311:3D01:01D'
var res = str.match(reg)
console.log(res) // ["00:22", "01:01"]
```

```js
// 正确写法
// 四位数字
// 第一位是1的时候 第二位 0-9 | 第一位是2 的时候 第二位是0-3
// 第三位是 0-5 第四位 0-9
var reg = /([01][0-9]|[2][0-3]):[0-5][0-9]/g
var str = 'AAD12D200:2281:34DD23:3DS44:3311:3D01:01D'
var res = str.match(reg)
console.log(res) // ["00:22", "01:01"]
```

* 检测字符串

```js
var reg = /^([01][0-9]|[2][0-3]):[0-5][0-9]$/
var str = '01:22'
var str1 = '24:05'
var res = reg.test(str) // true
var res1 = reg.test(str1) // false
```

* 忽略0

```js
// 7:9
var reg = /^(0?[0-9]|1[0-9]|[2][0-3]):(0?[0-9]|[1-5][0-9])$/;
var str = '01:22'
var str1 = '24:05'
var str2 = '29:7'
var str3 = '1:03'
var res = reg.test(str) // true
var res1 = reg.test(str1) // false
var res2 = reg.test(str2) // false
var res3 = reg.test(str3) // true
```

* 匹配日期

```js
// yyyy-mm-dd
// 2015-08-12
// 我的答案
var reg = /^([0-9]{4})-([0][1-9]|[1][0-2])-([0][1-9]|[12][0-9]|[3][01])$/
// 书上的答案
var reg = /^[0-9]{4}-(0[1-9]|1[0-2])-(0[1-9]|[12][0-9]|3[01])$/;
```

* 匹配文件路径
* [^\\:*<>|"?\r\n/] 表示合法路径名
* ([^\\:*<>|"?\r\n/]\\)* 可以匹配很多次

* 匹配id
* 如果没有 ? 的话 * 是一个贪婪字符, 会匹配到最后一个 " 所以,加个?匹配一个就完成了

```js
var reg = /id=".*?"/
var str = '<div id="container" class="main"></div>'
var res = str.match(reg)
console.log(res) // ["id="container""]
```