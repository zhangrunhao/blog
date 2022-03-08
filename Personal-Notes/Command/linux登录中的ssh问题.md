# ssh登录报错

```shell
IT IS POSSIBLE THAT SOMEONE IS DOING SOMETHING NASTY! Someone could be eavesdropping on you right now (man-in-the-middle attack)! It is also possible that a host key has just been changed. The fingerprint for the ED25519 key sent by the remote host is SHA256:Xv0t7qduicxnIEY0BSxTl1OPE9nE3+fDJ27Wc+GQzR4. Please contact your system administrator. Add correct host key in /Users/zhangrunhao/.ssh/known_hosts to get rid of this message. Offending ECDSA key in /Users/zhangrunhao/.ssh/known_hosts:36 Host key for 101.43.215.206 has changed and you have requested strict checking. Host key verification faile
```

> 参考: [SSH連線出現錯誤](https://ithelp.ithome.com.tw/articles/10083004)

```shell
[root@localhost ~]# vim /root/.ssh/known_hosts
#把有問題的192.168.2.151 KEY刪掉
```

第一个命令就解决问题
