# 解决 mac zsh 所有命令失效

> * 上面的没啥用, 直接看分割线吧, 上面的是第一次遇到这个问题, 没有解决..
> zsh: command not found:
> 参考:
> * [https://www.jiloc.com/43492.html](https://www.jiloc.com/43492.html)

## 原因

### 第一种

* 在`~`下新建了一个`.bashe_profile`
* 配置了一个环境变量
* 执行了`source ~/.bash_profile`
* 报错信息: `/Users/cygr-0101-01-0133/.bash_profile:export:3: not valid in this context: /Users/cygr-0101-01-0133/Documents/project/flutter/bin:/bin:/usr/bin:/usr/local/bin:`

### 第二种

* 修改了`~/.zshrc`
* 在最后添加了一行`source ～/.bash_profile`
* 所有新开启的命令行都会报上面那个错误
* 所有命令都不能用了.

### 第三步

* 放在了第一行
* 虽然能运行起来
* 发现找不到`.bash_profile`这个文件
* `cat ~/.bash_profile` 可以正常输出文件
* 但是在`zsh`被开启的时候, 就找不到这个文件了

### 第四步

* 文档中的所说的'$Home' 不是`~`
* 尴尬了...
* 应该是在`/etc/.bashrc`进行配置
* 还是不行, 可能是动到哪里?

## 解决方法

### 在命令行直接输入

* `PATH=/bin:/usr/bin:/usr/local/bin:${PATH}`

### 最后原因

------------  只看下面  -----------------------------------------

### 再次遇到这个问题: 不能用了

* 临时可用: export PATH=/usr/bin:/usr/sbin:/bin:/sbin:/usr/X11R6/bin

## 终结问题分析: 还是对命令行的运行不熟悉

### 修改.zshrc

* 在其中添加 `source ~/.bash_profile` 代表重新运行这个文件.
* 运行这个文件不会有任何问题. 问题出在了运行的这个文件中

### 修改.bash_profile

```bash
export PATH=/usr/bin:/usr/sbin:/bin:/sbin:/usr/X11R6/bin
export PATH=/Users/cygr-0101-01-0133/Documents/project/flutter/bin:$PATH
```

* 具体含义, 向外输出一个变量., 这个是我们所有命令行的路径
* 第二行: 也是输入这个PATH, 但是会覆盖上一个, 所以在最后通过`:$PATH`拼接上去就好了
* 这就是环境变量的全部秘密..  当时查了这么久, 都没有搞定..

### 当时的错误情况, 也是总结

* 就是在.bash_profile中直接干掉了第一行, 然后换成了第二行, 那样的话, 怎么样都不会管用的
* 基本常识..  还是没有找到真正原因..  那样就导致了所有的命令失效...  也真是够了..
