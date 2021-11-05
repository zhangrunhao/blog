# sql修改表结构

## 更改列类型

* 参考: <https://www.cnblogs.com/freeweb/p/5210762.html>

* `ALTER TABLE [表名] MODIFY COLUMN [字段名] [修改后的类型];`

## 重字段名称

* `ALTER TABLE [标明] CHANGE [原字段名] [现在字段名称] [修改后类型];`

## 添加字段

* 参看 [SQL ALTER TABLE Statement](https://www.w3schools.com/sql/sql_alter.asp)

* `ALTER TABLE [表名] ADD [字段名称] [字段类型];`


## 添加空约束

* 参考 [SQL NOT NULL 约束](https://www.runoob.com/sql/sql-notnuPll.html)
* `ALTER TABLE [表名] MODIFY [字段名称] [字段类型] NOT NULL;`
* *不好用*

## 删除字段

* 参考: [SQL DROP COLUMN Keyword](https://www.w3schools.com/sql/sql_ref_drop_column.asp)
* `ALTER TABLE [表名] DROP COLUMN [字段名];`


````sql
ALTER TABLE income_expend_record ADD spend_time DATETIME(3);

```


```sql
ALTER TABLE income_expend_record_sort MODIFY COLUMN create_at DATETIME(3);

ALTER TABLE income_expend_record_sort MODIFY COLUMN update_at DATETIME(3);

ALTER TABLE income_expend_record_sort MODIFY COLUMN delete_at DATETIME(3);

ALTER TABLE users MODIFY COLUMN create_at DATETIME(3);

ALTER TABLE users MODIFY COLUMN update_at DATETIME(3);

ALTER TABLE users MODIFY COLUMN delete_at DATETIME(3);

ALTER TABLE account_book MODIFY COLUMN create_at DATETIME(3);

ALTER TABLE account_book MODIFY COLUMN update_at DATETIME(3);

ALTER TABLE account_book MODIFY COLUMN delete_at DATETIME(3);

```