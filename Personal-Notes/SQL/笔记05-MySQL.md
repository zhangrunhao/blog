# SQL笔记05 - MySQL

* 安装mysql, 包括MySQL Server:真正的SQL服务器/MySQL Client: 命令行客户端
* client登录mysql
* 输入 `mysql -u root -p`: 登录服务器
* `exit`: 断开server连接
* Client的可执行程序是`mysql`, Server的可执行程序是`mysqld`.
* sql语句, 通过TCP连接发送到server, 端口号默认是: `3306`
* 连接远程sql server, 使用`-h <ip>`
* 在MySQL Server服务器上真正执行的是`mysqld`, 在后台运行

## 管理MySQL

### 数据库

* `SHOW DATABASES;`: 展示所有数据库
* `CREATE DATABASE <数据库名称>`: 创建数据库
* `DROP DATABASE <数据库名称>`: 删除数据库
* 删除一个数据, 所有的表都被删除了
* `USE <数据库名称>`: 切换数据库

### 表

* `SHOW TABLES:` 展示所有的表
* `DESC <表名>;` 展示表结构
* 查看建表语句: `SHOW CREATE TABLE students;`
* `CREATE TABLE <表名>`/`DROP TABLE <表名>`: 创建表/删除表
* 修改表:
  * 添加一列, 新增一个属性
  * `ALTER TABLE students  ADD COLUMN birth VARCHAR(10) NOT NULL;`
  * `ALTER TABLE <表名> ADD COLUMN <列名> <类型> <是否为空>`
  * 修改列, 属性
  * `ALTER TABLE students CHANGE COLUMN birth birthday VARCHAR(20) NOT NULL;`
  * 删除表
  * `ALTER TABLE students DROP COLUMN birthday;`

## 适用SQL语句

### 插入或替换

* 如果当前记录不存在, 就插入; 如果存在, 就替换

```sql
REPLACE INTO students (id, class_id, name, gender, score) VALUES (1, 1, '小明', 'F', 99);
```

### 插入或更新

* 如果记录不存在就插入, 如果存在, 就根据后面`UPDATE`进行更新

```sql
INSERT INTO students (id, class_id, name, gender, score) VALUES (1, 1, '小明', 'F', 88) ON DUPLICATE KEY UPDATE name='小红', gender='F', score=88;`
```

* `INSERT INTO ... ON DUPLICATE KEY UPDATE ...`: 插入或者更新

### 插入或忽略

* 不存在便插入, 存在便忽略

```sql
INSERT IGNORE INTO students (id, class_id, name, gender, score) VALUES (1, 1, '小明', 'F', 22);
```

### 快照

* 都某一个表中的全部数据, 或者指定数据进行快照存储

```sql
CREATE TABLE students_of_class1 SELECT * FROM students WHERE class_id=1;
```

### 写入查询结果集

* 可以使用`insert`将`select`查询到的结果直接插入到新表中

```sql
-- 创建表
CREATE TABLE statistics (id BIGINT NOT NULL AUTO_INCREMENT, class_id BIGINT NOT NULL, average DOUBLE NOT NULL, PRIMARY KEY (id));

-- 查询数据, 并直接插入
INSERT INTO statistics (class_id, average) SELECT class_id,  AVG(score) FROM students GROUP BY class_id;
```

### 强制使用查询索引

* 执行查询语句, 数据库自动分析查询语句, 并选择一个最合适的索引
* 多数时候, 数据库系统查询优化器, 并不一定总是使用最优索引
* 可以使用: `FORCE INDEX`: 强制查询使用的索引

```sql
-- 新建索引
CREATE INDEX idx_class_id ON students (id, class_id);

-- 强制使用指定索引进行查询
SELECT * FROM students FORCE INDEX (idx_class_id) WHERE class_id = 1 ORDER BY id DESC;
```
