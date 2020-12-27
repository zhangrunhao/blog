# Java笔记22 - Web开发

* JavaEE: Java Platform Enterprise Edition Java企业平台
* 并不是一个软件产品, 更多的是一种软件架构和设计思想. 可以把JavaEE看作是在JavaSE的基础上, 开发的一系列基于服务器的组件, API标准和通用架构.
* JavaEE最核心的组件就是基于Servlet标准的Web服务器, 开发者编写的应用程序是基于Servlet API并运行在Web服务器内部的.

## Web基础

* 访问网站, 使用App时, 都是基于Web这种Browser/Server模式, 简称BS架构.
  * 只需要浏览器, 应用程序的逻辑和数据都存在服务器.
  * 浏览器只需要请求服务器, 获取Web页面, 并把Web页面展示给用户即可.
  * Web页面由HTML编写, 具有极强的交互性和表现力.
  * 服务器升级后, 客户端无需任何部署便可以得到新版本.

### Http协议

* 在Web应用中, 浏览器请求一个URL, 服务器就把生成的HTML网页发送给浏览器, 浏览器和服务器之间的传输协议是HTTP
* HTTP是一种基于TCP协议之上的请求-响应协议.
* 请求页面流程:
  1. 与服务器建立TCP连接;
  2. 发送HTTP请求
  3. 收取HTTP响应, 然后把网页在浏览器中显示出来

* 看请求
  * 第一行表示使用`GET`请求获取路径为`/`的资源, 并使用的协议版本.
  * 第二行开始以Header: Value形式表示的HTTP头. 常见的.
  * Host: 表示请求的主机名, 因为一个服务器上可能运行着多个网站, 因此Host表示浏览器正在请求的域名.
  * User-Agent: 表示客户端本身. 可以知道浏览器的不同版本.
  * Accept: 表示浏览器能接受的类型, 例如`text/*`, `image/*`等.
  * Accept-language: 表示浏览器偏好的语言, 服务器可以据此返回不同语言的网页.
  * Accept-Encoding: 表示浏览器可以支持的压缩类型, 例如`gzip, br`等
* 看响应
  * 第一行表示: 版本号+响应代码+响应文本, 常见响应代码:
    * 200 OK: 表示成功
    * 301 Moved Permanently:  表示URL已经永久重定向
    * 302 Found: 表示URL需要临时重定向
    * 304 Not Modified: 表示该资源没有更改, 可以使用本地缓存的版本.
    * 400 Bad Request: 客户端发送了一个错误的请求, 例如无效的参数.
    * 401 Unauthorized: 表示客户端因为身份未验证而不允许访问该URL
    * 403 Forbidden: 表示服务器因为权限问题拒绝了客户端的请求.
    * 404 Not Found: 表示客户端请求了一个不存在的资源.
    * 500 Internal Server Error: 表示服务器处理时内部出错, 例如无法连接数据库.
    * 503 Service Unavailable: 表示服务器此刻暂时无法处理请求.
  * 第二行开始, 每一行返回HTTP头
  * Content-Type: 表示该响应内容的类型, 例如`text/html`等
  * Content-Length: 表示响应内容的长度
  * Content-Encoding: 表示响应压缩算法.
  * Cache-Control: 指客户端如何缓存, 例如: `max-age=300`表示最多缓存300毫秒.

* Http请求和响应都由HTTP Header和HTTP Body构成, 其中HTTP Header每行都以`\r\n`结束.
* 如果遇到两个连续的`\r\n`, 那么后面就是HTTP Body.

## Servlet入门

* 编写完整的HTTP服务非常复杂
* 在JavaEE平台上, 处理TCP连接, 解析HTTP协议这些底层工作统统扔给现成的Web服务器处理
* 我们只需要把自己的应用程序跑在Web服务器上
* JavaEE提供了Servlet API. 我们使用Servlet API编写自己的Servlet来处理HTTP请求.
* Web服务器实现Servlet API接口, 实现底层功能.

