// browser.js
// 端外环境 替换 jsKit Api
// ===============================

console.log(111)
var jsKitClient = {};

var commonApi = {};

commonApi.getNetworkInfo = function (callback) {
  var data = {
    type: ''
  };

  callback && callback(data);

  return data;
};

commonApi.getPrivateInfo = function (callback) {
  var data = {
    type: ''
  };

  callback && callback(data);

  return data;
};

commonApi.getRequestParam = function () {
  return {
    platform: ''
  };
};

commonApi.getAppInfo = function () {
  return {
    platform: '',
    version: '1.0'
  };
};
commonApi.authenticationPost = function () {
  return {
    
  }
};
var widgetApi = {};
widgetApi.toast = function (val, type) {

};


var jsKitStorage = {};
jsKitStorage.getItem = function(key) {
  return localStorage.getItem(key);
};

jsKitStorage.setItem = function(key, val) {
  return localStorage.setItem(key, val);
};


var jsKitCoreApi = {};
jsKitCoreApi.getStorageItem = function(scope,key) {
  return localStorage.getItem(key);
}

var newsApi = {};
newsApi.showLoadingView = function() {

};

newsApi.showTitle = function () {

};

newsApi.showShareBtn = function () {

};

newsApi.comPraiseForUrl = function () {

};


// export
window.jsKitClient = jsKitClient;
window.commonApi = commonApi;
window.widgetApi = widgetApi;
window.jsKitStorage = jsKitStorage;
window.newsApi = newsApi;
window.jsKitCoreApi = jsKitCoreApi;

// TODO: 简单满足 special.js 需求，后续添加完成








// jsKit.js
// ================================


// window.nativeObjectGraph = { // 当前webview下面挂载的方法
//   newsApi: [
//     ‘jsSendSubInfo’,
//     ‘scrollViewDidbounces’
//   ],
//   commonApi: [
//     ‘upAGif’,
//     ‘exposureStat’
//   ]
// };

// console.log(window.KKJSBridge)  

if (window.KKJSBridge) {
  let apiObj = window.nativeObjectGraph;

  console.log(window.nativeObjectGraph);

  for (let moduleName in apiObj) {
    window[moduleName] = {};
    for (let i = 0, len = apiObj[moduleName].length; i < len; i++) {

      let apiName = apiObj[moduleName][i];

      window[moduleName][apiName] = function () {
        
        let parametersArr = Array.prototype.slice.call(arguments);
        let parameters = {};
        let callbackArr = [];
        if (parametersArr) {
          parametersArr.forEach(function (item, index) {
            parameters[index] = item;
            if (typeof item == 'function') {
              callbackArr.push(item);
            }
          });
        }
        
        let result = window.KKJSBridge.syncCall(moduleName, apiName, parameters);


        let resultData = result ? result.value : '';

        if (resultData) { // 同步  函数前端回调
          callbackArr.forEach(function (item) {
            item(resultData);
          });
        }

        return resultData;
      };

    }
  }


  window.commonApi.getDeviceInfo = function () {

    let parametersArr = Array.prototype.slice.call(arguments);

    if (parametersArr) {
      parametersArr.forEach(function (item) {
        if (typeof item == 'function') {
          item(window.deviceInfo);
        }
      });
    }

    return window.deviceInfo;
  };

  window.commonApi.getAppInfo = function () {

    let parametersArr = Array.prototype.slice.call(arguments);
    if (parametersArr) {
      parametersArr.forEach(function (item) {
        if (typeof item == 'function') {
          item(window.appInfo);
        }
      });
    }
    
    return window.appInfo;
  };

  window.commonApi.archivePath = function () {
    return window.archivePath;
  };
}



