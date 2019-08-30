
# 外链打开App无法获取图片问题

## 查看请求

### 错误请求

```js
Request URL: http://k.sohu.com/static/sugar-workshop/1907_cp/1.0.0/asset/topic1/topic1.png?timeStamp=1565773906487
Referrer Policy: no-referrer-when-downgrade
Provisional headers are shown
Origin: http://sugar.k.sohu.com
Referer: http://sugar.k.sohu.com/h5/1907_cp/index.html?p1=NjUyMTk5MTc5NzM2NjIzOTI3OQ%3D%3D&gid=02ffff1106111134460b19d1fb2c5a6ffa1ea6cc2c78d1&pid=-1&p2=NjcxNDIwMmYtNGI3ZC0zZmFmLWE3ZWQtZGQ0MGY0Y2E3YTY1&u=1&sdk=29&ver=6.2.6&mode=0
User-Agent: Mozilla/5.0 (Linux; Android 10; Pixel 2 XL Build/QPP6.190730.005; wv) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/76.0.3809.132 Mobile Safari/537.36 JsKit/1.0 (Android) Mozilla/5.0 (Linux; Android 10; Pixel 2 XL Build/QPP6.190730.005; wv) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/76.0.3809.132 Mobile Safari/537.36 JsKit/1.0 (Android)/SohuNews/6.2.6 BuildCode/611
timeStamp: 1565773906487
```

### 正确请求

```js
Request URL: http://k.sohu.com/static/sugar-workshop/1907_cp/1.0.0/asset/topic1/A.png?timeStamp=1565773906487
Request Method: GET
Status Code: 200 OK
Remote Address: 123.126.104.7:80
Referrer Policy: no-referrer-when-downgrade
Accept-Ranges: bytes
Access-Control-Allow-Origin: *
Cache-Control: max-age=2592000
Connection: keep-alive
Content-Length: 23873
Content-Type: image/png
Date: Thu, 29 Aug 2019 09:23:15 GMT
ETag: "5d527e3d-5d41"
Expires: Sat, 28 Sep 2019 09:23:15 GMT
FSS-Proxy: Powered by 2931912.4111570.4024538
Last-Modified: Tue, 13 Aug 2019 09:09:17 GMT
Server: openresty/1.11.2.2
Provisional headers are shown
Origin: http://sugar.k.sohu.com
Referer: http://sugar.k.sohu.com/h5/1907_cp/index.html?p1=NjUyMTk5MTc5NzM2NjIzOTI3OQ%3D%3D&gid=02ffff1106111134460b19d1fb2c5a6ffa1ea6cc2c78d1&pid=-1&p2=NjcxNDIwMmYtNGI3ZC0zZmFmLWE3ZWQtZGQ0MGY0Y2E3YTY1&u=1&sdk=29&ver=6.2.6&mode=0
User-Agent: Mozilla/5.0 (Linux; Android 10; Pixel 2 XL Build/QPP6.190730.005; wv) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/76.0.3809.132 Mobile Safari/537.36 JsKit/1.0 (Android) Mozilla/5.0 (Linux; Android 10; Pixel 2 XL Build/QPP6.190730.005; wv) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/76.0.3809.132 Mobile Safari/537.36 JsKit/1.0 (Android)/SohuNews/6.2.6 BuildCode/611
timeStamp: 1565773906487
```

## 去掉请求图片跨域

### 外链调用app

* crossOrigin: true 无法加载图片
* crossOrigin: false 正常加载图片, 最后无法绘制图片

### 直接打开app

* crossOrigin: true 正常加载图片, 最后正常绘制图片
* * crossOrigin: false 正常加载图片, 最后无法绘制图片

## 错误

### 对比错误

* 使用ture 访问 不允许跨域图片 (新浪图片, 值为空了)
* `Access-Control-Allow-Origin`请求头中包含无效值 ''.

```js
test.html:1 Access to image at 'http://simg.sinajs.cn/blog7newtpl/image/30/30_1/images/modelhead.png' from origin 'http://10.2.155.67:6622' has been blocked by CORS policy: The 'Access-Control-Allow-Origin' header contains the invalid value ''.

simg.sinajs.cn/blog7newtpl/image/30/30_1/images/modelhead.png:1 GET http://simg.sinajs.cn/blog7newtpl/image/30/30_1/images/modelhead.png net::ERR_FAILED
```

* 正常打开, 使用true 访问 不需要跨域图片 (马杨图片)
* 请求的资源中不含有 `Access-Control-Allow-Origin`头部

```js
Access to image at 'http://mayang.wicp.vip/uploads/2019/6/1559785470103.jpg' from origin 'http://10.2.155.67:6622' has been blocked by CORS policy: No 'Access-Control-Allow-Origin' header is present on the requested resource.
```

* 外链打开app, 使用true, 访问允许跨域图片
* 请求的资源中不含有`Access-Control-Allow-Origin`头部, 因此不允许.

```js
Access to Image at 'http://k.sohu.com/static/sugar-workshop/1907_cp/1.0.0/asset/topic1/A.png' from origin 'http://10.2.155.67:6622' has been blocked by CORS policy: No 'Access-Control-Allow-Origin' header is present on the requested resource. Origin 'http://10.2.155.67:6622' is therefore not allowed access.
```

### 错误总结

* 如果服务器没有设置允许跨域的话, 使用跨域方式访问, 报错
* 通过外链打开app, 访问允许跨域的图片, 报同样错误
* 猜测外链打开app, 和直接打开app启动webview的方式不同