```json
                 ┌───────────┐
                 │My Servlet │
                 ├───────────┤
                 │Servlet API│
┌───────┐  HTTP  ├───────────┤
│Browser│<──────>│Web Server │
└───────┘        └───────────┘
```

* 编写的Servlet并不是直接运行, 而是由Web服务器加载后创建实例运行.
* Servlet容器中的Servlet有以下特点:
  * 无法在代码中直接通过new创建Servlet实例, 必须由Servlet容器自动创建Servlet实例
  * Servlet容器只会给每个Servlet类创建唯一实例
  * Servlet容器会使用多线程执行`doGet()`或`doPost()`方法.
* 结合对线程
  * 在Servlet中定义的实例变量会被多个线程同时访问, 要注意线程安全
  * `HttpServletRequest`和`HttpServletResponse`实例是由Servlet容器传入的局部变量, 它们只能被当前线程访问, 不存在多个线程访问的问题
  * 在`doGet()`或`doPost()`方法中, 如果使用了`ThreadLocal`, 但没有清理, 那么它的状态很可能影响到下次的某个请求. 因为*Servlet很可能用线程池实现线程复用*
* **编写正确的Servlet, 要清晰理解Java多线程模型, 需要同步访问的必须同步访问**

## Servlet开发

* 启动Tomcat的流程
  * 启动JVM并执行Tomcat的`main()`方法
  * 加载war并初始化Servlet;
  * 正常服务.

* **直接vscode一把梭, 以后遇到情况再说**

## Servlet进阶

* 一个Web App由一个或多个Servlet组成, 每个Servlet通过注解说明自己能处理的路径.
* 处理不同的请求方法使用覆写`doGet()`等
* 如果请求的方法没有进行处理, 会直接返回405或者500错误.
* 一个Servlet如果映射到`hello`, 那么所有的请求方法都会被这个Servlet处理, 至于能不能返回200, 需要看方法有没有被覆写.

```java
@WebServlet(urlPatterns = "/hello") 
public class HelloServlet extends HttpServlet {
  @Override
  protected void doGet(HttpServletRequest req, HttpServletResponse resp ) {
    // ...
  }
}
```

* 浏览器发出的请求首先被Web Servlet先接受.
* 然后根据Servlet映射, 不同路径转发到不同的Servlet:

```json
               ┌ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ┐

               │            /hello    ┌───────────────┐│
                          ┌──────────>│ HelloServlet  │
               │          │           └───────────────┘│
┌───────┐    ┌──────────┐ │ /signin   ┌───────────────┐
│Browser│───>│Dispatcher│─┼──────────>│ SignInServlet ││
└───────┘    └──────────┘ │           └───────────────┘
               │          │ /         ┌───────────────┐│
                          └──────────>│ IndexServlet  │
               │                      └───────────────┘│
                              Web Server
               └ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ┘
```

