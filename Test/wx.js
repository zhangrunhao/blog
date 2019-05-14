const rq = require('request')
const axios = require('axios')
rq('http://api.k.sohu.com/api/usercenter/getWeiXinJsSign.go', function (error, response, body) {
  const sign = JSON.parse(body)
  const callbackURL = `www.baidu.com`
  axios.get(`https://open.weixin.qq.com/connect/oauth2/authorize?appid=${sign.appId}&redirect_uri=${callbackURL}&response_type=code&scope=snsapi_userinfo&state=state#wechat_redirect`, {
    headers: {
      'User-Agent': 'Mozilla/5.0 (iPhone; CPU iPhone OS 8_3 like Mac OS X) AppleWebKit/600.1.4 (KHTML, like Gecko) Mobile/12F70 MicroMessenger/6.1.5 NetType/WIFI'
    }
  }).then((e, a, b) => {
    if (e) console.log(e)
    console.log(a)
  })
})