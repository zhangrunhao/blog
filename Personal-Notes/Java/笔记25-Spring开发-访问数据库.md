# Java学习笔记 - Spring - 访问数据库

* 使用JDBC虽然简单, 但代码比较繁琐. Spring简化了数据库访问:
  * 提供了简化的JDBC的模板类, 不必动手释放资源;
  * 提供了一个统一的DAO类以实现Data Access Object模式;
  * 把`SQLException`封装为`DataAccessException`, 这个异常是一个`RuntimeException`, 并且能够让我们能区分SQL异常的原因;
  * 能方便地集成Hibernate, JPA和MyBatis这些数据库访问框架

## 使用JDBC

* java使用JDBC访问数据库步骤:
  1. 创建全局`DataSource`实例, 表示数据库连接池
  2. 通过`Connection`实例创建`PreparedStatement`实例
  3. 执行SQL语句, 如果是查询, 则通过`ResultSet`读取结果集, 如果是修改, 获取`int`结果
* *关键使用`try...finally...`释放资源, 涉及到事务的代码需要正确提交或回滚事物*

* 在Spring使用JDBC
  1. 首先通过IoC容器创建并管理一个`DataSource`实例
  2. 然后Spring提供了一个`JdbcTemplate`, 可以方便地让我们操作JDBC
  3. 通常情况下, 我们会实例化一个JdbcTemplate. 主要使用了`Template`模式

```java
@Component
public class UserService {
  @Autowired
  JdbcTemplate jdbcTemplate;

  // 提供了jdbc的`Connection`使用
  public User getUserById(long id) {
    // 传入ConnectionCallback
    return jdbcTemplate.execute((Connection conn) -> {
      // 可以直接使用Connection实例, 不要释放, 回调结束后JdbcTemplate自动释放:
      // 内部手动创建的PreparedStatement, ResultSet必须用try(...)释放:
      try (PreparedStatement ps = conn.prepareStatement("SELECT * FROM users WHERE id = ?")) {
        ps.setObject(1, id);
        try (ResultSet rs = ps.executeQuery()) {
          if (rs.next()) {
            return new User(rs.getLong("id"), rs.getString("email"), rs.getString("password"), rs.getString("name"));
          }
          throw new RuntimeException("user not found by id");
        }
      }
    });
  }

  public User getUserByName(String name) {
    // 需要传入SQL语句, 以及PreparedStatementCallback
    return jdbcTemplate.execute("SELECT * FROM users WHERE name = ?", (PreparedStatement ps) -> {
      // PreparedStatement实例已经由JdbcTemplate创建, 并在回调后自动释放:
      ps.setObject(1, name);
      try (ResultSet rs = ps.executeQuery()) {
        if (rs.next()) {
          return new User(rs.getLong("id"), rs.getString("email"), rs.getString("password"), rs.getString("name"));
        }
        throw new RuntimeException("user not found by id");
      }
    });
  }

  public User getUserByEmail(String email) {
    // 传入SQL, 参数, 和RowMapper实例
    // RowMapper可以返回任何Java对象
    return jdbcTemplate.queryForObject("SELECT * FROM users WHERE email = ?", new Object[] { email },
        (ResultSet rs, int rowNum) -> {
          return new User(rs.getLong("id"), rs.getString("email"), rs.getString("password"), rs.getString("name"));
        });
  }

  // 返回多行记录
  public List<User> getUsers(int pageIndex) {
    int limit = 100;
    int offset = limit * (pageIndex - 1);
    return jdbcTemplate.query("SELECT * FROM users LIMIT ? OFFSET ?", new Object[] { limit, offset },
        new BeanPropertyRowMapper<>(User.class) // 数据库结构恰好类似, 可以把一行记录按照列名转换为JavaBean
    );
  }

  // 插入, 更新, 删除, 需要使用`update()`方法
  public void updateUser(User user) {
    // 传入SQL, SQL参数, 返回更新的行数
    if (1 != jdbcTemplate.update("UPDATE user SET name = ? WHERE id = ?", user.getName(), user.getId())) {
      throw new RuntimeException("User not found by id");
    }
  }

  // `INSERT`操作比较特殊
  // 如果某一列是自增列, 通常, 需要获取插入后的自增值.
  // 提供了一个`KeyHolder`简化操作
  public User register(String email, String password, String name) {
    // 创建一个KeyHolder
    KeyHolder holder = new GeneratedKeyHolder();
    if (1 != jdbcTemplate.update(
        // 参数1: PrepareStatementCreator
        (conn) -> {
          // 创建PreparedStatement时, 必须指定RETURN_GENERATED_KEYS:
          PreparedStatement ps = conn.prepareStatement("INSERT INFO users(email, password, name) VALUES()",
              Statement.RETURN_GENERATED_KEYS);
          ps.setObject(1, email);
          ps.setObject(2, password);
          ps.setObject(3, name);
          return ps;
        },
        // 参数2: KeyHolder
        holder)) {
      throw new RuntimeException("Insert failed.");
    }
    return new User(holder.getKey().longValue(), email, password, name);
  }
}
```

