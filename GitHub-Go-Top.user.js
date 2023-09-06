// ==UserScript==
// @name          GithubGoTop
// @name:CN-zh_cn Github一键返回顶部
// @version       0.5.3
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
// @note          2. 自适应系统或 GitHub 明暗主题, 自动切换明暗模式
// @note          3. 点击按钮, 平滑滚动到页面顶部
// @note          4. 页面在顶部或滚动到时隐藏按钮
// ==/UserScript==

(function () {
  let goTopBtn = null;

  function addIcon() {

    GM_addStyle(`
      @media print { #GoTop { display: none !important; } }
      .GoTopBtn { position: fixed; right: 13px; bottom: 0%; cursor: pointer; z-index: 999; display: none; }
      .invert { filter: invert(100%);}
    `);

    goTopBtn = document.createElement('div');
    goTopBtn.setAttribute('id', 'GoTop');
    goTopBtn.classList.add('GoTopBtn', 'tooltipped', 'tooltipped-n');
    goTopBtn.innerHTML = `<svg viewBox="0 0 16 16" width="48" height="48"><path d="M3.47 7.78a.75.75 0 0 1 0-1.06l4.25-4.25a.75.75 0 0 1 1.06 0l4.25 4.25a.751.751 0 0 1-.018 1.042.751.751 0 0 1-1.042.018L9 4.81v7.44a.75.75 0 0 1-1.5 0V4.81L4.53 7.78a.75.75 0 0 1-1.06 0Z"></path></svg>`;
    goTopBtn.setAttribute('aria-label', "回到顶部");
    document.body.appendChild(goTopBtn);

    goTopBtn.addEventListener('click', () => {
      // 页面平滑滚动到页面顶部
      scrollToTop(500); // 滚动时间为0.5秒（500毫秒）
    });
  }

  function toggleMode() {
    const github_mode = document.documentElement.getAttribute('data-color-mode');
    const system_dark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
    if (goTopBtn) {
      goTopBtn.classList.toggle('invert', "light" !== github_mode && ("dark" === github_mode || system_dark));
    }
  }

  function scrollToTop(scrollDuration) {
    const scrollStep = -window.scrollY / (scrollDuration / 15);
    const scrollInterval = setInterval(() => {
      if (window.scrollY !== 0) {
        window.scrollBy(0, scrollStep);
      } else {
        clearInterval(scrollInterval);
      }
    }, 15);
  }

  function init() {
    addIcon();
    toggleMode();

    // 监视系统的明暗主题设置
    window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', toggleMode);

    // 监视 GitHub 的明暗主题设置
    new window.MutationObserver(mutations => {
      toggleMode();
    }).observe(document.documentElement, {
      attributeFilter: ['data-color-mode']
    });

    // 当页面滚动时显示/隐藏返回顶部按钮
    window.addEventListener('scroll', () => {
      goTopBtn.style.display = document.body.scrollTop > 20 || document.documentElement.scrollTop > 20 ? 'block' : 'none';
    });
  }

  init();
})();
