# Java笔记17 - JDBC编程

## JDBC简介

* java程序访问数据库的标准接口
* JDBC接口通过JDBC驱动实现真正对数据库的访问
* 编写一套代码, 访问不同的数据库
* App.class -> java.sql.* -> mysql-xxx.jar -> (TCP) -> mysql

## JDBC查询

* java.sql.*放的是一组接口
* 用哪个数据库, 就用哪个数据库的实现类
* 某个数据库实现了JDBC接口的jar包称为JDBC依赖

### JDBC连接

* Connection代表一个JDBC连接, 相当于Java程序到数据库的连接.
* 打开一个Connection, 需要准备URL, 用户名, 口令
* `DriverManager`会自动扫描classpath, 找到所有的JDBC驱动, 然后根据我们传入的URL自动挑选一个合适的驱动
* JDBC是一种昂贵的资源, 使用后要及时释放, 使用`try (resource)`自动释放JDBC连接

### JDBC查询详解

* 第一步: 使用`Connection`提供的`createStatement()`方法创建一个`Statement`对象, 用于执行一个查询;
* 第二步: 执行`Statement`对象提供的`executeQuery("SELECT * FROM students")`并传入SQL语句. 查询执行并获得返回的结果集
* 第三部: 反复调用`ResultSet`的`next()`方法并读取每一行结果

```java
      try (Connection conn = DriverManager.getConnection(JDBC_URL, JDBC_USER, JDBC_PASSWORD)) {
        System.out.println(conn);
        try (Statement stmt = conn.createStatement()) {
          System.out.println(stmt);
          try (ResultSet rs = stmt.executeQuery("SELECT id, name, gender FROM students WHERE gender='F'")) {
            System.out.println(rs);
            while (rs.next()) {
              long id = rs.getLong(1); // 索引从1开始
              System.out.println(id);
            }
          }
        }
      }
```

### SQL注入

* 使用精心构造的字符串, 拼接出不同SQL.
* `PreparedStatement`可以完全避免SQL注入
* 始终使用`?`作为占位符, 并把数据连同SQL本身传给数据库, 保证每次传给数据库的SQL语句先沟通那个. 只是站位数据不同
* 高效利用数据对查询的查询.

```java
    String sql = "SELECT * FROM user WHERE lgoin=? AND pass=?";
    PreparedStatement ps = conn.prepareStatement(sql);
    ps.setObject(1, name);
    ps.setObject(2, pass);
```

* 必须首先调用`setObject()`设置每个占位符`?`的值, 最后仍然获取的仍然是`ResultSet`对象

### 数据类型

* JDBC定义了一组常量表示如何映射SQL数据类型, 经常用到的转换:

* SQL数据类型 / Java数据类型
* BIT,BOOL / boolean
* INTEGER / int
* BIGINT / long
* REAL / float
* FLOAT,DOUBLE / double
* CHAR,VARCHAR / String
* DECIMAL / BigDecimal
* DATE / java.sqal.Date,LocalDate
* TIME / java.sql.Time,LocalTime

* **只有最新的JDBC驱动才支持`LocalDate`和`LocalTime`**

## JDBC更新

### 插入

* 使用`PreparedStatement`执行sql语句, 使用`executeUpdate()`
* 返回成功插入的数量
* 创建`PreparedStatement`时, 同时指定`RETURN_GENERATED_KEYS`关键字, 自增后就能返回, 驱动就能返回自增关键则了.
* 返回的是多行成功值

* **插入, 更新, 删除都是使用`executeUpdate()`**
* 只是使用的sql语句不同

## JDBC事务

* 数据库事务具有ACID特性
* 数据库从安全性考虑, 对事物进行了四种安全特性
* 数据库事务, 保证程序结果正常
* *JDBC中执行事务, 就是多条sql包裹在一个数据库事务中*

```java
  Connection conn = openConnection();
  try {
    // 关闭自动提交
    conn.setAutoCommit(false);
    // 执行多个sql
    insert();
    update();
    delete();
    conn.commit();
  } catch (SQLException e) {
    // 回滚
    conn.rollback();
  } finally {
    conn.setAutoCommit(true);
    conn.close();
  }
```

* 数据库默认使用`REPEATABLE_READ`

## JDBC-Batch

* 一次性生成批量优惠卷等场景
* 循环生成`PreparedStatement`效率低
* 反复调用`addPatch`, 相当于给一个sql加上了多组参数, 变成多行`sql`
* 因为是多行, 返回一个数组, 表示每一条影响的sql数量

```java
try (Connection conn = DriverManager.getConnection(JDBC_URL, JDBC_USER, JDBC_PASSWORD)) {
    try (PreparedStatement ps = conn.prepareStatement(
        "INSERT INTO students (name, gender, grade, score) VALUES (?, ?, ?, ?)"
      ))
    {
      for (String name: names) {
        ps.setString(1, name);
        ps.setInt(2, 0); // gender
        ps.setInt(3, 4); // grade
        ps.setInt(4, 99); // score
        ps.addBatch(); // 添加到batch
      }
      int[] ns = ps.executeBatch();
      for (int n : ns) {
        System.out.println(n + " inserted.");
      }
    }
}
```

## JDBC连接池

* JDBC线程连接是昂贵的操作
* jdbc线程池标准接口 `javax.sql.DataSource`
* 创建`DataSource`是非常昂贵操作, 所以通常`DataSource`实例总是作为一个全局变量存储, 并贯穿整个应用程序

```java
    config.setJdbcUrl(JDBC_URL);
    config.setUsername(JDBC_USER);
    config.setPassword(JDBC_PASSWORD);
    config.addDataSourceProperty("connectionTimeout", "1000"); // 连接超时 1s
    config.addDataSourceProperty("idleTimeout", "60000"); // 空闲超时 60s
    config.addDataSourceProperty("maximumPoolSize", "10"); // 最大连接数 10
    DataSource ds = new HikariDataSource(config);

    try (Connection conn = ds.getConnection()) {
      // ...
    }
```

* 第一次调用`ds.getConnection()`会先在连接池内部创建一个`Connection`
* 调用`conn.close()`时, 并不会真的关闭, 释放到连接池中.
* 再次调用`getConnection()`并不会创建, 而是返回空闲的连接
