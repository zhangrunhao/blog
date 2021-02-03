# Java笔记26 - Spring开发 - 开发Web应用

* JavaEE中Web开发的基础: Servlet
  * Servlet规范定义了一种标准组件: Servlet, JSP, Filter和Listener;
  * Servlet的标准组件总是运行在Servlet容器中, 如Tomcat, Jetty, WebLogic等
* 直接使用Servlet进行Web开发好比直接在JDBC上操作数据库, 比较繁琐
* 更好的方法是在Servlet基础上封装MVC框架, 基于MVC开发Web应用
* Spring MVC足够我们不再去集成其他的框架.

## 使用Spring MVC

* Servlet容器, 和标准的Servlet组件
  * Servlet: 能处理HTTP请求并将HTTP响应返回;
  * JSP: 一种嵌套Java代码的HTML, 将被编译为Servlet;
  * Filter: 能过滤指定URL以实现拦截功能;
  * Listener: 监听指定的事件, 如ServletContext, HttpSession的创建和销毁;

* Servlet容器为每一个web容器自动创建一个唯一的`ServletContext`实例, 这个实例代表了Web应用程序本身

## 使用REST

## 集成Filter

```xml
<web-app>
    <filter>
        <filter-name>encodingFilter</filter-name>
        <filter-class>org.springframework.web.filter.CharacterEncodingFilter</filter-class>
        <init-param>
            <param-name>encoding</param-name>
            <param-value>UTF-8</param-value>
        </init-param>
        <init-param>
            <param-name>forceEncoding</param-name>
            <param-value>true</param-value>
        </init-param>
    </filter>

    <filter-mapping>
        <filter-name>encodingFilter</filter-name>
        <url-pattern>/*</url-pattern>
    </filter-mapping>
    ...
</web-app>
```

* 问题:
  * 在Spring中创建一个`AuthFilter`是一个普通的Bean, Servlet容器不知道这个Bean的存在, 所以不会起作用
  * 如果我们直接在`web.xml`中声明这个`AuthFilter`, 注意到`AuthFilter`的实例将由Servlet容器而不是Spring容器初始化
  * 所以`Autowire`不会生效, 用于登录的`UserService`成员变量永远是null.
* 方法:
  * 让Servlet容器实例化的Filter, 间接引用Spring容器实例化的`AuthFilter`.
  * Spring MVC提供了一个`DelegatingFilterProxy`, 处理
* 原理:
  * Servlet容器从`web.xml`中读取配置, 实例化`DelegatingFilterProxy`, 注意命名`authFilter`
  * Spring容器通过扫描`@Component`实例化`AuthFilter`
  * 当`DelegatingFilterProxy`生效后, 会自动查找注册在`Servlet`上的Spring容器.
  * 再试图从容器中查找名为`authFilter`的Bean. 也就是我们用`@Component`声明的`AuthFilter`

```xml
    <filter>
        <filter-name>authFilter</filter-name>
        <filter-class>org.springframework.web.filter.DelegatingFilterProxy</filter-class>
    </filter>

    <!-- 指定Bean名字 -->
    <filter>
        <filter-name>basicAuthFilter</filter-name>
        <filter-class>org.springframework.web.filter.DelegatingFilterProxy</filter-class>
        <!-- 指定Bean的名字 -->
        <init-param>
            <param-name>targetBeanName</param-name>
            <param-value>authFilter</param-value>
        </init-param>
    </filter>

    <filter-mapping>
        <filter-name>authFilter</filter-name>
        <url-pattern>/*</url-pattern>
    </filter-mapping>
```

* 代理模式应用:

```text
┌ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ┐ ┌ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─
  ┌─────────────────────┐        ┌───────────┐   │
│ │DelegatingFilterProxy│─│─│─ ─>│AuthFilter │
  └─────────────────────┘        └───────────┘   │
│ ┌─────────────────────┐ │ │    ┌───────────┐
  │  DispatcherServlet  │─ ─ ─ ─>│Controllers│   │
│ └─────────────────────┘ │ │    └───────────┘
                                                 │
│    Servlet Container    │ │  Spring Container
 ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─   ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ┘
```

