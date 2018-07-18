# ajax请求拦截处理

> 项目中用到的请求处理

## 概况分析

* 使用了`axios`进行请求的发送
* 引入了自定义中间件插件, 进行请求中的中间件处理

## 核心文件

### basic.js

> 项目中所有的请求, 都是基于此文件进行发送和接受响应

* 此文件导出名为ajax的`async`函数.
* 接受三个参数:
  * config: 我们在axios中所有需要使用的配置项, 也就是我们正常的config
  * whiteList: 传入的参数没有什么用, 应该表示需要进行哪些中间件的.
  * backList: 表示不进行哪些中间件的操作, 此处应该是一个非常有用的操作.
* 整个函数初始化之前, 我们在中间件里面添加了两种类型的中间件.
  * config: 用来处理请求发送前, 所有初始化的准备
  * result: 用来处理我们结果回来后, 需要执行的判断过程

### code-matrix

> 中间件的实现. 并且混入了一个白名单/黑名单机制.

* 首先使用use进行函数的预存.
* 在每次调用的时候, 都跑一边use进去的, 并指定的函数.
* 类似于moa中的中间件的实现.

## 源码分析

### `code-matrix`源码

```js
import Promise from 'es6-promise';

function routeInList(route,list){
  for (let i = 0; i < list.length; i++) {
    let rule=list[i];
    if (typeof rule=='string'&&~route.indexOf(rule)){
          return true;
      }
      if(rule!=null&&typeof rule.test=='function'&&rule.test(route)){
          return true;
      }
  }
  return false;
}
function next(middlewares,now,resolve){
    // 传入的now, 表示这个中间件, 执行的顺序.
    // 也表示应该应该执行到第几个了.
    this.__now = now;

    if (now >= middlewares.length) {
    // 表示已经执行完了. 如果有6个中间件.
    // 当时now=5的时候, 是最后一个, 6的时候, 应该就是执行完了. 但总是感觉不应该判断middlewares的长度
    // 因为还有黑白名单的存在.
    // 明白了, 的确是应该走一遍, 走的时候, 发现不再白名单上, 就不走了.
        resolve(this);
        return;
    }

    let {whiteList,blackList}=this; // 获取黑白名单
    Array.isArray(whiteList)||(whiteList=[]);
    Array.isArray(blackList)||(blackList=[]);

    let nowMiddleware=middlewares[now]; // 取出当前对应的中间件


    const {route,cb}=nowMiddleware;
    let inWhiteList=routeInList(route,whiteList),
        inBlackList=routeInList(route,blackList);

    // 定义这个函数没有执行到中间时, next()所对应的函数
    // 只有执行了这个函数, 才能继续向下走, 这个函数的空间保存.
    // 感觉就是一个无限回调的过程.
    // 定义下一个需要执行的中间件函数. now递增
    let nnext = next.bind(this,middlewares,now+1,resolve);

    if(!inBlackList&&inWhiteList){ // 这个函数的key在白名单, 不在黑名单, 即可执行

        let r=cb.call(this,nnext); // this, 指的是那个参数context, 然后用传入的context参数调用回调, 这个时候, 就能在回调的this中对, 参数进行一系列的处理了.

        // 唯一不是很能理解的事, 需要判断执行的一个结果
        // 防止cb的结果不是promise. 具体的原因, 还没有想清楚
        // 因为如果是r是promise的话, 表示, 这个函数可能还在处理的过程中, 没有完全处理完.
        if(!(r instanceof Promise)&&this.__now==now){ // 全部执行完所有的中间件了.
            resolve(this);
            return;
        }

    } else {
        nnext();
    }

}

export default class Router{
    constructor(){
        this.middlewares=[]; // 用来存储我们use进来的中间件函数
    }
    use(route,cb){ // 存储我们需要进行中间件处理的函数
        if(typeof route=='string'&&typeof cb=='function'){
            this.middlewares.push({route,cb}); // 里面是一个对象, key: 是我们需要执行的中间件名称, value: 是我们的中间件
        }
    }
    send(context){
        const {middlewares}=this; // this指的是 Routern new出来的实例. 所以, this中包含了meddlewares这个存储器
        return new Promise((resolve,reject)=>{ // 返回一个promise对象, 也就是我们外面接收到的`contxet`, 并不是参数那个!
            // 这里是用call, 调用, 表示, 我们使用的外面传入的那个对象调用的了, 改变了this指向.
            // 开始执行next, 上面的this上, 挂载了黑白名单, 我们需要生产的axios参数. 我们把promsie需要的reslove再次传下去.
            next.call(context,middlewares,0,resolve); // 返回一个promise, 应该可以从代码层面控制, 一直到最后一个中间件执行完, 返回之后, 才能行.
        });
    }
}
```

### `ajax`伪代码

```js
const Router=require('../dist/index.js').default;
let router=new Router();
router.use('/test/output0',function(next){
    this.text+=0;
    console.log(0);
    next();
});
router.use('/test/output1',function(next){
    this.text+=1;
    console.log(1);
    next();
});
router.use('/test/output2',function(next){
    this.text+=2;
    console.log(2);
    next();
});
router.send({// 此处传入的对象, 会经过use中一系列的修改.
  // 返回的就是还是这个对象, 但是只执行white中的函数, 不执行black中的. 两个条件必须都满足
    whiteList:['/test'],
    blackList:['/test/output1'],
    text:''
}).then(function(context){
    console.log(context.text);
});
```