* JdbcTemplate还有许多重载方法.
* 本质是对JDBC操作的一个简单封装.
* 目的:
  1. 减少手动编写`try(resource) {...}`
  2. 通过`RowMapper`实现了JDBC结果集到Java对象的转换
* 用法:
  1. 针对简单查询, 优选`query()`和`queryForObject()`, 因为只需要提供SQL语句, 参数和`RowMapper`
  2. 针对更新操作, 优选使用`update()`, 因为只需要提供SQL语句和参数;
  3. 任何复杂的操作, 最终可以通过`execute(ConnectionCallback)`实现, 因为拿到`Connection`就可以做任何JDBC操作
* 在设计表结构时, 能够和JavaBean的属性一一对应, 直接使用`BeanPropertyRowMapper`会很方便.

* **操作时候遇到了一个最大的问题, 就是数据库有两条数据, 因为设置了不唯一主键, 插入的时候, 一直冲突, 需要添加一条删除表的语句**

```java
@Component
public class DatabaseInitializer {
  @Autowired
  JdbcTemplate jdbcTemplate;

  @PostConstruct
  public void init() {
    jdbcTemplate.update(" DROP TABLE IF EXISTS users;"
    + "CREATE TABLE IF NOT EXISTS users ( "
    + "id BIGINT IDENTITY NOT NULL PRIMARY KEY, "
    + "email VARCHAR(100) NOT NULL, "
    + "password VARCHAR(100) NOT NULL, "
    + "name VARCHAR(100) NOT NULL, "
    + "UNIQUE (email))"
    );
  }
}
```

## 使用声明式事务

* Spring提供了一个`PlatformTransactionManager`表示事务管理器.
* `TransactionStatus`表示事务.

```java
    TransactionStatus tx = null;
    try {
      // 开启事务
      tx = txManager.getTransaction(new DefaultTransactionDefinition());
      // 相关jdbc操作
      jdbcTemplate.update("...");
      jdbcTemplate.update("...");
      // 提交事务
      txManager.commit(tx);
    } catch (Exception e) {
      // 回滚事务
      txManager.rollback(tx);
      throw e;
    }
```

* 抽象`PlatformTransactionManager`和`TransactionStatus`是为了支持分布式事务
* 分布式事务指多个数据源(多个数据库, 多个消息系统)要在分布式环境下实现事务的时候.
* 通过一个分布式事务管理器实现两阶段提交, 但本身数据库事务就不快, 基于数据库事务实现的分布式事务就非常慢, 使用率不高.

* Spring为了同时支持JDBC和JTA两种事务模型, 就抽象出`PlatformTransactionManager`.

* *Spring使用AOP代理, 即通过自动创建Bean的Proxy实现: 对一个声明式事务方法的事务支持*
* *声明了`@EnableTransactionManager`后, 不必额外添加`@EnableAspectJAutoProxy`*

### 事务回滚

* 发生了`RuntimeException`, Spring的声明式事务将自动回滚.
* 在一个事务中, 如果程序判断需要回滚事务, 只需要抛出`RuntimeException`

```java
@Transactional(rollbackFor = {RuntimeException.class, IoException.class})
public buyProducts(long productId, int num) throws IOException{
  ...
  if (store < num) {
    // 库存不够, 购买失效
    throw new IllegalArgumentException("No enough products");
  }
  ...
}
```

* **强烈建议业务异常体系从`RuntimeException`中派生, 这样就不必声明任何特殊异常即可让Spring的声明式事务正常工作**

### 事务边界

