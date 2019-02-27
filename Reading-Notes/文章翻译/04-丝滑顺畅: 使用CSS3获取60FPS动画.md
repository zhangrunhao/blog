# 丝滑顺畅:使用CSS3获取60FPS动画

> 原文链接: [Smooth as Butter: Achieving 60 FPS Animations with CSS3](https://medium.com/outsystems-experts/how-to-achieve-60-fps-animations-with-css3-db7b98610108)

  在移动端使用动画元素是很容易的.

  如果你能遵循我们的这里的提示, 在移动端适当的使用动画元素, 可以变得更加容易.

  在这些天里, 每个人都不会适当的使用CSS3动画. 有些最佳的实践方法, 一直被忽视. 被忽视的主要原因是人们不能真正的理解,这些实践存在的真正原因, 以及为何能得到大力支持.

  现在设备的规格非常多, 如果你不能通过仔细思考优化你的代码, 使用顺畅的动画, 你会给大部分的人带来不好的体验.

  记住: 尽管一些高端, 旗舰设备不断推动发展, 但这世界上大部分的设备, 和高端机相比差太多, 就像一个带着LCD的算盘.

  我们会告诉你如何使用CSS3, 发挥它的最大功效. 为了达成这一点, 我们首先需要学习一点东西.

## 理解时间线(Timeline)

  渲染和使用元素的时候, 浏览器会做些什么? 这是非常简单的一条时间线, 被称之为**关键渲染路径(Critical Rendering Path)**

  ![图片](https://cdn-images-1.medium.com/max/800/0*gMqY9IVJXuBbE8DF.)

  我们应该专注于改变影响**合成**步骤的属性, 而不是增加上一次布局的压力.

### 1.样式

  ![图片](https://cdn-images-1.medium.com/max/800/0*LDiyh_mOgH1n21wF.)

  浏览器开始计算样式, 以便应用到元素上 - 重新计算**样式**

### 2.布局

  ![图片](https://cdn-images-1.medium.com/max/800/0*X_6VTAJuRQCt1qXM.)

  下一个步骤中, 浏览器开始计算模型和各个元素的位置 - **布局**. 这是浏览器设置在页面中设置例如**宽**和**高**属性的地方, 也包括了**外边距**, 或者是实例的**左/高/右/下**.

### 3.绘制

  [图片](https://cdn-images-1.medium.com/max/800/0*wJKTvKHyYi13kPoI.)

  浏览器开始将每一个元素在像素级别填充到图层中. 我们使用的这些属性包括: **box-shadow**, **border-radius**, **color**, **background-color**, 等等.

### 4.合成

  这是你需要操作的地方, 因为这是浏览器开始在屏幕绘制所有的图层.

  [图片](https://cdn-images-1.medium.com/max/800/0*JHTvclhMvkYYEBEY.)

  现在浏览器能够产生动画的有四个属性, ,最好使用**tansform**, 和**opacity**属性.

* 位置: transform: translateX(n) translateY(n) translateZ(n);
* 扩大/缩放: transform: scale(n);
* 旋转: transform: rotate(ndeg);
* 透明: opacity: n;

## 如何获得每秒60帧的实现

  通过上面这些思考, 让我们开始干吧.

  我们通过一个HTML开始. 我们会创建一个非常简单的模型, 然后在`.layout`中放置一个`app-menu`.

  ```html
  <div class="layout">
    <div class="app-menu"></div>
    <div class="header">
      <div class="menu-icon"></div>
    </div>
  </div>
  ```

## 开始使用一个错误的方式

### Going About It the Wrong Way(下为原文翻译)

  ```css
  .app-menu {
    transition: left 300ms linear;
    left: -60%;
  }
  .open .app-menu {
    left: 0;
  }
  ```

  看到被我们改变的属性了吗? 你应该避免使用`transition`上面的`top/right/bottom/left`属性. 那并不会产生一个流畅的动画. 因为他们让浏览器一直在创建`layout`s, 这会影响到他所有的子组件.

  他的结果就像这样:

  ![动图](https://cdn-images-1.medium.com/max/800/0*ZWyuzfeBSbFbQjOy.)

  这个动画完全不顺畅. 我们通过使用`DevTools Timeline`来看看底层发生了什么, 这是他的结果:
  
  ![图片](https://cdn-images-1.medium.com/max/800/0*y6jExBTCikGX2hVC.)

  这清楚的展现了FPS的不规则, 并且性能很差.

  > "绿条表示FPS. 他上面的条表示动画在60FPS如何渲染. 下面的条表示低于60FPS. 所以, 理想情况下, 你希望绿条能在整个时间线保持较高的水平. 红条也能表示出闪避`jank`(避开了渲染时间?), 所以, 还可以通过消除红条, 来表示你性能的进步." 感谢Kayce Basques指出.

### 第一部分实践纠正

#### 关于`Dev Tools`

  [官方文档](https://developers.google.com/web/tools/chrome-devtools/evaluate-performance/timeline-tool?hl=en): `Timeline`已经不再使用, 下面是使用`Performance`

  ![图片](http://plkjlr20y.bkt.clouddn.com/fanyi03/01.jpeg)

#### 关于渲染顺序

  [官方文档:](https://developers.google.com/web/fundamentals/performance/critical-rendering-path/measure-crp?hl=zh-cn#devtools)

  **这是一个疑问句? 现在我发现, 官方文档上所说的CRP和这篇文章说的不太一样, 有空翻译下官方文档.**

## 使用 Transform

  ```css
  .app-menu {
    transition: transform 300ms linear;
    transform: translateX(-100%);
  }
  .open .app-menu{
    transform: none;
  }
  ```

  `transform`属性作用到`Composite`合成阶段. 这里告诉我们, 只要动画开始, 浏览器所有的图层都渲染完成并准备好了, 所以动画渲染的时候, 间隔非常小.

  ![图片](https://cdn-images-1.medium.com/max/800/0*D9YAp9EQwbKunIZ-.)

  在实际中的时间线中展示:

  ![图片](https://cdn-images-1.medium.com/max/800/0*qc1qxqFudZPYpIUE.)

  现在的结果变得好一些了, FPS能够进行更多渲染, 然后动画更加流畅.

### 个人第二部分测试

  ![图片](http://plkjlr20y.bkt.clouddn.com/fanyi03/02.jpeg)

  和上一次个人测试相比, 省去了layout阶段, 就是布局的时间.

## 在GPU中运行动画

  那么, 让我把他提高一个等级. 为了保证动画运行的顺畅, 我们是用GPU开始渲染动画.

  ```css
  .app-menu {
    transition: transform 300ms linear;
    transform: translateX(-100%);
    /* transform: translate3d(-100%, 0, 0); */
    will-change: transform;
  }
  .open .app-menu{
    transform: none;
  }
  ```

  尽管一些浏览器依旧需要使用`translateZ()`和`translate3d()`作为备选方案, `will-change`[CSS `will-change` - how to use it, how it works](https://stackoverflow.com/questions/26907265/css-will-change-how-to-use-it-how-it-works)才是以后的趋势. 这样做, 可以把元素提升到另一层上, 所以, 浏览器不需要考虑布局的渲染和绘制.

  ![图片](https://cdn-images-1.medium.com/max/800/0*ZeuG8kachde9iCnR.)

  能够看出他的顺畅吗? 渲染路径会证实这一点.

  ![图片](https://cdn-images-1.medium.com/max/800/0*ekofIUN-X7br1bIH.)

  动画的FPS是非常连续的, 并且动画的渲染是非常快速的. 但是依旧有一个红框在渲染的时候. 那只是在开始的时候, 一个小瓶颈.

  记住刚开始时创建的HTML的结构. 让我们使用JavaScript在结构中控制一个`app-menu`div.

  ```js
  function toggleClassMenu() {
    var layout = document.querySelector('.layout')
    if (!layout.classList.contains('app-menu-open')) {
      layout.classList.add('app-menu-open')
    } else {
      layout.classList.remove('app-menu-open')
    }
  }
  ```

  这个问题是: 我们给`layout`这个div添加了类名, 让浏览器再一次计算了样式, 影响了渲染性能.

### 个人关于第三部分测试

  首先是, 使用translate3d的效果:

  ![图片](http://plkjlr20y.bkt.clouddn.com/03-1.jpeg)

  这是使用了`will-change`的效果:

  ![图片](http://plkjlr20y.bkt.clouddn.com/03-2.jpeg)

  同样, 我也是使用这种控制类名的方式实现的动画.

## 60FPS的顺畅动画

  如果我们从视图层外边创建一个区域替代之前的做法呢? 一个隔离的区域, 可以确保影响到的元素, 就是想要进行动画的.

  所以, 我们使用下面这种HTML结构.

  ```html
  <div class="menu">
    <div class="app-menu"></div>
  </div>
  <div class="layout">
    <div class="header">
      <div class="menu-icon"></div>
    </div>
    <a href="www.baidu.com">baidu</a>
  </div>
  ```

  现在我们可以使用稍微不同的方式控制menu的状态了. 当动画结束的时候, 我们使用JavaScript中的`transitionend`函数, 删除还有动画的类名.

  ```js
  function toggleClassMenu() {
    myMenu.classList.add("menu--animatable");
    if (!myMenu.classList.contains("menu--visible")) {
      myMenu.classList.add("menu--visible");
    } else {
      myMenu.classList.remove('menu--visible');
    }
  }

  function OnTransitionEnd() {
    myMenu.classList.remove("menu--animatable");
  }

  var myMenu = document.querySelector(".menu");
  var oppMenu = document.querySelector(".menu-icon");
  myMenu.addEventListener("transitionend", OnTransitionEnd, false); // 只在动画期间添加动画函数
  oppMenu.addEventListener("click", toggleClassMenu, false);
  myMenu.addEventListener("click", toggleClassMenu, false);
  ```

  让我们全部结合起来, 然后检查结果.

  下面是完整, 可以使用CSS3的例子, 每一处都使用了最正确的方式.

  ```css
    body {
      margin: 0;
      padding: 0;
    }

    .menu {
      position: fixed;
      left: 0;
      top: 0;
      width: 100%;
      height: 100%;
      overflow: hidden;
      pointer-events: none; /* 这个属性表示, 即使是上面有一层, 也不影响, 下面元素的使用 */
      z-index: 150;
    }

    .menu--visible {
      pointer-events: auto; /* 遮盖了, 也就不让用了 */
    }

    .app-menu {
      background-color: #fff;
      color: #fff;
      position: relative;
      max-width: 400px;
      width: 90%;
      height: 100%;
      box-shadow: 0 2px 6px rgba(0, 0, 0, 0.5);
      -webkit-transform: translateX(-103%);
      transform: translateX(-103%);
      display: flex;
      flex-direction: column;
      will-change: transform;
      z-index: 160;
      pointer-events: auto; /* 这是我们的侧边栏, 打开的时候, 不让用下面的元素 */
    }

    .menu--visible .app-menu {
      -webkit-transform: none;
      transform: none;
    }

    .menu--animatable .app-menu { /* 消失的时候, 先慢后快 */
      transition: all 130ms ease-in;
    }

    .menu--visible.menu--animatable .app-menu { /* 出现的时候, 先快, 后慢 */
      transition: all 330ms ease-out;
    }

    .menu:after {
      content: '';
      display: block;
      position: absolute;
      left: 0;
      top: 0;
      width: 100%;
      height: 100%;
      background: rgba(0, 0, 0, 0.4);
      opacity: 0;
      will-change: opacity;
      pointer-events: none;
      transition: opacity 0.3s cubic-bezier(0, 0, 0.3, 1);
    }

    .menu--visible.menu:after {
      opacity: 1;
      pointer-events: auto;
    }

    /* aux */

    body {
      margin: 0;
    }

    .layout {
      width: 375px;
      height: 667px;
      background-color: #f5f5f5;
      position: relative;
    }

    .header {
      background-color: #ccc;
    }

    .menu-icon {
      content: "Menu";
      color: #fff;
      background-color: #666;
      width: 40px;
      height: 40px;
    }

    .app-menu {
      width: 300px;
      height: 667px;
      box-shadow: none;
      background-color: #ddd;
    }

    .menu:after {
      width: 375px;
      height: 667px;
    }
  ```

  ![图片](https://cdn-images-1.medium.com/max/800/0*EFkarCSe2mQEYK0e.)

  让我们看下Timeline展示给我们的?

  ![图片](https://cdn-images-1.medium.com/max/800/0*mDp5_LD08xtZKQyS.)

  看到了吗? 非常流畅.

### 最后一部分的测试

  发现, 性能提升主要在Event中, 其他未能看出提升, 并进行了一个名为`Fire Idle Callback`.还需要深入了解下. 下图为实操图片:

  ![图片](http://plkjlr20y.bkt.clouddn.com/fanyi03/04.jpg)

## 总结

* 再次深入学习了事件流.
* 没有搞明白`关键渲染路径`到底是什么. 文章和官网说的不一样.
* 知道了一个`will-change`和`pointer-events`