* 根据路径进行转发的功能, 称为Dispatch
* `/`比较特殊, 会匹配所有路径, 所以使用伪代码进行匹配, `else`的最后一个走`\`路径

### HttpServletRequest

* 封装了HTTP请求, 从`Servlet`集成而来.
* 除了HTTP请求外, 没有其他协议会使用Servlet处理. 这是一个过度设计

* 常用方法:
* getMethod(): 请求方法
* getRequestUrl(): 请求路径, 不包括请求参数
* getQueryString(): 请求参数
* getParameter(name): 请求参数, get方法从url中读取, post从body中读取
* getContentType(): Body的类型
* getContentPath(): 获取Webapp挂载的路径
* getCookies(): 请求携带的所有Cookie
* getHeader(name): 获取指定header, 对Header名称不区分大小写
* getHeaderNames(): 返回所有的Header名称
* getInputStream(): 如果请求带有HTTP Body, 打开一个输入流读取Body
* getReader():
* getRemoteAddr(): 返回客户端的ip地址
* getScheme(): 返回协议类型

### HttpServletResponse

* 封装了一个HTTP响应.
* HTTP响应必须先发送Header, 再发送Body.
* 所以, 必须先设置Header方法, 再调用发送Body方法

* 常用方法:
* setStatus(sc): 设置响应代码. 默认`200`
* setContentType(type): 设置body类型, 例如`text/html`
* setCharacterEncoding(charset): 设置字符编码, 例如`UTF-8`
* setHeader(name, value): 设置一个Header的值
* addCookie(cookie): 给响应添加一个Cookie
* addHeader(name, value): 给响应添加一个Header, 因为HTTP协议允许有多个相同的Header

* 写入响应时, 需要通过`getOutputStream()`获取写入流, 或者通过`getWriter()`获取字符流
* 写入响应前, 无需设置`setContentLength()`, 因为底层服务器会根据写入字节数自动设置.
* 写入的数量小, 会先写入缓存区, 如果写入的数据量大, 服务器会自动采用Chunked编码让浏览器能识别数据结束符而不需要设置Content-Length头
* 写入完毕后, 调用`flush()`是必须的.
* 写入完毕后, 不能调用`close()`方法, 因为会复用TCP()连接, 关闭写入流, 将关闭TCP连接.

* 使用`HttpServletRequest`, `HttpServletResponse`, 两个高级接口, 我们不需要直接处理HTTP协议.
* 具体的实现类由服务器提供, 我们编写的Web应用程序只关心接口方法, 不关系具体实现的子类.

### Servlet多线程模型

* 一个Servlet类在服务器中只有一个实例. 对于每个HTTP请求, Web服务器会使用多线程执行请求.
* 因此, 一个Servlet的`doGet()`, `doPost()`等方法是多线程并发执行的.
* 如果Servlet中定义了字段, 要注意多线程并发访问的问题.
* `HttpServletRequest`, `HttpServletResponse`是唯一实例, 只在当前线程中有效, 总是局部变量, 不存在多线程共享的问题

### 重定向和转发

#### Redirect

* 重定向: 当浏览器请求一个URL时, 服务器返回一个重定向指令, 告诉浏览器地址已经变了, 麻烦使用新的URL再重新发送请求
* `302`: 临时重定向.
* `301`: 永久重定向. 浏览器会缓存重定向的关联.

#### Forward

* 内部转发. 当一个Servlet处理请求的时候, 可以决定自己不继续处理, 而是转发给另一个Servlet处理

```java
req.getRequestDispatcher("/hello").forward(req, resp);
```

* 自己不发送响应, 而是把请求和响应都转发给路径为`\hello`的Servlet
* 转发和重定向的区别在于: 转发在服务器内部完成, 对浏览器来说只是一个HTTP请求

### 使用Session和Cookie

* 在Web应用程序中, 我们需要跟踪用户身份.
* HTTP是一个无状态协议. Web应用程序无法区分收到两个HTTP请求是否同一个浏览器发出.
* 为了跟踪用户状态, 服务器可以向浏览器分配一个唯一ID, 并以Cookie的形式发送到浏览器.
* 浏览器再后续访问时总是附带此Cookie, 这样, 浏览器就可以识别用户身份了.

#### Session

* Session: 基于唯一ID识别用户身份的机制.
* 每个用户第一次访问服务器, 会自动获得一个Session ID.
* 如果用户在一段时间内没有访问服务器. Session ID自动失效, 下次及时带着上次分配的Session ID访问, 服务器也会认为是新用户, 重新分配Session ID
* Servlet内置了对Session支持.

* 我们总是通过`HttpSession`访问当前Session.
* Web服务器自动维护了一个id到`HttpSession`的映射表
* 服务器识别Session依靠一个名为`JSESSIONID`的Cookie.
* 第一次调用`getSession()`的时候, 自动创建一个Session ID, 然后通过`JSESSIONID`的`Cookie`发送给浏览器

* `JESSIONID`是由Servlet容器自动创建的, 目的是维护一个浏览器会话, 和我们的登录逻辑没有关系
* 登录和登出的业务逻辑是我们自己根据`HttpSession`是否存在一个`user`的key判断的, 登出后, SessionId并不会改变.
* 即使没有登录功能, 仍然可以使用`HttpSession`追踪用户, 例如, 放入一些用户配置信息等
* 使用Session时, 服务器会把所有用户的Session都存储在内存中, 如果遇到内存不足的情况, 就需要把部分不活动的Session序列化到磁盘上. 会降低服务器运行效果, 因此, 放入的Session要小, 通常放入一个简单的`User`就足够了.

```java
public class User {
  public long id; // 唯一标识
  public String email;
  public String name;
}
```

* 使用多台服务器构成集群时, 使用Session会遇到一些额外的问题. 通常, 多台服务器集群使用反向代理作为网站入口.
* 如果多台Web Sever采用无状态集群, 那么反向代理总是以轮询的方式依次将请求转发给每台Web Server.
* 这会造成一个用户Web Sever1存储的Session信息, 在Web Server2和Web Server3上并不存在.
* 如果登录了1机器, 那么后续请求转发到2和3上, 仍然是无状态的
* 解决方法:
  * 每一天Web Server之间进行Session复制, 会严重消耗网路带宽, 并且内存使用率低
  * 采用粘置会话(Sticky Session)机制, 即反向返回代理在转发请求的时候, 总是根据JSESSIONID的值判断, 相同的JSESSIONID总是转发到固定的Web Server, 需要反向代理支持.
  * **无论使用哪种方法, Session机制会使得Web Sever的集群很难扩展. 中小型Web应用使用Session, 大型WEB应用程序避免使用Session机制**

#### Cookie

* Cookie我们可以任意使用

```java

  protected void doGet(HttpServletRequest req, HttpServletResponse resp) throws IOException {
    String lang = req.getParameter("lang");
    if (LANGUAGE.contains(lang)) {
      // 创建一个新的Cookie
      Cookie cookie = new Cookie("lang", lang);
      // 该Cookie生效的范围路径:
      cookie.setPath("/");
      // 设置有效期
      cookie.setMaxAge(10000);
      // cookie添加到响应
      resp.addCookie(cookie);
    }
    resp.sendRedirect("/");
  }
