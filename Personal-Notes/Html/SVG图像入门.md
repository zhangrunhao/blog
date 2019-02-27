# SVG图像学习

> 参考阮一峰老师: [SVG 图像入门教程](http://www.ruanyifeng.com/blog/2018/08/svg.html)

## 基本使用

* 可以直接放入到html中

```html
<body>
  <svg
    viewBox="0 0 800 600"
    >
    <circle id="mycircle" cx="400" cy="300" r="50" />
  </svg>
</body>
```

* 可以通过其他的带有src各种方式引入

```html
<img src="circle.svg">
<object id="object" data="circle.svg" type="image/svg+xml"></object>
<embed id="embed" src="icon.svg" type="image/svg+xml">
<iframe id="iframe" src="icon.svg"></iframe>
```

* 可以使用css的背景图引入

```css
.logo {
  background: url(icon.svg)
}
```

* 转成BASE64编码

```html
<img src="data:image/svg+xml;base64,[data]">
```

## 语法

### `<svg>`

* 有width和height属性.
* 可以是相对单位
* 默认大小, 300宽和150高

```html
<body>
  <svg
    width="100%"
    height="100%"
    >
    <circle id="mycircle" cx="50" cy="50" r="5" />
  </svg>
</body>
```

* 展示一部分使用viewBox属性
* 四个属性, 分别是横纵坐标, 视口的宽度和高度
* **视口必须适配所在空间**.
* 如果不指定`width`和`height`属性, 只指定`viewBox`属性, 相当与只给定了SVG图像的长宽比
* SVG图像的默认大小等于所在HTML元素的大小

```html
  <!-- 
    视口的大小是50 * 50
    svg的图像是 100 * 100
    视口就会放大去适配svg的大小, 所以放大了四倍
    说真的, 我不理解
  -->
  <svg
    width="100"
    height="100"
    viewBox="50 50 50 50"
    >
    <circle cx="50" cy="50" r="50" />
  </svg>
```

### `<circle>`

* 圆形
* cx, cy, r: 横纵坐标, 半径
* css元素类:
  * fill: 填充色
  * stroke: 描边色
  * stroke-width: 边框宽度

```html
  <style>
    .red {
      fill: red;
    }
    .fancy {
      fill: none;
      stroke: black;
      stroke-width: 3pt;
    }
  </style>
  <svg
    width="100"
    height="100"
    >
    <circle cx="30" cy="50" r="25" />
    <circle cx="30" cy="50" r="25" class="red" />
    <circle cx="30" cy="50" r="25" class="fancy" />
  </svg>
```

### `<line>`

* 直线
* x1, y1是开始, x2, y2 结束. 接受style样式渲染

```html
  <svg
    width="300"
    height="180"
    >
    <line x1="0" y1="0", x2="200", y2="0" style="stroke:rgb(0,0,0);stroke-width: 5;">
  </svg>
```

### `<polyline>`

* 折线
* `points`属性指定了每个端点的坐标
* 横纵左边用逗号分隔, 点点之间用空格分隔

```html
  <svg
    width="300"
    height="180"
    >
    <polyline points="3,3 20,28, 3,53" fill="none" stroke="black"/>
  </svg>
```

### `<rect>`

* 矩形
* xy左上角的纵横坐标, wh宽高

```html
  <svg
    width="300"
    height="180"
    >
    <rect x="0" y="0" height="100"  width="200" style="stroke: #70d5dd; fill: #dd524b" />
  </svg>
```

### `<ellipse>`

* 椭圆
* cx, cy, 中心的横纵坐标
* rx, ry, 椭圆的横纵向轴

```html
  <svg
    width="300"
    height="180"
    >
    <ellipse cx="60" cy="60", ry="40" rx="20" stroke="black" stroke-width="5" fill="silver" />
  </svg>
```

### `<path>`

* 路径
* d属性后面表示绘制顺序, 值是一个长字符串, 每个字母表示一个绘制动作
  * M: 移动到
  * L: 画直线到
  * Z: 闭合标签

```html
  <svg
    width="300"
    height="180"
    >
    <path d="
      M 18,3
      L 46,3
      L 46,40
      L 61,40
      L 32,68
      L 3,40
      L 18,40
      Z
    "></path>
  </svg>
```

### `<text>`

* xy文本区块的基线起点的横纵坐标
* 样式可以用class和style属性指定

```html
  <svg
    width="300"
    height="180"
    >
    <text x="30" y="10">Hello World</text>
  </svg>
```

### `<use>`

* 复制一个形状
* `href`指定要复制的节点
* xy是左上角的坐标
* 还可以指定width和height坐标

```html
  <svg
    width="300"
    height="180"
    viewBox="0 0 30 10"
    >
    <circle id="myC" x="5", y="5" r="4" />
    <use href="#myC" x="10" y="0" fill="blue" />
    <use href="#myC" x="20" y="0" fill="white" stroke="blue"/>
  </svg>
```

### `<g>`

* 将多个形状组成一个group, 方便复用

```html
  <svg
    width="300"
    height="180"
    >
    <g id="myC">
      <text x="25" y="20">圆形</text>
      <circle cx="50" cy="50" r="20" />
    </g>
    <use href="#myC" x="100" y="0" fill="blue" />
    <use href="#myC" x="200" y="0" fill="white" stroke="blue"/>
  </svg>
```

### `defs`

* 用于自定义形状, 但是内容不会显示, 仅仅可以引用

```html
  <svg
    width="300"
    height="180"
    >
    <defs>
      <g id="myC">
        <text x="25" y="20">圆形</text>
        <circle cx="50" cy="50" r="20" />
      </g>
    </defs>
    <use href="#myC" x="100" y="0" fill="blue" />
    <use href="#myC" x="200" y="0" fill="white" stroke="blue"/>
  </svg>
```

### `pattern`

* pattern标签将一个圆形定义为dots模式
* `patternUnits="userSpaceOnUse"`表示标签的宽度和长度是实际的像素比.
* fill: 指定的按照这个模式填充矩形

```html
  <svg
    width="300"
    height="180"
    >
    <defs>
      <pattern id="dots" x="0" y="0" width="100" height="100" patternUnits="userSpaceOnUse">
        <circle fill="red" cx="50" cy="50" r="35" />
      </pattern>
    </defs>
    <rect x="0" y="0" width="100%" height="100%" fill="url(#dots)" />
  </svg>
```

### `image`

* xlink: 表示来源链接

```html
  <svg
    width="100"
    height="100"
    >
    <image xlink:href="./download.jpg" width="50%" height="50%" />
  </svg>
```

### `animate`

* 产生动画效果
* 属性包含如下:
  * `attributeName`: 发生动画效果的名称
  * `from`: 单次动画的初始值
  * `to`: 单词动画的结束值
  * `dur`: 单次动画持续的时间
  * `repeatCount`: 动画的循环模式
* 可以在多个属性上定义动画

```html
  <svg
    width="500"
    height="500"
    >
    <rect x="0" y="0" width="100" height="100" fill="#feac5e">
      <animate attributeName="x" from="0" to="500" dur="2s" repeatCount="indefinite"></animate>
      <animate attributeName="width" to="500" dur="2s" repeatCount="indefinite"></animate>
    </rect>
  </svg>
```

### `animateTransform`

* animate对css的transform起作用的方式
* 可以让图案旋转变形

```html
  <svg
    width="500"
    height="500"
    >
    <rect x="250" y="250" width="50" height="50" fill="#feac5e">
      <animateTransform
        attributeName="transform"
        type="rotate"
        begin="0s"
        dur="10s"
        from="0 200 200"
        to="360 400 400"
        repeatCount="indefinite"
      />
    </rect>
  </svg>
```

## JavaScript操作

### DOM操作

* 正常获取, 正常操作就可以了

```html
  <style>
  circle {
    stroke-width: 5;
    stroke: #f00;
    fill: #ff0;
  }

  circle:hover {
    stroke: #090;
    fill: #fff;
  }
  </style>
  <svg
    id="mySvg"
    viewBox="0 0 800 600"
    >
    <circle id="mycircle" cx="400" cy="300" r="50" />
  </svg>
  <script>
    var  mycircle = document.getElementById('mycircle')
    mycircle.addEventListener('click', function (e) {
      console.log('circle clicked - enlarging')
      mycircle.setAttribute('r', 60)
    })
  </script>
```

### 后面还有一些读取SVG源码, 转换Cavas没写.. 懒得看了

### 还有一个实例, 有兴趣的可以看阮一峰老师的博客了. 我就是入个门, 看看svg是什么