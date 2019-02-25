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

### 操作步骤

> 在官网中有很舒服的操作原理说明: [Wireshark/HTTPS](https://en.wikiversity.org/wiki/Wireshark/HTTPS)

1. 安装Wireshark
2. 装个浏览器就行了
3. 点击开始捕获, 右上角, 鲨鱼标志
4. 在浏览器中输入`http://www.cnblogs.com/zhangrunhao/`
5. 或者是`https`
6. 页面渲染完成后, 点击停止捕获
7. 在筛选栏中输入http, 看到一个`info`是`GET /zhangrunhao/ HTTP/1.1`
8. 记录下请求的ip. (注: 当你找不到ip的时候, 不要慌, 尝试 `ping <域名>`即可, 例如: `ping www.cnblogs.com`)
9. 筛选栏中改为`ip.addr == <记录下的ip地址>`
10. 大概你就可以看到你想要的了.

  ![图片03](http://zhangrunhao.oss-cn-beijing.aliyuncs.com/blog/wireshark-tcp/03.jpg)

### 大概了解tcp字段

> 具体的tcp协议的讲解, 可以参考[TCP协议](https://www.cnblogs.com/qdhxhz/p/10267932.html)

  tcp协议中的各个字段.
  这篇文章中需要用到的三个字段:

* sequence number: 序列号

  占4个字节，是本报文段所发送的数据项目组第一个字节的序号。在TCP传送的数据流中，每一个字节都有一个序号。例如，一报文段的序号为300，而且数据共100字节，则下一个报文段的序号就是400；序号是32bit的无符号数，序号到达2^32-1后从0开始.

* Acknowledgment number: 确认码

  占4字节, 是期望收到对方下次发送的数据的第一个字节的序号, 也就是期望收到的下一个报文段的首部中的序号. 确认序号应该是上次已成功收到数据字节序号+1. 只有ACK标志为1时, 确认序号才有效.

* Flag: 标志位.(共用6个标志位, 我们只看需要用的几个.)
  * ACK：只有当ACK=1时，确认序号字段才有效
  * SYN：SYN=1,ACK=0时表示请求建立一个连接，携带SYN标志的TCP报文段为同步报文段.
  * FIN：发端完成发送任务。

  ![tcp数据包的各个字段](https://pic002.cnblogs.com/images/2012/263119/2012100717254656.png)

## HTTP协议中TCP握手过程

  三次握手的简单建立过程: 所有的`TCP`链接都是通过三次握手开始的, 也就是客户端和服务器在发送应用数据之前, 发送一系列的数据包.

  ![图片](https://pic002.cnblogs.com/images/2012/263119/2012100722541987.png)

  一次完整的三次握手的过程就完成了, 客户端和服务器端的数据就可以开始传输了. 需要注意的是, 客户端一旦发送完最后一个`ACK`数据包, 就立即开始发送应用数据, 但是服务器端需要等到最后一个`ACK`包接受完成才会去响应请求.

### 抓包看`三次握手`

* 第一次握手:

  ![图片04](http://zhangrunhao.oss-cn-beijing.aliyuncs.com/blog/wireshark-tcp/04.jpg)
  客户端向服务器发出请求建立的链接, 标志为是`SYN`, 这个时候报文中的同部位`SYN=1`, 然后我们的序列号也回生成好, `seq=x`. 这个时候, 三次握手也就开始了.

* 第二次握手:

  ![图片05](http://zhangrunhao.oss-cn-beijing.aliyuncs.com/blog/wireshark-tcp/05.jpg)
  服务器收到请求, 并发送给客户端确认报文. 在确认的报文中, 标志位应该为`ACK SYN`, 因为此时还没有携带数据, 所以这个时候, `ack = seq(x, 客户端发送过来的那个) + 1`, 并在这条报文中初始化序列号, `seq = y`. 发送给客户端, 让客户端用来确认, 我们第二次握手的请求建立过程. 询问下客户端是否准备完成了.

* 第三次握手:

  ![图片06](http://zhangrunhao.oss-cn-beijing.aliyuncs.com/blog/wireshark-tcp/06.jpg)
  客户端收到服务器发送过来的第二次握手的tcp请求, 再次向服务器发送确认. 只是确认的时候, 标志为只需要是`ACK`, 同时生成确认序号: `ack = y(这里的y, 是服务器第二次握手发送过来的seq) + 1`. 这里表示客户端, 已经准备好了.

* 题外话: 为什么是三次握手, 而不是两次?

  因为在我们第一次客户端发送握手请求的时候, 会出现网络情况不好, 发了很久才给服务器. 服务器收到请求后, 就会发送确认收到. 后面就会一直傻傻等待客户端传数据过来, 其实不知道, 这条请求链接在客户端那边已经作废了. 从而造成资源的浪费.

### 抓包看`四次挥手`

  ![four-shark](https://img2018.cnblogs.com/blog/1090617/201901/1090617-20190116111104366-175362855.png)

  在实际的捕获中, 只抓到三个tcp的数据包, 有资料讲解, 服务器给客户端确认关闭, 并向客户端发起关闭请求的的链接合并成了一个. 也就是第二和第三次挥手, 都是由服务器端发送给客户端的, 这个时候合并成了一个请求.

  ![图片07](http://zhangrunhao.oss-cn-beijing.aliyuncs.com/blog/wireshark-tcp/07.jpg)

* 第一次挥手:

  ![图片08](http://zhangrunhao.oss-cn-beijing.aliyuncs.com/blog/wireshark-tcp/08.jpg)

  第一次挥手的过程, 是客户端向服务器端发起请求. 发送一个带有`FIN ACK`标志位tcp包. 我们可以看到这个时候`seq = 1; ack = 1`. 表示, 凡是带有FIN标志位的tcp包, 都是为了告诉另一端, 我再没有数据需要传递给你了.

* 第二次挥手和第三次挥手:

  ![图片09](http://zhangrunhao.oss-cn-beijing.aliyuncs.com/blog/wireshark-tcp/09.jpg)

  本来, 第二次挥手是, 服务器用来确认客户端发送过来的请求的.然后再告诉客户端, 服务器也没什么好给你的东西了. 我理解的, 这应该是一种资源的优化, 既然都是服务器发送给客户端, 如果再服务器确认之后, 确实也没有要发送的了, 就直接一起发送过去了.变成了`seq=1, ack=2`. 标志位是`FIN ACK`, 其中`ack = 2`表示确认第一次挥手.

* 第四次挥手:

  ![图片10](http://zhangrunhao.oss-cn-beijing.aliyuncs.com/blog/wireshark-tcp/10.jpg)

  这是我们的最后一次挥手过程, 由客户端向服务器发送确认过程. 标志位`ACK`, 表示, 这是一个用于确认的tcp包. 发送`ack(确认二三次挥手seq + 1) = 2`. 至此一次完整的http通信过程就全部完成了.

* 那么问题来了: 为什么是四次挥手, 而不是三次呢?

  因为, 在挥手的过程中, 第一次挥手的时候, 客户端发送向了服务器端不需要通信的请求. 服务器端通过第二次挥手确认了收到. 但并不能保证, 服务器端再没有需要给客户端发送的信息了啊. 只是表明了, 客户端没有要发送给服务器的数据了, 服务器知道了. 但是服务器没有需要给客户端的数据, 就需要通过第三次挥手来表示. 客户端回复收到. 至此才算完完全全的完成.

## HTTPS中的TCP交互过程

> 一句话概况: 通过非对称加密的方式来传递对称加密所需要的秘钥.

  我懒, 还是贴图好了(原谅我这名盗图狗), 等会我们在抓包的过程中逐步分析.

  ![https图解](https://upload-images.jianshu.io/upload_images/2111324-19f47f0a6829c6f1.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/409/format/webp)

  注意一点: `ssl / tls`的交互过程, 是在完成我们上面的三次握手开始的.

## 具体的抓包分析

> 此过程完全参考了Wireshark中关于HTTPS的操作说明.

### 步骤1: 捕获HTTPS

1. 打开一个新的浏览器窗口或者tab页.
2. 开始捕获.
3. 浏览器导航到`https://en.wikiversity.org`.
4. 停止捕获.
5. 关闭浏览器窗口或者tab页.

### 步骤2: 确定你要捕获的那个流量通道

1. 在Wireshark最上面的列表中观察捕获到的链接列表. 为了只观察HTTPS的请求, 在筛选栏中输入`ssl`, 然后回车.
2. 选择第一个带有`Client Hello`标志的TLS包.
3. 观察IP地址.
4. 为了观察所有这个链接的tcp请求, 在筛选框中输入`ip.addr == <destination>` destination是指, 我们的ip地址.

  ![图片11](http://zhangrunhao.oss-cn-beijing.aliyuncs.com/blog/wireshark-tcp/11.jpg)

说两个事:

* 为什么筛选ssl, 出现大量的tsl? tsl是以建立在sslV3.0的基础上, 两者的加密算法和MAC算法都不一样, 而协议本身差异性不大.
* 我还是感觉, 命令行, 直接ping域名, 找ip, 比较方便哎~ `ping en.wikiversity.org` 多么舒服的做法..

### 步骤3: 分析tcp数据包

1. 观察数据包列表, 看到最上面的三次握手. 也就是带有(SYN, SYN ACK, ACK)标志位的数据包.![图片12](http://zhangrunhao.oss-cn-beijing.aliyuncs.com/blog/wireshark-tcp/12.jpg)
2. 在中间的数据框中, 观察数据包的详细信息. 这里包含了, 物理层, 网络层, 传输层的详细信息.
3. 展开 Ethernet II, 查看以太网, 数据链路层的详细信息.
4. 我们可以看到本机和服务器的MAC地址.你可以使用`ipconfig /all`和`arp -a`进行确认![图片13](http://zhangrunhao.oss-cn-beijing.aliyuncs.com/blog/wireshark-tcp/13.jpg)
5. 展开`Internet Protocol Version 4`这一层, 查看网络层的详情.
6. 你可以看到你的ip地址, 和服务器的ip地址. ![图片14](http://zhangrunhao.oss-cn-beijing.aliyuncs.com/blog/wireshark-tcp/14.jpg)
7. 展开`Transmission Control Protocol`, 你可以看到传输层的详细信息.
8. 你可以看到本机提供的端口号, 和服务器的端口号(443).![图片15](http://zhangrunhao.oss-cn-beijing.aliyuncs.com/blog/wireshark-tcp/15.jpg)
9. 注意: 所有的tcp数据包, 都含有匹配的MAC地址, ip地址, 端口号.

### 步骤4: 分析`SSL/TLS`Client Hello数据包

1. 双击打开, 带有`Client Hello`标识的tsl数据包. 这里还有, 物理层, 链路层, 网络层, 传输层, 安全传输层的信息, 这里和步骤三中的各项数据保持一致.
2. 展开安全传输层, TLS和握手协议, 去查看SSL/TLS中的详细数据.
3. 可以观察到客户端支持的各种加密方式.![图片16](http://zhangrunhao.oss-cn-beijing.aliyuncs.com/blog/wireshark-tcp/16.jpg)
4. 观察下一个带有`TCP ACK`标识的tcp数据包, 那是服务器端对于收到客户端请求的回应.

### 步骤5: 分析`SSL/TLS`Server Hello数据包

1. 双击打开, 带有`Server Hello`标识的数据包.
2. 依照我们上面的经验, 应该清楚我们要观察`Secure Sockets Layer`, 也就数安全数据层.
3. 这个时候, 服务器端返回了他所支持的加密方式, 是客户端所传递的一个子集. 肯定要两边都行的嘛.![图片17](http://zhangrunhao.oss-cn-beijing.aliyuncs.com/blog/wireshark-tcp/17.jpg)

### 步骤6: 分析SSL/TLS 交换证书的阶段

1. 双击, 打开带有`Certificate, Server Key Exchange, Server Hello Done.`标识的数据包.
2. 展开`Secure Sockets Layer`, 让我们来仔细观察安全层所携带的数据.
3. 我们可以看到这一次tcp上面, tsl的数据包含了三块: 分别是: 证书, 非对称加密的公钥(Server Key), 还有一个服务器信息结束标识.
4. 我们可以看到证书提供的信息.![图片18](http://zhangrunhao.oss-cn-beijing.aliyuncs.com/blog/wireshark-tcp/18.jpg)
5. 我们还可以看到我们的公钥信息!. ![图片19](http://zhangrunhao.oss-cn-beijing.aliyuncs.com/blog/wireshark-tcp/19.jpg)
6. 客户端使用证书来验证公钥和签名. 这些工作浏览器会帮助我们进行处理.

### 步骤7: 客户端的秘钥交换

1. 双击打开, 带有`Client Key Exchange, Change Cipher Spec, Encrypted Handshake Message`标识的tcp数据包.
2. 这一次的交互中, 客户端使用公钥对将对称加密的秘钥进行加密, 并发送给了服务器.
3. 从抓包上来看: 具体过程应该是, 客户端的秘钥交换, 然后更改加密规范, 然后对与握手的信息进行了加密.(对于, tls层的操作还需要深入理解, 再次不再深究. 有希望继续学习的小伙伴, 留个言, 我们一起搞起来)
4. ![图片20](http://zhangrunhao.oss-cn-beijing.aliyuncs.com/blog/wireshark-tcp/20.jpg)

### 步骤8: 开始数据交互

* 后面就是带有`Application Data`的数据之间的传递了, 此时的数据都是经过加密的.
* 留个疑问, 有些交互过程带有`New Session Ticket.`标识的数据包, 服务器用来确定加密信息, 有些不带有, 还不是很清楚的具体原因. 有待学习, 有待学习.

## 总结

  不会的地方可真多... 文章若有错误的地方, 还望大家能够帮忙指出. 大恩不言谢, 他日以身相许.