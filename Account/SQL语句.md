# SQL语句

## 初始化trade_cate

```sql
INSERT INTO trade_cate  
(icon, name, type, operate, create_at) 
VALUES 
("TransferData", "转入", "3", "3", "2021-11-22 00:00:00"),
("TransferData", "转出", "3", "4", "2021-11-22 00:00:00"),
("DownLoad", "借入", "3", "5", "2021-11-22 00:00:00"),
("Upload", "借出", "3", "6", "2021-11-22 00:00:00"),
("DownLoad", "收款", "3", "7", "2021-11-22 00:00:00"),
("Upload", "还款", "3", "8", "2021-11-22 00:00:00");
```

## 视图

### transfer视图

### trade视图

```sql
CREATE VIEW v_trade_cate_account 
(trade_id, user_id, account_id, trade_cate_id, money, remark, spend_date, operate, account_name, account_icon, trade_cate_name, trade_cate_icon, create_at, update_at, delete_at)
AS
SELECT 
t.id, t.user_id, t.account_id, t.trade_cate_id, t.money, t.remark, t.spend_date, t.operate, a.name, a.icon, c.name, c.icon, t.create_at, t.update_at, t.delete_at
FROM
trade t,  account a, trade_cate c
WHERE
t.account_id=a.id AND t.trade_cate_id=c.id;
```
