# flutter无法更新

* 参考: [macOS终端使用代理网络 #131](https://github.com/FatliTalk/blog/issues/131)
* `flutter upgrade`无法更新

* 因为命令行没有链接外网

* 首先打开clash X的`允许来自局域网的链接`

```shell
 # 配置http访问的
export https_proxy=http://127.0.0.1:7890
# 配置https访问的
export http_proxy=http://127.0.0.1:7890

# 配置http和https访问 (外部控制设置)(也是盲猜)
export all_proxy=socks5://127.0.0.1:9090

# 取消代理
unset http_proxy
unset https_proxy
```
