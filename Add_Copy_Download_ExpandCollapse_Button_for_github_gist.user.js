// ==UserScript==
// @name            Github Gists: 添加复制、下载和展开/折叠文件按钮，隐藏/显示删除按钮
// @name.en         Github Gists: Add copy, download and expand/collapse file buttons, hide/show delete button
// @namespace       https://github.com/maboloshi/UserScripts/
// @version         0.3
// @description     为 GitHub Gists 添加复制、下载和展开/折叠文件按钮，隐藏/显示删除按钮
// @description.en  Adds copy, download, expand/collapse file buttons and hide/show delete button for GitHub Gists
// @author          maboloshi
// @match           https://gist.github.com/*
// @grant           GM_addStyle
// @grant           GM_setClipboard
// @grant           GM_download
// @grant           GM_registerMenuCommand
// @icon            https://github.githubassets.com/pinned-octocat.svg
// @run-at          document-end
// ==/UserScript==

(function () {
  'use strict';

  // 添加样式
  GM_addStyle(`
    .gist-expand-collapse-btn { margin: 0 0 0 6px; }
    .copy-download-btn { width: 28px; text-align: center; padding-left: 0px; padding-right: 0px; }
    .collapsed { display: none; }
  `);

  // 将文本复制到剪贴板
  function copyToClipboard(el, text) {
    try {
      GM_setClipboard(text);
      console.log('✅ 复制成功');
      showNotification(el, '✅ 复制成功');
    } catch (error) {
      console.log('❌ 复制失败', error);
      showNotification(el, '❌ 复制失败');
    }
  }

  // 下载文件
  function downloadFile(el, fileUrl, fileName) {
    GM_download({
      url: fileUrl,
      name: fileName,
      onload: () => {
          console.log('✅ 文件下载完成');
          showNotification(el, '✅ 文件下载完成');
      },
      onerror: (error) => {
          console.log('❌ 下载出错:', error);
          showNotification(el, '❌ 下载出错');
      }
    });
  }

  // 显示通知
  function showNotification(el, message) {
    const originalText = el.getAttribute("aria-label");
    el.setAttribute("aria-label", message);
    setTimeout(() => {
      el.setAttribute("aria-label", originalText);
    }, 2000);
  }

  // 创建按钮
  function createButton(text, tooltip) {
    const button = document.createElement('div');
    button.classList.add('btn', 'btn-sm', 'tooltipped', 'tooltipped-n');
    button.textContent = text;
    button.setAttribute('aria-label', tooltip);
    return button;
  }

  // 初始化按钮
  function initializeButtons() {
    const files = document.querySelectorAll('.file');

    files.forEach(file => {
      const fileAction = file.querySelector('.file-header > .file-actions');

      // 创建复制按钮
      const copyBtn = createButton('复制', '复制原始文件');
      copyBtn.classList.add('copy-download-btn');
      copyBtn.innerHTML = `<svg aria-hidden="true" height="16" viewBox="0 0 16 16" version="1.1" width="16" class="octicon octicon-copy"><path d="M0 6.75C0 5.784.784 5 1.75 5h1.5a.75.75 0 0 1 0 1.5h-1.5a.25.25 0 0 0-.25.25v7.5c0 .138.112.25.25.25h7.5a.25.25 0 0 0 .25-.25v-1.5a.75.75 0 0 1 1.5 0v1.5A1.75 1.75 0 0 1 9.25 16h-7.5A1.75 1.75 0 0 1 0 14.25Z"></path><path d="M5 1.75C5 .784 5.784 0 6.75 0h7.5C15.216 0 16 .784 16 1.75v7.5A1.75 1.75 0 0 1 14.25 11h-7.5A1.75 1.75 0 0 1 5 9.25Zm1.75-.25a.25.25 0 0 0-.25.25v7.5c0 .138.112.25.25.25h7.5a.25.25 0 0 0 .25-.25v-7.5a.25.25 0 0 0-.25-.25Z"></path></svg>`;
      fileAction.appendChild(copyBtn);

      copyBtn.addEventListener('click', () => {
        const filebox = file.querySelector('[name="gist[content]"]');
        const fileContent = filebox?.innerText || file.querySelector('[itemprop="text"] > div > table')?.innerText.replace(/(^\t\n|^\t|\n\t)/g, (match) => match === '\n\t' ? '\n' : '');
        copyToClipboard(copyBtn, fileContent);
      });

      // 创建下载按钮
      const downloadBtn = createButton('下载', '下载原始文件');
      downloadBtn.classList.add('copy-download-btn');
      downloadBtn.innerHTML = `<svg aria-hidden="true" height="16" viewBox="0 0 16 16" version="1.1" width="16" viewBox="0 0 16 16" class="octicon octicon-download"><path d="M2.75 14A1.75 1.75 0 0 1 1 12.25v-2.5a.75.75 0 0 1 1.5 0v2.5c0 .138.112.25.25.25h10.5a.25.25 0 0 0 .25-.25v-2.5a.75.75 0 0 1 1.5 0v2.5A1.75 1.75 0 0 1 13.25 14Z"></path><path d="M7.25 7.689V2a.75.75 0 0 1 1.5 0v5.689l1.97-1.969a.749.749 0 1 1 1.06 1.06l-3.25 3.25a.749.749 0 0 1-1.06 0L4.22 6.78a.749.749 0 1 1 1.06-1.06l1.97 1.969Z"></path></svg>`;
      fileAction.appendChild(downloadBtn);

      downloadBtn.addEventListener('click', () => {
        const url = fileAction.firstElementChild.href;
        const filename = file.querySelector('.gist-blob-name').innerText;
        downloadFile(downloadBtn, fileUrl, fileName);
      });

      // 创建折叠/展开按钮
      const expandCollapseBtn = createButton('折叠', '折叠/展开文件');
      expandCollapseBtn.classList.add('gist-expand-collapse-btn');
      fileAction.appendChild(expandCollapseBtn);

      const fileContainer = file.children[1];

      expandCollapseBtn.addEventListener('click', () => {
        const isCollapsed = expandCollapseBtn.textContent === '折叠';
        expandCollapseBtn.textContent = isCollapsed ? '展开' : '折叠';
        fileContainer.classList.toggle('collapsed', isCollapsed);
      });
    });
  }

  // 初始化折叠/展开全部按钮
  function initializeExpandCollapseAll() {
    const pageHeadActions = document.querySelector('.pagehead-actions');
    const expandCollapseAllBtn = createButton('折叠全部', '折叠/展开全部文件');
    const listItem = document.createElement('li');
    listItem.appendChild(expandCollapseAllBtn);
    pageHeadActions.appendChild(listItem);

    const fileContainers = document.querySelectorAll('.Box-body');
    const buttons = document.querySelectorAll('.gist-expand-collapse-btn');

    expandCollapseAllBtn.addEventListener('click', () => {
      const isCollapsed = expandCollapseAllBtn.textContent === '折叠全部';
      expandCollapseAllBtn.textContent = isCollapsed ? '展开全部' : '折叠全部';

      buttons.forEach(button => {
        button.textContent = isCollapsed ? '展开' : '折叠';
      });

      fileContainers.forEach(fileContainer => {
        fileContainer.classList.toggle('collapsed', isCollapsed);
      });
    });
  }

  // 显示隐藏删除按钮
  function deleteBtnToggle() {
    const deleteBtn = document.querySelector('.btn-danger.btn-sm.btn');
    deleteBtn && (deleteBtn.style.display = deleteBtn.style.display === 'none' ? '' : 'none');
  }

  function init() {
    const isGistpage = () => /^https:\/\/gist\.github\.com\/[\w-]+\/[a-f0-9]{32}(?:#)?$/.test(location.href);

    const loadButtons = () => {
      initializeButtons();
      initializeExpandCollapseAll();
      deleteBtnToggle();
    }

    // 页面跳转后重新加载
    const reload = () => {
      new window.MutationObserver(mutations => {
        mutations.forEach(mutation => {
          const removedNodes = mutation.removedNodes;
          if (removedNodes.length > 0 && removedNodes[0].matches('div.turbo-progress-bar') && isGistpage()) {
            loadButtons();
            return;
          }
        });
      }).observe(document.documentElement, {
        childList: true
      })
    };

    const load = () => {
      if (isGistpage()) {
          loadButtons();
      }
    }

    load();
    reload();
  }

  // 注册菜单
  GM_registerMenuCommand("显示/隐藏\"删除按钮\"", deleteBtnToggle);

  init();
})();