* 在使用事务的时候, 明确事务边界非常重要.
* 如果一个事务内部, 又调用其他的事务方法, 在回滚的时候, 可能会造成一起回滚的现象.

### 事务传播

* 解决事务边界问题, 定义事务的传播类型.
* Spring的声明式事务为事务传播定义了几个级别, 默认的传播级别是`REQUIRED`.
* 如果当前没有事务, 就创建一个新事务, 如果当前有事务, 就加入到当前事务中执行.
* 这样整个事务边界就清晰了: 只有一个事务, 就是`UserService.register()`.
* 这样每个事务就都是单独且清晰的.

* 事务传播级别:
  * `REQUIRED`: 默认, 没有事务, 就创建一个, 有, 就加入
  * `SUPPORTS`: 如果有事务, 就加入, 没有, 自己也不开启事务执行. 一般用在查询方法
  * `MANDATORY`
  * `REQUIRES_NEW`: 不管当前有没有, 都必须开启一个新的事务执行. 如果当前有事务, 那么当前事务会挂起, 等新事物完成后, 再恢复执行;
  * `NOT_SUPPORTED`
  * `NEVER`
  * `NOT_SUPPORTED`
  * `NESTED`

```java
@Transactional(propagation = Propagation.REQUIRES_NEW)
public Product createProduct() {
}
```

### Spring如何传播事务

```java
// jdbc中事务写法
Connection con = openConnection();
try {
  // 关闭自动提交
  con.setAutoCommit(false)
  // 执行多条SQL语句
  insert();
  update();
  delete();
  // 提交事务
  con.commit();
} catch (SQLException e) {
  // 回滚事务
  con.rollback();
} finally {
  con.setAutoCommit(true)
  con.close();
}
```

* **使用`ThreadLocal`**
* Spring总把JDBC相关的`Connection`和`TransactionStatus`实例绑定到`ThreadLocal`
* 如果一个事务方法从`ThreadLocal`中未取到事务, 那么它会打开一个新的JDBC链接, 同时开启一个事务.
* 否则, 就直接从`ThreadLocal`获取JDBC链接以及`TransactionStatus`

* 因此事务支取之前的前提是, 方法调用是在一个线程内执行.

```java
@Transactional
public User register(String email, String password, String name) { // BEGIN TX-A
  User user = jdbcTemplate.insert("...");
  new Thread(() -> {
    // BEGIN TX-B
    bonusService.addBuns(user.id, 100)
    // END TX-B
  }).start();
} // END TX-A
```

* **事务只能在当前线程传播, 无法跨跃线程传播**

## 使用DAO

* 传统的多层应用程序中, 通常是Web层调用业务层, 业务层调用数据访问层.
* 业务层负责处理各种业务逻辑, 数据访问层只负责对数据进行增删改查.
* 实现数据访问层就是用`JdbcTemplate`实现对数据库的操作.

* DAO: Data Access Object

```java
public class AbstractDao<T> extends JdbcDaoSupport{
  private String table;
  private Class<T> entityClass;
  private RowMapper<T> rowMapper;

  @Autowired
  private JdbcTemplate jdbcTemplate;

  @PostConstruct
  public void init() {
    super.setJdbcTemplate(jdbcTemplate);
  }

  public AbstractDao() {
    // 获取当前类型的泛型类型
    this.entityClass = getParameterizedType();
    this.table = this.entityClass.getSimpleName().toLowerCase() + "s";
    this.rowMapper = new BeanPropertyRowMapper<>(entityClass);
  }

  public T getById(long id) {
    return getJdbcTemplate().queryForObject(
      "SELECT * FROM " + table + " WHERE id = ?",
      this.rowMapper,
      id
    );
  }

  public List<T> getAll(int pageIndex) {
    int limit = 100;
    int offset = limit * (pageIndex - 1);
    return getJdbcTemplate().query(
      "SELECT * FROM " + table + " LIMIT ? OFFSET ?",
      new Object[] {limit, offset},
      this.rowMapper
    );
  }

  public void deleteById(long id) {
    getJdbcTemplate().update("DELETE FROM " + table + " WHERE id = ? ", id);
  }

  public RowMapper<T> getRowMapper() {
    return this.rowMapper;
  }

  private Class<T> getParameterizedType() {
    ...
  }
}

```

* 这样每个子类都会有了这些通用方法