* **当一个Filter作为Spring容器管理的Bean存在时, 可以通过`DelegatingFilterProxy`简介的引用它, 并使其生效.**

## 使用Interceptor

* Filter2的拦截范围

```txt
         │   ▲
         ▼   │
       ┌───────┐
       │Filter1│
       └───────┘
         │   ▲
         ▼   │
       ┌───────┐
┌ ─ ─ ─│Filter2│─ ─ ─ ─ ─ ─ ─ ─ ┐
       └───────┘
│        │   ▲                  │
         ▼   │
│ ┌─────────────────┐           │
  │DispatcherServlet│<───┐
│ └─────────────────┘    │      │
   │              ┌────────────┐
│  │              │ModelAndView││
   │              └────────────┘
│  │                     ▲      │
   │    ┌───────────┐    │
│  ├───>│Controller1│────┤      │
   │    └───────────┘    │
│  │                     │      │
   │    ┌───────────┐    │
│  └───>│Controller2│────┘      │
        └───────────┘
└ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ┘
```

* Interceptor拦截范围: 不是后续整个处理流程, 而是仅针对Controller拦截.

```txt
       │   ▲
       ▼   │
     ┌───────┐
     │Filter1│
     └───────┘
       │   ▲
       ▼   │
     ┌───────┐
     │Filter2│
     └───────┘
       │   ▲
       ▼   │
┌─────────────────┐
│DispatcherServlet│<───┐
└─────────────────┘    │
 │              ┌────────────┐
 │              │ModelAndView│
 │              └────────────┘
 │ ┌ ─ ─ ─ ─ ─ ─ ─ ─ ┐ ▲
 │    ┌───────────┐    │
 ├─┼─>│Controller1│──┼─┤
 │    └───────────┘    │
 │ │                 │ │
 │    ┌───────────┐    │
 └─┼─>│Controller2│──┼─┘
      └───────────┘
   └ ─ ─ ─ ─ ─ ─ ─ ─ ┘
```

* 只拦截Controller方法, 返回`ModelAndView`后, 后续对View的渲染就脱离了interceptor的范围
* Interceptor好处:
  * 本身是Spring管理的Bean, 注入任意的Bean都很简单
  * 可以应用多个Interceptor, 并通过简单的`@Order`指定顺序

```java
@Order(1)
@Component
public class AuthInterceptor implements HandlerInterceptor{

  final Logger logger = LoggerFactory.getLogger(getClass());

  @Autowired
  UserService userService;

  @Override
  public boolean preHandle(HttpServletRequest request, HttpServletResponse response, Object handler) throws Exception {
    logger.info("pre authenticate {}...", request.getRequestURI());
    try {
      authenticateByHeader(request);
    } catch (Exception e) {
      logger.warn("login by authorization header failed", e);
    }
    return true;
  }

  private void authenticateByHeader(HttpServletRequest req) {
    String authHeader = req.getHeader("Authorization");
    if (authHeader != null && authHeader.startsWith("Basic ")) {
      logger.info("try authenticate by authorization header");
      String up = new String(Base64.getDecoder().decode(authHeader.substring(6)), StandardCharsets.UTF_8);
      int pos = up.indexOf(":");
      if (pos > 0) {
        String email = URLDecoder.decode(up.substring(0, pos), StandardCharsets.UTF_8);
        String password = URLDecoder.decode(up.substring(pos + 1), StandardCharsets.UTF_8);
        User user = userService.signin(email, password);
        req.getSession().setAttribute(UserController.KEY_USER, user);
        logger.info("user {} login by authorization header ok", email);
      }
    }
  }
}

  @Bean
  WebMvcConfigurer createWebMvcConfigurer(@Autowired HandlerInterceptor[] interceptors) {
    return new WebMvcConfigurer() {
      @Override
      public void addInterceptors(InterceptorRegistry registry) {
        for (HandlerInterceptor interceptor : interceptors) {
          registry.addInterceptor(interceptor);
        }
      }

      @Override
      public void addResourceHandlers(ResourceHandlerRegistry registry) {
        registry.addResourceHandler("/static/**").addResourceLocations("/static/");
      }
    };
  }
```