```

* 是否携带Cookie, 取决于以下条件:
  * URL前缀是设置Cookie时的Path
  * Cookie在有效期
  * Cookie设置了secure时, 必须以https访问

## JSP开发

* Java Server Page: 文件放到/src/main/webapp下
* 文件名以`.jsp`结尾

* 包含在<%-- --%>之间的是JSP注释
* 包含在<% %>之间的是Java代码, 可以编写任意Java代码
* 如果使用<%= xxx%>可以快捷输出一个变量

* 内置变量: 可以直接使用
  * out: 表示HttpServletResponse的PrintWriter
  * session: 表示当前HttpSession对象
  * request: 表示HttpServletRequest对象

* 使用完整路径, 直接访问

* JSP和Servlet没有任何区别, jsp文件首先被编译成一个Servlet.
* 可以在tomcat临时目录下找到这个文件

### JSP高级功能

* jsp指令非常复杂

```jsp
<%@ page import="java.io.*" %>
<%@ page import="java.util.*" %>
```

* 使用`include`指令可以引入另一个JSP文件

## MVC开发

* Model-View-Controller
* Controller专注业务处理, 处理的结果就是Model
* Model可以是JavaBean, 也可以是一个包含多个对象的Map, Controller负责把Model传递给View
* View只是负责吧Model给渲染出来.

## MVC高级开发

* 希望MVC框架可以做的事情
  * 如果是GET方法, 直接把URL参数按照方法参数对应起来然后传入
  * 如果是POST方法, 直接把POST参数变成一个JavaBean后通过方法传入
  * Controller的方法, 在需要使用`HttpServletRequest`, `HttpServletResponse`, `HttpSession`这些实例时, 只要有方法参数定义, 就可以自动传入

```json
   HTTP Request    ┌─────────────────┐