```java
@Component
@Transactional
public class UserDao extends AbstractDao<User> {
  // 已经有了:
  // User getUserById(long)
  // List<User> getAll(int)
  // void deleteById(long)
}

@Component
@Transactional
public class BookDao extends AbstractDao<Book> {
  // 已经有了:
  // Book getById(long)
  // List<Book> getAll(int)
  // void deleteById(long)
}
```

* DAO模式是一种简单的数据访问模式, 根据实际情况, 是否使用DAO.
* 直接在Service层操作数据库也是完全没有问题的.

## 集成Hibernate

* 使用`JdbcTemplate`的时候, 我们用的最多的方法就是`List<T> query(String sql, Object[] args, RowMapper rowMapper)`
* `RowMapper`的作用: 把`ResultSet`的一行记录映射为Java Bean.
* 这种关系数据库的表记录映射为Java对象的过程就是ORM: Object-Relational Mapping.
* ORM可以把记录转换为Java对象, 也可以把Java对下个转换为行记录.

* Hibernate作为ORM框架, 可以替代`JdbcTemplate`, 但仍然需要JDBC驱动.
* 所以我们需要引入JDBC驱动, 连接池, 已经Hibernate本身.

* **使用Hibernate时, 不要使用基本类型的属性, 总是使用包装类型, 如Long或Integer**

* **使用Spring集成Hibernate, 配合JPA注解, 无需任何额外的XML配置**

* 抽象一层, 可以直接注入通用属性

```java
@MappedSuperclass // 表示用于继承
public abstract class AbstractEntity {
  private Long id;
  private Long createdAt;

  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  @Column(nullable = false, updatable = false)
  public Long getId() {
    return id;
  }

  @Column(nullable = false, updatable = false)
  public Long getCreatedAt() {
    return createdAt;
  }

  @Transient // 表示虚拟属性, 不从数据库读取
  public ZonedDateTime getCreatedDateTime() {
    return Instant.ofEpochMilli(this.createdAt).atZone(ZoneId.systemDefault());
  }

  @PrePersist // 表示JavaBean持久化到数据库之前(INSERT), 会先执行这个方法.
  public void preInsert() {
    setCreatedAt(System.currentTimeMillis());
  }

  public void setCreatedAt(Long createdAt) {
    this.createdAt = createdAt;
  }

  public void setId(Long id) {
    this.id = id;
  }
}

@Entity
public class Book extends AbstractEntity {
  private String title;

  @Column(nullable = false, updatable = false)
  public String getTitle() {
    return title;
  }

  public void setTitle(String title) {
    this.title = title;
  }
}
```

### 插入

```java
  public User register(String email, String password, String name) {
    // 创建一个对象
    User user = new User();
    // 设置好属性
    user.setEmail(email);
    user.setPassword(password);
    user.setName(name);
    // 不用设置id, 因为设置了自增主键, 保存到数据库
    System.out.print(hibernateTemplate);
    hibernateTemplate.save(user);
    // 现在已经自动获得了id;
    System.out.println(user.getId());
    return user;
  }
```

### 删除

```java
  public boolean deleteUser(Long id) {
    // 先根据主键加载记录
    // get: 返回null
    // load: 抛出异常
    User user = hibernateTemplate.get(User.class, id);
    if (user != null) {
      hibernateTemplate.delete(user);
      return true;
    }
    return false;
  }
```

### 更新

```java
  public void updateUser(Long id, String name) {
    User user = hibernateTemplate.load(User.class, id);
    user.setName(name);
    hibernateTemplate.update(user);
  }
```

### 查询

* findByExample
* criteria: 可以实现任意复杂的查询
* HQL:

```java
  public User login(String email, String password) {
    User example = new User();
    example.setEmail(email);
    example.setPassword(password);
    List<User> list = hibernateTemplate.findByExample(example);
    // 在使用findByExample时, 基本类型字段总会加入到WHERE条件.
    return list.isEmpty() ? null : list.get(0);
  }

  public User login(String email, String password) {
    DetachedCriteria criteria = DetachedCriteria.forClass(User.class);
    criteria.add(Restrictions.eq("email", email));
    criteria.add(Restrictions.eq("password", password));
    List<User> list = (List<User>) hibernateTemplate.findByCriteria(criteria);
    return list.isEmpty() ? null : list.get(0);
  }


@NamedQueries(
  @NamedQuery(
    name = "login",
    query = "SELECT u FROM User u WHERE u.email=?0 AND u.password=?1"
  )
)
public class User extends AbstractEntity{
  ...
}

  public User login(String email, String password) {
    List<User> list = (List<User>) hibernateTemplate.findByNamedQuery("login", email, password);
    return list.isEmpty() ? null : list.get(0);
  }
```

