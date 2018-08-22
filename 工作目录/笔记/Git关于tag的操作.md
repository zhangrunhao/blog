# Git关于tag的操作

> 记录下git关于 tag的操作

## 列出所有标签

* `git tag` : 列出所有的
* `git tag -l 'v1.2.4.*'` : 最后一位任意匹配

## 新建标签

* `git tag -a [标签名称] -m '[注释]'`
* `git show [标签名称]`: 显示标签的具体信息
* `git tag -a [标签名称] [节点]` : 给某个commit补tag

## 推送标签

* `git push origin [标签名称]` : 推送某个节点
* `git push origin --tags` : 推送所有节点

## 删除标签

* `git tag -d [标签名称]` : 删除本地标签
* `git push origin :refs/tags/[标签名称]` : 删除远程标签

## 从指定tag切出分支

* `git checkout tags/<tag_name> -b <branch_name>`