# 宽高比例保持一定的情况的REM适配方案

> 秒啊, 不用改代码了

* 我这个是1080 * 1920的设计图, 针对了 375 / 667的屏幕
* **再三强调, 这是取巧, 针对了高宽一定的页面**

```js
    // 分辨率适配
    (function() {
        var winWidth = document.documentElement.clientWidth || window.screen.width || window.outerWidth || document.documentElement.scrollWidth;
        var winHeight = document.documentElement.clientHeight || window.screen.height || window.outerHeight || document.documentElement.scrollHeight;
        var ratio = 1080 / 1920
        if ((winWidth / winHeight) < ratio) {
          var fontSizeRoot = winWidth / 375 * (100 / (1080 / 375)) + 'px';
        } else {
          var fontSizeRoot = winHeight / 667 * (100 / (1920 / 667)) + 'px';
        }
        document.documentElement.style.fontSize = fontSizeRoot;
    })();
```
