# 平衡Dom总结

> * 介绍: 新的项目中有些Dom元素需要和画布保持统一个适配比例
> * 项目地址: [宝岛之光-台湾偶像剧](http://sugar.k.sohu.com/h5/1907_cp/index.html)

## 遇到的问题

* H5项目使用Canvas, 适配采用保持宽高比例, 上下或者左右留白方式
* 在项目中有些Dom元素, 例如用来放Gif的`<Img>`, 还有`<Video>`, 和输入框`<Input>`
* 这些元素的适配方式, 和画布无法保持同步, 造成开发上的时间浪费.
* 两个难点
  1. 直接传入设计图上的宽高,无需计算, 即可达到想要的效果
  2. 宽高等属性可直接计算, 但上下左右, 可能留白, 造成位置偏差

## 实现方式

### 思路

1. 传入Dom元素, 直接设置不需要计算的属性
2. 保存需要不断计算的属性
3. 设计监听, 即当选中屏幕的时候, 可自动改变
4. 并主动进行一次计算
5. 计算过程分为两种情况

### 计算情况

* ***注意: 位置元素只能使用top和lfet!!!***
* 非top或者left, 不受位置影响的计算属性, 可以直接进行计算
* top, 和lfet, 位置元素
  * 判断当前是否为上下留白, 如果是正好的话, 直接计算即可
  * 宽变多了, 过于宽了, 左右留白, 计算按照原始比例, 宽的长度, 再计算出需要移动的宽的一半
  * 上下留白同理

## 使用方式

### 正常使用

* ***注意: 位置元素只能使用top和lfet!!!***
* 正常使用过程, 直接设置属性和值即可, Number类型的属性, 是需要计算的

```js
  new NewDom(document.getElementById('videoQ1'), {
    top: 386,
    left: 50,
    width: 660,
    height: 380
  }).listenChange()
```

### 设置居中

* 居中不能进行数值的设置
* 设置居中的过程, 也就是让宽高是50%即可

```js
  new NewDom(document.getElement('img')), {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',

    width: 750,
    height: 1464
  }).listenChange()
```

### 具体实现代码

```js

const width = Symbol('w')
const height = Symbol('y')
const dom = Symbol('dom')
const storeStyle = Symbol('storeStyle')

export default class NewDom {
  constructor (domInstance, style) {
    this.setWidthAndHeight(750, 1464)
    if (!this.judgeDom(domInstance)) throw new Error('参数类型错误')
    this[dom] = domInstance // dom实例
    this[storeStyle] = {} // 存储所有变换的值

    Object.keys(style).forEach(key => {
      if (typeof style[key] === 'number') {
        this[storeStyle][key] = style[key] // 收集所有变化的值
      } else {
        this[dom].style[key] = style[key]
      }
    })
  }
  setWidthAndHeight (w, h) {
    if (typeof w === 'number' && typeof h === 'number') {
      this[width] = w
      this[height] = h
    } else {
      throw new Error('需要传入数字类型的宽高')
    }
    return this
  }
  judgeDom (obj) { // 判断是否为dom
    if (typeof HTMLElement === 'object') {
      return obj instanceof HTMLElement
    } else {
      return obj && typeof obj === 'object' && obj.nodeType === 1 && typeof obj.nodeName === 'string'
    }
  }
  listenChange () {
    let timer
    this.autoChange()
    window.addEventListener('orientationchange', () => {
      if (timer) clearTimeout(timer)
      timer = setTimeout(() => {
        this.autoChange()
      }, 1500)
    })
    return this
  }
  fouceSetStyle (key, value) { // 强行更改属性
    this[dom].style[key] = value
  }
  autoChange () {
    const style = this[storeStyle]
    const shouldScaleWidth = innerWidth / this[width]
    const shouldScaleHeight = innerHeight / this[height]
    const scale = Math.min(shouldScaleWidth, shouldScaleHeight)
    Object.keys(style).forEach(key => {
      if (shouldScaleWidth > shouldScaleHeight && key === 'left') { // 宽变化多, 左右留白
        const vacancy = innerWidth - this[width] * scale
        this[dom].style.left = `${style[key] * scale + vacancy / 2}px`
      } else if (shouldScaleWidth < shouldScaleHeight && key === 'top') { // 上下留白
        const vacancy = innerHeight - this[height] * scale
        this[dom].style.top = `${style[key] * scale + vacancy / 2}px`
      } else {
        this[dom].style[key] = `${style[key] * scale}px`
      }
    })
    return this
  }
}

```
