# git操作日常记录

## 本地分支与远程分支建立联系

> * [Git - 新建本地分支与远程分支关联问题](https://www.jianshu.com/p/fc433b1686bd)

* 查看本地分支与远程分支关系: `git branch -vv`
* 当前分支与远程分支建立关系: `git branch --set-upstream-to=origin/<origin>`

## 停止追踪已经记录的文件

> * [git停止追踪文件-最佳实践](https://www.jianshu.com/p/1b235abd8ee8)

### 正常情况下

* `git rm -r --cached .idea`
* 需要所有人进行同样的操作

### 有人没一起操作的话

* 有人没一起操作的话, 需要有人去 `git checkout <删除文件的节点>~1 <需要忽略的文件>`
* 再去回滚到当前的节点, 就可以了 `git git reset HEAD <需要忽略的文件>`

## 本地仓库取消与远程的关系

* 换了一个远程仓库, 添加的时候, 报错`fatal: remote origin already exists.`
* 取消远程仓库关联: `git remote rm origin`
* 再次添加就不会有问题了: `git remote add origin <远程仓库地址>`
