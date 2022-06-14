// ==UserScript==
// @name            隐藏 Github Gist 删除按钮
// @name.en         Hide Delete button for GitHub Gist
// @version         0.1.0
// @description     隐藏 Github Gist 删除按钮
// @description:en  Hide Delete button for GitHub Gist
// @namespace       https://github.com/maboloshi/UserScripts/
// @match           https://gist.github.com/*/*
// @grant           GM_registerMenuCommand
// @icon            https://github.githubassets.com/pinned-octocat.svg
// @run-at          document-end
// ==/UserScript==
(function () {
    'use strict';
  //console.log("==> 载入 Hide Delete button for GitHub Gist");

   var el = document.getElementsByClassName("btn-danger btn-sm btn")[0]

   if (!el) {
     return;
    }
  el.style.display = 'none';

   // 注册菜单
    GM_registerMenuCommand("显示/隐藏\"删除按钮\"", Toggle);
    function Toggle() {
      if (el.style.display == '') {
        el.style.display = 'none';
      } else {
        el.style.display = '';
      }
    }

  //console.log("==> 退出 Hide Delete button for GitHub Gist");

})();
