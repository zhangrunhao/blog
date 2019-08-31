# 总结调试webview的方式(安卓)

> * 参考文章:
> * [移动端真机调试指南](https://aotu.io/notes/2017/02/24/Mobile-debug/index.html)
> * [Mac 平台 Android 使用 Charles 抓包方法](https://zhuanlan.zhihu.com/p/47252675)
> * [Charles使用Map Local和Rewrite提高开发效率](https://www.jianshu.com/p/dffca69070fc)

## 通过chrome直接进行调试

### chrome调试_准备工作

> * **请保证已经科学上网**

* 科学上网
* 确定数据线为传输线, 不是充电线.
* 确保手机处于开发者模式, 链接电脑.
* 手机打开USB调试
* ![图1_01](https://zhangrunhao.oss-cn-beijing.aliyuncs.com/blog/test_webview/1_01.jpeg)
* 确认手机已开启USB调试模式
* ![图1_02](https://zhangrunhao.oss-cn-beijing.aliyuncs.com/blog/test_webview/1_02.jpeg)
* 打开Chrome, 地址栏输入`chrome://inspect`
* 在Devices选项, 打开发现USB设备选择
* 看到自己的手机出现在设备列表中
* ![图1_03](https://zhangrunhao.oss-cn-beijing.aliyuncs.com/blog/test_webview/1_03.jpeg)
* 手机上打开chrome浏览器
* 输入任意网址, 可在设备列表看到
* 点击`inspect`按钮, 即可进行调试
* ![图1_04](https://zhangrunhao.oss-cn-beijing.aliyuncs.com/blog/test_webview/1_04.jpeg)
* 可以通过`window.location.href = "http://xxx.com"`

### 遇到的问题

* 所有的问题全部来自于**科学上网**
* 首先在PC端, 显示空白, 后显404页面, 未能再次复现
  * 使用小米手机, 打开浏览器, 看到了这种情况, 必现, 未解决
  * 小米手机进webview也不能调试
  * 找到原因: **科学上网**
* 有些老手机, 进行调试的时候, 遇到的问题
  * 无法看到请求
  * 不能在console栏中直接输入代码
  * 找到原因: **科学上网**
* 在控制台不能输入代码
  * 找到原因: **科学上网**

### 问题原因

  注意：使用 Chrome Inspect 查看页面时，Chrome 需要从 [https://chrome-devtools-frontend.appspot.com](https://chrome-devtools-frontend.appspot.com) 加载资源，如果你得到的调试界面是一片空白，那你可能需要科学上网。

## 安卓抓包

### 安卓抓包_准备工作

* 配置Charles代理端口号
* ![图2_01](https://zhangrunhao.oss-cn-beijing.aliyuncs.com/blog/test_webview/2_01.jpg)
* 安卓手机处于同一个wifi下
* 进入WiFi设置, 设置代理, 代理地址到pc
* ![图2_02](https://zhangrunhao.oss-cn-beijing.aliyuncs.com/blog/test_webview/2_02.jpeg)
* 设置前面配置的端口号
* ![图2_03](https://zhangrunhao.oss-cn-beijing.aliyuncs.com/blog/test_webview/2_03.jpeg)
* pc弹出提示框, 是否同意进行代理, 同意
* ![图2_04](https://zhangrunhao.oss-cn-beijing.aliyuncs.com/blog/test_webview/2_04.jpeg)
* **此时遇到问题, 手机所有的链接变成不可信任(已关闭翻墙软件)**

* 进入charles, 选择`Proxy -> SSL Proxiyng Settings ->勾选 “Enable SSL Proxying”`
* ![图2_05](https://zhangrunhao.oss-cn-beijing.aliyuncs.com/blog/test_webview/2_05.jpg)

* **下面是之前安装的, 这次没有验证**
* 安装证书到电脑，选择 Help->SSL Proxying->Install Charles Root Certificate 按提示安装即可
* 在“加密套接字协议层(SSL)”一栏选择始终信任

* 安装证书到手机上: Install Charles Root Certificate on a Mobile Device or Remote Browser
* ![图2_06](https://zhangrunhao.oss-cn-beijing.aliyuncs.com/blog/test_webview/2_06.jpg)
* 显示安装成功, 并给出地址
* ![图2_07](https://zhangrunhao.oss-cn-beijing.aliyuncs.com/blog/test_webview/2_07.jpg)
* 手机浏览器打开后, 输入`chls.pro/ssl`, 下载
* 点击后, 进行安装, 并输入名称即可
* ![图2_08](https://zhangrunhao.oss-cn-beijing.aliyuncs.com/blog/test_webview/2_08.jpeg)

### 链接后无法上网问题

* 全部无法上网
  * 网页报错, 链接并不可靠
  * app无法正常发送请求
  * 猜测需要使用代理解决
* 已打开的app, 再去代理, 可以上网
  * 已经打开的app, 代理后, 不关闭, 可以正常上网
  * 打开浏览器后, 网页不能用
  * 再次重启app后, 不可上网
* 排除代理问题
  * 访问使用http的网站正常
  * 网站地址: `http://mayang.wicp.vip/`
* 确认使用https
  * 网站中的http图片均可以使用
  * https的图片不可以使用

## 使用Charles进行代理

### 代理本地地址

* 首先进入`Tools -> Map Local` 打开本地代理
* ![图3_01](https://zhangrunhao.oss-cn-beijing.aliyuncs.com/blog/test_webview/3_01.jpg)
* 选择`Add`添加代理地址
* ![图3_02](https://zhangrunhao.oss-cn-beijing.aliyuncs.com/blog/test_webview/3_02.jpg)
* 关掉翻墙, 软件, 并打开Charles的代理开关
* ![图3_03](https://zhangrunhao.oss-cn-beijing.aliyuncs.com/blog/test_webview/3_03.jpg)
* 测试成功
* ![图3_04](https://zhangrunhao.oss-cn-beijing.aliyuncs.com/blog/test_webview/3_04.jpg)

### 如何使用charles代理https

* 选中想要代理的链接
* ![图3_05](https://zhangrunhao.oss-cn-beijing.aliyuncs.com/blog/test_webview/3_05.jpg)
* 改变成本地地址
* ![图3_06](https://zhangrunhao.oss-cn-beijing.aliyuncs.com/blog/test_webview/3_06.jpg)
* **不明白为什么这种情况下, https可以使用?**
* [How to enable Map Local over https with Charles Proxy?](https://stackoverflow.com/questions/3979685/how-to-enable-map-local-over-https-with-charles-proxy)

### 代理远程地址

* 和本地地址一个样子, 只不过是这是在`Tools -> Map Remote`里进行设置

## 总结

  介绍了三个方法, chrome调试安卓, 安卓抓包, charles进行本地代理.,  现在使用的nginx代理, 感觉也不错.
  有这三, 调试安卓, 会很方便.
