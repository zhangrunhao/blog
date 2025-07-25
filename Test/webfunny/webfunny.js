!(function (n) {
  var o = {};
  function r(e) {
    if (o[e]) return o[e].exports;
    var t = (o[e] = { i: e, l: !1, exports: {} });
    return n[e].call(t.exports, t, t.exports, r), (t.l = !0), t.exports;
  }
  (r.m = n),
    (r.c = o),
    (r.d = function (e, t, n) {
      r.o(e, t) || Object.defineProperty(e, t, { enumerable: !0, get: n });
    }),
    (r.r = function (e) {
      "undefined" != typeof Symbol &&
        Symbol.toStringTag &&
        Object.defineProperty(e, Symbol.toStringTag, { value: "Module" }),
        Object.defineProperty(e, "__esModule", { value: !0 });
    }),
    (r.t = function (t, e) {
      if ((1 & e && (t = r(t)), 8 & e)) return t;
      if (4 & e && "object" == typeof t && t && t.__esModule) return t;
      var n = Object.create(null);
      if (
        (r.r(n),
        Object.defineProperty(n, "default", { enumerable: !0, value: t }),
        2 & e && "string" != typeof t)
      )
        for (var o in t)
          r.d(
            n,
            o,
            function (e) {
              return t[e];
            }.bind(null, o)
          );
      return n;
    }),
    (r.n = function (e) {
      var t =
        e && e.__esModule
          ? function () {
              return e.default;
            }
          : function () {
              return e;
            };
      return r.d(t, "a", t), t;
    }),
    (r.o = function (e, t) {
      return Object.prototype.hasOwnProperty.call(e, t);
    }),
    (r.p = ""),
    r((r.s = 0));
})([
  function (e, t, n) {
    e.exports = n(1);
  },
  function (e, t, n) {
    var o, m, r, i, a;
    !(function (C) {
      sessionStorage || (C.sessionStorage = {}),
        localStorage || (C.localStorage = {}),
        C.webfunnyRequests || (C.webfunnyRequests = []);
      var x = C.localStorage,
        E = x.WF_CONFIG
          ? JSON.parse(x.WF_CONFIG)
          : {
              s: !0,
              ia: [""],
              wc: 40,
              pv: { s: true, ia: [""] },
              je: { s: true, ia: [""] },
              hl: { s: true, ia: [""], uh: !1, rl: 500, sl: 500 },
              rl: { s: true, ia: [""] },
              bl: { s: true },
              lc: { s: false },
            },
        i = C.location.href.split("?")[0],
        a = performance && performance.timing,
        N =
          performance && "function" == typeof performance.getEntries
            ? performance.getEntries()
            : null,
        s =
          sessionStorage.CUSTOMER_WEB_MONITOR_ID || "webfunny_20211226_123743",
        t = "3.0.26",
        e = -1 === C.location.href.indexOf("https") ? "http://" : "https://",
        f = C.location.href,
        n = e + "localhost:8011",
        d = "/server/upLog",
        g = "/server/upDLog",
        u = n + d,
        c = n + g,
        I = "CUSTOMER_PV",
        o = "STAY_TIME",
        r = "CUS_LEAVE",
        l = "LOAD_PAGE",
        v = "HTTP_LOG",
        p = "JS_ERROR",
        h = "SCREEN_SHOT",
        m = "ELE_BEHAVIOR",
        w = "RESOURCE_LOAD",
        y = "CUSTOMIZE_BEHAVIOR",
        b = "VIDEOS_EVENT",
        _ = "LAST_BROWSE_DATE",
        T = "WM_PAGE_ENTRY_TIME",
        $ = "WM_VISIT_PAGE_COUNT",
        k = new (function () {
          (this.checkIgnore = function (e, t) {
            for (
              var n = t.replace(/ /g, ""), o = E[e].ia || [], r = !0, i = 0;
              i < o.length;
              i++
            ) {
              var a = o[i].replace(/ /g, "");
              if (a && -1 != n.indexOf(a)) {
                r = !1;
                break;
              }
            }
            return r;
          }),
            (this.getIp = function (n) {
              if ("1" != k.getWfCookie("wf_cj_status"))
                if (k.getWfCookie("wf_ip")) "function" == typeof n && n();
                else {
                  var o = new Date().getTime() + 864e5;
                  k.loadJs(
                    e + "pv.sohu.com/cityjson?ie=utf-8",
                    function () {
                      if (C.returnCitySN) {
                        var e = C.returnCitySN ? C.returnCitySN.cip : "",
                          t = encodeURIComponent(
                            C.returnCitySN ? C.returnCitySN.cname : ""
                          );
                        k.setWfCookie("wf_ip", e, o),
                          k.setWfCookie("wf_prov", t, o),
                          "function" == typeof n && n();
                      }
                    },
                    function () {
                      k.setWfCookie("wf_cj_status", 1, o),
                        "function" == typeof n && n();
                    }
                  );
                }
              else "function" == typeof n && n();
            }),
            (this.getUuid = function () {
              var e = k.formatDate(new Date().getTime(), "yMdhms");
              return (
                "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(
                  /[xy]/g,
                  function (e) {
                    var t = (16 * Math.random()) | 0;
                    return ("x" == e ? t : (3 & t) | 8).toString(16);
                  }
                ) +
                "-" +
                e
              );
            }),
            (this.getCustomerKey = function () {
              var e = this.getUuid(),
                t = k.getWfCookie("monitorCustomerKey");
              if (!t) {
                var n = new Date().getTime() + 31104e7;
                k.setWfCookie("monitorCustomerKey", e, n), (t = e);
              }
              return t;
            }),
            (this.setWfCookie = function (e, t, n) {
              var o = { data: t, expires: n };
              if (x.WEBFUNNY_COOKIE) {
                var r = JSON.parse(x.WEBFUNNY_COOKIE);
                (r[e] = o), (x.WEBFUNNY_COOKIE = JSON.stringify(r));
              } else {
                var i = {};
                (i[e] = o), (x.WEBFUNNY_COOKIE = JSON.stringify(i));
              }
            }),
            (this.getWfCookie = function (e) {
              var t = null;
              if (x.WEBFUNNY_COOKIE) {
                var n = (t = JSON.parse(x.WEBFUNNY_COOKIE))[e];
                return n
                  ? parseInt(n.expires, 10) < new Date().getTime()
                    ? (delete t[e], (x.WEBFUNNY_COOKIE = JSON.stringify(t)), "")
                    : n.data
                  : "";
              }
              return "";
            }),
            (this.isTodayBrowse = function (e) {
              var t = x[e],
                n =
                  new Date().getFullYear() +
                  "-" +
                  (new Date().getMonth() + 1) +
                  "-" +
                  new Date().getDate();
              return t && n == t ? !(!t || n != t) : ((x[e] = n), !1);
            }),
            (this.formatDate = function (e, t) {
              var n = new Date(e).getFullYear(),
                o = new Date(e).getMonth() + 1,
                r = new Date(e).getDate(),
                i = new Date(e).getHours(),
                a = new Date(e).getMinutes(),
                s = new Date(e).getSeconds();
              return (
                (o = 9 < o ? o : "0" + o),
                (r = 9 < r ? r : "0" + r),
                (i = 9 < i ? i : "0" + i),
                (a = 9 < a ? a : "0" + a),
                (s = 9 < s ? s : "0" + s),
                t
                  .replace("y", n)
                  .replace("M", o)
                  .replace("d", r)
                  .replace("h", i)
                  .replace("m", a)
                  .replace("s", s)
              );
            }),
            (this.getPageKey = function () {
              var e = this.getUuid();
              return (
                (x.monitorPageKey &&
                  /^[0-9a-z]{8}(-[0-9a-z]{4}){3}-[0-9a-z]{12}-\d{13}$/.test(
                    x.monitorPageKey
                  )) ||
                  (x.monitorPageKey = e),
                x.monitorPageKey
              );
            }),
            (this.setPageKey = function () {
              x.monitorPageKey = this.getUuid();
            }),
            (this.addLoadEvent = function (e) {
              var t = C.onload;
              "function" != typeof C.onload
                ? (C.onload = e)
                : (C.onload = function () {
                    t(), e();
                  });
            }),
            (this.addOnBeforeUnloadEvent = function (e) {
              var t = C.onbeforeunload;
              "function" != typeof C.onbeforeunload
                ? (C.onbeforeunload = e)
                : (C.onbeforeunload = function () {
                    t(), e();
                  });
            }),
            (this.addOnclickForDocument = function (e) {
              var t = document.onclick;
              "function" != typeof document.onclick
                ? (document.onclick = e)
                : (document.onclick = function () {
                    t(), e();
                  });
            }),
            (this.ajax = function (e, t, n, o, r) {
              try {
                var i = C.XMLHttpRequest
                  ? new XMLHttpRequest()
                  : new ActiveXObject("Microsoft.XMLHTTP");
                i.open(e, t, !0),
                  i.setRequestHeader(
                    "Content-Type",
                    "application/x-www-form-urlencoded"
                  ),
                  (i.onreadystatechange = function () {
                    if (4 == i.readyState) {
                      var t = {};
                      try {
                        t = i.responseText ? JSON.parse(i.responseText) : {};
                      } catch (e) {
                        t = {};
                      }
                      "function" == typeof o && o(t);
                    }
                  }),
                  (i.onerror = function () {
                    "function" == typeof r && r();
                  });
                var a = JSON.stringify(n || {});
                i.send("data=" + a);
              } catch (e) {}
            }),
            (this.upLog = function (e, i) {
              e &&
                "undefined" != e &&
                k.ajax(
                  "POST",
                  u,
                  { logInfo: e },
                  function (e) {
                    if (e && e.data && e.data.d) {
                      x.ds = "c" == e.data.d ? "connected" : "disconnect";
                      var t = e.data.c;
                      if (t) {
                        x.setItem("WF_CONFIG", e.data.c);
                        var n = JSON.parse(t);
                        if (0 == (E = n).s) {
                          var o = new Date().getTime() + 6e5;
                          k.setWfCookie("webfunnyStart", "p", o);
                        }
                      }
                    }
                    if (!0 === i)
                      for (var r = 0; r < L.length; r++) x[L[r]] = "";
                  },
                  function () {
                    if (!0 === i)
                      for (var e = 0; e < L.length; e++) x[L[e]] = "";
                  }
                );
            }),
            (this.initDebugTool = function () {
              var a = (x.wmUserInfo ? JSON.parse(x.wmUserInfo) : {}).userId;
              function t(e) {
                for (var t = [], n = e.length, o = 0; o < n; o++) t.push(e[o]);
                var r = {};
                (r.log = t),
                  (r.userId = a),
                  (r.happenTime = new Date().getTime());
                var i = "";
                try {
                  i = k.b64Code(JSON.stringify(r));
                } catch (e) {
                  i = "convert fail";
                }
                return i;
              }
              var n = console.log,
                o = console.warn;
              (console.log = function () {
                var e = t(arguments);
                return (
                  "connected" === x.ds &&
                    k.ajax("POST", c, { consoleInfo: e }, function () {}),
                  n.apply(console, arguments)
                );
              }),
                (console.warn = function () {
                  var e = t(arguments);
                  return (
                    "connected" === x.ds &&
                      k.ajax("POST", c, { warnInfo: e }, function () {}),
                    o.apply(console, arguments)
                  );
                });
            }),
            (this.uploadLocalInfo = function () {
              var e = (x.wmUserInfo ? JSON.parse(x.wmUserInfo) : {}).userId,
                t = {};
              for (var n in x)
                "function" == typeof x[n] ||
                  -1 != L.indexOf(n) ||
                  1e3 < x[n].length ||
                  (t[n] = x[n]);
              try {
                t = k.b64Code(JSON.stringify(t));
              } catch (e) {
                t = "";
              }
              var o = {};
              for (var n in sessionStorage)
                "function" == typeof sessionStorage[n] ||
                  -1 != L.indexOf(n) ||
                  1e3 < sessionStorage[n].length ||
                  (o[n] = sessionStorage[n]);
              try {
                o = k.b64Code(JSON.stringify(o));
              } catch (e) {
                o = "";
              }
              var r = k.b64Code(document.cookie);
              k.ajax(
                "POST",
                c,
                { localInfo: t, sessionInfo: o, cookieInfo: r, userId: e },
                function (e) {
                  if (
                    (setTimeout(function () {
                      k.uploadLocalInfo();
                    }, 2e4),
                    e.data) &&
                    1 == e.data.clear
                  ) {
                    var t = x.wmUserInfo;
                    localStorage.clear(),
                      (localStorage.wmUserInfo = t),
                      sessionStorage.clear(),
                      (x.WEBFUNNY_COOKIE = "");
                  }
                }
              );
            }),
            (this.encryptObj = function (e) {
              if (e instanceof Array) {
                for (var t = [], n = 0; n < e.length; ++n)
                  t[n] = this.encryptObj(e[n]);
                return t;
              }
              if (e instanceof Object) {
                t = {};
                for (var n in e) t[n] = this.encryptObj(e[n]);
                return t;
              }
              return (
                50 < (e += "").length &&
                  (e =
                    e.substring(0, 10) +
                    "****" +
                    e.substring(e.length - 9, e.length)),
                e
              );
            }),
            (this.getDevice = function () {
              var e = {},
                t = navigator.userAgent,
                n = t.match(/(Android);?[\s\/]+([\d.]+)?/),
                o = t.match(/(iPad).*OS\s([\d_]+)/),
                r = !o && t.match(/(iPhone\sOS)\s([\d_]+)/),
                i = t.match(/Android\s[\S\s]+Build\//),
                a = C.screen.width,
                s = C.screen.height;
              if (
                ((e.ios = e.android = e.iphone = e.ipad = e.androidChrome = !1),
                (e.isWeixin = /MicroMessenger/i.test(t)),
                (e.os = "web"),
                (e.deviceName = "PC"),
                (e.deviceSize = a + "×" + s),
                n &&
                  ((e.os = "android"),
                  (e.osVersion = n[2]),
                  (e.android = !0),
                  (e.androidChrome = 0 <= t.toLowerCase().indexOf("chrome"))),
                (o || r) && ((e.os = "ios"), (e.ios = !0)),
                r && ((e.osVersion = r[2].replace(/_/g, ".")), (e.iphone = !0)),
                o && ((e.osVersion = o[2].replace(/_/g, ".")), (e.ipad = !0)),
                e.ios &&
                  e.osVersion &&
                  0 <= t.indexOf("Version/") &&
                  "10" === e.osVersion.split(".")[0] &&
                  (e.osVersion = t
                    .toLowerCase()
                    .split("version/")[1]
                    .split(" ")[0]),
                e.iphone)
              ) {
                var c = "iphone";
                320 === a && 480 === s
                  ? (c = "4")
                  : 320 === a && 568 === s
                  ? (c = "5/SE")
                  : 375 === a && 667 === s
                  ? (c = "6/7/8")
                  : 414 === a && 736 === s
                  ? (c = "6/7/8 Plus")
                  : 375 === a && 812 === s
                  ? (c = "X/S/Max")
                  : 414 === a && 896 === s
                  ? (c = "11/Pro-Max")
                  : 375 === a && 812 === s
                  ? (c = "11-Pro/mini")
                  : 390 === a && 844 === s
                  ? (c = "12/Pro")
                  : 428 === a && 926 === s && (c = "12-Pro-Max"),
                  (e.deviceName = "iphone " + c);
              } else if (e.ipad) e.deviceName = "ipad";
              else if (i) {
                for (var f = i[0].split(";"), u = "", l = 0; l < f.length; l++)
                  -1 != f[l].indexOf("Build") &&
                    (u = f[l].replace(/Build\//g, ""));
                "" == u && (u = f[1]),
                  (e.deviceName = u.replace(/(^\s*)|(\s*$)/g, ""));
              }
              if (-1 == t.indexOf("Mobile")) {
                var p = navigator.userAgent.toLowerCase();
                if (((e.browserName = "其他"), 0 < p.indexOf("msie"))) {
                  var h = p.match(/msie [\d.]+;/gi)[0];
                  (e.browserName = "ie"), (e.browserVersion = h.split("/")[1]);
                } else if (0 < p.indexOf("edg")) {
                  h = p.match(/edg\/[\d.]+/gi)[0];
                  (e.browserName = "edge"),
                    (e.browserVersion = h.split("/")[1]);
                } else if (0 < p.indexOf("firefox")) {
                  h = p.match(/firefox\/[\d.]+/gi)[0];
                  (e.browserName = "firefox"),
                    (e.browserVersion = h.split("/")[1]);
                } else if (0 < p.indexOf("safari") && p.indexOf("chrome") < 0) {
                  h = p.match(/safari\/[\d.]+/gi)[0];
                  (e.browserName = "safari"),
                    (e.browserVersion = h.split("/")[1]);
                } else if (0 < p.indexOf("chrome")) {
                  h = p.match(/chrome\/[\d.]+/gi)[0];
                  (e.browserName = "chrome"),
                    (e.browserVersion = h.split("/")[1]),
                    0 < p.indexOf("360se") && (e.browserName = "360");
                }
              }
              return (
                (e.webView = (r || o) && t.match(/.*AppleWebKit(?!.*Safari)/i)),
                e
              );
            }),
            (this.loadJs = function (e, t, n) {
              var o = document.createElement("script");
              (o.async = 1),
                (o.src = e),
                (o.onload = t),
                "function" == typeof n && (o.onerror = n);
              var r = document.getElementsByTagName("script")[0];
              return r.parentNode.insertBefore(o, r), r;
            }),
            (this.b64Code = function (e) {
              var t = encodeURIComponent(e);
              try {
                return btoa(
                  encodeURIComponent(t).replace(
                    /%([0-9A-F]{2})/g,
                    function (e, t) {
                      return String.fromCharCode("0x" + t);
                    }
                  )
                );
              } catch (e) {
                return t;
              }
            });
        })(),
        O = k.getDevice(),
        S = x.wmUserInfo ? JSON.parse(x.wmUserInfo) : {},
        L = [m, p, v, h, I, l, w, y, b],
        j = [];
      function D() {
        this.handleLogInfo = function (e, t) {
          if (t) {
            var n = x[e] ? x[e] : "";
            switch (e) {
              case m:
                x[m] = n + JSON.stringify(t) + "$$$";
                break;
              case p:
                x[p] = n + JSON.stringify(t) + "$$$";
                break;
              case v:
                x[v] = n + JSON.stringify(t) + "$$$";
                break;
              case h:
                x[h] = n + JSON.stringify(t) + "$$$";
                break;
              case I:
                x[I] = n + JSON.stringify(t) + "$$$";
                break;
              case l:
                x[l] = n + JSON.stringify(t) + "$$$";
                break;
              case w:
                x[w] = n + JSON.stringify(t) + "$$$";
                break;
              case y:
                x[y] = n + JSON.stringify(t) + "$$$";
                break;
              case b:
                x[b] = n + JSON.stringify(t) + "$$$";
            }
          }
        };
      }
      function M() {
        (this.wmVersion = t),
          (this.h = new Date().getTime()),
          (this.a = s),
          (this.g = C.location.href.split("?")[0]),
          (this.f = k.b64Code(C.location.href)),
          (this.b = k.getCustomerKey());
        var e = x.wmUserInfo ? JSON.parse(x.wmUserInfo) : {};
        (this.c = e.userId),
          (this.d = k.b64Code(e.userTag || "")),
          (this.e = k.b64Code(e.secondUserParam || ""));
      }
      function U(e, t, n, o, r) {
        M.apply(this),
          (this.i = e),
          (this.j = k.b64Code(S.projectVersion || "")),
          (this.k = k.getPageKey()),
          (this.l = O.deviceName),
          (this.deviceSize = O.deviceSize),
          (this.m = O.os + (O.osVersion ? " " + O.osVersion : "")),
          (this.n = O.browserName),
          (this.o = O.browserVersion),
          (this.p = k.getWfCookie("wf_ip")),
          (this.q = ""),
          (this.r = k.getWfCookie("wf_prov")),
          (this.s = ""),
          (this.t = t),
          (this.u = n),
          (this.newStatus = o),
          (this.referrer = (r || "").split("?")[0]);
      }
      function P(e) {
        (this.i = r),
          (this.a = s),
          (this.leaveType = e),
          (this.h = new Date().getTime()),
          (this.g = C.location.href.split("?")[0]),
          (this.b = k.getCustomerKey());
      }
      function J(e) {
        (this.i = o),
          (this.h = new Date().getTime()),
          (this.a = s),
          (this.g = C.location.href.split("?")[0]),
          (this.b = k.getCustomerKey()),
          (this.stayTime = e);
      }
      function W(e, t, n, o, r, i, a, s, c, f, u, l) {
        M.apply(this),
          (this.i = e),
          (this.t = t),
          (this.v = n),
          (this.w = o),
          (this.x = r),
          (this.y = i),
          (this.z = a),
          (this.A = s),
          (this.B = c),
          (this.C = f),
          (this.D = u),
          (this.E = l);
      }
      function A(e, t, n, o, r, i, a) {
        M.apply(this),
          (this.i = e),
          (this.da = t),
          (this.G = k.b64Code(n)),
          (this.H = k.b64Code(o)),
          (this.I = k.b64Code(r)),
          (this.L = i),
          (this.M = k.b64Code(a));
      }
      function R(e, t, n, o) {
        M.apply(this),
          (this.i = e),
          (this.O = t),
          (this.k = k.getPageKey()),
          (this.l = O.deviceName),
          (this.m = O.os + (O.osVersion ? " " + O.osVersion : "")),
          (this.n = O.browserName),
          (this.o = O.browserVersion),
          (this.p = k.getWfCookie("wf_ip")),
          (this.q = ""),
          (this.r = k.getWfCookie("wf_prov")),
          (this.s = ""),
          (this.P = k.b64Code(n)),
          (this.Q = k.b64Code(o)),
          (this.R = "");
      }
      function V(e, t, n, o, r, i, a, s, c, f, u) {
        M.apply(this),
          (this.i = e),
          (this.method = t),
          (this.g = n),
          (this.S = k.b64Code(o)),
          (this.T = r),
          (this.U = i),
          (this.V = a),
          (this.W = k.b64Code(s)),
          (this.X = k.b64Code(c)),
          (this.h = f),
          (this.u = u);
      }
      function F(e, t, n, o) {
        M.apply(this),
          (this.i = e),
          (this.Y = k.b64Code(t)),
          (this.Z = n),
          (this.aa = o || "jpeg");
      }
      function K(e, t, n, o) {
        M.apply(this),
          (this.i = e),
          (this.ba = n),
          (this.ca = k.b64Code(t)),
          (this.T = o);
      }
      function B(e, t, n, o, r) {
        (this.c = e),
          (this.a = s),
          (this.da = t),
          (this.ea = n),
          (this.i = o),
          (this.Y = r),
          (this.h = new Date().getTime());
      }
      function Y(e) {
        var t = E.lc;
        t && !0 === t.s && k.getIp(), k.setPageKey();
        var n = k.isTodayBrowse(_),
          o = new Date().getTime();
        x[T] = o;
        var r = null,
          i = k.formatDate(o, "y-M-d"),
          a = encodeURIComponent(C.location.href.split("?")[0]),
          s = x[$];
        if (s) {
          var c = s.split("$$$"),
            f = c[0],
            u = c[1],
            l = parseInt(c[2], 10);
          i == u
            ? a != f &&
              1 == l &&
              ((x[$] = a + "$$$" + i + "$$$2"), (r = new P(2)))
            : ((x[$] = a + "$$$" + i + "$$$1"), (r = new P(1)));
        } else (x[$] = a + "$$$" + i + "$$$1"), (r = new P(1));
        var p = "";
        N && (p = N[0] && "navigate" === N[0].type ? "load" : "reload");
        var h = k.getWfCookie("monitorCustomerKey");
        if (h) {
          var d = "",
            g = h ? h.match(/\d{14}/g) : [];
          if (g && 0 < g.length) {
            var v = g[0].match(/\d{2}/g),
              m =
                v[0] +
                v[1] +
                "-" +
                v[2] +
                "-" +
                v[3] +
                " " +
                v[4] +
                ":" +
                v[5] +
                ":" +
                v[6],
              w = new Date(m).getTime(),
              y = new Date().getTime();
            d = 2e3 < y - w ? (0 == n ? "o_uv" : "o") : "n_uv";
          }
        } else d = "n_uv";
        var b = document.referrer;
        function O(n) {
          var e = C.location.href;
          k.checkIgnore("pv", e) &&
            ((x.wmUserInfo ? JSON.parse(x.wmUserInfo) : {}).userId
              ? t()
              : setTimeout(function () {
                  t();
                }, 2e3));
          function t() {
            var e = new U(I, p, 0, d, b),
              t = JSON.stringify(e) + "$$$";
            r && (t += JSON.stringify(r) + "$$$"),
              n ? e.handleLogInfo(I, e) : k.upLog(t, !1);
          }
        }
        var S = x.ds;
        S || !0 !== t.s
          ? ("connected" === S && k.initDebugTool(),
            setTimeout(function () {
              "connected" === S && k.uploadLocalInfo();
            }, 2e3),
            O(e))
          : k.getIp(function () {
              O();
            });
      }
      function q(e, t, n, o, r, i) {
        var a = t || "",
          s = i || "",
          c = "";
        if (k.checkIgnore("je", a)) {
          if (a)
            if ("string" == typeof s) c = s.split(": ")[0].replace('"', "");
            else c = JSON.stringify(s).split(": ")[0].replace('"', "");
          var f = new R(p, e, c + ": " + a, s);
          f.handleLogInfo(p, f);
        }
      }
      (U.prototype = new D()),
        (P.prototype = new D()),
        (J.prototype = new D()),
        (W.prototype = new D()),
        (A.prototype = new D()),
        (R.prototype = new D()),
        (V.prototype = new D()),
        (F.prototype = new D()),
        (K.prototype = new D()),
        (B.prototype = new D()),
        new D();
      for (var H = E.ia, z = !1, G = 0; G < H.length; G++) {
        var X = H[G].replace(/ /g, "");
        if (X && -1 != (C.location.href + C.location.hash).indexOf(X)) {
          z = !0;
          break;
        }
      }
      var Z = k.getWfCookie("webfunnyStart") || E.s;
      Z &&
        "p" != Z &&
        !z &&
        (function () {
          try {
            var e = E.pv,
              t = E.je,
              n = E.hl,
              o = E.rl,
              r = E.bl;
            e.s &&
              (Y(),
              k.addLoadEvent(function () {
                setTimeout(function () {
                  if (N) {
                    var e = "load";
                    e = N[0] && "navigate" === N[0].type ? "load" : "reload";
                    var t = a,
                      n = new W(l);
                    (n.loadType = e),
                      (n.lookupDomain =
                        t.domainLookupEnd - t.domainLookupStart),
                      (n.connect = t.connectEnd - t.connectStart),
                      (n.request = t.responseEnd - t.requestStart),
                      (n.ttfb = t.responseStart - t.navigationStart),
                      (n.domReady = t.domComplete - t.responseEnd),
                      (n.loadPage = t.loadEventEnd - t.navigationStart),
                      (n.redirect = t.redirectEnd - t.redirectStart),
                      (n.loadEvent = t.loadEventEnd - t.loadEventStart),
                      (n.appcache = t.domainLookupStart - t.fetchStart),
                      (n.unloadEvent = t.unloadEventEnd - t.unloadEventStart),
                      n.handleLogInfo(l, n);
                  }
                }, 1e3);
              }),
              (function () {
                function e(e) {
                  var t = history[e],
                    n = new Event(e);
                  return function () {
                    var e = t.apply(this, arguments);
                    return (n.arguments = arguments), C.dispatchEvent(n), e;
                  };
                }
                (history.pushState = e("pushState")),
                  (history.replaceState = e("replaceState")),
                  C.addEventListener("hashchange", function () {
                    Y(1);
                  }),
                  C.addEventListener("popstate", function () {
                    var e = C.location.href.split("?")[0].split("#")[0];
                    i != e && (Y(0), (i = e));
                  }),
                  C.addEventListener("pushState", function (e) {
                    Y(0);
                  }),
                  C.addEventListener("replaceState", function (e) {
                    Y(0);
                  });
              })()),
              t.s &&
                (function () {
                  var o = console.error;
                  (console.error = function (e) {
                    var t = (e && e.message) || e,
                      n = e && e.stack;
                    if (n) q("on_error", t, f, 0, 0, n);
                    else {
                      if ("object" == typeof t)
                        try {
                          t = JSON.stringify(t);
                        } catch (e) {
                          t = "错误无法解析";
                        }
                      q("console_error", t, f, 0, 0, "CustomizeError: " + t);
                    }
                    return o.apply(console, arguments);
                  }),
                    (C.onerror = function (e, t, n, o, r) {
                      q("on_error", e, t, n, o, r ? r.stack : null);
                    }),
                    (C.onunhandledrejection = function (e) {
                      var t = "",
                        n = "";
                      (n =
                        "object" == typeof e.reason
                          ? ((t = e.reason.message), e.reason.stack)
                          : ((t = e.reason), "")),
                        q(
                          "on_error",
                          t,
                          f,
                          0,
                          0,
                          "UncaughtInPromiseError: " + n
                        );
                    });
                })(),
              n.s &&
                (function () {
                  function t(e) {
                    var t = new CustomEvent(e, { detail: this });
                    C.dispatchEvent(t);
                  }
                  var n = C.XMLHttpRequest;
                  function r(e, t) {
                    if (h[e] && !0 !== h[e].uploadFlag) {
                      var n = E.hl,
                        o = (parseInt(n.rl, 10), parseInt(n.sl, 10) || 500),
                        r = "";
                      if (t && t.length < o)
                        try {
                          r = t;
                        } catch (e) {
                          r = "";
                        }
                      else r = "内容太长";
                      var i = h[e].simpleUrl,
                        a = new Date().getTime(),
                        s = h[e].event.detail.responseURL,
                        c = h[e].event.detail.status,
                        f = h[e].event.detail.statusText,
                        u = a - h[e].timeStamp;
                      if (
                        s &&
                        -1 == s.indexOf(d) &&
                        -1 == s.indexOf(g) &&
                        k.checkIgnore("hl", s)
                      ) {
                        var l = new V(
                            v,
                            "",
                            i,
                            s,
                            c,
                            f,
                            "request",
                            "",
                            "",
                            h[e].timeStamp,
                            0
                          ),
                          p = new V(v, "", i, s, c, f, "response", "", r, a, u);
                        j.push(l, p), (h[e].uploadFlag = !0);
                      }
                    }
                  }
                  var h = [];
                  (C.XMLHttpRequest = function () {
                    var e = new n();
                    return (
                      e.addEventListener(
                        "loadstart",
                        function () {
                          t.call(this, "ajaxLoadStart");
                        },
                        !1
                      ),
                      e.addEventListener(
                        "loadend",
                        function () {
                          t.call(this, "ajaxLoadEnd");
                        },
                        !1
                      ),
                      e
                    );
                  }),
                    C.addEventListener("ajaxLoadStart", function (e) {
                      var t = {
                        timeStamp: new Date().getTime(),
                        event: e,
                        simpleUrl: C.location.href.split("?")[0],
                        uploadFlag: !1,
                      };
                      h.push(t);
                    }),
                    C.addEventListener("ajaxLoadEnd", function () {
                      for (var o = 0; o < h.length; o++) {
                        if (!0 !== h[o].uploadFlag)
                          if (0 < h[o].event.detail.status)
                            if (
                              "blob" ===
                              (
                                h[o].event.detail.responseType + ""
                              ).toLowerCase()
                            )
                              !(function (t) {
                                var n = new FileReader();
                                n.onload = function () {
                                  var e = n.result;
                                  r(t, e);
                                };
                                try {
                                  n.readAsText(
                                    h[o].event.detail.response,
                                    "utf-8"
                                  );
                                } catch (e) {
                                  r(t, h[o].event.detail.response + "");
                                }
                              })(o);
                            else
                              try {
                                var e = h[o] && h[o].event && h[o].event.detail;
                                if (!e) return;
                                var t = e.responseType,
                                  n = "";
                                ("" !== t && "text" !== t) ||
                                  (n = e.responseText),
                                  "json" === t &&
                                    (n = JSON.stringify(e.response)),
                                  r(o, n);
                              } catch (e) {}
                      }
                    });
                })(),
              o.s &&
                C.addEventListener(
                  "error",
                  function (e) {
                    var t = e.target.localName,
                      n = "";
                    if (
                      ("link" === t
                        ? (n = e.target.href)
                        : "script" === t && (n = e.target.src),
                      (n = n ? n.split("?")[0] : ""),
                      k.checkIgnore("rl", n) &&
                        -1 == n.indexOf("pv.sohu.com/cityjson"))
                    ) {
                      var o = new K(w, n, t, "0");
                      o.handleLogInfo(w, o);
                    }
                  },
                  !0
                ),
              r.s &&
                k.addOnclickForDocument(function (e) {
                  if (e) {
                    var t = "",
                      n = "",
                      o = "",
                      r = e.target.tagName,
                      i = "";
                    "svg" != e.target.tagName &&
                      "use" != e.target.tagName &&
                      ((t = e.target.className),
                      (n = e.target.placeholder || ""),
                      (o = e.target.value || ""),
                      100 <
                        (i = e.target.innerText
                          ? e.target.innerText.replace(/\s*/g, "")
                          : "").length &&
                        (i =
                          i.substring(0, 50) +
                          " ... " +
                          i.substring(i.length - 49, i.length - 1)),
                      (i = i.replace(/\s/g, "")));
                    var a = new A(m, "click", t, n, o, r, i);
                    a.handleLogInfo(m, a);
                  }
                }),
              k.addOnBeforeUnloadEvent(function () {
                var e = parseInt(x[T], 10),
                  t = new Date().getTime() - e,
                  n = JSON.stringify(new J(t));
                navigator &&
                  "function" == typeof navigator.sendBeacon &&
                  navigator.sendBeacon(u, n);
              });
            var s = 0,
              c = L;
            setInterval(function () {
              var e = parseInt(E.wc || "40", 10);
              if (((e = "connected" == x.ds ? 5 : e), 0 < s && s % 5 == 0)) {
                if (10 <= j.length) {
                  for (var t = "", n = 0; n < j.length; n++) {
                    var o = j[n];
                    o && (t += JSON.stringify(o) + "$$$");
                  }
                  k.upLog(t, !1);
                } else {
                  var r = "";
                  for (n = 0; n < j.length; n++) {
                    var i = j[n];
                    i && (r += JSON.stringify(i) + "$$$");
                  }
                  (x[v] += r),
                    3e4 <= x[v].length && (k.upLog(x[v], !1), (x[v] = ""));
                }
                j = [];
              }
              if (e <= s) {
                var a = "";
                for (n = 0; n < c.length; n++) a += x[c[n]] || "";
                0 < a.length && k.upLog(a, !0), (s = 0);
              }
              s++;
            }, 200);
          } catch (e) {
            console.error("监控代码异常，捕获", e);
          }
        })(),
        (C.webfunny = {
          wm_upload_picture: function (e, t, n) {
            var o = new F(h, t, e, n || "jpeg");
            o.handleLogInfo(h, o);
          },
          wm_upload_extend_log: function (e, t, n, o, r) {
            var i = new B(e, t, n, o, r);
            i.handleLogInfo(y, i);
          },
        }),
        (function () {
          if ("function" == typeof C.CustomEvent) return;
          function e(e, t) {
            t = t || { bubbles: !1, cancelable: !1, detail: void 0 };
            var n = document.createEvent("CustomEvent");
            return n.initCustomEvent(e, t.bubbles, t.cancelable, t.detail), n;
          }
          (e.prototype = C.Event.prototype), (C.CustomEvent = e);
        })();
    })(window),
      (window.LZString =
        ((m = String.fromCharCode),
        (r =
          "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+-$"),
        (i = {}),
        (a = {
          compressToEncodedURIComponent: function (e) {
            return null == e
              ? ""
              : a._compress(e, 6, function (e) {
                  return r.charAt(e);
                });
          },
          decompressFromEncodedURIComponent: function (t) {
            return null == t
              ? ""
              : "" == t
              ? null
              : ((t = t.replace(/ /g, "+")),
                a._decompress(t.length, 32, function (e) {
                  return (function (e, t) {
                    if (!i[e]) {
                      i[e] = {};
                      for (var n = 0; n < e.length; n++) i[e][e.charAt(n)] = n;
                    }
                    return i[e][t];
                  })(r, t.charAt(e));
                }));
          },
          _compress: function (e, t, n) {
            if (null == e) return "";
            var o,
              r,
              i,
              a = {},
              s = {},
              c = "",
              f = "",
              u = "",
              l = 2,
              p = 3,
              h = 2,
              d = [],
              g = 0,
              v = 0;
            for (i = 0; i < e.length; i += 1)
              if (
                ((c = e.charAt(i)),
                Object.prototype.hasOwnProperty.call(a, c) ||
                  ((a[c] = p++), (s[c] = !0)),
                (f = u + c),
                Object.prototype.hasOwnProperty.call(a, f))
              )
                u = f;
              else {
                if (Object.prototype.hasOwnProperty.call(s, u)) {
                  if (u.charCodeAt(0) < 256) {
                    for (o = 0; o < h; o++)
                      (g <<= 1),
                        v == t - 1 ? ((v = 0), d.push(n(g)), (g = 0)) : v++;
                    for (r = u.charCodeAt(0), o = 0; o < 8; o++)
                      (g = (g << 1) | (1 & r)),
                        v == t - 1 ? ((v = 0), d.push(n(g)), (g = 0)) : v++,
                        (r >>= 1);
                  } else {
                    for (r = 1, o = 0; o < h; o++)
                      (g = (g << 1) | r),
                        v == t - 1 ? ((v = 0), d.push(n(g)), (g = 0)) : v++,
                        (r = 0);
                    for (r = u.charCodeAt(0), o = 0; o < 16; o++)
                      (g = (g << 1) | (1 & r)),
                        v == t - 1 ? ((v = 0), d.push(n(g)), (g = 0)) : v++,
                        (r >>= 1);
                  }
                  0 == --l && ((l = Math.pow(2, h)), h++), delete s[u];
                } else
                  for (r = a[u], o = 0; o < h; o++)
                    (g = (g << 1) | (1 & r)),
                      v == t - 1 ? ((v = 0), d.push(n(g)), (g = 0)) : v++,
                      (r >>= 1);
                0 == --l && ((l = Math.pow(2, h)), h++),
                  (a[f] = p++),
                  (u = String(c));
              }
            if ("" !== u) {
              if (Object.prototype.hasOwnProperty.call(s, u)) {
                if (u.charCodeAt(0) < 256) {
                  for (o = 0; o < h; o++)
                    (g <<= 1),
                      v == t - 1 ? ((v = 0), d.push(n(g)), (g = 0)) : v++;
                  for (r = u.charCodeAt(0), o = 0; o < 8; o++)
                    (g = (g << 1) | (1 & r)),
                      v == t - 1 ? ((v = 0), d.push(n(g)), (g = 0)) : v++,
                      (r >>= 1);
                } else {
                  for (r = 1, o = 0; o < h; o++)
                    (g = (g << 1) | r),
                      v == t - 1 ? ((v = 0), d.push(n(g)), (g = 0)) : v++,
                      (r = 0);
                  for (r = u.charCodeAt(0), o = 0; o < 16; o++)
                    (g = (g << 1) | (1 & r)),
                      v == t - 1 ? ((v = 0), d.push(n(g)), (g = 0)) : v++,
                      (r >>= 1);
                }
                0 == --l && ((l = Math.pow(2, h)), h++), delete s[u];
              } else
                for (r = a[u], o = 0; o < h; o++)
                  (g = (g << 1) | (1 & r)),
                    v == t - 1 ? ((v = 0), d.push(n(g)), (g = 0)) : v++,
                    (r >>= 1);
              0 == --l && ((l = Math.pow(2, h)), h++);
            }
            for (r = 2, o = 0; o < h; o++)
              (g = (g << 1) | (1 & r)),
                v == t - 1 ? ((v = 0), d.push(n(g)), (g = 0)) : v++,
                (r >>= 1);
            for (;;) {
              if (((g <<= 1), v == t - 1)) {
                d.push(n(g));
                break;
              }
              v++;
            }
            return d.join("");
          },
          _decompress: function (e, t, n) {
            var o,
              r,
              i,
              a,
              s,
              c,
              f,
              u = [],
              l = 4,
              p = 4,
              h = 3,
              d = "",
              g = [],
              v = { val: n(0), position: t, index: 1 };
            for (o = 0; o < 3; o += 1) u[o] = o;
            for (i = 0, s = Math.pow(2, 2), c = 1; c != s; )
              (a = v.val & v.position),
                (v.position >>= 1),
                0 == v.position && ((v.position = t), (v.val = n(v.index++))),
                (i |= (0 < a ? 1 : 0) * c),
                (c <<= 1);
            switch (i) {
              case 0:
                for (i = 0, s = Math.pow(2, 8), c = 1; c != s; )
                  (a = v.val & v.position),
                    (v.position >>= 1),
                    0 == v.position &&
                      ((v.position = t), (v.val = n(v.index++))),
                    (i |= (0 < a ? 1 : 0) * c),
                    (c <<= 1);
                f = m(i);
                break;
              case 1:
                for (i = 0, s = Math.pow(2, 16), c = 1; c != s; )
                  (a = v.val & v.position),
                    (v.position >>= 1),
                    0 == v.position &&
                      ((v.position = t), (v.val = n(v.index++))),
                    (i |= (0 < a ? 1 : 0) * c),
                    (c <<= 1);
                f = m(i);
                break;
              case 2:
                return "";
            }
            for (r = u[3] = f, g.push(f); ; ) {
              if (v.index > e) return "";
              for (i = 0, s = Math.pow(2, h), c = 1; c != s; )
                (a = v.val & v.position),
                  (v.position >>= 1),
                  0 == v.position && ((v.position = t), (v.val = n(v.index++))),
                  (i |= (0 < a ? 1 : 0) * c),
                  (c <<= 1);
              switch ((f = i)) {
                case 0:
                  for (i = 0, s = Math.pow(2, 8), c = 1; c != s; )
                    (a = v.val & v.position),
                      (v.position >>= 1),
                      0 == v.position &&
                        ((v.position = t), (v.val = n(v.index++))),
                      (i |= (0 < a ? 1 : 0) * c),
                      (c <<= 1);
                  (u[p++] = m(i)), (f = p - 1), l--;
                  break;
                case 1:
                  for (i = 0, s = Math.pow(2, 16), c = 1; c != s; )
                    (a = v.val & v.position),
                      (v.position >>= 1),
                      0 == v.position &&
                        ((v.position = t), (v.val = n(v.index++))),
                      (i |= (0 < a ? 1 : 0) * c),
                      (c <<= 1);
                  (u[p++] = m(i)), (f = p - 1), l--;
                  break;
                case 2:
                  return g.join("");
              }
              if ((0 == l && ((l = Math.pow(2, h)), h++), u[f])) d = u[f];
              else {
                if (f !== p) return null;
                d = r + r.charAt(0);
              }
              g.push(d),
                (u[p++] = r + d.charAt(0)),
                (r = d),
                0 == --l && ((l = Math.pow(2, h)), h++);
            }
          },
        }))),
      void 0 ===
        (o = function () {
          return window.LZString;
        }.call(t, n, t, e)) || (e.exports = o);
  },
]);
