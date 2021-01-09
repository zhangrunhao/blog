# Java笔记24 - Spring开发 - 使用AOP

* Aspect Oriented Programming: 面向切面编程

* OOP: 面向对象编程: 数据封装, 继承和多态

* 把权限作为切面(Aspect), 把日志, 事务也视为切面, 某种自动化的方式, 把切面植入到核心逻辑中, 实现Proxy模式

* 以AOP的视角来编写上述业务:
  1. 核心逻辑: BookService;
  2. 切面逻辑:
      1. 权限检查逻辑的Aspect;
      2. 日志的Aspect;
      3. 事务的Aspect;

* 让框架把上述3个Aspect以Proxy的方式"织入"到"BookService".

## AOP原理

* 三种方式AOP的织入:
  * 编译期: 在编译时, 由编译器把切面调用编译进字节码, 这种方式需要定义新的关键字并扩展编译器.
  * 类加载器: 在目标被装载到JVM时, 通过一个特殊的类加载器, 对目标类的字节码重新"增强".
  * 运行期: 目标对象和切面都是普通的Java类, 通过JVM的动态代理功能或者第三方库实现运行期动态织入.

* Spring的AOP实现是基于JVM的动态代理. 由于JVM的动态代理要求必须实现接口. 如果一个普通类没有业务接口, 就需要通过CGLB或者javassist第三方库实现.

## 装配AOP

* 主要概念
  * Aspect: 切面, 横跨多个核心逻辑的功能, 或称为系统关注点
  * Joinpoint: 连接点, 定义在应用程序的何处插入切面的执行
  * Pointcut: 切入点: 一组连接点的集合
  * Advice: 增强, 特定连接点上执行的动作
  * Introduction: 引介, 为一个已有的Java对象动态的增加新的接口
  * Weaving: 织入, 将切面整合到程序的执行流中
  * Interceptror: 拦截器, 一种实现增强的方式
  * Target Object: 目标对象, 真正执行业务的核心逻辑对象
  * AOP Proxy: AOP代理, 客户端持有的增强后的对象引用

```java
@Aspect
@Component
public class LoggingAspect {
  // 在UserService的每个方法前执行
  @Before("execution(public * com.zhangrh.spring.service.UserService.*(..))")
  public void doAccessCheck() {
    System.err.println("[Before] do access check...");
  }

  // 在MailService的每个方法前后执行
  @Around("execution(public * com.zhangrh.spring.service.MailService.*(..))")
  public Object doLooging(ProceedingJoinPoint pjp) throws Throwable {
    System.out.println("[Around] start " + pjp.getSignature());
    Object retVal = pjp.proceed();
    System.out.println("[Around] done" + pjp.getSignature());
    return retVal;
  }
}
```

* Spring容器启动时, 自动为我们创建的注入了Aspect的子类, 取代了原始的`UserService`.
  1. 使用AcpectJ解析注解
  2. 通过CGLIB实现代理类

* 使用AOP:
  1. 定义执行方法, 并在方法上通过AspectJ的注解告诉Spring应该在何处调用此方法
  2. 标记`@Component`和`@Aspect`
  3. 在`@Configuration`类上标记`@EnableAspectJAutoProxy`

* 拦截器类型:
  * @Before: 先执行拦截代码, 再执行目标代码. 如果拦截器抛出异常, 那目标代码就不执行了
  * @After: 先执行目标代码, 再执行拦截器代码, 无论目标是否异常, 拦截器代码都会执行
  * @AfterRunning: 只有当目标代码正常返回时, 才会执行
  * @AfterThrowing: 只有当目标代码抛出异常时, 才会执行
  * @Around: 能完全控制目标代码是否执行, 并可在执行前后, 抛出异常前后, 任意拦截代码, 是上面的合集.

## 使用注解装配AOP

```java
@Component
@Transactional // 所有的public都被安排
public class UserService {
  // 有事务
  @Transactional
  public User createUser(String name) {
    // ...
  }

  // 无事务
  public boolean isValidName(String name) {
    // ...
  }
}
```

* 使用`@Around("execution...")`杀伤力太大

```java
@Target(ElementType.METHOD)
@Retention(RetentionPolicy.RUNTIME)
public @interface MetricTime {
    String value();
}
@Component
@Aspect
public class MetricAspect {
  @Around("@annotation(metricTime)")
  public Object metric(ProceedingJoinPoint joinPoint, MetricTime metricTime) throws Throwable {
    String name = metricTime.value();
    long start = System.currentTimeMillis();
    try {
      return joinPoint.proceed();
    } finally {
      long t = System.currentTimeMillis() - start;
      System.out.println("[Metrics] " + name + ": " + t + "ms");
    }
  }
}

  @MetricTime("login")
  public User Login(String email, String password) {
    // ...
  }
```

## AOP避坑指南

* 无论使用AspectJ语法, 还是配合Annotation, AOP的本质都是一个代理模式
* 使得调用方无感知的调用指定方法
* **Spring通过CGLB创建的代理类, 不会初始化类自身继承的任何成员变量, 包括final类型的成员变量**
* AOP避坑指南:
  1. 访问被注入的Bean时, 总是调用方法而非直接访问字段;
  2. 编写Bean时, 如果可能被代理, 就不要编写`public final`方法
