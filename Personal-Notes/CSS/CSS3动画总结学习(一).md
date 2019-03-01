# CSS3动画总结学习(一)

> * 参考文章:
> * [CSS3 Transitions, Transforms和Animation使用简介与应用展示](https://www.zhangxinxu.com/wordpress/2010/11/css3-transitions-transforms-animation-introduction/#three)
> * [CSS3 transition 属性](http://www.w3school.com.cn/cssref/pr_transition.asp)

## 动画的分类

### 平移动画

> * `transform`: 就是变换, 变换, 变换
> * 也就是能看到的, 直接的更改. 暴力的那种.

```css
  .dv {
    transform: translate(10px, 10px); /* 位置 */
    transform: scale(1, 0.5); /* 缩放 */
    transform: rotate(20deg); /* 旋转 */
  }
```

* `translate`:
  * 坐标变换.
  * 可以接受两个参数, 表示X轴和Y轴上的变化
  * 也可以只使用某个位置, 例如`transform: transalteX(10px);`
  * 可以开启三个轴上的同时变化: 例如`transform: translate3d(10px, 20px, 10px);`
* `rotate`:
  * 元素旋转
  * 可以接受一个参数, 表示需要旋转的角度
  * 也可以只在某个位置上进行旋转, 例如: `transform: rotateX(35deg)`;
  * 也可以在3d方面的旋转变化, 例如: `transform: rotate3d(1, 1, 2, 45deg)`
  * 关于每个属性的具体原理, 后面具体分析
* `scale`:
  * 缩放
  * 可以接受一个参数, 表示缩放表示水平和垂直同时缩放的倍数.
  * 就收两个参数, 第一个参数表示在水平方向的缩放, 第二个参数表示在垂直方向的缩放
  * 同样可以使用`scale3d()`来表示在三维层面的缩放
* `skew`:
  * 倾斜
  * 表示在X轴上的倾斜角度
  * 第二个参数表示在Y轴上的倾斜角度
* `marix`:
  * 矩阵
  * 这是一个超屌的属性.岂是这一句两句能扯清楚的
  * 放一篇大神博客, 以后再来慢慢琢磨: [理解CSS3 transform中的Matrix(矩阵)](https://www.zhangxinxu.com/wordpress/2012/06/css3-transform-matrix-%E7%9F%A9%E9%98%B5/)

### 过渡动画

> * transition: 过渡.
> * 这是下面四个属性的简写.
> * 就是一个属性的数值, 慢慢的, 平滑的向另一个数值进行改变

* `transition-property`
  * 需要设置过度的属性
  * 也就是当这个属性变化的, 是慢慢的变化.
  * 值是none, 没有过渡属性.
  * 默认是all, 所有属性采用过渡的方式变化.
  * 当给定过渡时间后, 不需要列出过渡属性, 所有属性默认使用过渡效果.
* `transition-duration`
  * 期间, 就是时间, 就是一个这个属性上的值, 变成另一个值的时候, 需要的时间.
  * 其值可以是毫秒`ms`, 也可以是秒`s`
    * 有个好玩的地方, 动画默认的是先慢后快.
    * 如果我们设置了hover属性五秒完成, 三秒后移开, 这个时候, 会先慢慢的过去, 然后最快的速度回来.
    * 我的理解是, 当一个属性值变化的时候, 会有一个函数计算, 还差多少, 完成多少的时候, 是什么速度.
  * 默认是0, 不会有过渡.
* `transition-timing-function`
  * 动画变化的方式, 快慢的区别
  * 允许随着时间来改变速度.
  * 默认的方式是: `ease`: 先慢后快. ease: 单词翻译: 缓解, 减轻, 缓慢的落下.
  * `linear`: 线性过渡
  * `ease-in`: in, 去里面, 进去的时候,慢一点.
  * `ease-out`: out, 外边, 走到最后外边的时候, 慢下来.
  * `ease-in-out`: 先快再慢再快.
  * `cubic-bezier()`: 很牛逼了.
* `transition-delay`
  * 在动画开始前, 需要等待的时间.
  * 用秒`s`和毫秒`ms`计算.

### 自定义动画(帧动画)

> * animation: 动画, 就是动画. 就是c3的动画
> * 动画, 还能指什么呢, 各个属性的改变之类的.
> * 是个总称: `animation: name duration timing-function delay iteration-count direction`

```css
  .dv:hover {
    animation-name: myAnimaiton;
    animation-duration: 3s;
  }
  @keyframes myAnimaiton {
    0% {
      padding: 0;
    }
    100% {
      padding: 150px;
    }
  }
```

* `animation-name`
  * 需要绑定的`keyframe`的名称
  * 默认值: none. 无动画效果.
  * 后面给一个`@keyframes <animation-name> {// 描述动画}`
  * 就可以完成动画过程的描述了
* `animation-duration`
  * 动画执行的时间
  * 默认是0, 无动画执行
  * 单位是秒`s`或者毫秒`ms`
* `animation-timing-function`
  * 动画执行的速度
  * 具体的参考下`transition-timing-funciton`
* `animation-delay`
  * 延迟时间.
  * 多久后, 开始执行动画
* `animation-iteration-count`
  * 动画循环执行的次数
  * 可以是具体的数字.
  * `infinite`: 无限次.
  * 留个疑问: 当鼠标hover的时候, 执行的动画, 为什么鼠标移动的时候, 没有离开元素, 但是元素缩小后, 离开了. 动画没有停止.
* `animation-direction`
  * 动画的方向
  * `normal`: 正常方向, 该怎么动, 怎么动.
  * `reverse`: 反方向, 从100%-0%的执行
  * `alternate`: 交替执行, 从正常方向开始
  * `alternate-reverse`: 交替执行, 从反方向开始