### 异常处理

```java
  @ExceptionHandler(RuntimeException.class)
  public ModelAndView handleUnkAndView(Exception ex) {
    return new ModelAndView("500.html", Map.of("error", ex.getClass().getSimpleName(), "message", ex.getMessage()));
  }
```

* 可以编写多个错误处理方法, 每个方法针对特定的异常.
* `LoginException`使得页面可以自动跳转到登录页.
* `ExceptionHandler`仅作用于当前的Controller,

## 处理CORS

* JavaScript和后端Api交互. 有很多安全限制.
* 默认情况下, 浏览器按同源策略放行JavaScript调用API:
  * A站在域名`a.com`页面的js调用A的api, 没问题
  * A站在域名`b.com`页面的js调用B站`b.com`的api, 被浏览器拒绝, 不满足同源策略
* 同源策略: 域名相同(a.com/www.a.com不同);协议相同(http/https不同);端口相同

* 办法: CORS: Cross-Origin Resource Sharing, HTML5规定的如何跨域访问资源
* A站的js访问B站的api时, B站能够返回响应头`Access-Control-Allow-Origin: http://a.com`. 浏览器就运行访问;
* 跨域能否成功, 取决于B站是否愿意给A站返回一个正确的`Access-Control-Allow-Origin`

### 使用@CrossOrigin

```java
@CrossOrigin(origins = "https://local.aaa.com:8080")
@RestController
@RequestMapping("/api")
public class AipController {
}
```

### 使用CorsRegistry

```java
  WebMvcConfigurer createWebMvcConfigurer(@Autowired HandlerInterceptor[] interceptors) {
    return new WebMvcConfigurer() {
      @Override
      public void addCorsMappings(CorsRegistry registry) {
        registry.addMapping("/api/**")
        .allowedOrigins("http://sugar.k.sohu.com", "https://www.baidu.com")
        .allowedMethods("GET", "POST")
        .maxAge(3600);
      }
    }
  }
```

### 使用CorsFilter

* 需要配置`web.xml`, 不推荐.

## 国际化

```java
  public static void main(String[] args) {
    double price = 123.5;
    int number = 10;
    Object[] arguments = {price, number};
    MessageFormat mfUS = new MessageFormat("Pay {0, number, currency} for {1} books.", Locale.US);
    System.out.println(mfUS.format(arguments));
    MessageFormat mfZH = new MessageFormat("{1}本书一共{0, number, currency}.", Locale.CHINA);
    System.out.println(mfZH.format(arguments));
  }
```

### 获取Locale

```java
  @Bean
  LocaleResolver createLocalResolver() {
    CookieLocaleResolver clr = new CookieLocaleResolver();
    clr.setDefaultLocale(Locale.ENGLISH);
    clr.setDefaultTimeZone(TimeZone.getDefault());
    return clr;
  }
```

* 首先根据特定的Cookie判断是否指定了`Local`
* 如果没有, 就从HTTP头获取, 如果还没有, 就返回默认的`Local`
* 用户第一次访问网帐时, `CookieLocalResolver`只能从HTTP头获取`Local`. 浏览器默认使用的语言
* 网站让用户选择自己的语言, 此时, `CookieLocaleResolver`就会把用户选择的语言存放在Cookie中.

### 提取资源文件

* 第二步: 把写死在模板中字符串以资源文件的方式存储在外部.

### 创建MessageSource

* 第三步: 创建一个Spring提供的`MessageSource`实例, 自动读取`.properties`文件.
* 并提供一个统一的接口来实现翻译

* **真费劲.. 越到后面越不想学, 越想写自己的项目.. 还有最后一节课. 搞定一个聊天室就ok了. 美滋滋**

## 异步处理