### 使用Hibernate原生接口

* 原生接口总是从`SessionFactory`出发, 通常用全局变量存储.
* 在`HibernateTemplate`中以成员变量注入.

```java
void operation() {
  Session session = null;
  boolean isNew = false;
  // 获取当前Session或者打开新的Session
  try {
    session = this.sessionFactory.getCurrentSession();
  } catch (HibernateException e) {
    session = this.sessionFactory.openSession();
    isNew = true;
  }
  // 操作Session
  try {
    User user = session.load(User.class, 123L);
  }
  finally {
    // 关闭新打开的Session
    if (isNew) {
      session.close();
    }
  }
}
```

## 集成JPA

* JPA: Java Persistence API, 是ORM标准
* 如果使用JPA, 引用: `javax.persistence`, 不再是`org.hibernate`第三方包
* JPA只是一个接口, 需要一个实现产品, 例如`Hibernate`

```java
@Bean
  LocalContainerEntityManagerFactoryBean createEntityManagerFactory(@Autowired DataSource dataSource) {
    LocalContainerEntityManagerFactoryBean entityManagerFactoryBean = new LocalContainerEntityManagerFactoryBean();
    // 设置DataSource
    entityManagerFactoryBean.setDataSource(dataSource);
    // 扫面package
    entityManagerFactoryBean.setPackagesToScan("com.zhangrh.spring.entity");
    // 指定JPA的提供商是Hibernate:
    JpaVendorAdapter vendorAdapter = new HibernateJpaVendorAdapter();
    entityManagerFactoryBean.setJpaVendorAdapter(vendorAdapter);
    // 设定特定提供商自己的配置
    Properties props = new Properties();
    props.setProperty("hibernate.hbm2ddl.auto", "update");
    props.setProperty("hibernate.dialect", "org.hibernate.dialect.HSQLDialect");
    props.setProperty("hibernate.show_sql", "true");
    entityManagerFactoryBean.setJpaProperties(props);
    return entityManagerFactoryBean;
  }

  @Bean
  PlatformTransactionManager createTxManager(@Autowired EntityManagerFactory entityManagerFactory) {
    return new JpaTransactionManager(entityManagerFactory);
  }
```

* 使用Spring + Hibernate作为API的实现, 无需任何配置文件.
* Entity Bean的配置和上一节完全相同, 全部采用Annotation标注.

* JDBC, Hibernate, JPA关系
  * DataSource  SessionFactory  EntityManagerFactory
  * Connection  Session         EntityManager

* @PersistenceContext // Spring会自动注入`EntityManager`代理, 该代理类会在必要的时候自动打开`EnetityManager`
* 多线程引用的`EntityManager`虽然是一个代理类, 但该代理类内部针对不同线程会创建不同的`EntityManager`实例
* *@Persistence的`EntityManager`可以多线程安全的共享*

```java
    CriteriaBuilder cb = em.getCriteriaBuilder();
    CriteriaQuery<User> q = cb.createQuery(User.class);
    Root<User> r = q.from(User.class);
    q.where(cb.equal(r.get("email"), cb.parameter(String.class, "e")));
    TypedQuery<User> query = em.createQuery(q);
    // 绑定参数
    query.setParameter("e", email);
    // 执行查询
    List<User> list = query.getResultList();
    return list.isEmpty() ? null : list.get(0);
```

```java
    // JPQL查询
    TypedQuery<User> query = em.createQuery("SELECT u FROM User u WHERE u.email = :e", User.class);
    query.setParameter("e", email);
    List<User> list = query.getResultList();
    if (list.isEmpty()) {
      throw new RuntimeException("User not found by email");
    }
    return list.get(0);
```

```java
  public User login(String email, String password) {
    TypedQuery<User> query = em.createNamedQuery("login", User.class);
    query.setParameter("e", email);
    query.setParameter("p", password);
    List<User> list = query.getResultList();
    return list.isEmpty() ? null : list.get(0);
  }

  public User register(String email, String password, String name) {
    User user = new User();
    user.setEmail(email);
    user.setPassword(password);
    user.setName(name);
    em.persist(user);
    return user;
  }

  public void updateUser(Long id, String name) {
    User user = getUserById(id);
    user.setName(name);
    em.refresh(user);
  }

  public void deleteUser(Long id) {
    User user = getUserById(id);
    em.remove(user);
  }
```

