# Java笔记23 - Spring开发 - IoC容器

* Spring 支持快速开发Java EE的框架
* 主要模块:
  * 支持IoC和AOP的容器
  * 支持JDBC和ORM的数据访问模块
  * 支持声明式事务的模块
  * 支持基于Servlet的MVC开发
  * 支持基于Reactive的WEB开发
  * 集成JMS, JavaMail, JMX, 缓存等其他模块

* 容器:
  * 为某种特定组件的运行提供一种必要支持的一个软件环境
  * 提供需要底层服务
* Tomcat容器:
  * 为Servlet提供运行环境
  * 提供类似Http解析的底层环境
* Docker容器: 提供Linux环境, 以便运行一个Linux进程
* IoC容器:
  * 管理所有轻量级的JavaBean组件
  * 组件生命周期管理
  * 配置和组装服务
  * AOP支持
  * AOP基础上的声明式事务服务

## IoC原理

* Inversion of Control: 控制反转

* 在线书城例子:
  1. `BookServices`和`UserServices`, 都需要读取配置, 实例化`Config`, 根据配置, 实例化`DataSource`;
  2. `BookServices`和`UserServices`可以共享一个`DataSource`; `CarServlet`和`HistoryServlet`也可以共享一个`BookServices`和`UserServices`. 谁来创建, 谁来使用, 不好处理.
  3. 很多组件需要销毁, 以便释放资源.例如`DataSource`, 如果确保使用方已经全部销毁, 不好处理.
  4. 组件越来越多, 共享的组件会越来越复杂.
  5. 测试某个组件是复杂的, 必须在真是的数据库环境下运行.
* *传统开发: 生命周期与相互之间的依赖关系如果组件自己维护, 增加系统的复杂度, 导致组件之间极为耦合, 给测试和维护带来复杂*
* 核心问题:
  1. 谁负责创建组件?
  2. 谁负责根据依赖关系组装组件?
  3. 销毁时, 如何按照依赖关系正确销毁?
* **使用IoC解决问题: 组件的创建, 装配控制权从组件本身移动到容器中**

* 使用注入机制: 进行组件装配

```java
public class BookServices {
  private DataSource dataSource;
  public void setDataSource(DataSource dataSource) {
    this.dataSource = dataSource;
  }
}
```

* 好处:
  1. `BookServices`不再关系如何创建`DataSource`, 因此不必编写数据库配置之类的
  2. `DataSource`实例被注入到`BookServices`, 也可以被注入到`UserServices`, 共享一个组件变得非常简单
  3. 测试`BookServices`非常简单, 因为是注入的`DataSource`, 可以使用内存数据库, 而不是真是的MySQL配置

* IoC依赖注入: 将组件的创建配置和使用相分离, 并且由IoC容器负责管理组件的生命周期.
* 使用XML文件声明: 容器如何创建组件, 以及组件见的依赖关系.

```xml
<beans>
  <bean id="dataSource" class="HiDataSource" />
  <bean id="bookServices" class="bookServices">
    <property name="dataSource" ref="dataSource" />
  </bean>
  <bean id="userServlet" class="UserServices">
    <property name="dataSource" ref="dataSource" />
  </bean>
</beans>
```

* 声明创建三个JavaBean组件, 并把id为`dataSource`组件, 通过属性`dataSource`(即调用setDataSource()方法)注入到另外两个组件
* 所有的组件都称为JavaBean, 配置一个组件就是配置一个Bean

### 依赖注入方式

* 可以通过`set()`方法实现
* 也可以通过构造方法实现

```java
public class BookServices {
  private DataSource dataSource;
  public BookServices(DataSource dataSource) {
    this.dataSource = dataSource;
  }
}
```

### 无入侵容器

* 应用程序无需实现Spring的特定接口, 组件不知道自己在Spring的容器中运行.
* 好处:
  * 应用程序既可以在Spring的IoC容器中运行, 也可以自己编写代码自己组装.
  * 测试的时候, 并不依赖Spring容器, 可单独进行测试, 大大提高开发效率.

