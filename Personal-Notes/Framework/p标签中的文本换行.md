# p标签中的文本换行

## 参考文章

* [word-break:break-all和word-wrap:break-word的区别](https://www.zhangxinxu.com/wordpress/2015/11/diff-word-break-break-all-word-wrap-break-word/)
* [CSS自动换行、强制不换行、强制断行、超出显示省略号](https://www.kancloud.cn/digest/yvettelau/137670)

## 属性介绍

### white-space: 如何处理元素中的空白

* normal: 默认, 被浏览器忽略空白
* pre: 空白被浏览器保留.
* nowrap: 文本不会换行, 会在同一行上继续, 一直走到需要换行为止
* pre-wrap: 保留空白符序列, 但正常换行
* pre-line: 合并空白符序列, 但正常换行
* inherit: 从父元素继承`white-space`这个属性

### word-wrap: 是否允许浏览器在单词内断句

* **现在更名为了`overflow-wrap`**
* normal: 默认, 只在允许的断字点换行
* break-word: 在实在找不到换行点的时候, 就断单词换行

### word-break: 怎样进行单词内的断句

* noraml: 默认, 使用浏览器的换行规则
* break-all: 允许在 **(非中日文等, 也就是英语什么的)** 单词内换行
* keep-all: 只能在半角空格和连字符换行

## p标签操作的各种方式

* 强制不换行: `p { white-space:nowrap; }`
* 自动换行: `p { word-wrap:break-word; }`
* 强制英文单词断行: `p { word-break:break-all; }`
* 超出显示省略号: `p{text-overflow:ellipsis;overflow:hidden;}`

## word-break:break-all和word-wrap:break-word的区别

* ![这是鑫大神的图](https://image.zhangxinxu.com/image/blog/201511/2015-11-18_233948.png)
