# vcsass 项目分析 (一)

> 项目目录结构

## 项目整体情况

> 项目使用yarn进行node包管理, gulp进行打包.

### 注意事项

* 项目基于gulp, 需要全局安装`gulp`. 当然了, 还需要全局安装`yarn`
* 项目运行环境中的 `node版本必须为8.*.*` 不然安装包会出现问题
* 直接使用yarn下载安装依赖包, 再次使用npm安装下载, 已保证所有依赖包正确安装.

## build

> 存放打包文件

* basic: 公用打包文件
* config: 打包配置文件
* plugin: 插件
* task: 打包任务文件

## src

> 项目核心目录

### entry

> 入口文件

* [loading]: 打包中loading样式, 在`/build/config/webpack_base_config.js#19`中进行配置.
* favicon.ico
* index.html: 使用`htmlWebpackPlugin`对其所在环境进行不同的文件生成
* index.js: 全局入口文件, 引入所有需要的工程文件

### lib

> 核心函数库: **在index.js中挂载到window对象的kr上面**

* collection.js: 深度和广度优先遍历 [深度优先广度优先算法](https://zhuanlan.zhihu.com/p/38477689)
* data.js: 不懂. 没有找到用的地方
* **dataflow.js**: 核心, 数据流函数. 所有核心组件在获取数据前需要通过此函数进行参数的准备, 也就是其中的`prepare`, 影响范围`effect`函数的执行. 通过run进行数据流的处理. 后面, 详细看
* dom.js: 操作dom
* fileTransfer.js: 文件传输
* format.js: 格式化函数
* lodash.js: 引入loadsh中方法
* page.js: 获取分页的信息
* random.js: 获取制定长度的随机字符串
* script.js: 本地执行脚本命令没有懂
* statics.js: 命名文件, 一个'-'没有懂.方便统一配置吧.
* ui.js: element中的四种弹出提示框
* url.js: 关于url的字符串操作
* vue.js: 对于prop中的默认值, 最后的两个函数, 并未找到使用场景

### vue_expand

> vue项目工程

### wrapper

> 包装器, 其中只有一个数据传输机制

## 其他

* .babelrc
* .editorconfig: 编辑器代码风格, vscode装个插件
* .eslintrc: 代码约束
* .gitignore
* .npmignore: npm包忽略文件, 怎么还有这个东西. 还发布了?
* CHANGELOG.md
* gulpfile.js: 打包文件, 使用了任务分组, 具体的后面还要看
* package.json
* README.md
* yarn.lock: 比`package.json`更加详细的依赖信息.