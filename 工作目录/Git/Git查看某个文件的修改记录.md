# 问题: 查看某个文件的修改记录

> * 参考文章:
> * [git查看某个文件的修改历史](https://www.cnblogs.com/flyme/archive/2011/11/28/2265899.html)
> * [5.3 Git log 高级用法](https://github.com/geeeeeeeeek/git-recipes/wiki/5.3-Git-log-%E9%AB%98%E7%BA%A7%E7%94%A8%E6%B3%95)

## 基本步骤

* `git log --pretty=oneline [文件名]`
* `git show [节点]`

## `git log`

> 两周高级用法结合在一起就能找到想要的

### 自定义提交的输出格式

* --online: 每个提交压缩到一行, 只显示id和提交信息第一行
* --decorate: 显示每个节点关联的分支和tag
* --stat: 每次修改的文件名
* -p: 每次修改的精确信息
* `git shortlog`: 每个人的提交记录
* --graph: 详细的查看分支. 和online, decorate配合比较好用

### 过滤输出哪些提交

* `-<n>`: 查看几次的提交
* --after, --before: 时间段. `git log --after="2014-7-1" --before="2014-7-4"`
* --since, --until: 范围. `git log master..feature`
* --author: 查看作者
* --grep: 提交信息
* -- <文件名> <文件名>: 查看某个文件
* -- S: 按照内容筛选
* --no-merges: 去除合并提交. --merges: 只是合并提交

## 总结

* 坚持学习, Git高级用法. 会很酷.
* `git log -p <文件名>` 才是真理