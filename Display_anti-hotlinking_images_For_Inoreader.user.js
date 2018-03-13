// ==UserScript==
// @name             显示防盗链图片 for Inoreader
// @name:en          Display anti-hotlinking images For Inoreader
// @version          0.1
// @namespace        https://github.com/maboloshi/UserScripts/
// @description      通过强制全站不发送 referrer， 实现显示防盗链图片
// @description:en   Display anti-hotlinking images, for forced not send a referrer.
// @include          http://www.inoreader.com/*
// @include          https://www.inoreader.com/*
// @icon             http://www.inoreader.com/favicon.ico
// @grant none
// ==/UserScript==
var meta = document.createElement('meta');
meta.name = "referrer";
meta.content = "no-referrer";
document.getElementsByTagName('head')[0].appendChild(meta);
