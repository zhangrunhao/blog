# JDBC编程

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
