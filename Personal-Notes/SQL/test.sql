

SELECT *
FROM income_expend_record
WHERE users_id=1
AND account_book_id=3
AND spend_time > '2021-06-29 02:31:33'
AND spend_time < '2021-06-29 02:41:00';



-- WHERE QS.creation_time BETWEEN '2020-12-15 1:00:00' AND '2020-12-15 12:00:00'