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
    n(1), (e.exports = n(2));
  },
  function (e, t, n) {
    var o, v, r, i, s;
    !(function (x) {
      sessionStorage || (x.sessionStorage = {}),
        localStorage || (x.localStorage = {}),
        x.webfunnyRequests || (x.webfunnyRequests = []);
      var E = x.localStorage,
        _ = E.WF_CONFIG
          ? JSON.parse(E.WF_CONFIG)
          : {
              s: !0,
              ia: [""],
              wc: 40,
              pv: { s: true, ia: [""] },
              je: { s: true, ia: [""] },
              hl: { s: true, ia: [""], uh: !1, rl: 500, sl: 500 },
              rl: { s: true, ia: [""] },
              bl: { s: true },
              lc: { s: true },
            },
        i = x.location.href.split("?")[0],
        s = performance && performance.timing,
        C =
          performance && "function" == typeof performance.getEntries
            ? performance.getEntries()
            : null,
        a =
          sessionStorage.CUSTOMER_WEB_MONITOR_ID || "webfunny_20211226_144305",
        t = "3.0.26",
        e = -1 === x.location.href.indexOf("https") ? "http://" : "https://",
        c = x.location.href,
        n = e + "localhost:8011",
        p = "/server/upLog",
        y = "/server/upDLog",
        u = n + p,
        f = n + y,
        T = "CUSTOMER_PV",
        o = "STAY_TIME",
        r = "CUS_LEAVE",
        h = "LOAD_PAGE",
        g = "HTTP_LOG",
        d = "JS_ERROR",
        l = "SCREEN_SHOT",
        v = "ELE_BEHAVIOR",
        m = "RESOURCE_LOAD",
        w = "CUSTOMIZE_BEHAVIOR",
        b = "VIDEOS_EVENT",
        I = "LAST_BROWSE_DATE",
        N = "WM_PAGE_ENTRY_TIME",
        A = "WM_VISIT_PAGE_COUNT",
        U = new (function () {
          (this.checkIgnore = function (e, t) {
            for (
              var n = t.replace(/ /g, ""), o = _[e].ia || [], r = !0, i = 0;
              i < o.length;
              i++
            ) {
              var s = o[i].replace(/ /g, "");
              if (s && -1 != n.indexOf(s)) {
                r = !1;
                break;
              }
            }
            return r;
          }),
            (this.getIp = function (n) {
              if ("1" != U.getWfCookie("wf_cj_status"))
                if (U.getWfCookie("wf_ip")) "function" == typeof n && n();
                else {
                  var o = new Date().getTime() + 864e5;
                  U.loadJs(
                    e + "pv.sohu.com/cityjson?ie=utf-8",
                    function () {
                      if (x.returnCitySN) {
                        var e = x.returnCitySN ? x.returnCitySN.cip : "",
                          t = encodeURIComponent(
                            x.returnCitySN ? x.returnCitySN.cname : ""
                          );
                        U.setWfCookie("wf_ip", e, o),
                          U.setWfCookie("wf_prov", t, o),
                          "function" == typeof n && n();
                      }
                    },
                    function () {
                      U.setWfCookie("wf_cj_status", 1, o),
                        "function" == typeof n && n();
                    }
                  );
                }
              else "function" == typeof n && n();
            }),
            (this.getUuid = function () {
              var e = U.formatDate(new Date().getTime(), "yMdhms");
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
                t = U.getWfCookie("monitorCustomerKey");
              if (!t) {
                var n = new Date().getTime() + 31104e7;
                U.setWfCookie("monitorCustomerKey", e, n), (t = e);
              }
              return t;
            }),
            (this.setWfCookie = function (e, t, n) {
              var o = { data: t, expires: n };
              if (E.WEBFUNNY_COOKIE) {
                var r = JSON.parse(E.WEBFUNNY_COOKIE);
                (r[e] = o), (E.WEBFUNNY_COOKIE = JSON.stringify(r));
              } else {
                var i = {};
                (i[e] = o), (E.WEBFUNNY_COOKIE = JSON.stringify(i));
              }
            }),
            (this.getWfCookie = function (e) {
              var t = null;
              if (E.WEBFUNNY_COOKIE) {
                var n = (t = JSON.parse(E.WEBFUNNY_COOKIE))[e];
                return n
                  ? parseInt(n.expires, 10) < new Date().getTime()
                    ? (delete t[e], (E.WEBFUNNY_COOKIE = JSON.stringify(t)), "")
                    : n.data
                  : "";
              }
              return "";
            }),
            (this.isTodayBrowse = function (e) {
              var t = E[e],
                n =
                  new Date().getFullYear() +
                  "-" +
                  (new Date().getMonth() + 1) +
                  "-" +
                  new Date().getDate();
              return t && n == t ? !(!t || n != t) : ((E[e] = n), !1);
            }),
            (this.formatDate = function (e, t) {
              var n = new Date(e).getFullYear(),
                o = new Date(e).getMonth() + 1,
                r = new Date(e).getDate(),
                i = new Date(e).getHours(),
                s = new Date(e).getMinutes(),
                a = new Date(e).getSeconds();
              return (
                (o = 9 < o ? o : "0" + o),
                (r = 9 < r ? r : "0" + r),
                (i = 9 < i ? i : "0" + i),
                (s = 9 < s ? s : "0" + s),
                (a = 9 < a ? a : "0" + a),
                t
                  .replace("y", n)
                  .replace("M", o)
                  .replace("d", r)
                  .replace("h", i)
                  .replace("m", s)
                  .replace("s", a)
              );
            }),
            (this.getPageKey = function () {
              var e = this.getUuid();
              return (
                (E.monitorPageKey &&
                  /^[0-9a-z]{8}(-[0-9a-z]{4}){3}-[0-9a-z]{12}-\d{13}$/.test(
                    E.monitorPageKey
                  )) ||
                  (E.monitorPageKey = e),
                E.monitorPageKey
              );
            }),
            (this.setPageKey = function () {
              E.monitorPageKey = this.getUuid();
            }),
            (this.addLoadEvent = function (e) {
              var t = x.onload;
              "function" != typeof x.onload
                ? (x.onload = e)
                : (x.onload = function () {
                    t(), e();
                  });
            }),
            (this.addOnBeforeUnloadEvent = function (e) {
              var t = x.onbeforeunload;
              "function" != typeof x.onbeforeunload
                ? (x.onbeforeunload = e)
                : (x.onbeforeunload = function () {
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
                var i = x.XMLHttpRequest
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
                var s = JSON.stringify(n || {});
                i.send("data=" + s);
              } catch (e) {}
            }),
            (this.upLog = function (e, i) {
              e &&
                "undefined" != e &&
                U.ajax(
                  "POST",
                  u,
                  { logInfo: e },
                  function (e) {
                    if (e && e.data && e.data.d) {
                      E.ds = "c" == e.data.d ? "connected" : "disconnect";
                      var t = e.data.c;
                      if (t) {
                        E.setItem("WF_CONFIG", e.data.c);
                        var n = JSON.parse(t);
                        if (0 == (_ = n).s) {
                          var o = new Date().getTime() + 6e5;
                          U.setWfCookie("webfunnyStart", "p", o);
                        }
                      }
                    }
                    if (!0 === i)
                      for (var r = 0; r < L.length; r++) E[L[r]] = "";
                  },
                  function () {
                    if (!0 === i)
                      for (var e = 0; e < L.length; e++) E[L[e]] = "";
                  }
                );
            }),
            (this.initDebugTool = function () {
              var s = (E.wmUserInfo ? JSON.parse(E.wmUserInfo) : {}).userId;
              function t(e) {
                for (var t = [], n = e.length, o = 0; o < n; o++) t.push(e[o]);
                var r = {};
                (r.log = t),
                  (r.userId = s),
                  (r.happenTime = new Date().getTime());
                var i = "";
                try {
                  i = U.b64Code(JSON.stringify(r));
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
                  "connected" === E.ds &&
                    U.ajax("POST", f, { consoleInfo: e }, function () {}),
                  n.apply(console, arguments)
                );
              }),
                (console.warn = function () {
                  var e = t(arguments);
                  return (
                    "connected" === E.ds &&
                      U.ajax("POST", f, { warnInfo: e }, function () {}),
                    o.apply(console, arguments)
                  );
                });
            }),
            (this.uploadLocalInfo = function () {
              var e = (E.wmUserInfo ? JSON.parse(E.wmUserInfo) : {}).userId,
                t = {};
              for (var n in E)
                "function" == typeof E[n] ||
                  -1 != L.indexOf(n) ||
                  1e3 < E[n].length ||
                  (t[n] = E[n]);
              try {
                t = U.b64Code(JSON.stringify(t));
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
                o = U.b64Code(JSON.stringify(o));
              } catch (e) {
                o = "";
              }
              var r = U.b64Code(document.cookie);
              U.ajax(
                "POST",
                f,
                { localInfo: t, sessionInfo: o, cookieInfo: r, userId: e },
                function (e) {
                  if (
                    (setTimeout(function () {
                      U.uploadLocalInfo();
                    }, 2e4),
                    e.data) &&
                    1 == e.data.clear
                  ) {
                    var t = E.wmUserInfo;
                    localStorage.clear(),
                      (localStorage.wmUserInfo = t),
                      sessionStorage.clear(),
                      (E.WEBFUNNY_COOKIE = "");
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
                s = x.screen.width,
                a = x.screen.height;
              if (
                ((e.ios = e.android = e.iphone = e.ipad = e.androidChrome = !1),
                (e.isWeixin = /MicroMessenger/i.test(t)),
                (e.os = "web"),
                (e.deviceName = "PC"),
                (e.deviceSize = s + "×" + a),
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
                var f = "iphone";
                320 === s && 480 === a
                  ? (f = "4")
                  : 320 === s && 568 === a
                  ? (f = "5/SE")
                  : 375 === s && 667 === a
                  ? (f = "6/7/8")
                  : 414 === s && 736 === a
                  ? (f = "6/7/8 Plus")
                  : 375 === s && 812 === a
                  ? (f = "X/S/Max")
                  : 414 === s && 896 === a
                  ? (f = "11/Pro-Max")
                  : 375 === s && 812 === a
                  ? (f = "11-Pro/mini")
                  : 390 === s && 844 === a
                  ? (f = "12/Pro")
                  : 428 === s && 926 === a && (f = "12-Pro-Max"),
                  (e.deviceName = "iphone " + f);
              } else if (e.ipad) e.deviceName = "ipad";
              else if (i) {
                for (var c = i[0].split(";"), u = "", h = 0; h < c.length; h++)
                  -1 != c[h].indexOf("Build") &&
                    (u = c[h].replace(/Build\//g, ""));
                "" == u && (u = c[1]),
                  (e.deviceName = u.replace(/(^\s*)|(\s*$)/g, ""));
              }
              if (-1 == t.indexOf("Mobile")) {
                var d = navigator.userAgent.toLowerCase();
                if (((e.browserName = "其他"), 0 < d.indexOf("msie"))) {
                  var l = d.match(/msie [\d.]+;/gi)[0];
                  (e.browserName = "ie"), (e.browserVersion = l.split("/")[1]);
                } else if (0 < d.indexOf("edg")) {
                  l = d.match(/edg\/[\d.]+/gi)[0];
                  (e.browserName = "edge"),
                    (e.browserVersion = l.split("/")[1]);
                } else if (0 < d.indexOf("firefox")) {
                  l = d.match(/firefox\/[\d.]+/gi)[0];
                  (e.browserName = "firefox"),
                    (e.browserVersion = l.split("/")[1]);
                } else if (0 < d.indexOf("safari") && d.indexOf("chrome") < 0) {
                  l = d.match(/safari\/[\d.]+/gi)[0];
                  (e.browserName = "safari"),
                    (e.browserVersion = l.split("/")[1]);
                } else if (0 < d.indexOf("chrome")) {
                  l = d.match(/chrome\/[\d.]+/gi)[0];
                  (e.browserName = "chrome"),
                    (e.browserVersion = l.split("/")[1]),
                    0 < d.indexOf("360se") && (e.browserName = "360");
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
        O = U.getDevice(),
        S = E.wmUserInfo ? JSON.parse(E.wmUserInfo) : {},
        L = [v, d, g, l, T, h, m, w, b],
        P = [];
      function $() {
        this.handleLogInfo = function (e, t) {
          var n = E[e] ? E[e] : "";
          switch (e) {
            case v:
              E[v] = n + JSON.stringify(t) + "$$$";
              break;
            case d:
              E[d] = n + JSON.stringify(t) + "$$$";
              break;
            case g:
              E[g] = n + JSON.stringify(t) + "$$$";
              break;
            case l:
              E[l] = n + JSON.stringify(t) + "$$$";
              break;
            case T:
              E[T] = n + JSON.stringify(t) + "$$$";
              break;
            case h:
              E[h] = n + JSON.stringify(t) + "$$$";
              break;
            case m:
              E[m] = n + JSON.stringify(t) + "$$$";
              break;
            case w:
              E[w] = n + JSON.stringify(t) + "$$$";
              break;
            case b:
              E[b] = n + JSON.stringify(t) + "$$$";
          }
        };
      }
      function k() {
        (this.wmVersion = t),
          (this.h = new Date().getTime()),
          (this.a = a),
          (this.g = x.location.href.split("?")[0]),
          (this.f = U.b64Code(x.location.href)),
          (this.b = U.getCustomerKey());
        var e = E.wmUserInfo ? JSON.parse(E.wmUserInfo) : {};
        (this.c = e.userId),
          (this.d = U.b64Code(e.userTag || "")),
          (this.e = U.b64Code(e.secondUserParam || ""));
      }
      function j(e, t, n, o, r) {
        k.apply(this),
          (this.i = e),
          (this.j = U.b64Code(S.projectVersion || "")),
          (this.k = U.getPageKey()),
          (this.l = O.deviceName),
          (this.deviceSize = O.deviceSize),
          (this.m = O.os + (O.osVersion ? " " + O.osVersion : "")),
          (this.n = O.browserName),
          (this.o = O.browserVersion),
          (this.p = U.getWfCookie("wf_ip")),
          (this.q = ""),
          (this.r = U.getWfCookie("wf_prov")),
          (this.s = ""),
          (this.t = t),
          (this.u = n),
          (this.newStatus = o),
          (this.referrer = (r || "").split("?")[0]);
      }
      function D(e) {
        (this.i = r),
          (this.a = a),
          (this.leaveType = e),
          (this.h = new Date().getTime()),
          (this.g = x.location.href.split("?")[0]),
          (this.b = U.getCustomerKey());
      }
      function B(e) {
        (this.i = o),
          (this.h = new Date().getTime()),
          (this.a = a),
          (this.g = x.location.href.split("?")[0]),
          (this.b = U.getCustomerKey()),
          (this.stayTime = e);
      }
      function R(e, t, n, o, r, i, s, a, f, c, u, h) {
        k.apply(this),
          (this.i = e),
          (this.t = t),
          (this.v = n),
          (this.w = o),
          (this.x = r),
          (this.y = i),
          (this.z = s),
          (this.A = a),
          (this.B = f),
          (this.C = c),
          (this.D = u),
          (this.E = h);
      }
      function M(e, t, n, o, r, i, s) {
        k.apply(this),
          (this.i = e),
          (this.da = t),
          (this.G = U.b64Code(n)),
          (this.H = U.b64Code(o)),
          (this.I = U.b64Code(r)),
          (this.L = i),
          (this.M = U.b64Code(s));
      }
      function F(e, t, n, o) {
        k.apply(this),
          (this.i = e),
          (this.O = t),
          (this.k = U.getPageKey()),
          (this.l = O.deviceName),
          (this.m = O.os + (O.osVersion ? " " + O.osVersion : "")),
          (this.n = O.browserName),
          (this.o = O.browserVersion),
          (this.p = U.getWfCookie("wf_ip")),
          (this.q = ""),
          (this.r = U.getWfCookie("wf_prov")),
          (this.s = ""),
          (this.P = U.b64Code(n)),
          (this.Q = U.b64Code(o)),
          (this.R = "");
      }
      function J(e, t, n, o, r, i, s, a, f, c, u) {
        k.apply(this),
          (this.i = e),
          (this.method = t),
          (this.g = n),
          (this.S = U.b64Code(o)),
          (this.T = r),
          (this.U = i),
          (this.V = s),
          (this.W = U.b64Code(a)),
          (this.X = U.b64Code(f)),
          (this.h = c),
          (this.u = u);
      }
      function W(e, t, n, o) {
        k.apply(this),
          (this.i = e),
          (this.Y = U.b64Code(t)),
          (this.Z = n),
          (this.aa = o || "jpeg");
      }
      function V(e, t, n, o) {
        k.apply(this),
          (this.i = e),
          (this.ba = n),
          (this.ca = U.b64Code(t)),
          (this.T = o);
      }
      function K(e, t, n, o, r) {
        (this.c = e),
          (this.a = a),
          (this.da = t),
          (this.ea = n),
          (this.i = o),
          (this.Y = r),
          (this.h = new Date().getTime());
      }
      function q(e) {
        var t = _.lc;
        t && !0 === t.s && U.getIp(), U.setPageKey();
        var n = U.isTodayBrowse(I),
          o = new Date().getTime();
        E[N] = o;
        var r = null,
          i = U.formatDate(o, "y-M-d"),
          s = encodeURIComponent(x.location.href.split("?")[0]),
          a = E[A];
        if (a) {
          var f = a.split("$$$"),
            c = f[0],
            u = f[1],
            h = parseInt(f[2], 10);
          i == u
            ? s != c &&
              1 == h &&
              ((E[A] = s + "$$$" + i + "$$$2"), (r = new D(2)))
            : ((E[A] = s + "$$$" + i + "$$$1"), (r = new D(1)));
        } else (E[A] = s + "$$$" + i + "$$$1"), (r = new D(1));
        var d = "";
        C && (d = C[0] && "navigate" === C[0].type ? "load" : "reload");
        var l = U.getWfCookie("monitorCustomerKey");
        if (l) {
          var p = "",
            y = l ? l.match(/\d{14}/g) : [];
          if (y && 0 < y.length) {
            var g = y[0].match(/\d{2}/g),
              v =
                g[0] +
                g[1] +
                "-" +
                g[2] +
                "-" +
                g[3] +
                " " +
                g[4] +
                ":" +
                g[5] +
                ":" +
                g[6],
              m = new Date(v).getTime(),
              w = new Date().getTime();
            p = 2e3 < w - m ? (0 == n ? "o_uv" : "o") : "n_uv";
          }
        } else p = "n_uv";
        var b = document.referrer;
        function O(n) {
          var e = x.location.href;
          U.checkIgnore("pv", e) &&
            ((E.wmUserInfo ? JSON.parse(E.wmUserInfo) : {}).userId
              ? t()
              : setTimeout(function () {
                  t();
                }, 2e3));
          function t() {
            var e = new j(T, d, 0, p, b),
              t = JSON.stringify(e) + "$$$";
            r && (t += JSON.stringify(r) + "$$$"),
              n ? e.handleLogInfo(T, e) : U.upLog(t, !1);
          }
        }
        var S = E.ds;
        S || !0 !== t.s
          ? ("connected" === S && U.initDebugTool(),
            setTimeout(function () {
              "connected" === S && U.uploadLocalInfo();
            }, 2e3),
            O(e))
          : U.getIp(function () {
              O();
            });
      }
      function H(e, t, n, o, r, i) {
        var s = t || "",
          a = i || "",
          f = "";
        if (U.checkIgnore("je", s)) {
          if (s)
            if ("string" == typeof a) f = a.split(": ")[0].replace('"', "");
            else f = JSON.stringify(a).split(": ")[0].replace('"', "");
          var c = new F(d, e, f + ": " + s, a);
          c.handleLogInfo(d, c);
        }
      }
      (j.prototype = new $()),
        (D.prototype = new $()),
        (B.prototype = new $()),
        (R.prototype = new $()),
        (M.prototype = new $()),
        (F.prototype = new $()),
        (J.prototype = new $()),
        (W.prototype = new $()),
        (V.prototype = new $()),
        (K.prototype = new $()),
        new $();
      for (var Y = _.ia, G = !1, X = 0; X < Y.length; X++) {
        var z = Y[X].replace(/ /g, "");
        if (z && -1 != (x.location.href + x.location.hash).indexOf(z)) {
          G = !0;
          break;
        }
      }
      var Z = U.getWfCookie("webfunnyStart") || _.s;
      Z &&
        "p" != Z &&
        !G &&
        (function () {
          try {
            var e = _.pv,
              t = _.je,
              n = _.hl,
              o = _.rl,
              r = _.bl;
            e.s &&
              (q(),
              U.addLoadEvent(function () {
                setTimeout(function () {
                  if (C) {
                    var e = "load";
                    e = C[0] && "navigate" === C[0].type ? "load" : "reload";
                    var t = s,
                      n = new R(h);
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
                      n.handleLogInfo(h, n);
                  }
                }, 1e3);
              }),
              (function () {
                function e(e) {
                  var t = history[e],
                    n = new Event(e);
                  return function () {
                    var e = t.apply(this, arguments);
                    return (n.arguments = arguments), x.dispatchEvent(n), e;
                  };
                }
                (history.pushState = e("pushState")),
                  (history.replaceState = e("replaceState")),
                  x.addEventListener("hashchange", function () {
                    q(1);
                  }),
                  x.addEventListener("popstate", function () {
                    var e = x.location.href.split("?")[0].split("#")[0];
                    i != e && (q(0), (i = e));
                  }),
                  x.addEventListener("pushState", function (e) {
                    q(0);
                  }),
                  x.addEventListener("replaceState", function (e) {
                    q(0);
                  });
              })()),
              t.s &&
                (function () {
                  var o = console.error;
                  (console.error = function (e) {
                    var t = (e && e.message) || e,
                      n = e && e.stack;
                    if (n) H("on_error", t, c, 0, 0, n);
                    else {
                      if ("object" == typeof t)
                        try {
                          t = JSON.stringify(t);
                        } catch (e) {
                          t = "错误无法解析";
                        }
                      H("console_error", t, c, 0, 0, "CustomizeError: " + t);
                    }
                    return o.apply(console, arguments);
                  }),
                    (x.onerror = function (e, t, n, o, r) {
                      H("on_error", e, t, n, o, r ? r.stack : null);
                    }),
                    (x.onunhandledrejection = function (e) {
                      var t = "",
                        n = "";
                      (n =
                        "object" == typeof e.reason
                          ? ((t = e.reason.message), e.reason.stack)
                          : ((t = e.reason), "")),
                        H(
                          "on_error",
                          t,
                          c,
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
                    x.dispatchEvent(t);
                  }
                  var n = x.XMLHttpRequest;
                  function r(e, t) {
                    if (l[e] && !0 !== l[e].uploadFlag) {
                      var n = _.hl,
                        o = (parseInt(n.rl, 10), parseInt(n.sl, 10) || 500),
                        r = "";
                      if (t && t.length < o)
                        try {
                          r = t;
                        } catch (e) {
                          r = "";
                        }
                      else r = "内容太长";
                      var i = l[e].simpleUrl,
                        s = new Date().getTime(),
                        a = l[e].event.detail.responseURL,
                        f = l[e].event.detail.status,
                        c = l[e].event.detail.statusText,
                        u = s - l[e].timeStamp;
                      if (
                        a &&
                        -1 == a.indexOf(p) &&
                        -1 == a.indexOf(y) &&
                        U.checkIgnore("hl", a)
                      ) {
                        var h = new J(
                            g,
                            "",
                            i,
                            a,
                            f,
                            c,
                            "request",
                            "",
                            "",
                            l[e].timeStamp,
                            0
                          ),
                          d = new J(g, "", i, a, f, c, "response", "", r, s, u);
                        P.push(h, d), (l[e].uploadFlag = !0);
                      }
                    }
                  }
                  var l = [];
                  (x.XMLHttpRequest = function () {
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
                    x.addEventListener("ajaxLoadStart", function (e) {
                      var t = {
                        timeStamp: new Date().getTime(),
                        event: e,
                        simpleUrl: x.location.href.split("?")[0],
                        uploadFlag: !1,
                      };
                      l.push(t);
                    }),
                    x.addEventListener("ajaxLoadEnd", function () {
                      for (var o = 0; o < l.length; o++) {
                        if (!0 !== l[o].uploadFlag)
                          if (0 < l[o].event.detail.status)
                            if (
                              "blob" ===
                              (
                                l[o].event.detail.responseType + ""
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
                                    l[o].event.detail.response,
                                    "utf-8"
                                  );
                                } catch (e) {
                                  r(t, l[o].event.detail.response + "");
                                }
                              })(o);
                            else
                              try {
                                var e = l[o] && l[o].event && l[o].event.detail;
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
                x.addEventListener(
                  "error",
                  function (e) {
                    var t = e.target.localName,
                      n = "";
                    if (
                      ("link" === t
                        ? (n = e.target.href)
                        : "script" === t && (n = e.target.src),
                      (n = n ? n.split("?")[0] : ""),
                      U.checkIgnore("rl", n) &&
                        -1 == n.indexOf("pv.sohu.com/cityjson"))
                    ) {
                      var o = new V(m, n, t, "0");
                      o.handleLogInfo(m, o);
                    }
                  },
                  !0
                ),
              r.s &&
                U.addOnclickForDocument(function (e) {
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
                    var s = new M(v, "click", t, n, o, r, i);
                    s.handleLogInfo(v, s);
                  }
                }),
              U.addOnBeforeUnloadEvent(function () {
                var e = parseInt(E[N], 10),
                  t = new Date().getTime() - e,
                  n = JSON.stringify(new B(t));
                navigator &&
                  "function" == typeof navigator.sendBeacon &&
                  navigator.sendBeacon(u, n);
              });
            var a = 0,
              f = L;
            setInterval(function () {
              var e = parseInt(_.wc || "40", 10);
              if (((e = "connected" == E.ds ? 5 : e), 0 < a && a % 5 == 0)) {
                if (10 <= P.length) {
                  for (var t = "", n = 0; n < P.length; n++) {
                    var o = P[n];
                    o && (t += JSON.stringify(o) + "$$$");
                  }
                  U.upLog(t, !1);
                } else {
                  var r = "";
                  for (n = 0; n < P.length; n++) {
                    var i = P[n];
                    i && (r += JSON.stringify(i) + "$$$");
                  }
                  (E[g] += r),
                    3e4 <= E[g].length && (U.upLog(E[g], !1), (E[g] = ""));
                }
                P = [];
              }
              if (e <= a) {
                var s = "";
                for (n = 0; n < f.length; n++) s += E[f[n]] || "";
                0 < s.length && U.upLog(s, !0), (a = 0);
              }
              a++;
            }, 200);
          } catch (e) {
            console.error("监控代码异常，捕获", e);
          }
        })(),
        (x.webfunny = {
          wm_upload_picture: function (e, t, n) {
            var o = new W(l, t, e, n || "jpeg");
            o.handleLogInfo(l, o);
          },
          wm_upload_extend_log: function (e, t, n, o, r) {
            var i = new K(e, t, n, o, r);
            i.handleLogInfo(w, i);
          },
        }),
        (function () {
          if ("function" == typeof x.CustomEvent) return;
          function e(e, t) {
            t = t || { bubbles: !1, cancelable: !1, detail: void 0 };
            var n = document.createEvent("CustomEvent");
            return n.initCustomEvent(e, t.bubbles, t.cancelable, t.detail), n;
          }
          (e.prototype = x.Event.prototype), (x.CustomEvent = e);
        })();
    })(window),
      (window.LZString =
        ((v = String.fromCharCode),
        (r =
          "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+-$"),
        (i = {}),
        (s = {
          compressToEncodedURIComponent: function (e) {
            return null == e
              ? ""
              : s._compress(e, 6, function (e) {
                  return r.charAt(e);
                });
          },
          decompressFromEncodedURIComponent: function (t) {
            return null == t
              ? ""
              : "" == t
              ? null
              : ((t = t.replace(/ /g, "+")),
                s._decompress(t.length, 32, function (e) {
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
              s = {},
              a = {},
              f = "",
              c = "",
              u = "",
              h = 2,
              d = 3,
              l = 2,
              p = [],
              y = 0,
              g = 0;
            for (i = 0; i < e.length; i += 1)
              if (
                ((f = e.charAt(i)),
                Object.prototype.hasOwnProperty.call(s, f) ||
                  ((s[f] = d++), (a[f] = !0)),
                (c = u + f),
                Object.prototype.hasOwnProperty.call(s, c))
              )
                u = c;
              else {
                if (Object.prototype.hasOwnProperty.call(a, u)) {
                  if (u.charCodeAt(0) < 256) {
                    for (o = 0; o < l; o++)
                      (y <<= 1),
                        g == t - 1 ? ((g = 0), p.push(n(y)), (y = 0)) : g++;
                    for (r = u.charCodeAt(0), o = 0; o < 8; o++)
                      (y = (y << 1) | (1 & r)),
                        g == t - 1 ? ((g = 0), p.push(n(y)), (y = 0)) : g++,
                        (r >>= 1);
                  } else {
                    for (r = 1, o = 0; o < l; o++)
                      (y = (y << 1) | r),
                        g == t - 1 ? ((g = 0), p.push(n(y)), (y = 0)) : g++,
                        (r = 0);
                    for (r = u.charCodeAt(0), o = 0; o < 16; o++)
                      (y = (y << 1) | (1 & r)),
                        g == t - 1 ? ((g = 0), p.push(n(y)), (y = 0)) : g++,
                        (r >>= 1);
                  }
                  0 == --h && ((h = Math.pow(2, l)), l++), delete a[u];
                } else
                  for (r = s[u], o = 0; o < l; o++)
                    (y = (y << 1) | (1 & r)),
                      g == t - 1 ? ((g = 0), p.push(n(y)), (y = 0)) : g++,
                      (r >>= 1);
                0 == --h && ((h = Math.pow(2, l)), l++),
                  (s[c] = d++),
                  (u = String(f));
              }
            if ("" !== u) {
              if (Object.prototype.hasOwnProperty.call(a, u)) {
                if (u.charCodeAt(0) < 256) {
                  for (o = 0; o < l; o++)
                    (y <<= 1),
                      g == t - 1 ? ((g = 0), p.push(n(y)), (y = 0)) : g++;
                  for (r = u.charCodeAt(0), o = 0; o < 8; o++)
                    (y = (y << 1) | (1 & r)),
                      g == t - 1 ? ((g = 0), p.push(n(y)), (y = 0)) : g++,
                      (r >>= 1);
                } else {
                  for (r = 1, o = 0; o < l; o++)
                    (y = (y << 1) | r),
                      g == t - 1 ? ((g = 0), p.push(n(y)), (y = 0)) : g++,
                      (r = 0);
                  for (r = u.charCodeAt(0), o = 0; o < 16; o++)
                    (y = (y << 1) | (1 & r)),
                      g == t - 1 ? ((g = 0), p.push(n(y)), (y = 0)) : g++,
                      (r >>= 1);
                }
                0 == --h && ((h = Math.pow(2, l)), l++), delete a[u];
              } else
                for (r = s[u], o = 0; o < l; o++)
                  (y = (y << 1) | (1 & r)),
                    g == t - 1 ? ((g = 0), p.push(n(y)), (y = 0)) : g++,
                    (r >>= 1);
              0 == --h && ((h = Math.pow(2, l)), l++);
            }
            for (r = 2, o = 0; o < l; o++)
              (y = (y << 1) | (1 & r)),
                g == t - 1 ? ((g = 0), p.push(n(y)), (y = 0)) : g++,
                (r >>= 1);
            for (;;) {
              if (((y <<= 1), g == t - 1)) {
                p.push(n(y));
                break;
              }
              g++;
            }
            return p.join("");
          },
          _decompress: function (e, t, n) {
            var o,
              r,
              i,
              s,
              a,
              f,
              c,
              u = [],
              h = 4,
              d = 4,
              l = 3,
              p = "",
              y = [],
              g = { val: n(0), position: t, index: 1 };
            for (o = 0; o < 3; o += 1) u[o] = o;
            for (i = 0, a = Math.pow(2, 2), f = 1; f != a; )
              (s = g.val & g.position),
                (g.position >>= 1),
                0 == g.position && ((g.position = t), (g.val = n(g.index++))),
                (i |= (0 < s ? 1 : 0) * f),
                (f <<= 1);
            switch (i) {
              case 0:
                for (i = 0, a = Math.pow(2, 8), f = 1; f != a; )
                  (s = g.val & g.position),
                    (g.position >>= 1),
                    0 == g.position &&
                      ((g.position = t), (g.val = n(g.index++))),
                    (i |= (0 < s ? 1 : 0) * f),
                    (f <<= 1);
                c = v(i);
                break;
              case 1:
                for (i = 0, a = Math.pow(2, 16), f = 1; f != a; )
                  (s = g.val & g.position),
                    (g.position >>= 1),
                    0 == g.position &&
                      ((g.position = t), (g.val = n(g.index++))),
                    (i |= (0 < s ? 1 : 0) * f),
                    (f <<= 1);
                c = v(i);
                break;
              case 2:
                return "";
            }
            for (r = u[3] = c, y.push(c); ; ) {
              if (g.index > e) return "";
              for (i = 0, a = Math.pow(2, l), f = 1; f != a; )
                (s = g.val & g.position),
                  (g.position >>= 1),
                  0 == g.position && ((g.position = t), (g.val = n(g.index++))),
                  (i |= (0 < s ? 1 : 0) * f),
                  (f <<= 1);
              switch ((c = i)) {
                case 0:
                  for (i = 0, a = Math.pow(2, 8), f = 1; f != a; )
                    (s = g.val & g.position),
                      (g.position >>= 1),
                      0 == g.position &&
                        ((g.position = t), (g.val = n(g.index++))),
                      (i |= (0 < s ? 1 : 0) * f),
                      (f <<= 1);
                  (u[d++] = v(i)), (c = d - 1), h--;
                  break;
                case 1:
                  for (i = 0, a = Math.pow(2, 16), f = 1; f != a; )
                    (s = g.val & g.position),
                      (g.position >>= 1),
                      0 == g.position &&
                        ((g.position = t), (g.val = n(g.index++))),
                      (i |= (0 < s ? 1 : 0) * f),
                      (f <<= 1);
                  (u[d++] = v(i)), (c = d - 1), h--;
                  break;
                case 2:
                  return y.join("");
              }
              if ((0 == h && ((h = Math.pow(2, l)), l++), u[c])) p = u[c];
              else {
                if (c !== d) return null;
                p = r + r.charAt(0);
              }
              y.push(p),
                (u[d++] = r + p.charAt(0)),
                (r = p),
                0 == --h && ((h = Math.pow(2, l)), l++);
            }
          },
        }))),
      void 0 ===
        (o = function () {
          return window.LZString;
        }.call(t, n, t, e)) || (e.exports = o);
  },
  function (e, t) {
    !(function (e) {
      var t, n;
      if (
        "p" !=
        ((n = new RegExp("(^| )" + "webfunnyStart" + "=([^;]*)(;|$)")),
        document.cookie.match(n)
          ? ((t = document.cookie.match(n)), unescape(t[2]))
          : "")
      ) {
        var o = "URLSearchParams" in e,
          r = "Symbol" in e && "iterator" in Symbol,
          s =
            "FileReader" in e &&
            "Blob" in e &&
            (function () {
              try {
                return new Blob(), !0;
              } catch (e) {
                return !1;
              }
            })(),
          i = "FormData" in e,
          a = "ArrayBuffer" in e;
        if (a)
          var f = [
              "[object Int8Array]",
              "[object Uint8Array]",
              "[object Uint8ClampedArray]",
              "[object Int16Array]",
              "[object Uint16Array]",
              "[object Int32Array]",
              "[object Uint32Array]",
              "[object Float32Array]",
              "[object Float64Array]",
            ],
            c = function (e) {
              return e && DataView.prototype.isPrototypeOf(e);
            },
            u =
              ArrayBuffer.isView ||
              function (e) {
                return e && -1 < f.indexOf(Object.prototype.toString.call(e));
              };
        (g.prototype.append = function (e, t) {
          (e = l(e)), (t = p(t));
          var n = this.map[e];
          this.map[e] = n ? n + "," + t : t;
        }),
          (g.prototype.delete = function (e) {
            delete this.map[l(e)];
          }),
          (g.prototype.get = function (e) {
            return (e = l(e)), this.has(e) ? this.map[e] : null;
          }),
          (g.prototype.has = function (e) {
            return this.map.hasOwnProperty(l(e));
          }),
          (g.prototype.set = function (e, t) {
            this.map[l(e)] = p(t);
          }),
          (g.prototype.forEach = function (e, t) {
            for (var n in this.map)
              this.map.hasOwnProperty(n) && e.call(t, this.map[n], n, this);
          }),
          (g.prototype.keys = function () {
            var n = [];
            return (
              this.forEach(function (e, t) {
                n.push(t);
              }),
              y(n)
            );
          }),
          (g.prototype.values = function () {
            var t = [];
            return (
              this.forEach(function (e) {
                t.push(e);
              }),
              y(t)
            );
          }),
          (g.prototype.entries = function () {
            var n = [];
            return (
              this.forEach(function (e, t) {
                n.push([t, e]);
              }),
              y(n)
            );
          }),
          r && (g.prototype[Symbol.iterator] = g.prototype.entries);
        var h = ["DELETE", "GET", "HEAD", "OPTIONS", "POST", "PUT"];
        (S.prototype.clone = function () {
          return new S(this, { body: this._bodyInit });
        }),
          O.call(S.prototype),
          O.call(E.prototype),
          (E.prototype.clone = function () {
            return new E(this._bodyInit, {
              status: this.status,
              statusText: this.statusText,
              headers: new g(this.headers),
              url: this.url,
            });
          }),
          (E.error = function () {
            var e = new E(null, { status: 0, statusText: "" });
            return (e.type = "error"), e;
          });
        var d = [301, 302, 303, 307, 308];
        (E.redirect = function (e, t) {
          if (-1 === d.indexOf(t)) throw new RangeError("Invalid status code");
          return new E(null, { status: t, headers: { location: e } });
        }),
          (e.Headers = g),
          (e.Request = S),
          (e.Response = E),
          (e.fetch = function (n, o) {
            return new Promise(function (r, e) {
              var t = new S(n, o),
                i = new XMLHttpRequest();
              (i.onload = function () {
                var e = i.responseType,
                  t = "",
                  n = {
                    status: i.status,
                    statusText: i.statusText,
                    headers: (function (e) {
                      var r = new g();
                      return (
                        e.split(/\r?\n/).forEach(function (e) {
                          var t = e.split(":"),
                            n = t.shift().trim();
                          if (n) {
                            var o = t.join(":").trim();
                            r.append(n, o);
                          }
                        }),
                        r
                      );
                    })(i.getAllResponseHeaders() || ""),
                  };
                (n.url =
                  "responseURL" in i
                    ? i.responseURL
                    : n.headers.get("X-Request-URL")),
                  ("" !== e && "text" !== e) || (t = i.responseText),
                  "json" === e && (t = i.response);
                var o = "response" in i ? i.response : t;
                r(new E(o, n));
              }),
                (i.onerror = function () {
                  console.error("Network request failed"),
                    e(new TypeError("Network request failed"));
                }),
                (i.ontimeout = function () {
                  e(new TypeError("Network request failed"));
                }),
                i.open(t.method, t.url, !0),
                "include" === t.credentials && (i.withCredentials = !0),
                "responseType" in i && s && (i.responseType = "blob"),
                t.headers.forEach(function (e, t) {
                  i.setRequestHeader(t, e);
                }),
                i.send(void 0 === t._bodyInit ? null : t._bodyInit);
            });
          }),
          (e.fetch.polyfill = !0);
      }
      function l(e) {
        if (
          ("string" != typeof e && (e = String(e)),
          /[^a-z0-9\-#$%&'*+.\^_`|~]/i.test(e))
        )
          throw new TypeError("Invalid character in header field name");
        return e.toLowerCase();
      }
      function p(e) {
        return "string" != typeof e && (e = String(e)), e;
      }
      function y(t) {
        var e = {
          next: function () {
            var e = t.shift();
            return { done: void 0 === e, value: e };
          },
        };
        return (
          r &&
            (e[Symbol.iterator] = function () {
              return e;
            }),
          e
        );
      }
      function g(t) {
        (this.map = {}),
          t instanceof g
            ? t.forEach(function (e, t) {
                this.append(t, e);
              }, this)
            : Array.isArray(t)
            ? t.forEach(function (e) {
                this.append(e[0], e[1]);
              }, this)
            : t &&
              Object.getOwnPropertyNames(t).forEach(function (e) {
                this.append(e, t[e]);
              }, this);
      }
      function v(e) {
        if (e.bodyUsed) return Promise.reject(new TypeError("Already read"));
        e.bodyUsed = !0;
      }
      function m(n) {
        return new Promise(function (e, t) {
          (n.onload = function () {
            e(n.result);
          }),
            (n.onerror = function () {
              t(n.error);
            });
        });
      }
      function w(e) {
        var t = new FileReader(),
          n = m(t);
        return t.readAsArrayBuffer(e), n;
      }
      function b(e) {
        if (e.slice) return e.slice(0);
        var t = new Uint8Array(e.byteLength);
        return t.set(new Uint8Array(e)), t.buffer;
      }
      function O() {
        return (
          (this.bodyUsed = !1),
          (this._initBody = function (e) {
            if ((this._bodyInit = e))
              if ("string" == typeof e) this._bodyText = e;
              else if (s && Blob.prototype.isPrototypeOf(e)) this._bodyBlob = e;
              else if (i && FormData.prototype.isPrototypeOf(e))
                this._bodyFormData = e;
              else if (o && URLSearchParams.prototype.isPrototypeOf(e))
                this._bodyText = e.toString();
              else if (a && s && c(e))
                (this._bodyArrayBuffer = b(e.buffer)),
                  (this._bodyInit = new Blob([this._bodyArrayBuffer]));
              else {
                if (!a || (!ArrayBuffer.prototype.isPrototypeOf(e) && !u(e)))
                  throw new Error("unsupported BodyInit type");
                this._bodyArrayBuffer = b(e);
              }
            else this._bodyText = "";
            this.headers.get("content-type") ||
              ("string" == typeof e
                ? this.headers.set("content-type", "text/plain;charset=UTF-8")
                : this._bodyBlob && this._bodyBlob.type
                ? this.headers.set("content-type", this._bodyBlob.type)
                : o &&
                  URLSearchParams.prototype.isPrototypeOf(e) &&
                  this.headers.set(
                    "content-type",
                    "application/x-www-form-urlencoded;charset=UTF-8"
                  ));
          }),
          s &&
            ((this.blob = function () {
              var e = v(this);
              if (e) return e;
              if (this._bodyBlob) return Promise.resolve(this._bodyBlob);
              if (this._bodyArrayBuffer)
                return Promise.resolve(new Blob([this._bodyArrayBuffer]));
              if (this._bodyFormData)
                throw new Error("could not read FormData body as blob");
              return Promise.resolve(new Blob([this._bodyText]));
            }),
            (this.arrayBuffer = function () {
              return this._bodyArrayBuffer
                ? v(this) || Promise.resolve(this._bodyArrayBuffer)
                : this.blob().then(w);
            })),
          (this.text = function () {
            var e = v(this);
            if (e) return e;
            if (this._bodyBlob)
              return (function (e) {
                var t = new FileReader(),
                  n = m(t);
                return t.readAsText(e), n;
              })(this._bodyBlob);
            if (this._bodyArrayBuffer)
              return Promise.resolve(
                (function (e) {
                  for (
                    var t = new Uint8Array(e), n = new Array(t.length), o = 0;
                    o < t.length;
                    o++
                  )
                    n[o] = String.fromCharCode(t[o]);
                  return n.join("");
                })(this._bodyArrayBuffer)
              );
            if (this._bodyFormData)
              throw new Error("could not read FormData body as text");
            return Promise.resolve(this._bodyText);
          }),
          i &&
            (this.formData = function () {
              return this.text().then(x);
            }),
          (this.json = function () {
            return this.text().then(JSON.parse);
          }),
          this
        );
      }
      function S(e, t) {
        var n = {
          url: e,
          method: t && t.method ? t.method : "",
          params: t && t.body ? t.body : "",
        };
        window.webfunnyRequests
          ? window.webfunnyRequests.push(n)
          : (window.webfunnyRequests = [n]);
        var o = (t = t || {}).body;
        if (e instanceof S) {
          if (e.bodyUsed) throw new TypeError("Already read");
          (this.url = e.url),
            (this.credentials = e.credentials),
            t.headers || (this.headers = new g(e.headers)),
            (this.method = e.method),
            (this.mode = e.mode),
            o || null == e._bodyInit || ((o = e._bodyInit), (e.bodyUsed = !0));
        } else this.url = String(e);
        if (
          ((this.credentials = t.credentials || this.credentials || "omit"),
          (!t.headers && this.headers) || (this.headers = new g(t.headers)),
          (this.method = (function (e) {
            var t = e.toUpperCase();
            return -1 < h.indexOf(t) ? t : e;
          })(t.method || this.method || "GET")),
          (this.mode = t.mode || this.mode || null),
          (this.referrer = null),
          ("GET" === this.method || "HEAD" === this.method) && o)
        )
          throw new TypeError("Body not allowed for GET or HEAD requests");
        this._initBody(o);
      }
      function x(e) {
        var r = new FormData();
        return (
          e
            .trim()
            .split("&")
            .forEach(function (e) {
              if (e) {
                var t = e.split("="),
                  n = t.shift().replace(/\+/g, " "),
                  o = t.join("=").replace(/\+/g, " ");
                r.append(decodeURIComponent(n), decodeURIComponent(o));
              }
            }),
          r
        );
      }
      function E(e, t) {
        (t = t || {}),
          (this.type = "default"),
          (this.status = "status" in t ? t.status : 200),
          (this.ok = 200 <= this.status && this.status < 300),
          (this.statusText = "statusText" in t ? t.statusText : "OK"),
          (this.headers = new g(t.headers)),
          (this.url = t.url || ""),
          this._initBody(e);
      }
    })("undefined" != typeof self ? self : window);
  },
]);
