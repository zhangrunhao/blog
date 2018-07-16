# 解决git commit报错问题

> 参考: [https://stackoverflow.com/questions/3239274/git-commit-fails-due-to-insufficient-permissions](https://stackoverflow.com/questions/3239274/git-commit-fails-due-to-insufficient-permissions)

## 问题

* `git add` 或者 `git commit` 之后报错:

```shell
error: insufficient permission for adding an object to repository database .git/objects
error: insufficient permission for adding an object to repository database .git/objects
error: Error building trees
```

## 解决

1. `sudo chown -R cygr-0101-01-0133 *`
2. `cd .git`
3. `sudo chown -R cygr-0101-01-0133 *`