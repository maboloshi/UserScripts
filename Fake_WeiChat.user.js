// ==UserScript==
// @name           伪装成PC版微信客户端
// @name:en        Fake WeiChat for PC
// @version        0.1
// @description    修改 userAgent, 伪装成微信客户端。
// @description:en Modify userAgent to pretend to be a WeChat client.
// @namespace      https://github.com/maboloshi/UserScripts
// @icon           https://res.wx.qq.com/a/wx_fed/assets/res/NTI4MWU5.ico
// @match          https://*.h5.xiaoeknow.com/*
// @run-at document-start
// @grant none
// ==/UserScript==
Object.defineProperty(navigator, 'userAgent', {
    value: 'Mozilla/5.0 (Windows NT 6.1; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/81.0.4044.138 Safari/537.36 NetType/WIFI MicroMessenger/7.0.20.1781(0x6700143B) WindowsWechat(0x6304051b)'
});
