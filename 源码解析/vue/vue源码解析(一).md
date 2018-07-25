# vue源码解析(一)

## 源码下载搭建

1. 地址: `https://github.com/vuejs/vue`
2. `git clone` 下载代码到本地
3. 进入项目, `npm install`进行安装
4. vscdoe去除掉编辑本身的代码检查, 不然flow的变量声明, 全程报错, 难受死
5. `"javascript.validate.enable": false`
6. 查看packjson中的各个文件, 确定命令行作用.

## 项目结构

### `.circleci`

> 持续集成工具

### `.github`

> GitHub的网站模板配置

### `benchmarks`

> 性能测试目录

### `dist`

> 打包后目录

### `examples`

> 官方实例demo

### `flow`

> 强制静态类型检查

### `pack`