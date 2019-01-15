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