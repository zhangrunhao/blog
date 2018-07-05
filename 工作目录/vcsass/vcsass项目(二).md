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

## directive

## filter

## locale

## mixin

## router

## store

## style

## view