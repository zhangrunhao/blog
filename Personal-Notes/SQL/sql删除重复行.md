# sql删除重复行

> * 参考:
> * [https://zhuanlan.zhihu.com/p/50584524](必备神技能 | MySQL 查找删除重复行)

## 找到重复行

* 当前数据

```sql
mysql> SELECT * FROM users;
+----------+--------------------+----------+---------------------+-----------+-----------+
| users_id | email              | password | create_at           | update_at | delete_at |
+----------+--------------------+----------+---------------------+-----------+-----------+
|        2 | zhangrh@11.com     | zhang    | 2016-09-12 16:57:44 | NULL      | NULL      |
|        3 | zhangrh@11.com     | zhang    | 2021-02-07 15:53:33 | NULL      | NULL      |
|        4 | zhang@22.com       | 11       | 2021-02-07 15:58:11 | NULL      | NULL      |
|        5 | zhang@22.com       | 11       | 2021-02-07 16:03:16 | NULL      | NULL      |
|        6 | zhang@22.com       | 11       | 2021-02-07 16:06:31 | NULL      | NULL      |
|        7 | zhang@22.com       | 11       | 2021-02-07 16:07:13 | NULL      | NULL      |
+----------+--------------------+----------+---------------------+-----------+-----------+
```

* 找到重复行

```sql
mysql> SELECT email, count(*) from users GROUP BY email;
+--------------------+----------+
| email              | count(*) |
+--------------------+----------+
| zhangrhweb@163.com |        1 |
| zhangrh@11.com     |        2 |
| zhang@22.com       |        4 |
| zhangrh@163.com    |        4 |
+--------------------+----------+
```

* 只显示重复行>1的

```sql
mysql> SELECT email, count(*) from users GROUP BY email HAVING count(*) > 1;
+-----------------+----------+
| email           | count(*) |
+-----------------+----------+
| zhangrh@11.com  |        2 |
| zhang@22.com    |        4 |
| zhangrh@163.com |        4 |
+-----------------+----------+
```

* **WHERE过滤分组之前的, HAVING过滤分组之后的**
