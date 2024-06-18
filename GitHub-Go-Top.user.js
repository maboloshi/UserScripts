// ==UserScript==
// @name          GithubGoTop
// @name:CN-zh_cn Github一键返回顶部
// @version       0.5.6
// @description   scrolltop
// @author        gaojr, maboloshi
// @namespace     https://github.com/maboloshi/UserScripts
// @license       MIT
// @match         https://*github.com/*
// @grant         GM_addStyle
// @icon          https://github.githubassets.com/pinned-octocat.svg
// @note          在 https://github.com/gaojr/scripts-styles/blob/master/scripts/github-go-top.user.js 基础上改进
// @note          1. 打印页面时隐藏图标
// @note          2. 自适应系统或 GitHub 明暗主题, 自动切换明暗模式
// @note          3. 点击按钮, 平滑滚动到页面顶部
// @note          4. 页面在顶部或滚动到时隐藏按钮
// ==/UserScript==

(function () {
  let goTopBtn = null;
  const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');

  const addStyles = () => {
    GM_addStyle(`
      @media print { .GoTopBtn__no-print { display: none !important; } }
      .GoTopBtn { position: fixed; font-size: 48px; right: 13px; bottom: 0%; cursor: pointer; z-index: 999; }
      .GoTopBtn__invert { filter: invert(100%); }
      .GoTopBtn__hide { display: none !important; }
    `);
  };

  const addIcon = () => {
    goTopBtn = document.createElement('div');
    goTopBtn.classList.add('GoTopBtn', 'GoTopBtn__no-print', 'GoTopBtn__hide', 'tooltipped', 'tooltipped-n');
    goTopBtn.textContent = '🔝';
    goTopBtn.setAttribute('aria-label', "回到顶部");
    document.documentElement.appendChild(goTopBtn);

    goTopBtn.addEventListener('click', () => {
      // 页面平滑滚动到页面顶部
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  };

  const toggleMode = (system_dark = null) => {
    const github_mode = document.documentElement.dataset.colorMode,
          isSystemDark = system_dark || mediaQuery.matches,
          isDarkMode = github_mode !== "light" && (github_mode === "dark" || isSystemDark);
    if (goTopBtn) {
      goTopBtn.classList.toggle('GoTopBtn__invert', isDarkMode);
    }
  };

  const init = () => {
    addStyles();
    addIcon();

    // 监视系统的明暗主题设置
    mediaQuery.addEventListener('change', event => toggleMode(event.matches));

    // 监视 GitHub 的明暗主题设置
    new MutationObserver(() => toggleMode()).observe(document.documentElement, {
      attributeFilter: ['data-color-mode']
    });

    toggleMode();

    // 当页面滚动时显示/隐藏返回顶部按钮
    window.addEventListener('scroll', () => {
      const shouldShow = document.body.scrollTop > 20 || document.documentElement.scrollTop > 20;
      goTopBtn.classList.toggle('GoTopBtn__hide', !shouldShow);
    });
  };

  init();
})();