* 在Servlet模型中, 每个请求都是由某个线程处理, 然后将响应写入IO流, 发送给客户端.
* 从开始处理请求, 到写入响应完成, 都是同一个线程中处理.

* 实现Servlet容器, 只要每处理一个请求, 就创建一个新线程处理它, 就能保证正确实现了Servlet线程模型.
* 例如Tomcat, 总是通过线程池来处理请求, 仍然符合一个请求从头到尾都由某一个线程处理

* 线程模型非常重要, 因为Spring的JDBC事务是基于`ThreadLocal`实现.
* 很多安全认证也是基于`ThreadLocal`实现, 可以保证在处理请求的过程中, 各个线程互不影响.

* 如果请求处理的时间很长, 基于线程池的同步模型很快就回把所有线程耗尽, 导致服务器无法响应新的请求.
* 如果长时间处理的请求改为异步, 线程池的利用率就会大大提高.
* Servlet从3.0开始添加了异步支持, 允许对一个请求进行异步处理.

* 和不同的MVC程序相比, `web.xml`不同:
  * 声明对Servlet3.1规范的支持
  * 对`DispatcherServlet`的配置多了一个`<async-supported>`

* **配置`web.xml`**

```java
  @GetMapping("/users")
  public Callable<List<User>> users() {
    return () -> {
      try {
        Thread.sleep(3000);
      } catch (Exception e) {
      }
      return userService.getUsers();
    };
  }

  @GetMapping("/user/{id}")
  public DeferredResult<User> user(@PathVariable("id") long id) {
    DeferredResult<User> result = new DeferredResult<>(3000L); // 3秒超时
    new Thread(() -> {
      try {
        Thread.sleep(1000);
      } catch (Exception e) {
      }
      try {
        User user = userService.getQueryById(id);
        result.setResult(user);
      } catch (Exception e) {
        result.setErrorResult(Map.of("error", e.getClass().getSimpleName(), "message", e.getMessage()));
      }
    }).start();
    return result;
  }
```

* 使用`DeferredResult`, 可以设置超时, 正常结果和错误结果.

* 使用async处理异步响应时, 要牢记, 在另一个线程中的事务和Controller方法执行的事物不是同一个事务.
* 在Controller中绑定的`ThreadLocal`信息也无法在异步线程中获取.

  Servlet3.0规范添加的异步支持是针对同步模型打了一个`补丁`. 虽然可以异步处理请求, 但在高并发异步请求时, 效率不高.
  因为没有真正用到原生异步. Java标准库封装了操作系统的异步IO包`java.nio`, 是真正的多路复用IO模型, 可以用少量线程支持大量并发.
  NIO编程复杂高, 很少直接也能够. 可以选用`Netty`框架.

## 使用WebSocket

* WebSocket是一种基于HTTP的长连接技术.
* 传统的HTTP协议, 是一种`请求-响应`模型, 如果浏览器不发送请求, 那么服务器无法主动给浏览器推送数据.
* 基本靠轮询.

* HTTP本身基于TCP连接的, WebSocket在HTTP协议上做了一个简单的升级, 即建立TCP连接后, 浏览器发送请求, 附带:

```http
GET /chat HTTP/1.1
Host: www.example.com
Upgrade: websocket
Connection: Upgrade
```

* 表示客户端希望升级连接, 变成长连接的WebSocket, 服务器返回升级成功的响应:

```http
Http/1.1 101 Switching Protocols
Upgrade: websocket
Connection: Upgrade
```

* 收到成功响应后表示WebSocket握手成功, 这样, 代表WebSocket的这个TCP连接将不会被服务器关闭, 而是一直保持.

* 两步:
  * 嵌入式Tomcat支持WebSocket的组件
  * Spring封装的支持WebSocket的接口
* 加入配置

```java
  @Bean
  WebSocketConfigurer createWebSocketConfigurer(@Autowired ChatHandler chatHandler,
      @Autowired ChatHandshakeInterceptor catInterceptor) {
    return new WebSocketConfigurer() {
      @Override
      public void registerWebSocketHandlers(WebSocketHandlerRegistry registry) {
        // 把URL与指定的WebSocketHandler关联, 可关联多个
        registry.addHandler(chatHandler, "/chat").addInterceptors(catInterceptor);
      }
    };
  }
```

