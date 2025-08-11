# NextJS 02 - 服务端渲染

## 疑问列表

- 如果是加了`getServerProps`就是在服务端渲染的话，那第一次会渲染哪些组件？
- 如果这些组件里面用到了，需要在客户端执行的方法，该怎么办？
- NextJS 是会在 page-router 的情况下，检查每个文件，导出了哪些方法吗？比如`getServerProps`, 或者是`getStaticProps`
- 服务器上执行的 react 树和客户端还是否是同一个？服务器上，如何确定这个 react 树上哪些组件能生成，哪些不能生成？
- 最后一个步骤上，能否动态的执行组件，生成组件。比如一个请求回来了，才再客户端生成某些组件

## 渲染流程

1. 用户请求了域名`https://aa.com/news/123`
2. 走中间件`middleware.ts` / 走路由`rewrites/redirects`
3. 匹配页面`pages/news/[id].tsx`
4. 运行`getServerProps`, 通过 context 获取一系列参数， 然后返回出来`{props, redirect, notfound}`
5. 服务器上渲染`react`树, 得到进一步生成好的 HTML。
6. 把 Html 和数据注入发送给浏览器，
   - html 时用户直接能看的内容，利于 seo
   - 数据注入是`__NEXT_DATA__`的 json，包括 props，还有路由信息
7. 浏览器接管，下载数据，JS 等，开始执行 JS 代码，此时开始绑定事件啥的。
8. `useEffect / useLayoutEffect`等都开始这行了。

## 如何确定哪些组件渲染

- NexJS 会执行整个页面组件，然后统一进行渲染返回。
- 三种情况下，组件不会被执行
  - 条件判断下，只有有数据才会渲染，这个数据又是在`useEffect`请求数据回来的
  - 使用了`const Weather = dynamic(() => import('../components/Weather'), { ssr: false });`
  - 或者是在服务端只渲染一个壳子，和第一种情况下同理。
- 本质上，还是执行了一遍 react 树，然后生成 html。走不通的就拉倒了。

## 检查每个文件的方法

- 是的会检查每个`pages`这个目录下的文件，看看都返回了什么

## 关于 react 树的问题

- 执行两遍。服务端执行一遍，客户端执行一遍
- 服务端执行一遍，生成第一次的 html
- 客户端执行一遍，得到自己要的 ReactDom 虚拟树，对比 SSR 生成的 HTML，进行事件/状态绑定
- 之后的交互，状态更新都在客户端执行

> 称为双端渲染+水合（SSR + Hydration）

## 关于对比 HTML，进行渲染 React 树

- 客户端最终执行一个渲染函数`hydrateRoot`
- `const root = hydrateRoot(domNode, reactNode);`
- 客户端会渲染一遍 reactNode 得到一个 fiber 树，然后遍历容器里面的 dom 结构进行对齐
  - 类型对齐：期望是 div，实际也是 div。复用节点，只是绑定事件，矫正属性差异，class 啥的
  - 文本对齐，文本不一致就覆盖文本
  - 类型不对 / 数量不对，触发不匹配，React 会丢弃，并重建子树

## 关于强行插入 html 导致水合不匹配

- **不会出现，因为服务端渲染的时候，会在代码里放一份`getServerSideProps`产生的数据，到客户端的时候，再执行一遍。**