## 装配Bean

* 每个`<bean ...>`都有一个`id`标识, 相当于Bean的唯一ID;
* 在`userService`Bean中, 通过`<property name="..." ref="...">`注入了另一个Bean;
* Bean的顺序并不重要, Spring根据依赖关系会自动正确初始化;

* **Spring容器通过读取XML文件后, 使用反射完成*

* 使用spring框架操作

* `ClassPathXmlApplicationContext`自动从classpath中查找指定的XML的配置文件

```java
public class Main {

  public static void main(String[] args) {
    // 创建一个Spring的IoC容器, 然后配置加载文件
    // 让Spring容器为我们创建并装配好配置文件中指定的所有Bean
    ApplicationContext context = new ClassPathXmlApplicationContext("application.xml");
    // 获取Bean:
    UserService userService = context.getBean(UserService.class);
    // 正常调用
    User user = userService.Login("bob@example", "password");
    System.out.println(user.getName());
  }
}
```

* Spring还可以通过另一种IoC容器叫做`BeanFactory`

## 使用Annotation配置

```java
@Component // 声明一个bean
public class UserService {
  @Autowired // 自动注入
  private MailService mailService;

  public void setMailService(@Autowired MailService mailService) { // 自动注入
    this.mailService = mailService;
  }
}
```

* 一般写在字段上, 通常使用package权限字段, 以便测试

```java
/**
 * AppConfig
 */
@Configuration // 配置类
@ComponentScan // 自动搜索当前类所在的包以及子包
public class AppConfig {
  public static void main(String[] args) {
    ApplicationContext context = new AnnotationConfigApplicationContext(AppConfig.class);
    UserService userService = context.getBean(UserService.class);
    User user = userService.Login("bob@example.com", "password");
    System.out.println(user.getName());
  }
}
```

* 使用注解方式大大简化Spring的配置
  * 每个Bean被标注为`@Component`并正确使用`@Autowired`注入;
  * 配置类被标注为`@Configuration`和`@ComponentScan`;
  * 所有Bean均在指定包以及子包内.
  * 配置`AppConfig`位于自定义的顶层包

## 定制Bean

### Scope

* 对于Spring容器来说, 一个Bean标记为`Component`后, 会自动创建一个单例(Singleton)
* 容器初始化时创建Bean, 容器关闭前销毁Bean
* 容器运行期间调用`getBean(Class)`获取到的Bean总是一个实例

* 使用`@Scope`注解, 声明一个Prototype的Bean时, 每次调用`getBean(Class)`每次都会返回一个新的实例

```java
@Component
@Scope(ConfigurableBeanFactory.SCOPE_PROTOTYPE) //  @Scope("prototype")
public class MailSession {
  
}
```

### 注入List

* 自动把所有的类型为`Validator`的Bean装配为一个List注入进来

```java
@Component
public class Validators {
  @Autowired
  List<Validator> validators;

  public void validate(String email, String password, String name) {
    for (Validator validator: validators) {
      validator.validate(email, password, name);
    }
  }
}
```

* Spring是扫描classpath获得到所有的Bean, 而List是有序的, 可以通过`@Order`注解写明

```java
@Component
@Order(1)
public class EmailValidator implements Validator{

  @Override
  public void validate(String email, String password, String name) {
    if (!email.matches("^[a-z0-9]+\\@[a-z0-9]+\\.[a-z]{2,10}$")) {
      throw new IllegalArgumentException("invalid email: " + email);
    }
  }
  
}
```

### 可选注入

* `@Autowired(required = false)`如果找到了, 就注入, 没找到, 就忽略.

### 创建第三方Bean

* Bean不再我们自己的package管理之内, 在`@Configuration`类中编写Java方法创建并返回

```java
@Configuration
@ComponentScan
public class AppConfig {
  @Bean // 创建一个Bean, 这里的Bean是单例模式
  ZoneId createZoneId() {
    return ZoneId.of("Z");
  }
}
```