* 关键实现能处理`WebSocket`的handler, 和可选的WebSocket拦截器

* `TextWebSocketHandler`和`BinaryWebSocketHandler`分别处理文本消息和二进制消息.
* 我们选择文本消息作为聊天室协议, 所以`ChatHandler`继承`TextWebSocketHandler`

```java
@Component
public class ChatHandler extends TextWebSocketHandler {

  private final Logger logger = LoggerFactory.getLogger(getClass());

  @Autowired
  ChatHistory chatHistory;

  @Autowired
  ObjectMapper objectMapper;

  // 保存所有Client的WebSocket会话实例
  private Map<String, WebSocketSession> clients = new ConcurrentHashMap<>();

  // 传播消息
  public void broadcastMessage(ChatMessage chat) throws IOException {
    // 首先拿到消息
    TextMessage message = toTextMessage(List.of(chat));
    // 取到所有客户端的session id
    for (String id : clients.keySet()) {
      WebSocketSession session = clients.get(id);
      session.sendMessage(message);
    }
  }

  // 处理消息
  @Override
  protected void handleTextMessage(WebSocketSession session, TextMessage message) throws Exception {
    String s = message.getPayload().strip();
    if (s.isEmpty()) {
      return;
    }
    String name = (String) session.getAttributes().get("name");
    ChatText chat = objectMapper.readValue(s, ChatText.class);
    ChatMessage msg = new ChatMessage(name, chat.text);
    // 添加到历史记录
    chatHistory.addToHistory(msg);
    // 广播消息
    broadcastMessage(msg);
  }

  // 开启连接的时候
  @Override
  public void afterConnectionEstablished(WebSocketSession session) throws JsonProcessingException, IOException {
    // 新会话根据id放入Map
    clients.put(session.getId(), session);
    String name = null;
    // 根据session获取用户信息
    User user = (User) session.getAttributes().get("__user__");
    if (user != null) {
      name = user.getName();
    } else {
      name = initGuestName();
    }
    session.getAttributes().put("name", name);
    logger.info("websocket connection established: id = {}, name = {}", session.getId(), name);
    // 把历史消息发送给新用户
    List<ChatMessage> list = chatHistory.getHistory();
    session.sendMessage(toTextMessage(list));
    // 添加系统消息并广播
    ChatMessage msg = new ChatMessage("SYSTEM MESSAGE: ", name + " joined the room");
    chatHistory.addToHistory(msg);
    broadcastMessage(msg);
  }

  @Override
  public void afterConnectionClosed(WebSocketSession session, CloseStatus status) {
    clients.remove(session.getId());
    logger.info("websocket connection closed: id = {}, close-status = {}", session.getId(), status);
  }

  private TextMessage toTextMessage(List<ChatMessage> messages) throws JsonProcessingException {
    String json = objectMapper.writeValueAsString(messages);
    return new TextMessage(json);
  }

  private String initGuestName() {
    return "Guest" + this.guestNumber.incrementAndGet();
  }

  private AtomicInteger guestNumber = new AtomicInteger();
}
```

* 我们需要从http的session中复制信息到 websocket session

```java
@Component
public class ChatHandshakeInterceptor extends HttpSessionHandshakeInterceptor {
  public ChatHandshakeInterceptor() {
    // 指定HttpSession复制属性到WebSocketSession
    super(List.of(UserController.KEY_USER));
  }
}
```

* 浏览器中js连接websocket的方法

```js
    var ws = new WebSocket('ws://' + location.host + '/chat');
    // 连接打开
    ws.addEventListener('open', function (event) {
    });
    // 收到消息
    ws.addEventListener('message', function (event) {
    });
    // 连接关闭
    ws.addEventListener('close', function () {
    });
    // 绑定全局
    window.chatWs = ws;
```
