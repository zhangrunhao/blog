# NextJS01 - page router

## 学习过程中的问题

- what is 'file system routing'
- nextjs 都有哪些自定义标签 类似与`<Link> <Image>`
- 怎么确定同一个 nextjs app 呢？
  - 如果我打包了一个 app，然后把不同的页面部署在不同的服务器。但是是同一个域名。
  - 有些 SSG， 有些 SSR，是同一个 app 吗
- 除了 SSG，SSR 还是有啥？和 SSG 有啥区别？
- `<Link>` 是如何在不同页面之间，实现 SPA 功能的？
- `<Link>`能否开启一个新的 tab 页面
- 如何做的代码切割，针对不同页面，加载出来不同的代码块。
  - 比如不同的页面，都用到了同一个组件。那这个组件如何被打包？
- The public directory is also useful for robots.txt, Google Site Verification, and any other static assets. 时啥意思？
- 图片如果不放到 public 会怎样，有啥区别？
- d Cumulative Layout Shift, a Core Web Vital that Google is going to use in search ranking.什么意思
- 什么是 post css
- hydration 的概念
- getStaticProps 为什么会在 build 时执行呢？
- 如果既有`getStaticProps`, 又有`getServerProps`呢？
- `fallback`这个关键词有什么作用？
- `swr`是什么
  = `The DPS Workflow:`是什么

## file system routing
