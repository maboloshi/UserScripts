// ==UserScript==
// @name          GithubGoTop
// @name:CN-zh_cn Github一键返回顶部
// @version       0.5.2
// @description   scrolltop
// @author        gaojr, maboloshi
// @namespace     https://github.com/maboloshi/UserScripts
// @license       MIT
// @match         https://*github.com/*
// @grant         GM_addStyle
// @connect       github.com
// @icon          https://github.githubassets.com/pinned-octocat.svg
// @note          在 https://github.com/gaojr/scripts-styles/blob/master/scripts/github-go-top.user.js 基础上改进
// @note          1. 打印页面时隐藏图标
// @note          2. 修复因 GitHub 新`ajax`载入方式, 导致切换页面时图标消失
// @note          3. 自适应系统或 GitHub 明暗主题, 自动切换明暗模式
// ==/UserScript==

(function () {
  var goTopBtn = null;

  function addIcon() {

    GM_addStyle(`
      @media print { #GoTop { display: none !important; } }
      .GoTopBtn { position: fixed; right: 13px; bottom: 0%; cursor: pointer; z-index: 999; }
      .invert { filter: invert(100%);}
    `);

    goTopBtn = document.createElement('div');
    goTopBtn.setAttribute('id', 'GoTop');
    goTopBtn.classList.add('GoTopBtn', 'tooltipped', 'tooltipped-n');
    goTopBtn.innerHTML = `<svg viewBox="0 0 16 16" width="48" height="48"><path d="M3.47 7.78a.75.75 0 0 1 0-1.06l4.25-4.25a.75.75 0 0 1 1.06 0l4.25 4.25a.751.751 0 0 1-.018 1.042.751.751 0 0 1-1.042.018L9 4.81v7.44a.75.75 0 0 1-1.5 0V4.81L4.53 7.78a.75.75 0 0 1-1.06 0Z"></path></svg>`;
    goTopBtn.setAttribute('aria-label', "回到顶部");
    document.body.appendChild(goTopBtn);

    goTopBtn.addEventListener('click', () => {
      document.body.scrollTop = document.documentElement.scrollTop = 0;
    });
  }

  function toggleMode() {
    var github_mode = document.documentElement.getAttribute('data-color-mode');
    var system_dark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
    if (goTopBtn) {
      goTopBtn.classList.toggle('invert', github_mode !== "light" && (github_mode === "dark" || system_dark));
    }
  }

  function observeMutation(mutations) {
    for (let mutation of mutations) {
      if (mutation.addedNodes.length > 0) {
        for (const node of mutation.addedNodes) {
          if (node.nodeName === 'BODY') {
            addIcon();
            toggleMode();
            return;
          }
        }
      } else if (mutation.type === 'attributes') {
        toggleMode();
        return;
      }
    }
  }

  function init() {
    addIcon();
    toggleMode();

    window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', toggleMode);

    new window.MutationObserver(observeMutation).observe(document.documentElement, {
      childList: true,
      attributeFilter: ['data-color-mode']
    });
  }

  init();
})();
