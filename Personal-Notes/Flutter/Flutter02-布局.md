# Flutter02-布局

## 常见的集中布局

### 线性布局

- 其实就是 flex 布局，用的是 column, row

```dart
Column({
  mainAxisSize: MainAxisSize.max, // 是否占满父容器
  mainAxisAlignment: MainAxisAlignment.center, // 主轴的对齐方式
  children: [
    Flexible(), // 可以使用剩余空间，但不强制拉满
    Expended(), // 占满剩余高度
  ]
})
```

### 层叠布局

- css 中的 absolute
- Stack 子组件按照顺序进行定位

```dart
Stack(
  children: [
    Container(),
    Positioned(
      top:15,
      left:15,
      childe: Text()
    )
  ]
)
```

### 包裹布局

- Wrap: 空间不足自动换行
- Flow: 自定义布局策略

### 适配布局

- MediaQuery / LayoutBuilder
- 用于根据屏幕尺寸调整高度

### 约束布局

- ConstrainedBox
- AspectRation

### 对齐布局

- Align / Center

```dart
Align(
  alignment: Alignment.bottomright,
  child: Text('')
)

Center(

)
```

### 列表

- ListView: 可滚动的线形列表 = Column + ScrollView
- CustomScrollView + Sliver: 复杂滚动列表，吸顶 / 无限加载

## 布局

### 三种 Widget

- 结构型：
  - 控制布局和结构
  - Container,Row,Column,Stack,Expanded,Padding
- 显示型：
  - 展示内容
  - Text,Image,Icon,FlutterLogo
- 功能型：
  - 提供交互和功能
  - GestureDetector,Form,TextFiled

### 布局步骤

- 先约束，后布局。(Constraints go down, sizes go up)。
- 父 Widget 给子 Widget 传递约束，子 Widget 自己决定自己的大小。

### 常用的 widget

- Container
  - 容器
  - 可以设置 padding, margin, color, alignment, width, height
- Row / Column
  - mainAxisAlignment 主轴对齐方式
  - crossAxisAlignment 交叉轴对齐方式
- Expended / Flexible
  - 主动占满所有空间
  - 可以占满，但是不强迫占满
- Stack / Positioned
  - 堆叠布局
- Wrap
  - 自动换行

## 疑问

- 先约束，后布局的具体含义，如何先给约束，再给布局？
  - Constraints go down. Sizes go up. Parent sets position
  - 约束向下传递，父组件给约束，一层层向下传递。
  - 子组件确定自己的尺寸大小，告诉父组件。
  - 父组件确定子组件的位置。
- Positioned 必须嵌套在 Stack 里面吗？
  - 是的。
- Wrap 的意思是宽度要给定，然后高度由子 widget 撑开吗？
  - 不给宽度，会尝试自动撑满主轴上的空间。
- Stack 中子组件，是不是默认在左上角对齐？
  - 是的，但是可以通过 alignment 属性，进行一个修改
- 什么是 Flow 布局？
  - 继承 FlowDelegate，可以按照动画的方式进行一个排列

```dart
Flow(
  delegate: MyFlowDelegate(),
  children: []
)

class MyFlowDelegate extends FlowDelegate{
  @override
  void paintChildren(FlowPaintingContext context) {}

  @override
  bool shouldRepaint(covariant FlowDelegate oldDelegate) => false;
}
```

- MediaQuery / LayoutBuilder 的使用方法是什么？
  - MediaQuery 获取屏幕大小，文字缩放比例，当前主题颜色等
  - LayoutBuilder 根据父组件的约束来做布局

```dart
double screenWidth = MediaQuery.of(context).size.width;

LayoutBuilder(
  builder: (context, constrains) {
    if (constrains.maxWidth<600) {
      return Column()
    } else {
      return Column()
    }
  }
)
```

- ConstrainedBox 限制大小，超过了，会发生什么？
  - 红色框的报错
- AspectRatio 这个什么作用？
  - 子组件的宽高比例固定

```dart
AspectRatio(
  aspectRatio: 16 / 9,
  child:
)
```

