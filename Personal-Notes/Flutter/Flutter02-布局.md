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

### 
