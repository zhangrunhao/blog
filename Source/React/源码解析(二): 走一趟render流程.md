# React源码解携(二): 走一趟render流程

## 总结

* ![我看到的四者关系](https://zhangrunhao.oss-cn-beijing.aliyuncs.com/blog/react/react2.jpeg)

## render

```js
// 渲染函数
function render(element, container, callback) {
  // element: React.Component元素这个是react的工作, 等会看
  // container: 这个传入的dom元素
  // callback: 没传
  if (!isValidContainer(container)) { // 判断是否为合理的dom元素
    {
      throw Error( "Target container is not a DOM element." );
    }
  }

  {
    // 是否被标记问react的根元素
    var isModernRoot = isContainerMarkedAsRoot(container) && container._reactRootContainer === undefined;

    if (isModernRoot) {
      error('You are calling ReactDOM.render() on a container that was previously ' + 'passed to ReactDOM.createRoot(). This is not supported. ' + 'Did you mean to call root.render(element)?');
    }
  }

  // 将dom节点渲染到container中
  return legacyRenderSubtreeIntoContainer(null, element, container, false, callback);
}
```

## isValidContainer

```js
function isValidContainer(node) {
  // node: dom元素
  return !!(node && 
    (node.nodeType === ELEMENT_NODE || // 元素
    node.nodeType === DOCUMENT_NODE || // 整个文档
    node.nodeType === DOCUMENT_FRAGMENT_NODE || // 轻量级的Document对象
    node.nodeType === COMMENT_NODE && // 注释元素 就必须判断 node-value了 TODO: 这里不理解注释元素,是如何处理的
    node.nodeValue === ' react-mount-point-unstable ')
  );
}
```

## isContainerMarkedAsRoot

```js
var randomKey = Math.random().toString(36).slice(2);
var internalInstanceKey = '__reactFiber$' + randomKey;
var internalPropsKey = '__reactProps$' + randomKey;
var internalContainerInstanceKey = '__reactContainer$' + randomKey;
var internalEventHandlersKey = '__reactEvents$' + randomKey;
function precacheFiberNode(hostInst, node) {
  node[internalInstanceKey] = hostInst;
}
function markContainerAsRoot(hostRoot, node) {
  // hostRoot: RootFiber
  // node: containerDom
  // containerDom.__reactContainer = RootFiber
  node[internalContainerInstanceKey] = hostRoot;
}
function unmarkContainerAsRoot(node) {
  node[internalContainerInstanceKey] = null;
}
// 判断节点是否有internalContainerInstanceKey: TODO: 是否可以理解为判断根组件?
function isContainerMarkedAsRoot(node) {
  return !!node[internalContainerInstanceKey];
} 
```

## legacyRenderSubtreeIntoContainer

```js
// 过时的, 将子树渲染到Container中
function legacyRenderSubtreeIntoContainer(parentComponent, children, container, forceHydrate, callback) {
  // parentComponent: 父组件 null
  // children: 子组件 element
  // container: 挂载元素 container
  // forceHydrate: 是否为服务端渲染ssr
  // callback: 回调函数
  {
    topLevelUpdateWarnings(container); // 关于container 输出错误
    warnOnInvalidCallback$1(callback === undefined ? null : callback, 'render'); // 判断callback是否为一个函数
  }

  // fb开发者逗笑我了, 看源码呗, 这句话, 为啥打印了.
  // TODO: Without `any` type, Flow says "Property cannot be accessed on any
  // member of intersection type." Whyyyyyy.

  var root = container._reactRootContainer; // 获取根节点
  var fiberRoot; // fiber的根节点

  if (!root) { // 没获取到, 证明这个就是根节点
    // Initial mount
    root = container._reactRootContainer = legacyCreateRootFromDOMContainer(container, forceHydrate);
    // FiberRootNode
    fiberRoot = root._internalRoot;  // createContainer(container, tag, hydrate);

    if (typeof callback === 'function') { // 处理回调函数
      var originalCallback = callback;

      callback = function () {
        var instance = getPublicRootInstance(fiberRoot);
        originalCallback.call(instance);
      };
    } // Initial mount should not be batched.


    unbatchedUpdates(function () { // TODO: 执行更新流程, 明天再看
      updateContainer(children, fiberRoot, parentComponent, callback); // 这一步就把我们的children 渲染上去了
    });
  } else {
    fiberRoot = root._internalRoot;

    if (typeof callback === 'function') {
      var _originalCallback = callback;

      callback = function () {
        var instance = getPublicRootInstance(fiberRoot);

        _originalCallback.call(instance);
      };
    } // Update


    updateContainer(children, fiberRoot, parentComponent, callback);
  }

  return getPublicRootInstance(fiberRoot);
}
```

## topLevelUpdateWarnings

```js
{
  topLevelUpdateWarnings = function (container) {
    if (container._reactRootContainer && container.nodeType !== COMMENT_NODE) {
      // 首次执行的时候, container还不是根节点, 不会走到这里
      // 判断是否为根节点, 如果是的话, 类型不是注释节点
      var hostInstance = findHostInstanceWithNoPortals(container._reactRootContainer._internalRoot.current);
      if (hostInstance) {
        if (hostInstance.parentNode !== container) {
          error('render(...): It looks like the React-rendered content of this ' + 'container was removed without using React. This is not ' + 'supported and will cause errors. Instead, call ' + 'ReactDOM.unmountComponentAtNode to empty a container.');
        }
      }
    }

    var isRootRenderedBySomeReact = !!container._reactRootContainer;
    var rootEl = getReactRootElementInContainer(container); // 获取根元素, 第一遍渲染, 这里返回了null
    var hasNonRootReactChild = !!(rootEl && getInstanceFromNode(rootEl)); // false

    if (hasNonRootReactChild && !isRootRenderedBySomeReact) { // 首次不会走这里
      error('render(...): Replacing React-rendered children with a new root ' + 'component. If you intended to update the children of this node, ' + 'you should instead have the existing children update their state ' + 'and render the new components instead of calling ReactDOM.render.');
    }

    if (container.nodeType === ELEMENT_NODE && container.tagName && container.tagName.toUpperCase() === 'BODY') {
      // 如果是文档挂在了Body上, 报错. 因为有很多的第三方脚本和浏览器插件都放在body下面, react一更新就没了
      error('render(): Rendering components directly into document.body is ' + 'discouraged, since its children are often manipulated by third-party ' + 'scripts and browser extensions. This may lead to subtle ' + 'reconciliation issues. Try rendering into a container element created ' + 'for your app.');
    }
  };
}
```

## getReactRootElementInContainer

```js
function getReactRootElementInContainer(container) {
  if (!container) {
    return null;
  }

  if (container.nodeType === DOCUMENT_NODE) { // 如果是document, 就返回document元素
    return container.documentElement;
  } else {
    return container.firstChild; // 否则返回第一个元素, 但是这里是null, 因为后面没有元素了
  }
}
```

## warnOnInvalidCallback

```js
function warnOnInvalidCallback$1(callback, callerName) { // 判断callback是否为一个函数
  {
    if (callback !== null && typeof callback !== 'function') {
      error('%s(...): Expected the last optional `callback` argument to be a ' + 'function. Instead received: %s.', callerName, callback);
    }
  }
}
```

## legacyCreateRootFromDOMContainer

```js
// 从container中创建根节点
function legacyCreateRootFromDOMContainer(container, forceHydrate) {
  // container: 挂载节点
  // forceHydrate: 是否进行强制ssr
  // 判断是否进行ssr
  var shouldHydrate = forceHydrate || shouldHydrateDueToLegacyHeuristic(container); // First clear any existing content.

  if (!shouldHydrate) { // 不是ssr, 这里开始清空元素
    var warned = false;
    var rootSibling;

    while (rootSibling = container.lastChild) { // 判断根节点下面是否含有子元素
      {
        if (!warned && rootSibling.nodeType === ELEMENT_NODE && rootSibling.hasAttribute(ROOT_ATTRIBUTE_NAME)) { // 如果含有子元素, 并且子元素是react元素, 报错
          warned = true;

          error('render(): Target node has markup rendered by React, but there ' + 'are unrelated nodes as well. This is most commonly caused by ' + 'white-space inserted around server-rendered markup.');
        }
      }

      container.removeChild(rootSibling);
    }
  }

  {
    if (shouldHydrate && !forceHydrate && !warnedAboutHydrateAPI) { // 处理ssr?
      warnedAboutHydrateAPI = true;
      // React 18将会停止render 进行ssr更新, 并提供hydrate进行.
      warn('render(): Calling ReactDOM.render() to hydrate server-rendered markup ' + 'will stop working in React v18. Replace the ReactDOM.render() call ' + 'with ReactDOM.hydrate() if you want React to attach to the server HTML.');
    }
  }

  return createLegacyRoot(container, shouldHydrate ? {
    hydrate: true
  } : undefined);
}
```

## shouldHydrateDueToLegacyHeuristic

```js
function shouldHydrateDueToLegacyHeuristic(container) { // TODO: 返回根节点是否应该更新?
  var rootElement = getReactRootElementInContainer(container); // 获取根节点
  return !!(rootElement && rootElement.nodeType === ELEMENT_NODE && rootElement.hasAttribute(ROOT_ATTRIBUTE_NAME));
}
```

## createLegacyRoot

```js
// 创建根节点
function createLegacyRoot(container, options) {
  debugger
  return new ReactDOMBlockingRoot(container, LegacyRoot, options);
}

// 创建老的一种根节点
function ReactDOMBlockingRoot(container, tag, options) {
  this._internalRoot = createRootImpl(container, tag, options);
}
```

## createRootImpl

```js
// 创建根节点接口
function createRootImpl(container, tag, options) {
  // Tag is either LegacyRoot or Concurrent Root // tag表示, 你创建了一个老版本的root, 还是一个同时更新的root
  // 因为, 我们没有传入任何options
  var hydrate = options != null && options.hydrate === true; // false, 不是ssr
  var hydrationCallbacks = options != null && options.hydrationOptions || null; // null
  var mutableSources = options != null && options.hydrationOptions != null && options.hydrationOptions.mutableSources || null; // null
  var root = createContainer(container, tag, hydrate);
  // root就是FiberRootNode
  // FiberRootNode.containerInfo 指向了 container的dom元素
  // FiberRootNode.current 指向了 RootFiber
  // RootFiber.stateNode 指向了 FiberRootNode
  markContainerAsRoot(root.current, container);
  //  container的dom元素.__reactContainer$ = RootFiber
  var containerNodeType = container.nodeType;

  {
    var rootContainerElement = container.nodeType === COMMENT_NODE ? container.parentNode : container;
    listenToAllSupportedEvents(rootContainerElement); // 这里不再继续看事件的筛选添加过程.
  }

  if (mutableSources) { // 这是是false
    for (var i = 0; i < mutableSources.length; i++) {
      var mutableSource = mutableSources[i];
      registerMutableSourceForHydration(root, mutableSource);
    }
  }

  return root;
}

function createContainer(containerInfo, tag, hydrate, hydrationCallbacks) {
  // contanerInfo: container的dom节点
  // tag: 表示老的root, 还是新的同时更新的root节点
  // hydrate: ssr
  return createFiberRoot(containerInfo, tag, hydrate);
}

// 创建Fiber根节点
function createFiberRoot(containerInfo, tag, hydrate, hydrationCallbacks) {
  //  这里创建的fiber的根节点
  var root = new FiberRootNode(containerInfo, tag, hydrate);
  // root上挂载container的信息
  // stateNode is any.


  // 这里才是创建真正的fiber
  var uninitializedFiber = createHostRootFiber(tag);
  root.current = uninitializedFiber;
  uninitializedFiber.stateNode = root;
  initializeUpdateQueue(uninitializedFiber);
  return root;
}
```

## FiberRootNode

```js
function FiberRootNode(containerInfo, tag, hydrate) {
  this.tag = tag; // 表示老的root, 还是新的同时更新的root节点
  this.containerInfo = containerInfo; // container的dom节点
  this.pendingChildren = null;
  this.current = null;
  this.pingCache = null;
  this.finishedWork = null;
  this.timeoutHandle = noTimeout;
  this.context = null;
  this.pendingContext = null;
  this.hydrate = hydrate; // 是否ssr
  this.callbackNode = null;
  this.callbackPriority = NoLanePriority;
  this.eventTimes = createLaneMap(NoLanes);
  this.expirationTimes = createLaneMap(NoTimestamp);
  this.pendingLanes = NoLanes;
  this.suspendedLanes = NoLanes;
  this.pingedLanes = NoLanes;
  this.expiredLanes = NoLanes;
  this.mutableReadLanes = NoLanes;
  this.finishedLanes = NoLanes;
  this.entangledLanes = NoLanes;
  this.entanglements = createLaneMap(NoLanes);

  {
    this.mutableSourceEagerHydrationData = null;
  }

  {
    this.interactionThreadID = tracing.unstable_getThreadID();
    this.memoizedInteractions = new Set();
    this.pendingInteractionMap = new Map();
  }

  {
    switch (tag) {
      case BlockingRoot:
        this._debugRootType = 'createBlockingRoot()';
        break;

      case ConcurrentRoot:
        this._debugRootType = 'createRoot()';
        break;

      case LegacyRoot:
        this._debugRootType = 'createLegacyRoot()';
        break;
    }
  }
}
```

## createLaneMap

```js
function createLaneMap(initial) {
  // Intentionally pushing one by one.
  // https://v8.dev/blog/elements-kinds#avoid-creating-holes
  var laneMap = [];

  for (var i = 0; i < TotalLanes; i++) {
    laneMap.push(initial);
  }

  return laneMap;
}
```

## createHostRootFiber

```js
// 根据tab, 创建fiber的根节点
function createHostRootFiber(tag) {
  var mode;

  if (tag === ConcurrentRoot) { // 根据tab指定mode
    mode = ConcurrentMode | BlockingMode | StrictMode;
  } else if (tag === BlockingRoot) {
    mode = BlockingMode | StrictMode;
  } else {
    mode = NoMode;
  }

  if ( isDevToolsPresent) {
    // Always collect profile timings when DevTools are present.
    // This enables DevTools to start capturing timing at any point–
    // Without some nodes in the tree having empty base times.
    mode |= ProfileMode;
  }

  // 创建真正的节点
  return createFiber(HostRoot, null, null, mode);
}

var createFiber = function (tag, pendingProps, key, mode) {
  // $FlowFixMe: the shapes are exact here but Flow doesn't like constructors
  return new FiberNode(tag, pendingProps, key, mode);
};
```

## FiberNode

```js
function FiberNode(tag, pendingProps, key, mode) {
  // Instance
  this.tag = tag;
  this.key = key;
  this.elementType = null;
  this.type = null;
  this.stateNode = null; // Fiber

  this.return = null;
  this.child = null;
  this.sibling = null;
  this.index = 0;
  this.ref = null;
  this.pendingProps = pendingProps;
  this.memoizedProps = null;
  this.updateQueue = null;
  this.memoizedState = null;
  this.dependencies = null;
  this.mode = mode; // Effects

  this.flags = NoFlags;
  this.nextEffect = null;
  this.firstEffect = null;
  this.lastEffect = null;
  this.lanes = NoLanes;
  this.childLanes = NoLanes;
  this.alternate = null;

  {
    // Note: The following is done to avoid a v8 performance cliff.
    //
    // Initializing the fields below to smis and later updating them with
    // double values will cause Fibers to end up having separate shapes.
    // This behavior/bug has something to do with Object.preventExtension().
    // Fortunately this only impacts DEV builds.
    // Unfortunately it makes React unusably slow for some applications.
    // To work around this, initialize the fields below with doubles.
    //
    // Learn more about this here:
    // https://github.com/facebook/react/issues/14365
    // https://bugs.chromium.org/p/v8/issues/detail?id=8538
    this.actualDuration = Number.NaN;
    this.actualStartTime = Number.NaN;
    this.selfBaseDuration = Number.NaN;
    this.treeBaseDuration = Number.NaN; // It's okay to replace the initial doubles with smis after initialization.
    // This won't trigger the performance cliff mentioned above,
    // and it simplifies other profiler code (including DevTools).

    this.actualDuration = 0;
    this.actualStartTime = -1;
    this.selfBaseDuration = 0;
    this.treeBaseDuration = 0;
  }

  {
    // This isn't directly used but is handy for debugging internals:
    this._debugID = debugCounter++;
    this._debugSource = null;
    this._debugOwner = null;
    this._debugNeedsRemount = false;
    this._debugHookTypes = null;

    if (!hasBadMapPolyfill && typeof Object.preventExtensions === 'function') {
      Object.preventExtensions(this); // 让对象变得不能扩展
    }
  }
}
```

## initializeUpdateQueue

```js
function initializeUpdateQueue(fiber) { // 初始化更新队列
  var queue = {
    baseState: fiber.memoizedState, // null
    firstBaseUpdate: null,
    lastBaseUpdate: null,
    shared: {
      pending: null
    },
    effects: null
  }; // 啥啥都是null, 把队列返回出去
  fiber.updateQueue = queue;
}
```