──────────────────>│DispatcherServlet│
                   └─────────────────┘
                            │
               ┌────────────┼────────────┐
               ▼            ▼            ▼
         ┌───────────┐┌───────────┐┌───────────┐
         │Controller1││Controller2││Controller3│
         └───────────┘└───────────┘└───────────┘
               │            │            │
               └────────────┼────────────┘
                            ▼
   HTTP Response ┌────────────────────┐
<────────────────│render(ModelAndView)│
                 └────────────────────┘
```

* **这一节涉及太多东西了, 没有搞明白, 会再单独学习一次**

## 使用Filter

* Filter插件, 过滤器, 在HTTP请求到到Servlet之前, 可以被一个或多个Filter预处理.
* 例如: 打印日志, 登录检查等

```java
@WebFilter(urlPatterns = "/*")
public class EncodingFilter implements Filter {

  @Override
  public void doFilter(ServletRequest request, ServletResponse response, FilterChain chain) throws IOException, ServletException {
    System.out.println("EncodingFilter:doFilter");
    request.setCharacterEncoding("UTF-8");
    response.setCharacterEncoding("UTF-8");
    chain.doFilter(request, response);
  }
}
```

* 使用`@WebFilter`注解标注Filter需要过滤的URL
* 无法对标注的Filter规定顺序. 只能在`web.xml`文件中, 再对这些Filter再标注一遍

```java
@WebFilter(urlPatterns = "/user/*")
public class AuthFilter implements Filter {

  @Override
  public void doFilter(ServletRequest request, ServletResponse response, FilterChain chain)
      throws IOException, ServletException {
    System.out.println("AuthFilter: check authentication");
    HttpServletRequest req = (HttpServletRequest) request;
    HttpServletResponse resp = (HttpServletResponse) response;
    if (req.getSession().getAttribute("name") == null) {
      // 未登录, 跳转到登录页
      System.out.println("AuthFilter: not signin!");
      resp.sendRedirect("/signin");
    } else {
      // 已登录, 继续处理
      chain.doFilter(request, response);
    }
  }

}
```

* 可以对指定路径进行拦截
* 如果没有进行`chain.doFilter()`, 返回200+空白页
* 统一的Servlet入口, 配合多个Controller, Filter仍然正常工作. 可以针对不同的请求进行拦截.

### 修改请求

```java
@WebFilter(urlPatterns = "/upload/*")
public class ValidateUploadFilter implements Filter {

  @Override
  public void doFilter(ServletRequest request, ServletResponse response, FilterChain chain) throws IOException, ServletException {
    HttpServletRequest req = (HttpServletRequest) request;
    HttpServletResponse resp = (HttpServletResponse) response;
    // 获取客户端传入的签名方法和签名:
    String digest = req.getHeader("Signature-Method");
    String signature = req.getHeader("Signature");
    if (digest == null || digest.isEmpty() || signature.isEmpty()) {
      sendErrorPage(resp, "Missing signature");
      return;
    }
    // 读取request的body, 并验证签名
    MessageDigest md = getMessageDigest(digest);
    InputStream input = new DigestInputStream(request.getInputStream(), md);
    ByteArrayOutputStream output = new ByteArrayOutputStream();
    byte[] buffer = new byte[1024];
    for (;;) {
      int len = input.read(buffer);
      if (len == -1) break;
      output.write(buffer, 0, len);
    }
    String actual = toHexString(md.digest());
    if (!signature.equals(actual)) {
      sendErrorPage(resp, "Invalid signature");
      return;
    }

    // 验证成功后, 继续处理:
    chain.doFilter(new ReReadableHttpServletRequest(req, output.toByteArray()), response);

  }
  
