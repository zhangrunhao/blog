# vcsass vue工程构建

> 详解`vue-expand`目录

## asset

> 静态资源存放目录

* fonts
* images
* javascript
  * gt.js: 滑动验证码
  * telprefix.js: 电话号码前缀

## component

> **核心**公用组件

* area: 空白区域, 具体用起来还得后面慢慢补
* avatar: 头像
* bread: 导航, 面包屑
* country-code: 验证码
* dialog: 弹框
* form: 表单, 貌似很复杂, 后面详解
* kr-auth-button: 身份验证弹框
* kr-export: 导出选择框
* modal: 一个样式模块, 感觉并没有用, 实际业务场景见吧
* move-tree: 移动文件所用组件
* side-nav: 竖着的导航栏, 只在系统设置中用到
* toggle-section: 切换组件
* top-nav: 顶部导航栏
* upload: 上传组件

### form 继续

> 还是没有搞清楚具体的代码逻辑, 还要继续再开个文档来搞

* field:
  * 除去外面的三个文件, 其他所有的都是一个基础的样式组件
  * basic中为核心代码, `为具体的动态字段所控制(自己理解的)`
* view:
  * 页面中所有的基础视图组件
  * 核心为`data-detail`, `detail`和`data-table`组件, 构成所有的页面

## core

> 核心代码? 怎么理解呢. 一些通用的方法, 回头还得继续看..

### abstarct

> 一些抽象类

* basic.js: 基础类, 其他类均集成此处
* log.js: 打印日志函数
* regist.js: 注册空间模块, 虽然没看懂在干嘛, 但是最后的单例模式眼前一亮

### bo

> 抽象类的扩展

* match.js: 判断有没有Match的默认开关?
* space.js: 好像是用来对组件的一些数据做处理的.

### manager

* context-menu.js:
* keyboard.js: 监听键盘事件. 具体使用场景未知
* manager.js: 管理模块, 用来监听模块的开始和结束. 导出日志和注册模块

## directive

> 自定义指令

* error: 错误指令, 直接用就好了..

## filter

> 自定义一个过滤器..

* 处理字符串的超出长度, 用'...'表示

## locale

> 定义汉语表示

## mixin

> 混入

* event.js: 事件的注入. 整个项目的事件绑定关系来源于此. 分别关系到:
  * `/vue_expand/form/field/basic/filed-min.js`
  * `/vue_expand/core/bo/space.js`
  * 关系为核心事件通信机制, 后面再展开去看
* leave.js: 离开事件, 用来表示离开时所处理为保存内容
* quick-add.js: 快速新增事件. 具体作用未知, 在核心组件中, 都将其作为事件传入

## router

> 路由

* index.js: 导入路由文件, 并对路由进行一系列处理
* routes.js: 路由文件, 存放具体路由信息

## store

> vuex状态管理器

* index.js: 导出全局状态
* avatar: 为何感觉是随机出来一个颜色..
* domain: 无用
* notify: 通知. 具体作用未知, 存了一些共用的变量
* route: 当前录用的一个状态
* search: 当前搜素的内容
* user: 存储了与当前用户相关的数据
* view: 视图相关, 当然里面只有一个bodywidth

## style

> 存放了公用样式库

## view

> 业务相关

### home

> 主业务组件

* index.vue: 整体, 不知道在view里面的那个index.vue有什么作用
* 403
* 404
* app
* approval
* file
* index
* moudle
* notify-center
* schedule
* search
* setting

### login

> 登录页面

### test

> 测试页面

### index.vue

> 还没有找到这个组件的具体作用