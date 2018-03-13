// ==UserScript==
// @name           使 userstyles.org 支持 xStyle 扩展 (chrome)
// @name:en        Make userstyles.org support xStyle extension for Chrome
// @version        0.1
// @description    通过伪装成firefox浏览器，实现使 userstyles.org 支持 xStyle 扩展 (chrome)。
// @description:en Uses Mozilla user agent, make it support xStyle extension (chrome).
// @namespace      https://github.com/maboloshi/UserScripts
// @icon           https://userstyles.org/favicon.ico  
// @match          https://userstyles.org/*
// @run-at document-start
// @grant none
// ==/UserScript==
Object.defineProperty(navigator, 'userAgent', {
    value: 'Mozilla/5.0 (Windows NT 6.1; WOW64; rv:54.0) Gecko/20100101 Firefox/54.0'
});
