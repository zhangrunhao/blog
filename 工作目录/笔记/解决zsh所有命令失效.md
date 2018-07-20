# 解决zsh所有命令失效

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