## 集成MyBatis

* ORM框架的主要工作就是把ResultSet的每一行编程Java Bean.
* 或者把Java Bean自动转换到INSERT或UPDATE语句的参数中去, 从而实现ORM
* 因为我们在Java Bean的属性上给了足够的注解作为元数据
* ORM获取Java Bean的注解之后, 知道如何进行映射
* *通过`Proxy`模式, 对每个setter方法进行覆写, 达到`update()`目的*

```java
public class UserProxy extends User{
  Session _session;
  boolean _isNamedChanged;

  public void setName(String name) {
    super.setName(name);
    _isNamedChanged = true;
  }

  // 获取User对象关联的Address对象
  public Address getAddress() {
    Query q = _session.createQuery("from Address where userId = :userId");
    q.setParameter("userId", this.getId());
    List<Address> list = query.list();
    return list.isEmpty() ? null : list(0);
  }
}

```

* Proxy必须保持当前的Session, 事务提交后, Session自动关闭, 要么无法访问, 要么数据不一致.
* ORM总是引入Attached/Detached, 表示此Java Bean到底是在Session的范围内, 还是脱离了Session编程了一个"游离对象".

* ORM提供了缓存
  * 一级缓存: 指在一个Session范围内的缓存, 例如根据主键查询时候, 两次查询返回同一个实例
  * 二级缓存: 跨Session缓存, 默认关闭. 二级缓存极大的增加了数据的不一致性

* JdbcTemplate和ORM相比:
  * 查询后需要手动提供Mapper实例, 以便把ResultSet的每一行变为Java对象
  * 增删改操作所需参数列表, 需要手动传入, 即把User实例变为[user.id, user.name, user.email]这样的列表, 比较麻烦
* jdbcTemplate
  * 优势: 确定性, 每次读取数据库一定是数据库操作, 而不是缓存, 所执行的SQL是完全确定的.
  * 缺点: 代码比较繁琐, 构造`INSERT INTO users VALUES(?,?,?)`更加复杂
* 半自动ORM框架: `MyBatis`:
  * 只负责ResultSet自动映射到Java Bean
  * 自动填充Java Bean参数
  * 需要自己写出SQL

* JDBC       | Hibernate      | JPA                  | MyBatis
* DataSource | SessionFactory | EntityManagerFactory | SqlSessionFactory
* Connection | Session        | EntityManager        | SqlSession

* MyBatis使用Mapper来实现映射.

```java
public interface UserMapper {
  @Select("SELECT * FROM users WHERE id = #{id}")
  User getById(@Param("id") long id);

  @Select("SELECT * FROM users LIMIT #{offset}, #{maxResults}")
  List<User> getAll(@Param("offset") int offset, @Param("maxResults") int maxResults);
}
```

* MyBatis执行查询后, 将根据方法的返回类型自动把ResultSet的每一行转换为User实例
* 转换规则按照列名和属性名对应
* 如果对应不成, 改写sql语句:

```sql
-- 列名: created_time; 属性名: createdAt
SELECT id, name, email, created_time AS createdAt FROM users
```

```java
@MapperScan("com.zhangrh.spring.mapper") //自动创建所有mapper的实现类
public class AppConfig {
  // ...
}
public class UserService {
  @Autowired
  UserMapper userMapper;

  public User getUserById(long id) {
    User user = userMapper.getById(id);
    if (user == null) {
      throw new RuntimeException("User not found by id");
    }
    return user;
  }
}
```

### XML配置方式

* xml可以动态组装输出sql, 但是配置繁琐, 不推荐使用

* 使用MyBatis最大的问题: 所有的sql全部需要手写
* 优点: sql是我们自己写的, 优化简单, 可以编写任意负责sql
* 切换数据库不太方便, 但是大部分项目没有切换数据库的需求

## 设计ORM

* ORM: 建立在JDBC的基础上, 通过ResultSet到JavaBean的映射, 实现各种查询.

### 设计ORM接口

```java
```

// todo: 不再看了, 暂时达成能用就成. 后面补上.
