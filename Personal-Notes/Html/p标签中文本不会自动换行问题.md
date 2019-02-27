# p标签中文本不会自动换行问题

## 解决方案

```css
  p {
    word-wrap: break-word;
    word-break: break-all;
    overflow: hidden;
  }
```

## 原因

> 以后再看