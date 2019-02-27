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

## 核心原因

> [https://stackoverflow.com/questions/28832815/git-commands-require-sudo-on-osx](stackoverflow)

  其实就是我们的项目`git clone`的时候, 需要系统`sudo`权限, 和我们git安装与关系. 应该是ssh需要系统权限. 即使操作了, 以后`git fetch` 和 `git push` 也需要权限. 但最起码, 保存不恶心了...

### 解决办法

* `chown -R <user> myproject`
