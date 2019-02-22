# 从wireshake分析http和https的通信过程

> * [Wireshark基本介绍和学习TCP三次握手](https://www.cnblogs.com/TankXiao/archive/2012/10/10/2711777.html#tcpdetails)
> * [【技术流】Wireshark对HTTPS数据的解密](https://zhuanlan.zhihu.com/p/36669377)
> * [Wireshark/HTTPS](https://en.wikiversity.org/wiki/Wireshark/HTTPS)
> * [Journey to HTTP/2](https://kamranahmed.info/blog/2016/08/13/http-in-depth/)
> * [以TCP/IP协议为例，如何通过wireshark抓包分析？](https://zhuanlan.zhihu.com/p/36414915)
> * [TCP三次握手和四次挥手](https://www.cnblogs.com/qdhxhz/p/8470997.html)
> * [Https详解+wireshark抓包演示](https://www.jianshu.com/p/a3a25c6627ee)

## 前言

  面试被问到有没有用过抓包工具, 还真没有... 弥补一波. 一直以来看http和https的介绍, 都是文章, 然后图片, 理解的也不深入. 借此一个机会, 深入理解下.

  入行不久, 写的哪里不对的, 请谅解. 还望各位路过的大佬帮忙指出, 十分感谢.

## 软件使用

### 软件使用分析

> 我刚开始用, 哪里不对的. 望大神们见谅.

  ![软件图片介绍](http://zhangrunhao.oss-cn-beijing.aliyuncs.com/blog/wireshark-tcp/01.jpg)

  ![各层介绍](http://zhangrunhao.oss-cn-beijing.aliyuncs.com/blog/wireshark-tcp/02.jpg)

  下面这个图是盗的, 来自上面的参考文章.

  ![tcp数据包的各个字段](https://pic002.cnblogs.com/images/2012/263119/2012100717254656.png)

### 操作步骤

1. 安装Wireshark
2. 装个浏览器就行了
3. 点击开始捕获, 右上角, 鲨鱼标志
4. 在浏览器中输入`http://www.cnblogs.com/zhangrunhao/`
5. 或者是`https`
6. 页面渲染完成后, 点击停止捕获
7. 在筛选栏中输入http, 看到一个`info`是`GET /zhangrunhao/ HTTP/1.1`
8. 记录下请求的ip
9. 筛选栏中改为`ip.addr == <记录下的ip地址>`
10. 大概你就可以看到你想要的了.

  ![图片03](http://zhangrunhao.oss-cn-beijing.aliyuncs.com/blog/wireshark-tcp/03.jpg)

## HTTP协议中TCP握手过程

  三次握手的简单建立过程: 所有的`TCP`链接都是通过三次握手开始的, 也就是客户端和服务器在发送应用数据之前, 发送一系列的数据包.

  ![图片](https://pic002.cnblogs.com/images/2012/263119/2012100722541987.png)

  ![three-shark](https://img2018.cnblogs.com/blog/1090617/201901/1090617-20190116110625814-795901602.png)

  一次完整的三次握手的过程就完成了, 客户端和服务器端的数据就可以开始传输了. 需要注意的是, 客户端一旦发送完最后一个`ACK`数据包, 就立即开始发送应用数据, 但是服务器端需要等到最后一个`ACK`包接受完成才会去响应请求.

## 抓包HTTP分析

### 三次握手

  ![图片04](http://zhangrunhao.oss-cn-beijing.aliyuncs.com/blog/wireshark-tcp/04.jpg)

  ![图片05](http://zhangrunhao.oss-cn-beijing.aliyuncs.com/blog/wireshark-tcp/05.jpg)

  ![图片06](http://zhangrunhao.oss-cn-beijing.aliyuncs.com/blog/wireshark-tcp/06.jpg)

  开始发送http请求的时候, 就是应用层的事情了. 表示tcp的三次握手完成.

### 四次挥手

  ![four-shark](https://img2018.cnblogs.com/blog/1090617/201901/1090617-20190116111104366-175362855.png)
  ![图片07](http://zhangrunhao.oss-cn-beijing.aliyuncs.com/blog/wireshark-tcp/07.jpg)
  ![图片08](http://zhangrunhao.oss-cn-beijing.aliyuncs.com/blog/wireshark-tcp/08.jpg)
  ![图片09](http://zhangrunhao.oss-cn-beijing.aliyuncs.com/blog/wireshark-tcp/09.jpg)
  ![图片10](http://zhangrunhao.oss-cn-beijing.aliyuncs.com/blog/wireshark-tcp/10.jpg)

## HTTPS中的TCP交互过程

## 抓包HTTPS分析