### 初始化和销毁

* 首先引入注解标准

```xml
<dependency>
    <groupId>javax.annotation</groupId>
    <artifactId>javax.annotation-api</artifactId>
    <version>1.3.2</version>
</dependency>
```

```java
  @PostConstruct
  public void init() {
    System.out.println("Init mail service with zoneId = " + this.zoneId);
  }

  @PreDestroy
  public void shutdown() {
    System.out.println("Shut mail service");
  }
```

* Spring容器对Bean初始化流程:
  1. 调用构造方法创建`MailService`流程
  2. 根据`@Autowired`进行注入
  3. 调用标记有`PostConstruct`的`init()`方法进行初始化

* Spring只根据Annotation查找无参数方法, 对方法名不作要求

### 使用别名

* 对于同一种Bean, 容器只能创建一实例, 某些情况下, 我们需要对同一种类型的Bean创建多个实例.

```java
  @Bean("z")
  @Primary // 定义为主要Bean
  ZoneId createZoneOfZ() {
    return ZoneId.of("Z");
  }

  @Bean
  @Qualifier("UTC8")
  ZoneId createZoneOFUTC8() {
    return ZoneId.of("UTC+08:00");
  }


  @Autowired
  @Qualifier("z")
  private ZoneId zoneId;

```

### 使用FactoryBean

* 可以定义个工厂, 然后由工厂创建真正的Bean

```java
@Component
public class ZoneIdFactoryBean implements FactoryBean<ZoneId>{

  String zone = "Z";

  @Override
  public ZoneId getObject() throws Exception {
    return ZoneId.of(zone);
  }

  @Override
  public Class<?> getObjectType() {
    return ZoneId.class;
  }
}
```

* Bean实现了FactoryBean接口后, Spring会先实例化这个工厂, 然后调用`getObject()`创建真正的Bean.
* `getObjectType()`可以指定创建的Bean的类型, 因为指定类型不一定和实际类型一致, 可以是接口或者抽象类.

## 使用Resource

* 使用Spring容器, 我们可以把配置文件, 资源文件等注入进来, 方便使用

```java
@Component
public class AppService {

  // Value("file:/path/to/logo.txt")
  @Value("classpath:/logo.txt")
  private Resource resource;

  private String logo;

  @PostConstruct
  public void init() throws IOException {
    try (BufferedReader reader = new BufferedReader(
      new InputStreamReader(
        resource.getInputStream(),
        StandardCharsets.UTF_8
      )
    )) {
      this.logo = reader.lines().collect(Collectors.joining("\n"));
      System.out.println(this.logo);
    }
  }
}
```

## 注入配置

* 通告注解写到方法参数中

```java
@Value("${app.zone:Z}")
String zoneId;

@Bean
ZoneId createZoneId(@Value("${app.zone:Z}") String zoneId) {
    return ZoneId.of(zoneId);
}
```

* 通告简单的JavaBean持有

```java
@Component
public class SmtpConfig {
    @Value("${smtp.host}")
    private String host;

    @Value("${smtp.port:25}")
    private int port;

    public String getHost() {
        return host;
    }

    public int getPort() {
        return port;
    }
}

// 进行读取
@Component
public class MailService {
    @Value("#{smtpConfig.host}")
    private String smtpHost;

    @Value("#{smtpConfig.port}")
    private int smtpPort;
}
```

## 使用条件装配

* Spring容器根据`@Profile`来决定是否创建:
* 三种环境
  * native: 开发
  * test: 测试
  * producation: 生产

* 程序运行时, 加上JVM蚕食, 可以指定启动方法
* 并可以表示使用`test`环境, `master`分支代码

```shell
-Dspring.profiles.active=test,master
```

### 使用Conditional

```java

public class OnSmtpEnvCondition implements Condition {

  @Override
  public boolean matches(ConditionContext context, AnnotatedTypeMetadata metadata) {
    return false;
  }
  
}

@Component
@Conditional(OnSmtpEnvCondition.class)
public class MailService {
}
```
