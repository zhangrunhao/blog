# Github提交PR(pull request)过程

1. fork到自己的仓库
2. `git clone`到本地
3. `git remote add upstream [原项目地址]` 多添加一个源地址, 并命名为stream
4. `git status` `git add .` `git commit -m`代码commit
5. `git push origin master` 推到自己的GitHub的仓库
6. `git fetch upstream` 拉取原仓库
7. `git rebase upstream/master` 把原仓库修改的内容, 合并到当前分支
8. `git push origin master` 更新远程分支