  // 将byte[] 转换为hex string:
  private String toHexString(byte[] digest) {
    StringBuilder sb = new StringBuilder();
    for (byte b : digest) {
      sb.append(String.format("%02x", b));
    }
    return sb.toString();
  }

  private MessageDigest getMessageDigest (String name) throws ServletException {
    try {
      return MessageDigest.getInstance(name);
    } catch (Exception e) {
      throw new ServletException(e);
    }
  }

  private void sendErrorPage(HttpServletResponse response, String errorMessage) throws IOException {
    response.setStatus(HttpServletResponse.SC_BAD_REQUEST);
    PrintWriter pw = response.getWriter();
    pw.write("<html><body><h1>");
    pw.write(errorMessage);
    pw.write("</h1></body></html>");
    pw.flush();
  }

}
```

### 修改响应

```java
@WebFilter("/slow/*")
public class CacheFilter implements Filter {

  // Path到byte[]的缓存:
  private Map<String, byte[]> cache = new ConcurrentHashMap<>();


  @Override
  public void doFilter(ServletRequest request, ServletResponse response, FilterChain chain)
      throws IOException, ServletException {
    HttpServletRequest req = (HttpServletRequest) request;
    HttpServletResponse resp = (HttpServletResponse) response;
    // 获取path
    String url = req.getRequestURI();
    // 获取缓存内容
    byte[] data = this.cache.get(url);
    resp.setHeader("X-Cache-Hit", data == null ? "No" : "Yes");
    if (data == null) {
      // 缓存未找到, 构造一个伪造的Response
      CachedHttpServletResponse wrapper = new CachedHttpServletResponse(resp);
      // 让上下游组件写入数据到伪造的Response
      chain.doFilter(request, wrapper);
      // 从伪造的Response中读取写入的内容并放入缓存
      data = wrapper.getContent();
      cache.put(url, data);
    }
    // 写入到原始的Response
    ServletOutputStream output = resp.getOutputStream();
    output.write(data);
    output.flush();
  }

}
```

## 使用Listener

> 监听器, 最常用的: ServletContextListener

```java
@WebListener
public class AppListener implements ServletContextListener{
  @Override
  public void contextInitialized(ServletContextEvent sce) {
    System.out.println("Webapp initialized");
  }

  @Override
  public void contextDestroyed(ServletContextEvent sce) {
    System.out.println("Webapp destroyed");
  }
}
```

* 任何标注了`@WebListener`, 且实现了特定接口的类, 都会被Web服务器自动初始化.
* 会在Web程序启动的时候, 和Web程序关闭的时候, 进行启动

* 其他的监听器
  * HttpSessionListener: 监听HttpSession的创建和销毁
  * ServletListener: 监听ServletRequest的创建和销毁
  * ServletRequestAttributeListener: 监听ServletRequest请求的属性变化事件. (即调用ServletRequests.setAttribute)
  * ServletContextAttributeListener: 监听ServletContext的属性变化事件. (即调用ServletContext.setAttribute)

### ServletContext

* 一定Web服务器可以运行一个或者多个WebApp, 对于每个WebApp, Web服务器都会创建一个全局的唯一的`ServletContext`实例, 我们在`AppListener`调用的方法, 实际上是`ServletContext`的创建和销毁
* ServletRequest, HttpSession等对象, 通过`getServletContext()`获取到的是同一个.
* 最大的作用是设置和共享全局信息
* 还可以动态的添加`Servlet`, `Filter`, `Listener`方法

## 部署

* Servlet中的映射是`\`会自动屏蔽, 静态文件的`Servlet`映射

```json
             ┌ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ┐

             │  /static/*            │
┌───────┐      ┌──────────> file
│Browser├────┼─┤                     │    ┌ ─ ─ ─ ─ ─ ─ ┐
└───────┘      │/          proxy_pass
             │ └─────────────────────┼───>│  Web Server │
                       Nginx
             └ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ┘    └ ─ ─ ─ ─ ─ ─ ┘
```

* Nginx服务器用作反向代理和静态服务器