var jsKitClient = function () {
  var client = {};
  client.isReady = false;
  var a = / JsKit\/([\.\d]*) \((\w*)\)/;
  var result = a.exec(navigator.userAgent);
  if (result) {
    client.hasNativeSupport = true;
    client.version = result[1];
    client.platform = result[2];
  } else {
    client.hasNativeSupport = false;
    client.version = '0';
    client.platform = 'browser';
  }


  //iOS 无法注入_jsKitN对象，使用xhr请求代替
  var _jsKitN;
  if (client.platform == 'iOS' && !window.KKJSBridge) {


    var clientIdRegex = /jsKitClientId=(\d*)/;
    var clientId = clientIdRegex.exec(window.location)[1];
    _jsKitN = {};
    _jsKitN.callCount = new Date().getTime();
    _jsKitN.callNative = function (objName, methodName, args) {
      var xmlHttp = new XMLHttpRequest();
      _jsKitN.callCount++;
      xmlHttp.open('POST', '/' + clientId + '/' + objName + '/' + methodName + '/call.jskitbridge?callCount=' + _jsKitN.callCount, false);
      xmlHttp.send(args);
      return xmlHttp.response;
    };
    _jsKitN.getInitScript = function () {
      return JSON.parse(this.callNative('_jsKitN', 'getInitScript', '[]'))[0];
    }
    window._jsKitN = _jsKitN;
  }
  _jsKitN = window._jsKitN;
  if (typeof _jsKitN == "undefined") {
    _jsKitN = {};
    _jsKitN.getInitScript = function () {
      return ""
    };
    window._jsKitN = _jsKitN;
  }
  var jsKit = {};
  window.jsKit = jsKit;
  jsKit.create = function (parent) {
    var f = function () {
    };
    f.prototype = parent;
    return new f();
  };
  jsKit.createCallNativeFun = function (method, resultObject) {
    return function (resultCallBack) {
      var args = [];
      var hasCallback = typeof resultCallBack == 'function';
      for (var i = (hasCallback ? 1 : 0), c = arguments.length; i < c; i++) {
        args.push(arguments[i]);
      }
      var result = _jsKitN.callNative(this._jsKitName, method, JSON.stringify(args));
      result = resultObject ? eval(result) : JSON.parse(result)[0];
      if (hasCallback) {
        resultCallBack(result);
      } else {
        return result;
      }
    };
  };
  client._callbacks = {};
  client._callbacksCount = 0;
  client._createFunctionId = function (callback) {
    var callId = "_jsKitFunCallback_" + (++this._callbacksCount);
    this._callbacks[callId] = callback;
    return callId;
  };
  jsKit.createCallNativeFunWithCallback = function (method, resultObject) {
    return function () {
      var args = [];
      for (var i = 0, c = arguments.length; i < c; i++) {
        var arg = arguments[i];
        if ((typeof arg) == 'function') {
          args.push(client._createFunctionId(arg));
        } else {
          args.push(arg);
        }
      }
      var result = _jsKitN.callNative(this._jsKitName, method, JSON.stringify(args));
      result = resultObject ? eval(result) : JSON.parse(result)[0];
      return result;
    };
  };
  jsKit.createInstance = function (name, type) {
    var i = jsKit.create(type);
    i._jsKitName = name;
    return i;
  };
  jsKit.newInstance = function (name, type) {
    window[name] = jsKit.createInstance(name, type);
  };
  jsKit.addMethod = function (obj, method, resultObject) {
    obj[method] = jsKit.createCallNativeFun(method, resultObject);
  };
  jsKit.addMethodWithCallback = function (obj, method, resultObject) {
    obj[method] = jsKit.createCallNativeFunWithCallback(method, resultObject);
  };
  jsKit.init = function () {
    eval(_jsKitN.getInitScript(window.location.pathname));
  };

  client.pageCached = document.getElementsByName("jskit_page_cached").length != 0;
  client.cachePage = function () {
    if (!this.pageCached) {
      var jskit_page_cached = document.createElement("meta");
      jskit_page_cached.name = "jskit_page_cached";
      jskit_page_cached.content = "true";
      document.getElementsByTagName("head")[0].appendChild(jskit_page_cached);
      this.pageCached = true;
    }
    jsKitStorage.setItem("jskit_page_cache_" + location.href, document.getElementsByTagName("html")[0].innerHTML);
  }

  client.enableAjaxCrossDomain = function () {
    if (this.hasNativeSupport) {
      XMLHttpRequest.prototype.old_open = XMLHttpRequest.prototype.open;
      XMLHttpRequest.prototype.open = function (method, url, async, user, password) {
        this.old_open(method, "/jskitbridge/cross_domain?url=" + encodeURIComponent(url), async, user, password);
      }
    }
  }

  client.setDeviceReady = function () {
    this.isReady = true;
    if (this.readyListener) {
      this.readyListener(this.pageCached);
    }
  };
  client.init = function () {
    if (!this.isReady) {
      jsKit.init();
      var evt = document.createEvent('HTMLEvents');
      evt.initEvent('jsKitReady', false, false);
      window.dispatchEvent(evt);
      this.setDeviceReady();
    }
    this.setDeviceReady();
  };
  client.onDeviceReady = function (readyListener) {
    this.readyListener = readyListener;
    this.init();
  };



  client._notificationListeneres = {};
  client.addNotificationListener = function (action, listener) { // h5先挂listener 生成键值对 _dispatchNotificationFromNative才有效

    window.KKJSBridge && window.KKJSBridge.on(action, function (result) {
      listener(result.action, result.data);
    });

    this._notificationListeneres[action] = listener;

  };
  client._dispatchNotificationFromNative = function (action, data) {
    if (this._notificationListeneres.hasOwnProperty(action)) {
      this._notificationListeneres[action](action, data);
    }
  };
  client.dispatchNotification = function (action, data) {
    if (window.KKJSBridge) {

      window.KKJSBridge.call('notificationCenter', 'postNotification', {
          action,
          data
      });
    }else {

      _jsKitNotification.dispatchNotification(action, data);

    }
  };


  client.setAttr = function (tagName, attrName, value) {
    var allTag = document.getElementsByTagName(tagName);
    for (var i = 0,
           c = allTag.length; i < c; i++) {
      allTag[i][attrName] = value;
    }
  };
  client.setImageShowMode = function (show) {
    var allTag = document.getElementsByTagName('img');
    var regImageMode = /jsKitImageMode=([^\?&])/;
    for (var i = 0, c = allTag.length; i < c; i++) {
      var imgTag = allTag[i];
      if (!imgTag.hasOwnProperty('data')) {
        imgTag.data = {};
      }
      if (!imgTag.data.hasOwnProperty('originSrc')) {
        imgTag.data.originSrc = imgTag.src;
      }
      if (show) { //show image
        var imgSrc = imgTag.data.originSrc;
        if (regImageMode.exec(imgSrc)) {
          imgSrc = imgSrc.replace(regImageMode, 'jsKitImageMode=' + show);
        } else {
          imgSrc += (((imgSrc.indexOf('?') == -1) ? '?' : '&') + 'jsKitImageMode=' + show);
        }
        imgTag.src = imgSrc;
      } else { //no image
        imgTag.src = '';
      }
    }
  };
  client.addNotificationListener('com.sohu.jskit.action.setImageMode', function (action, data) {
    client.setImageShowMode(data);
  });
  client.init();
  return client;
}();

window.jsBridgeClient = window.jsKitClient = jsKitClient;

// module.exports = jsKitClient;